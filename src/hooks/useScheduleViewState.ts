import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { formatDisplayDate, getTodayKST, getWeekStart, toDateKey } from '../utils/datetime'

const useScheduleViewState = () => {
  const today = useMemo(() => getTodayKST(), [])
  const initialWeekStart = useMemo(() => getWeekStart(today), [today])

  const [currentWeekStart, setCurrentWeekStart] = useState(initialWeekStart)
  const [selectedDate, setSelectedDate] = useState(today)

  const goToWeek = (offset: number) => {
    const nextWeekStart = currentWeekStart.add(offset, 'week')
    setCurrentWeekStart(nextWeekStart)

    const currentWeekdayIndex = selectedDate.diff(currentWeekStart, 'day')
    const nextSelectedDate = nextWeekStart.add(currentWeekdayIndex, 'day')
    setSelectedDate(nextSelectedDate)
  }

  const selectDate = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
    const newWeekStart = getWeekStart(date)
    setCurrentWeekStart(newWeekStart)
  }

  return {
    currentWeekStart,
    selectedDate,
    selectedDateLabel: formatDisplayDate(selectedDate),
    selectedDateKey: toDateKey(selectedDate),
    goToWeek,
    selectDate,
  }
}

type UseScheduleViewStateReturn = ReturnType<typeof useScheduleViewState>

export type { UseScheduleViewStateReturn }
export default useScheduleViewState
