import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import type dayjs from 'dayjs'
import type { ScheduleSummary } from '../types/schedule'
import { toDateKey } from '../utils/datetime'
import { fetchScheduleSummaries } from '../api/schedules'
import { useScheduleCache } from '../context/ScheduleCacheContext'
import { areScheduleListsEqual } from '../utils/scheduleList'

type UseScheduleListReturn = {
  schedules: ScheduleSummary[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

const useScheduleList = (selectedDate: dayjs.Dayjs): UseScheduleListReturn => {
  const { getDateSchedules, setDateSchedules, schedulesByDate } = useScheduleCache()
  const [schedules, setSchedules] = useState<ScheduleSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState(() => Date.now())
  const lastAppliedRef = useRef<ScheduleSummary[]>([])

  const dateKey = useMemo(() => toDateKey(selectedDate), [selectedDate])

  const applySchedules = useCallback((next: ScheduleSummary[]) => {
    lastAppliedRef.current = next
    setSchedules(next)
  }, [])

  // 캐시 변경 감지하여 자동 업데이트
  useEffect(() => {
    const cached = schedulesByDate[dateKey]
    if (cached && !areScheduleListsEqual(cached, lastAppliedRef.current)) {
      applySchedules(cached)
      setIsLoading(false)
    }
  }, [applySchedules, dateKey, schedulesByDate])

  useEffect(() => {
    let isCancelled = false

    const fetchList = async () => {
      setIsLoading(true)
      setError(null)

      const cached = getDateSchedules(dateKey)
      if (cached) {
        applySchedules(cached)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetchScheduleSummaries(dateKey)
        if (isCancelled) return
        applySchedules(response)
        setDateSchedules(dateKey, response)
      } catch (error) {
        if (isCancelled) return
        const message = error instanceof Error ? error.message : '일정을 불러오지 못했습니다.'
        setError(message)
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchList()

    return () => {
      isCancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey, timestamp, applySchedules])

  return {
    schedules,
    isLoading,
    error,
    refetch: () => setTimestamp(Date.now()),
  }
}

export default useScheduleList
