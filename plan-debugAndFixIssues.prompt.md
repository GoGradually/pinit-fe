# 핀잇 일정 관리 FE - 디버깅 및 수정 계획

## 현재 문제 상황

### 확인된 문제점
1. **일정 조회가 화면에 표시되지 않음**
   - API 호출은 성공하지만 데이터가 화면에 렌더링되지 않음
   - 원인: 캐시 로직, API 응답 형식 불일치, 또는 로깅 부족으로 인한 디버깅 어려움

2. **상태 전이 버튼이 보이지 않음**
   - ScheduleCard에 시작/일시정지/완료 버튼이 표시되지 않음
   - 코드상으로는 구현되어 있으나 실제 화면에 렌더링 안 됨
   - 원인: 조건부 렌더링 로직 문제 또는 상태 값 불일치

3. **취소 버튼 미구현**
   - COMPLETED 상태를 PENDING으로 되돌리는 취소 버튼 없음
   - useScheduleActions의 allowedCancelStates에 COMPLETED 미포함

### 전제 조건
- ✅ 백엔드 API 서버: localhost:8080에서 정상 작동 중
- ✅ CORS 설정: localhost:5173, 5174 모두 허용됨
- ✅ OpenAPI 스펙 준수: 실제 존재하는 API만 사용

## 해결 계획

### Phase 1: 디버깅 인프라 구축 (우선순위: 최고)

#### 1.1 API 클라이언트 로깅 강화
**파일**: `src/api/httpClient.ts`

**목표**: 모든 API 요청/응답을 Console에 로깅하여 문제 파악

**수정 내용**:
```typescript
const API_BASE_URL = "http://localhost:8080"

// 앱 시작 시 설정 확인
console.log('🔌 API Configuration:', { 
  baseUrl: API_BASE_URL,
  timestamp: new Date().toISOString()
})

export class ApiError extends Error {
  status: number
  data: unknown
  url: string

  constructor(message: string, status: number, data: unknown, url: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
    this.url = url
  }
}

export const httpClient = async <T>(path: string, options: HttpClientOptions = {}): Promise<T> => {
  const { json, headers, ...rest } = options
  const url = `${API_BASE_URL}${path}`
  
  // 요청 로깅
  console.log(`📡 [${new Date().toISOString()}] API Request:`, {
    method: options.method || 'GET',
    url,
    body: json || undefined
  })
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: json ? JSON.stringify(json) : undefined,
      ...rest,
    })

    // 응답 로깅
    console.log(`📥 [${new Date().toISOString()}] API Response:`, {
      status: response.status,
      statusText: response.statusText,
      url
    })

    if (!response.ok) {
      let payload: unknown
      try {
        payload = await response.json()
      } catch {
        payload = await response.text()
      }
      console.error(`❌ API Error:`, { status: response.status, url, payload })
      throw new ApiError(
        `API 요청 실패: ${response.status} ${response.statusText}`,
        response.status,
        payload,
        url
      )
    }

    if (response.status === 204) {
      console.log(`✅ Success (No Content):`, url)
      return undefined as T
    }

    const data = (await response.json()) as T
    console.log(`✅ Success:`, { 
      url, 
      dataType: Array.isArray(data) ? `Array[${data.length}]` : typeof data,
      sampleData: Array.isArray(data) && data.length > 0 ? data[0] : data
    })
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    console.error(`🔥 Network Error:`, { url, error })
    throw new ApiError(
      error instanceof Error ? error.message : '네트워크 오류',
      0,
      error,
      url
    )
  }
}
```

#### 1.2 일정 목록 훅 디버깅 로그
**파일**: `src/hooks/useScheduleList.ts`

**목표**: 캐시 히트/미스, API 호출, 데이터 수신 상태 추적

