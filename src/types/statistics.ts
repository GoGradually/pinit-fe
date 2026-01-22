import type { DateTimeWithZone } from './datetime'

export type StatisticsResponse = {
  memberId: number
  startOfWeek: DateTimeWithZone | string
  deepWorkElapsedTime: string
  adminWorkElapsedTime: string
  totalWorkElapsedTime: string
}

export type WeeklyStatisticsView = {
  weekStartLabel: string
  deepWorkMinutes: number
  adminWorkMinutes: number
  quickWorkMinutes: number
  totalMinutes: number
  deepWorkRatio: number
  adminWorkRatio: number
  quickWorkRatio: number
}

export type WeeklyStatisticsSet = {
  current: WeeklyStatisticsView | null
  previous: WeeklyStatisticsView | null
}
