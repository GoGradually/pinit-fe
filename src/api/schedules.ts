import type dayjs from 'dayjs'
import type {
  ScheduleResponse,
  ScheduleRequest,
  ScheduleSummary,
} from '../types/schedule'
import { MEMBER_ID } from '../constants/member'
import type { DateTimeWithZone } from '../types/datetime'
import { toApiDateTimeWithZone, toLocalDateTimeString } from '../utils/datetime'
import { buildApiUrl } from './config'
import { httpClient } from './httpClient'

export const fetchScheduleSummaries = (dateTime: dayjs.Dayjs | DateTimeWithZone | string | Date) => {
  const dateParam = toLocalDateTimeString(dateTime)
  return httpClient<ScheduleSummary[]>(buildApiUrl(`/schedules?memberId=${MEMBER_ID}&date=${dateParam}`))
}

export const fetchWeeklySchedules = (time: DateTimeWithZone | string | Date) => {
  const timeParam = toApiDateTimeWithZone(time)
  const query = new URLSearchParams({
    memberId: String(MEMBER_ID),
    time: timeParam.dateTime,
    zoneId: timeParam.zoneId,
  })
  return httpClient<ScheduleResponse[]>(buildApiUrl(`/schedules/week?${query.toString()}`))
}

export const fetchScheduleDetail = (scheduleId: number) =>
  httpClient<ScheduleResponse>(buildApiUrl(`/schedules/${scheduleId}?memberId=${MEMBER_ID}`))

export const createSchedule = (payload: ScheduleRequest) =>
  httpClient<ScheduleResponse>(buildApiUrl(`/schedules?memberId=${MEMBER_ID}`), {
    method: 'POST',
    json: payload,
  })

export const updateSchedule = (scheduleId: number, payload: Partial<ScheduleRequest>) =>
  httpClient<ScheduleResponse>(buildApiUrl(`/schedules/${scheduleId}?memberId=${MEMBER_ID}`), {
    method: 'PATCH',
    json: payload,
  })

export const deleteSchedule = (scheduleId: number) =>
  httpClient<void>(buildApiUrl(`/schedules/${scheduleId}?memberId=${MEMBER_ID}`), {
    method: 'DELETE',
  })

export const fetchActiveScheduleId = () =>
  httpClient<number>(buildApiUrl(`/now?memberId=${MEMBER_ID}`))

const buildTimeQuery = (time: DateTimeWithZone | string | Date) => {
  const timeParam = toApiDateTimeWithZone(time)
  return new URLSearchParams({
    memberId: String(MEMBER_ID),
    time: timeParam.dateTime,
    zoneId: timeParam.zoneId,
  }).toString()
}

export const startSchedule = (scheduleId: number, at: DateTimeWithZone | string | Date = new Date()) =>
  httpClient<void>(buildApiUrl(`/schedules/${scheduleId}/start?${buildTimeQuery(at)}`), {
    method: 'POST',
  })

export const suspendSchedule = (scheduleId: number, at: DateTimeWithZone | string | Date = new Date()) =>
  httpClient<void>(buildApiUrl(`/schedules/${scheduleId}/suspend?${buildTimeQuery(at)}`), {
    method: 'POST',
  })

export const completeSchedule = (scheduleId: number, at: DateTimeWithZone | string | Date = new Date()) =>
  httpClient<void>(buildApiUrl(`/schedules/${scheduleId}/complete?${buildTimeQuery(at)}`), {
    method: 'POST',
  })

export const cancelSchedule = (scheduleId: number) =>
  httpClient<void>(buildApiUrl(`/schedules/${scheduleId}/cancel?memberId=${MEMBER_ID}`), {
    method: 'POST',
  })