**수정 내용** (33줄 fetchList 함수 내부):
```typescript
const fetchList = async () => {
  setIsLoading(true)
  setError(null)
  
  console.log('🔄 useScheduleList: Starting fetch', { dateKey, timestamp })
  
  const cached = getDateSchedules(dateKey)
  if (cached) {
    console.log('📦 Cache HIT:', { 
      dateKey, 
      count: cached.length, 
      items: cached.map(s => ({ id: s.id, title: s.title, state: s.state }))
    })
    setSchedules(cached)
    setIsLoading(false)
    return
  }
  
  console.log('🌐 Cache MISS, calling API:', dateKey)
  
  try {
    const response = await fetchScheduleSummaries(dateKey)
    console.log('✅ API Response received:', { 
      dateKey, 
      count: response.length,
      items: response.map(s => ({ id: s.id, title: s.title, state: s.state }))
    })
    
    if (isMounted) {
      setSchedules(response)
      setDateSchedules(dateKey, response)
      console.log('💾 Data saved to state and cache')
    }
  } catch (error) {
    console.error('❌ Fetch error:', { dateKey, error })
    if (isMounted) {
      const message = error instanceof Error ? error.message : '일정을 불러오지 못했습니다.'
      setError(message)
    }
  } finally {
    if (isMounted) {
      setIsLoading(false)
      console.log('✅ useScheduleList: Fetch complete', { dateKey })
    }
  }
}
```

#### 1.3 ScheduleCard 조건부 렌더링 디버깅
**파일**: `src/components/schedules/ScheduleCard.tsx`

**목표**: 버튼 표시 조건 확인

**수정 내용** (26줄 컴포넌트 시작 부분):
```typescript
const ScheduleCard = ({ schedule }: ScheduleCardProps) => {
  const navigate = useNavigate()
  const { id, title, description, importance, urgency, taskType, state } = schedule
  const actions = useScheduleActions(id, state)

  // 디버깅: 버튼 표시 조건 확인
  console.log('🎴 ScheduleCard render:', { 
    id, 
    title,
    state, 
    buttons: {
      canStart: actions.canStart,
      canPause: actions.canPause,
      canComplete: actions.canComplete,
      canCancel: actions.canCancel
    }
  })

  // ...rest of the code
```

### Phase 2: 캐시 로직 개선

#### 2.1 캐시 무효화 옵션
**파일**: `src/hooks/useScheduleList.ts`

**문제**: 빈 배열이 캐시에 저장되면 실제 데이터가 있어도 표시 안 됨

**해결책**: 개발 중 캐시 비활성화 옵션 추가

```typescript
const fetchList = async () => {
  setIsLoading(true)
  setError(null)
  
  // 개발 중 캐시 비활성화 (나중에 true로 변경)
  const USE_CACHE = false
  
  if (USE_CACHE) {
    const cached = getDateSchedules(dateKey)
    if (cached) {
      console.log('📦 Cache HIT:', { dateKey, count: cached.length })
      setSchedules(cached)
      setIsLoading(false)
      return
    }
  }
  
  console.log('🌐 Fetching from API:', dateKey)
  
  try {
    const response = await fetchScheduleSummaries(dateKey)
    // ...
  }
}
```

#### 2.2 새로고침 버튼 강화
**파일**: `src/pages/SchedulesTabPage.tsx`

**수정 내용**:
```typescript
const handleRefresh = () => {
  console.log('🔄 Manual refresh triggered')
  
  // 캐시 무효화 (선택적)
  // sessionStorage.clear()
  
  refetchPresence()
  refetchOverdue()
  refetchSchedules()
}
```

### Phase 3: 상태 전이 버튼 수정

#### 3.1 취소 버튼 활성화 상태 확장
**파일**: `src/hooks/useScheduleActions.ts`

**현재**:
```typescript
const allowedCancelStates: ScheduleState[] = ['PENDING', 'IN_PROGRESS']
```

**수정**:
```typescript
// COMPLETED, SUSPENDED 상태에서도 취소 가능하도록 확장
const allowedCancelStates: ScheduleState[] = [
  'PENDING', 
  'IN_PROGRESS', 
  'SUSPENDED', 
  'COMPLETED'
]
```

