import { httpClient } from './httpClient'
import type { StatisticsResponse } from '../types/statistics'
import type { DateTimeWithZone } from '../types/datetime'
import { toApiDateTimeWithZone } from '../utils/datetime'

type WeeklyStatisticsParams = {
  memberId: number
  time: DateTimeWithZone | string | Date
}

export const fetchWeeklyStatistics = ({ memberId, time }: WeeklyStatisticsParams) => {
  const timeParam = toApiDateTimeWithZone(time)
  const query = new URLSearchParams({
    memberId: String(memberId),
    time: timeParam.dateTime,
    zoneId: timeParam.zoneId,
  })

  return httpClient<StatisticsResponse>(`/statistics?${query.toString()}`)
}
