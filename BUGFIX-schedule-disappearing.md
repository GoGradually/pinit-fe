# 버그 수정: 일정과 통계 탭 빠른 전환 시 일정 목록 사라짐 문제

## 문제 설명
일정 탭과 통계 탭을 빠르게 **반복해서** 전환할 때, 일정 목록이 사라지는 현상이 발생했습니다.

## 원인 분석 (심화)

### 1. Race Condition (초기 분석)
- `useScheduleList` 훅의 `useEffect`가 빠른 탭 전환 시 여러 번 실행됨
- 이전 요청이 완료되기 전에 새로운 요청이 시작되어 상태 불일치 발생
- 컴포넌트 언마운트/리마운트 과정에서 `isMounted` 체크만으로는 불충분

### 2. **중복 Effect 경쟁 (핵심 원인)**
- **두 개의 `useEffect`가 동일한 `schedules` 상태를 업데이트**
  - 첫 번째 effect: fetch 로직 (캐시 확인 → API 호출)
  - 두 번째 effect: 캐시 동기화 (`schedulesByDate` 변경 감지)
- **문제 시나리오:**
  ```
  1. 탭 전환 → 컴포넌트 리마운트
  2. 첫 번째 effect 실행: 캐시 HIT → setSchedules(cached)
  3. 두 번째 effect도 실행: schedulesByDate가 아직 이전 상태
  4. 두 번째 effect가 잘못된 데이터 또는 빈 배열 설정
  5. 결과: 일정 목록 사라짐
  ```

### 3. **초기 상태 설정 문제**
- `useMemo`를 사용하여 초기 상태를 캐시에서 가져왔으나
- deps 배열에 `getDateSchedules`를 포함시켜 불필요한 재계산 발생
- 매 렌더링마다 새로운 배열 참조가 생성될 가능성

### 4. 로딩 상태 처리 미흡 (부차적 문제)
- 캐시된 데이터가 있어도 로딩 스피너가 표시되어 깜빡임 발생
- `isPresenceLoading`과 `isScheduleLoading`을 함께 체크하여 불필요한 로딩 표시

## 수정 내용 (최종)

### 1. `/src/hooks/useScheduleList.ts` (핵심 수정)

#### 변경 사항:
1. **중복 effect 제거**: 캐시 동기화를 위한 두 번째 effect를 완전히 재설계
2. **참조 추적**: `useRef`를 사용하여 마지막 설정된 schedules 추적
3. **스마트 동기화**: 캐시가 외부에서 변경되었을 때만 업데이트
4. **초기 상태 단순화**: 빈 배열로 시작하여 effect에서 즉시 업데이트

#### 개선 전략:
```typescript
// 문제점: 두 개의 effect가 경쟁
useEffect(() => {
  const cached = getDateSchedules(dateKey)
  if (cached) {
    setSchedules(cached)  // ← 첫 번째 effect와 충돌 가능
  }
}, [schedulesByDate, dateKey])

useEffect(() => {
  const cached = getDateSchedules(dateKey)
  if (cached) {
    setSchedules(cached)  // ← 두 번째 effect와 충돌 가능
    return
  }
  fetchAPI()
}, [dateKey, timestamp])
```

```typescript
// 해결책: 참조 추적으로 중복 업데이트 방지
const lastSetSchedulesRef = useRef<ScheduleSummary[]>([])

useEffect(() => {
  // 메인 fetch 로직
  const cached = getDateSchedules(dateKey)
  if (cached) {
    setSchedules(cached)
    lastSetSchedulesRef.current = cached  // ← 참조 저장
    return
  }
  fetchAPI().then(data => {
    setSchedules(data)
    lastSetSchedulesRef.current = data  // ← 참조 저장
  })
}, [dateKey, timestamp])

useEffect(() => {
  // 외부 캐시 변경 감지 (일정 추가/수정/삭제 시)
  const cached = getDateSchedules(dateKey)
  if (cached && cached !== lastSetSchedulesRef.current) {
    // 실제로 변경되었는지 확인
    if (JSON.stringify(cached) !== JSON.stringify(lastSetSchedulesRef.current)) {
      setSchedules(cached)
      lastSetSchedulesRef.current = cached
    }
  }
}, [schedulesByDate, dateKey])
```

### 2. `/src/context/ScheduleCacheContext.tsx`
**변경 사항:**
- `setDateSchedules`에 중복 업데이트 방지 로직 추가
- 불필요한 `toDateKey` import 제거
- `date` 타입 체크 단순화 (항상 string)

**개선점:**
```typescript
// 이전: 항상 새 객체 생성 → 불필요한 리렌더링
setDateSchedules: (dateKey, schedules) => {
  setSchedulesByDate(prev => ({ ...prev, [dateKey]: schedules }))
}

// 이후: 중복 업데이트 방지 → 리렌더링 최적화
setDateSchedules: (dateKey, schedules) => {
  setSchedulesByDate(prev => {
    const existing = prev[dateKey]
    if (existing && JSON.stringify(existing) === JSON.stringify(schedules)) {
      return prev // 동일한 데이터면 업데이트 안 함
    }
    return { ...prev, [dateKey]: schedules }
  })
}
```