#### 3.2 ScheduleCard에 취소 버튼 추가
**파일**: `src/components/schedules/ScheduleCard.tsx`

**위치**: 완료 버튼 다음 (89줄 근처)

**추가 코드**:
```typescript
{actions.canComplete && (
  <button
    className="schedule-card__action-btn schedule-card__action-btn--complete"
    onClick={(e) => handleActionClick(e, actions.complete)}
    disabled={actions.isMutating}
    title="완료"
    aria-label="일정 완료"
  >
    ✓
  </button>
)}
{actions.canCancel && (
  <button
    className="schedule-card__action-btn schedule-card__action-btn--cancel"
    onClick={(e) => handleActionClick(e, actions.cancel)}
    disabled={actions.isMutating}
    title="취소"
    aria-label="일정 취소"
  >
    ✕
  </button>
)}
```

#### 3.3 취소 버튼 스타일링
**파일**: `src/components/schedules/ScheduleCard.css`

**추가 코드**:
```css
.schedule-card__action-btn--cancel {
  background-color: #fee2e2;
  color: #b91c1c;
}

.schedule-card__action-btn--cancel:hover:not(:disabled) {
  background-color: #fecaca;
}
```

### Phase 4: 상세 페이지 개선

#### 4.1 ScheduleDetailPage 버튼 확인
**파일**: `src/pages/ScheduleDetailPage.tsx`

**확인 사항**: 취소 버튼이 이미 있는지 확인하고 없으면 추가

**기대되는 구조** (50줄 근처):
```typescript
<footer className="schedule-detail__actions">
  <button 
    type="button" 
    disabled={!scheduleActions.canStart || scheduleActions.isMutating} 
    onClick={scheduleActions.start}
  >
    시작
  </button>
  <button 
    type="button" 
    disabled={!scheduleActions.canPause || scheduleActions.isMutating} 
    onClick={scheduleActions.pause}
  >
    일시중지
  </button>
  <button 
    type="button" 
    disabled={!scheduleActions.canComplete || scheduleActions.isMutating} 
    onClick={scheduleActions.complete}
  >
    완료
  </button>
  <button 
    type="button" 
    disabled={!scheduleActions.canCancel || scheduleActions.isMutating} 
    onClick={scheduleActions.cancel}
  >
    취소
  </button>
  <button 
    type="button" 
    onClick={() => schedule && modal?.openEdit(schedule.id)}
  >
    수정
  </button>
</footer>
```

## 테스트 체크리스트

### 개발 서버 실행 후 확인 사항

#### 브라우저 Console 로그
- [ ] `🔌 API Configuration` 로그 확인
- [ ] `📡 API Request: GET http://localhost:8080/schedules?memberId=1&date=...` 확인
- [ ] `📥 API Response: 200 OK` 확인
- [ ] `✅ Success: { dataType: 'Array[?]', ... }` 확인
- [ ] `🔄 useScheduleList: Starting fetch` 확인
- [ ] `📦 Cache HIT` 또는 `🌐 Cache MISS` 확인
- [ ] `🎴 ScheduleCard render` 로그에서 버튼 조건 확인

#### UI 동작 확인
- [ ] 일정 목록 페이지에 일정 카드가 표시되는가?
- [ ] PENDING 상태 일정에 ▶ 시작 버튼과 ✕ 취소 버튼이 보이는가?
- [ ] IN_PROGRESS 상태 일정에 ⏸ 일시중지, ✓ 완료, ✕ 취소 버튼이 보이는가?
- [ ] COMPLETED 상태 일정에 ✕ 취소 버튼이 보이는가?
- [ ] SUSPENDED 상태 일정에 ▶ 시작 버튼과 ✕ 취소 버튼이 보이는가?
- [ ] 버튼 클릭 시 상태가 변경되는가?
- [ ] 상태 변경 후 UI가 즉시 업데이트되는가?

#### 디버깅 시나리오

