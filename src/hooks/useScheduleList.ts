import { useEffect, useMemo, useState } from 'react'
import type dayjs from 'dayjs'
import type { ScheduleSummary } from '../types/schedule'
import { toDateKey } from '../utils/datetime'
import { fetchScheduleSummaries } from '../api/schedules'
import { useScheduleCache } from '../context/ScheduleCacheContext'

type UseScheduleListReturn = {
  schedules: ScheduleSummary[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

const useScheduleList = (selectedDate: dayjs.Dayjs): UseScheduleListReturn => {
  const { getDateSchedules, setDateSchedules } = useScheduleCache()
  const [schedules, setSchedules] = useState<ScheduleSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState(() => Date.now())

  const dateKey = useMemo(() => toDateKey(selectedDate), [selectedDate])

  useEffect(() => {
    let isMounted = true

    const fetchList = async () => {
      setIsLoading(true)
      setError(null)
      const cached = getDateSchedules(dateKey)
      if (cached) {
        setSchedules(cached)
        setIsLoading(false)
        return
      }
      try {
        const response = await fetchScheduleSummaries(dateKey)
        if (isMounted) {
          setSchedules(response)
          setDateSchedules(dateKey, response)
        }
      } catch (err) {
        if (isMounted) {
          setError('일정을 불러오지 못했습니다.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchList()

    return () => {
      isMounted = false
    }
  }, [dateKey, timestamp])

  return {
    schedules,
    isLoading,
    error,
    refetch: () => setTimestamp(Date.now()),
  }
}

export default useScheduleList
