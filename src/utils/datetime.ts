import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isoWeek)
dayjs.extend(weekday)

dayjs.tz.setDefault('Asia/Seoul')

export const getTodayKST = () => dayjs().tz()

export const getWeekStart = (date: dayjs.Dayjs) => date.isoWeekday(1).startOf('day')

export const getWeekDays = (weekStart: dayjs.Dayjs) =>
  Array.from({ length: 7 }, (_, index) => weekStart.add(index, 'day'))

export const toDateKey = (date: dayjs.Dayjs | Date | string) => dayjs(date).tz().format('YYYY-MM-DD')

export const formatDisplayDate = (date: dayjs.Dayjs | Date | string) =>
  dayjs(date).tz().format('M월 D일 (dd)')

export const fromApiDateTimeKST = (value: string) => dayjs(value).tz()

export const toApiDateTimeKST = (value: dayjs.Dayjs | Date | string) =>
  dayjs(value).tz().format('YYYY-MM-DDTHH:mm:ssZ[Asia/Seoul]')
