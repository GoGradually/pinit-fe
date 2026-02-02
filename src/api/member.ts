import { buildApiUrl } from './config'
import { httpClient } from './httpClient'

export const MEMBER_API_VERSION = 'v2'

export const fetchActiveScheduleId = () =>
  httpClient<number | null>(buildApiUrl('/members/now', MEMBER_API_VERSION))
