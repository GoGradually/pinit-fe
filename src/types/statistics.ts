export type StatisticsResponse = {
  weekStart: string
  deepWorkElapsedTime: string
  adminWorkElapsedTime: string
  totalWorkElapsedTime: string
}

export type WeeklyStatisticsView = {
  weekStartLabel: string
  deepWorkMinutes: number
  adminWorkMinutes: number
  totalMinutes: number
  deepWorkRatio: number
  adminWorkRatio: number
}