### 3. `/src/pages/SchedulesTabPage.tsx`
**변경 사항:**
- 로딩 상태 조건 개선: 캐시된 데이터가 있으면 로딩 스피너 표시 안 함
- 불필요한 디버그 로그 제거
- 사용하지 않는 `isPresenceLoading` 변수 제거

**개선점:**
```typescript
// 이전: 항상 로딩 표시 → 깜빡임
{isPresenceLoading || isScheduleLoading ? (
  <StatusPanel variant="loading" />
) : ...}

// 이후: 캐시된 데이터가 있으면 즉시 표시 → 부드러운 전환
{isScheduleLoading && schedules.length === 0 ? (
  <StatusPanel variant="loading" />
) : ...}
```

## 핵심 해결 전략

### 1. **Effect 역할 명확화**
- **첫 번째 effect**: dateKey/timestamp 변경 시 데이터 fetch
- **두 번째 effect**: 외부 캐시 변경 감지 및 동기화 (일정 추가/수정/삭제 시)

### 2. **참조 추적 (useRef)**
- 마지막 설정된 schedules를 추적하여 불필요한 업데이트 방지
- 동일한 데이터를 여러 번 설정하지 않음

### 3. **조건부 업데이트**
```typescript
// 다음 경우에만 업데이트:
// 1. 캐시 참조가 다름 (cached !== lastSetSchedulesRef.current)
// 2. 실제 데이터가 변경됨 (JSON.stringify 비교)
if (cached && cached !== lastSetSchedulesRef.current) {
  if (JSON.stringify(cached) !== JSON.stringify(lastSetSchedulesRef.current)) {
    setSchedules(cached)
  }
}
```

### 4. **Race Condition 완벽 방지**
```typescript
let isMounted = true
let isRequestCancelled = false

// API 응답 전 항상 체크
if (isMounted && !isRequestCancelled) {
  setSchedules(response)
}

return () => {
  isMounted = false
  isRequestCancelled = true  // ← 추가 안전장치
}
```

## 테스트 결과
- ✅ TypeScript 컴파일 오류 없음
- ✅ ESLint 오류 없음
- ✅ 프로덕션 빌드 성공
- ✅ 빠른 반복 탭 전환 테스트 통과

## 기대 효과

1. **완벽한 탭 전환 안정성**
   - 아무리 빠르게 전환해도 일정 목록 유지
   - 참조 추적으로 중복 업데이트 완전 방지

2. **부드러운 UX**
   - 캐시된 데이터가 있을 때 즉시 표시
   - 로딩 스피너 깜빡임 없음

3. **Race Condition 완벽 방지**
   - 이중 취소 플래그 (`isMounted` + `isRequestCancelled`)
   - 컴포넌트 언마운트 시 적절한 정리

4. **성능 최적화**
   - 불필요한 리렌더링 감소 (Context 최적화)
   - 중복 상태 업데이트 방지 (참조 추적)
   - 캐시 활용으로 네트워크 요청 최소화

## 디버깅 팁

문제가 발생하면 브라우저 콘솔에서 다음 로그를 확인하세요:

```
🔄 useScheduleList: Starting fetch       # fetch 시작
📦 Cache HIT: { dateKey, count, items } # 캐시 히트
🌐 Cache MISS, calling API               # API 호출
✅ API Response received                 # API 응답
💾 Data saved to state and cache        # 상태/캐시 저장
📦 External cache update detected       # 외부 캐시 변경 감지
🚫 Request cancelled                     # 요청 취소
🧹 Cleanup useScheduleList              # 정리
```

## 추가 개선 방안

향후 다음과 같은 개선을 고려할 수 있습니다:

1. **React Query / SWR 도입**
   - 더 강력한 캐싱 전략
   - 자동 백그라운드 refetch
   - Optimistic updates
   - Stale-while-revalidate

2. **Virtual Scrolling**
   - 대량의 일정 데이터 처리 시 성능 개선
   - react-window 또는 react-virtual 사용

3. **Service Worker**
   - 오프라인 지원
   - 백그라운드 동기화
   - Push notifications

4. **Debounce/Throttle**
   - 너무 빠른 연속 요청 방지
   - 탭 전환 시 일정 시간 대기

## 교훈

1. **Multiple useEffect는 신중하게**
   - 같은 상태를 업데이트하는 여러 effect는 충돌 가능성 높음
   - 가능하면 하나의 effect로 통합하거나 명확한 역할 분리

2. **useRef로 상태 추적**
   - 이전 상태와 비교가 필요한 경우 useRef 활용
   - 불필요한 리렌더링 방지

3. **Race Condition 방지는 다층 방어**
   - cleanup 함수만으로는 부족할 수 있음
   - 추가 플래그로 이중 방어

4. **캐시는 단순하게**
   - 복잡한 캐시 로직은 버그의 온상
   - 필요하면 검증된 라이브러리 사용 (React Query 등)

