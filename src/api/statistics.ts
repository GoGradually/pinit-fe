import type { StatisticsResponse } from '../types/statistics'
import type { DateTimeWithZone } from '../types/datetime'
import { toApiDateTimeWithZone } from '../utils/datetime'
import { buildApiUrl } from './config'
import { httpClient } from './httpClient'

const STATISTICS_API_VERSION = 'v2'

type WeeklyStatisticsParams = {
  time: DateTimeWithZone | string | Date
}

export const fetchWeeklyStatistics = ({ time }: WeeklyStatisticsParams) => {
  const timeParam = toApiDateTimeWithZone(time)
  const query = new URLSearchParams({
    time: timeParam.dateTime,
    zoneId: timeParam.zoneId,
  })

  return httpClient<StatisticsResponse>(buildApiUrl(`/statistics?${query.toString()}`, STATISTICS_API_VERSION))
}
