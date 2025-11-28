import { httpClient } from './httpClient'
import type { StatisticsResponse } from '../types/statistics'

export const fetchWeeklyStatistics = () => httpClient<StatisticsResponse>('/statistics/weekly')

