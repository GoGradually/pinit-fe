import { useMemo } from 'react'
import { useScheduleCache } from '../context/ScheduleCacheContext'
import type { ScheduleSummary } from '../types/schedule'

const useActiveSchedule = (): ScheduleSummary | null => {
  const { activeSchedule } = useScheduleCache()

  return useMemo(() => (activeSchedule ? { ...activeSchedule } : null), [activeSchedule])
}

export default useActiveSchedule

