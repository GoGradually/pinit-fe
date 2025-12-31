import { MEMBER_ID } from '../constants/member'
import { buildApiUrl } from './config'
import { httpClient } from './httpClient'

export const fetchMemberZoneOffset = (memberId: number = MEMBER_ID) =>
  httpClient<string>(buildApiUrl(`/zone-offset?memberId=${memberId}`))