**시나리오 1: 일정이 표시되지 않는 경우**
1. Console에서 `📡 API Request` 로그 확인
2. `📥 API Response` 로그에서 상태 코드 확인
3. `✅ Success` 로그에서 데이터 개수 확인 (`Array[0]`이면 백엔드에 데이터 없음)
4. `📦 Cache HIT` 로그에서 캐시된 데이터 개수 확인
5. `🎴 ScheduleCard render` 로그가 나타나는지 확인

**시나리오 2: 버튼이 표시되지 않는 경우**
1. Console에서 `🎴 ScheduleCard render` 로그 찾기
2. `buttons` 객체에서 `canStart`, `canPause`, `canComplete`, `canCancel` 값 확인
3. 모두 `false`라면 `useScheduleActions` 훅 확인 필요
4. `state` 값이 올바른지 확인

**시나리오 3: API 호출은 되지만 화면 업데이트 안 됨**
1. `💾 Data saved to state and cache` 로그 확인
2. React DevTools에서 `SchedulesTabPage` 컴포넌트의 `schedules` state 확인
3. 캐시 문제일 가능성: `USE_CACHE = false`로 설정하고 재시도

## 예상 결과

### 성공 시 Console 로그 예시
```
🔌 API Configuration: { baseUrl: "http://localhost:8080", timestamp: "2025-01-29T..." }
📡 [2025-01-29T...] API Request: { method: "GET", url: "http://localhost:8080/schedules?memberId=1&date=2025-01-29" }
📥 [2025-01-29T...] API Response: { status: 200, statusText: "OK", url: "..." }
✅ Success: { url: "...", dataType: "Array[3]", sampleData: { id: 1, title: "...", state: "PENDING" } }
🔄 useScheduleList: Starting fetch { dateKey: "2025-01-29", timestamp: ... }
🌐 Cache MISS, calling API: 2025-01-29
✅ API Response received: { dateKey: "2025-01-29", count: 3, items: [...] }
💾 Data saved to state and cache
✅ useScheduleList: Fetch complete { dateKey: "2025-01-29" }
🎴 ScheduleCard render: { id: 1, title: "...", state: "PENDING", buttons: { canStart: true, canPause: false, canComplete: false, canCancel: true } }
🎴 ScheduleCard render: { id: 2, title: "...", state: "IN_PROGRESS", buttons: { canStart: false, canPause: true, canComplete: true, canCancel: true } }
```

### 화면 표시 예시

**일정 카드 (PENDING 상태)**:
```
┌─────────────────────────────────┐
│ 마케팅 전략 회의       [대기]   │
│ 집중 작업                       │
│ 2시간 동안 집중적으로...        │
│ [중요도 8] [긴급도 7]  [▶] [✕] │
└─────────────────────────────────┘
```

**일정 카드 (IN_PROGRESS 상태)**:
```
┌─────────────────────────────────┐
│ 프로젝트 개발           [진행중]│
│ 집중 작업                       │
│ React 컴포넌트 구현...          │
│ [중요도 9] [긴급도 8] [⏸][✓][✕]│
└─────────────────────────────────┘
```

**일정 카드 (COMPLETED 상태)**:
```
┌─────────────────────────────────┐
│ 문서 작성               [완료]  │
│ 행정 작업                       │
│ 보고서 작성 완료               │
│ [중요도 5] [긴급도 6]      [✕] │
└─────────────────────────────────┘
```

## 주의 사항

1. **로그 제거**: 프로덕션 배포 전 console.log 제거 또는 환경 변수로 제어
2. **캐시 활성화**: 디버깅 완료 후 `USE_CACHE = true`로 변경
3. **성능**: 과도한 로깅은 성능에 영향을 줄 수 있음
4. **타입 안전성**: 모든 수정 후 `npm run build`로 타입 체크

## 다음 단계

이 계획의 모든 단계를 완료한 후:

1. 모든 Console 로그를 환경 변수로 제어
2. 에러 바운더리 추가
3. 로딩 스켈레톤 UI 개선
4. 상태 전이 애니메이션 추가
5. 토스트 메시지로 피드백 개선
6. E2E 테스트 작성

