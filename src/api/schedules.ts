import { httpClient } from './httpClient'
import type dayjs from 'dayjs'
import type {
  ScheduleResponse,
  ScheduleRequest,
  ScheduleSummary,
} from '../types/schedule'
import { MEMBER_ID } from '../constants/member'
import type { DateTimeWithZone } from '../types/datetime'
import { toApiDateTimeWithZone, toLocalDateTimeString } from '../utils/datetime'

export const fetchScheduleSummaries = (dateTime: dayjs.Dayjs | DateTimeWithZone | string | Date) => {
  const dateParam = toLocalDateTimeString(dateTime)
  return httpClient<ScheduleSummary[]>(`/schedules?memberId=${MEMBER_ID}&date=${dateParam}`)
}

export const fetchWeeklySchedules = (time: DateTimeWithZone | string | Date) => {
  const timeParam = toApiDateTimeWithZone(time)
  const query = new URLSearchParams({
    memberId: String(MEMBER_ID),
    time: timeParam.dateTime,
    zoneId: timeParam.zoneId,
  })
  return httpClient<ScheduleResponse[]>(`/schedules/week?${query.toString()}`)
}

export const fetchScheduleDetail = (scheduleId: number) =>
  httpClient<ScheduleResponse>(`/schedules/${scheduleId}?memberId=${MEMBER_ID}`)

export const createSchedule = (payload: ScheduleRequest) =>
  httpClient<ScheduleResponse>(`/schedules?memberId=${MEMBER_ID}`, {
    method: 'POST',
    json: payload,
  })

export const updateSchedule = (scheduleId: number, payload: Partial<ScheduleRequest>) =>
  httpClient<ScheduleResponse>(`/schedules/${scheduleId}?memberId=${MEMBER_ID}`, {
    method: 'PATCH',
    json: payload,
  })

export const deleteSchedule = (scheduleId: number) =>
  httpClient<void>(`/schedules/${scheduleId}?memberId=${MEMBER_ID}`, {
    method: 'DELETE',
  })

export const fetchActiveScheduleId = () =>
  httpClient<number>(`/now?memberId=${MEMBER_ID}`)

const buildTimeQuery = (time: DateTimeWithZone | string | Date) => {
  const timeParam = toApiDateTimeWithZone(time)
  return new URLSearchParams({
    memberId: String(MEMBER_ID),
    time: timeParam.dateTime,
    zoneId: timeParam.zoneId,
  }).toString()
}

export const startSchedule = (scheduleId: number, at: DateTimeWithZone | string | Date = new Date()) =>
  httpClient<void>(`/schedules/${scheduleId}/start?${buildTimeQuery(at)}`, {
    method: 'POST',
  })

export const suspendSchedule = (scheduleId: number, at: DateTimeWithZone | string | Date = new Date()) =>
  httpClient<void>(`/schedules/${scheduleId}/suspend?${buildTimeQuery(at)}`, {
    method: 'POST',
  })

export const completeSchedule = (scheduleId: number, at: DateTimeWithZone | string | Date = new Date()) =>
  httpClient<void>(`/schedules/${scheduleId}/complete?${buildTimeQuery(at)}`, {
    method: 'POST',
  })

export const cancelSchedule = (scheduleId: number) =>
  httpClient<void>(`/schedules/${scheduleId}/cancel?memberId=${MEMBER_ID}`, {
    method: 'POST',
  })
