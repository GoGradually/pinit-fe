import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import type { OverdueSummary } from '../types/schedule'

const simulateOverdueSummary = async (): Promise<OverdueSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 120))
  return {
    hasOverdue: true,
    count: 2,
    earliestDate: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
  }
}

const useOverdueSchedulesSummary = () => {
  const [summary, setSummary] = useState<OverdueSummary>({ hasOverdue: false })
  const [isLoading, setIsLoading] = useState(true)
  const [timestamp, setTimestamp] = useState(() => Date.now())

  useEffect(() => {
    let isMounted = true

    const fetchSummary = async () => {
      setIsLoading(true)
      try {
        const result = await simulateOverdueSummary()
        if (isMounted) {
          setSummary(result)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchSummary()

    return () => {
      isMounted = false
    }
  }, [timestamp])

  return {
    summary,
    isLoading,
    refetch: () => setTimestamp(Date.now()),
  }
}

export default useOverdueSchedulesSummary

