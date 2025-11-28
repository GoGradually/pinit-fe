import { useEffect, useState } from 'react'
import type dayjs from 'dayjs'
import { getWeekDays, toDateKey } from '../utils/datetime'
import type { DateSchedulePresence } from '../types/schedule'

type Options = {
  weekStart: dayjs.Dayjs
}

type UseWeeklySchedulePresenceReturn = {
  presenceMap: DateSchedulePresence
  isLoading: boolean
  refetch: () => void
}

const simulatePresenceFetch = async (dateKeys: string[]) => {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return dateKeys.reduce<DateSchedulePresence>((map, key, index) => {
    map[key] = index % 2 === 0
    return map
  }, {})
}

const useWeeklySchedulePresence = ({ weekStart }: Options): UseWeeklySchedulePresenceReturn => {
  const [presenceMap, setPresenceMap] = useState<DateSchedulePresence>({})
  const [isLoading, setIsLoading] = useState(true)
  const [requestId, setRequestId] = useState(() => Date.now())

  useEffect(() => {
    let isMounted = true
    const dateKeys = getWeekDays(weekStart).map(toDateKey)

    const fetchPresence = async () => {
      setIsLoading(true)
      try {
        const map = await simulatePresenceFetch(dateKeys)
        if (isMounted) {
          setPresenceMap(map)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchPresence()

    return () => {
      isMounted = false
    }
  }, [weekStart, requestId])

  return {
    presenceMap,
    isLoading,
    refetch: () => setRequestId(Date.now()),
  }
}

export default useWeeklySchedulePresence

