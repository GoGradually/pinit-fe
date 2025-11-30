import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekday from 'dayjs/plugin/weekday'
import 'dayjs/locale/ko'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isoWeek)
dayjs.extend(weekday)
dayjs.locale('ko')

const SEOUL_TZ = 'Asia/Seoul'
dayjs.tz.setDefault(SEOUL_TZ)

export const getTodayKST = () => dayjs().tz(SEOUL_TZ)

export const getWeekStart = (date: dayjs.Dayjs) => date.isoWeekday(1).startOf('day')

export const getWeekDays = (weekStart: dayjs.Dayjs) =>
  Array.from({ length: 7 }, (_, index) => weekStart.add(index, 'day'))

export const toDateKey = (date: dayjs.Dayjs | Date | string) => {
  if (typeof date === 'string' && date.length >= 10) {
    // API에서 넘어온 문자열(타임존 포함)은 앞 10자리(YYYY-MM-DD)를 그대로 사용해 일자 보정을 막는다.
    return date.slice(0, 10)
  }
  return dayjs.tz(date, SEOUL_TZ).format('YYYY-MM-DD')
}

export const formatDisplayDate = (date: dayjs.Dayjs | Date | string) =>
  dayjs.tz(date, SEOUL_TZ).format('M월 D일 (dd)')

export const fromApiDateTimeKST = (value: string) => dayjs(value).tz(SEOUL_TZ)

export const toApiDateTimeKST = (value: dayjs.Dayjs | Date | string) => {
  const normalized = dayjs(value).tz(SEOUL_TZ)
  return normalized.toISOString()
}

export const toApiDateTimeWithZone = (
  value: dayjs.Dayjs | Date | string,
  zone: string = dayjs.tz.guess(),
) => {
  const normalized = dayjs(value).tz(zone)
  return normalized.toISOString()
}

export const addDays = (date: dayjs.Dayjs | Date | string, offset: number) =>
  dayjs(date).tz(SEOUL_TZ).add(offset, 'day')
