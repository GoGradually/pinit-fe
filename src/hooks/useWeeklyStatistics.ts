import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import type { WeeklyStatisticsView } from '../types/statistics'

const simulateStatistics = async (): Promise<WeeklyStatisticsView> => {
  await new Promise((resolve) => setTimeout(resolve, 120))
  return {
    weekStartLabel: dayjs().startOf('week').add(1, 'day').format('M월 D일 ~ M월 D일'),
    deepWorkMinutes: 620,
    adminWorkMinutes: 180,
    totalMinutes: 900,
    deepWorkRatio: 620 / 900,
    adminWorkRatio: 180 / 900,
  }
}

type UseWeeklyStatisticsReturn = {
  stats: WeeklyStatisticsView | null
  isLoading: boolean
  refetch: () => void
}

const useWeeklyStatistics = (): UseWeeklyStatisticsReturn => {
  const [stats, setStats] = useState<WeeklyStatisticsView | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timestamp, setTimestamp] = useState(() => Date.now())

  useEffect(() => {
    let isMounted = true
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const response = await simulateStatistics()
        if (isMounted) setStats(response)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    fetchStats()
    return () => {
      isMounted = false
    }
  }, [timestamp])

  return {
    stats,
    isLoading,
    refetch: () => setTimestamp(Date.now()),
  }
}

export default useWeeklyStatistics
