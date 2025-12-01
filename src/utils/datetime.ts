import type { DateTimeWithZone } from '../types/datetime'
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

export const SEOUL_TZ = 'Asia/Seoul'
dayjs.tz.setDefault(SEOUL_TZ)

const isDateTimeWithZone = (value: unknown): value is DateTimeWithZone => {
  if (!value || typeof value !== 'object') return false
  return 'dateTime' in value && 'zoneId' in value
}

const normalizeZoneId = (zoneId?: string, fallback = SEOUL_TZ) => {
  // Allow only IANA-style names (e.g., "Asia/Seoul"); fall back otherwise
  return zoneId && /^[A-Za-z]+\/[A-Za-z_+-]+$/.test(zoneId) ? zoneId : fallback
}

const toZonedDayjs = (value: dayjs.Dayjs | Date | string | DateTimeWithZone, fallbackZone = SEOUL_TZ) => {
  if (isDateTimeWithZone(value)) {
    const zoneId = normalizeZoneId(value.zoneId, fallbackZone)
    return dayjs.tz(value.dateTime, zoneId)
  }
  return dayjs(value).tz(fallbackZone)
}

export const getTodayKST = () => dayjs().tz(SEOUL_TZ)

export const getWeekStart = (date: dayjs.Dayjs) => date.isoWeekday(1).startOf('day')

export const getWeekDays = (weekStart: dayjs.Dayjs) =>
  Array.from({ length: 7 }, (_, index) => weekStart.add(index, 'day'))

export const toDateKey = (date: dayjs.Dayjs | Date | string | DateTimeWithZone) =>
  toZonedDayjs(date).format('YYYY-MM-DD')

export const formatDisplayDate = (date: dayjs.Dayjs | Date | string | DateTimeWithZone) =>
  toZonedDayjs(date).format('M월 D일 (dd)')

export const formatDateTimeWithZone = (
  value: dayjs.Dayjs | Date | string | DateTimeWithZone,
  format: string = 'M월 D일 HH:mm',
) => toZonedDayjs(value).format(format)

export const fromApiDateTimeKST = (value: string) => toZonedDayjs(value)

// Backend expects local wall time string without trailing Z; zone is sent separately
export const toApiDateTimeKST = (value: dayjs.Dayjs | Date | string | DateTimeWithZone) =>
  toZonedDayjs(value, SEOUL_TZ).format('YYYY-MM-DDTHH:mm:ss')

export const toApiDateTimeWithZone = (
  value: dayjs.Dayjs | Date | string | DateTimeWithZone,
  zone: string = SEOUL_TZ,
): DateTimeWithZone => {
  const safeZone = normalizeZoneId(zone, SEOUL_TZ)
  if (isDateTimeWithZone(value)) {
    const zoneId = normalizeZoneId(value.zoneId, safeZone)
    const normalized = dayjs.tz(value.dateTime, zoneId)
    return {
      dateTime: normalized.format('YYYY-MM-DDTHH:mm:ss'),
      zoneId,
    }
  }
  const normalized = dayjs(value).tz(safeZone)
  return {
    dateTime: normalized.format('YYYY-MM-DDTHH:mm:ss'),
    zoneId: safeZone,
  }
}

export const toDateFromApi = (value: dayjs.Dayjs | Date | string | DateTimeWithZone) =>
  toZonedDayjs(value).toDate()

export const addDays = (date: dayjs.Dayjs | Date | string | DateTimeWithZone, offset: number) =>
  toZonedDayjs(date).add(offset, 'day')
