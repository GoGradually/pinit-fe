import { useMemo } from 'react'
import { useScheduleCache } from '../../context/ScheduleCacheContext.tsx'
import type { ScheduleSummary } from '../../types/schedule.ts'

/**
 * 활성 일정(현재 진행중인 일정) 정보를 반환하는 커스텀 훅
 * useMemo를 사용하여 활성 일정이 변경될 때만 새로운 객체를 반환
 * @returns 현재 진행중인 일정 요약 정보 또는 null
 */
const useActiveSchedule = (): ScheduleSummary | null => {
  const { activeSchedule } = useScheduleCache()

  return useMemo(() => (activeSchedule ? { ...activeSchedule } : null), [activeSchedule])
}

export default useActiveSchedule

