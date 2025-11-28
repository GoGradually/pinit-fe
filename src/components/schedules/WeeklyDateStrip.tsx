import { useMemo, useRef, useState } from 'react'
import type dayjs from 'dayjs'
import { getWeekDays, toDateKey } from '../../utils/datetime'
import type { DateSchedulePresence } from '../../types/schedule'
import './WeeklyDateStrip.css'

type WeeklyDateStripProps = {
  weekStart: dayjs.Dayjs
  selectedDate: dayjs.Dayjs
  presenceMap: DateSchedulePresence
  onSelectDate: (date: dayjs.Dayjs) => void
  onChangeWeek: (offset: 1 | -1) => void
}

const DRAG_THRESHOLD = 60

const WeeklyDateStrip = ({
  weekStart,
  selectedDate,
  presenceMap,
  onSelectDate,
  onChangeWeek,
}: WeeklyDateStripProps) => {
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart])
  const dragStartX = useRef<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX
    setIsDragging(true)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartX.current === null) {
      setIsDragging(false)
      return
    }

    const deltaX = event.clientX - dragStartX.current
    if (Math.abs(deltaX) > DRAG_THRESHOLD) {
      onChangeWeek(deltaX > 0 ? -1 : 1)
    }

    dragStartX.current = null
    setIsDragging(false)
  }

  const handlePointerLeave = () => {
    dragStartX.current = null
    setIsDragging(false)
  }

  return (
    <div
      className="weekly-date-strip"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      role="group"
      aria-label="주간 날짜 선택"
    >
      {weekDays.map((day) => {
        const dateKey = toDateKey(day)
        const isSelected = toDateKey(selectedDate) === dateKey
        const hasSchedule = presenceMap[dateKey]
        return (
          <button
            key={dateKey}
            type="button"
            className={[
              'weekly-date-strip__day',
              isSelected && 'is-selected',
              hasSchedule && 'has-schedule',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelectDate(day)}
          >
            <span className="weekly-date-strip__day-name">
              {day.format('dd')}
            </span>
            <span className="weekly-date-strip__day-number">{day.format('D')}</span>
            <span className="weekly-date-strip__dot" aria-hidden>
              ●
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default WeeklyDateStrip

