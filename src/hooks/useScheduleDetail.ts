import { fetchScheduleDetail } from '../api/schedules'
import { useScheduleCache } from '../context/ScheduleCacheContext'
import { useEffect, useState } from 'react'
import type { ScheduleResponse } from '../types/schedule'

type UseScheduleDetailReturn = {
  schedule: ScheduleResponse | null
  isLoading: boolean
  refetch: () => void
}

const useScheduleDetail = (scheduleId?: string): UseScheduleDetailReturn => {
  const numericId = scheduleId ? Number(scheduleId) : undefined
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timestamp, setTimestamp] = useState(() => Date.now())
  const { upsertSchedule } = useScheduleCache()

  useEffect(() => {
    if (!numericId) return
    let isMounted = true

    const fetchSchedule = async () => {
      setIsLoading(true)
      try {
        const response = await fetchScheduleDetail(numericId)
        if (isMounted) {
          setSchedule(response)
          upsertSchedule(response)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchSchedule()

    return () => {
      isMounted = false
    }
  }, [numericId, timestamp, upsertSchedule])

  return {
    schedule,
    isLoading,
    refetch: () => setTimestamp(Date.now()),
  }
}

export default useScheduleDetail
