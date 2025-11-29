import { useState, useEffect, useMemo } from 'react'
import type dayjs from 'dayjs'

import { fetchWeeklyStatistics } from '../api/statistics'
import { toWeeklyStatisticsView } from '../utils/statisticsTransform'
import { getTodayKST } from '../utils/datetime'
import type { WeeklyStatisticsView } from '../types/statistics'
import { MEMBER_ID } from '../constants/member'

type Options = {
  weekStart?: dayjs.Dayjs
  memberId?: number
}

type UseWeeklyStatisticsReturn = {
  stats: WeeklyStatisticsView | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

const useWeeklyStatistics = (options: Options = {}): UseWeeklyStatisticsReturn => {
  const [stats, setStats] = useState<WeeklyStatisticsView | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timestamp, setTimestamp] = useState(() => Date.now())
  const [error, setError] = useState<string | null>(null)
  const { weekStart, memberId = MEMBER_ID } = options
  const timeParam = useMemo(() => (weekStart ?? getTodayKST()).toISOString(), [weekStart])

  useEffect(() => {
    let isMounted = true
    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)

      console.log('📊 Fetching weekly statistics...')

      try {
        console.log('📊 Request params:', { memberId, time: timeParam })

        const response = await fetchWeeklyStatistics({ memberId, time: timeParam })

        console.log('📊 API Response:', response)

        const view = toWeeklyStatisticsView(response)

        console.log('📊 Transformed view:', view)

        if (isMounted) setStats(view)
      } catch (err) {
        console.error('❌ Statistics fetch error:', err)
        if (isMounted) setError(err instanceof Error ? err.message : '통계를 불러오는데 실패했습니다.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    fetchStats()
    return () => {
      isMounted = false
    }
  }, [timestamp, memberId, timeParam])

  return {
    stats,
    isLoading,
    error,
    refetch: () => setTimestamp(Date.now()),
  }
}

export default useWeeklyStatistics
