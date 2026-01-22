import type dayjs from 'dayjs'
import type { ScheduleResponse } from '../types/schedule'
import type { DateTimeWithZone } from '../types/datetime'
import { toApiDateTimeWithZone } from '../utils/datetime'
import { withTimeZoneParams } from '../utils/timeParams'
import { buildApiUrl } from './config'
import { httpClient } from './httpClient'

const buildTimeQuery = (time: dayjs.Dayjs | DateTimeWithZone | string | Date) => withTimeZoneParams(time)

export const fetchSchedules = (time: dayjs.Dayjs | DateTimeWithZone | string | Date) => {
  const query = buildTimeQuery(time)
  return httpClient<ScheduleResponse[]>(buildApiUrl(`/schedules?${query}`, 'v1'))
}

export const fetchWeeklySchedules = (time: dayjs.Dayjs | DateTimeWithZone | string | Date) => {
  const query = buildTimeQuery(time)
  return httpClient<ScheduleResponse[]>(buildApiUrl(`/schedules/week?${query}`, 'v1'))
}

export type ScheduleSimpleRequest = {
  title: string
  description: string
  date: DateTimeWithZone
  scheduleType: 'DEEP_WORK' | 'QUICK_TASK' | 'ADMIN_TASK'
}

export type ScheduleSimplePatchRequest = Partial<ScheduleSimpleRequest>

export const createSchedule = (payload: ScheduleSimpleRequest) =>
  httpClient<ScheduleResponse>(buildApiUrl('/schedules', 'v1'), {
    method: 'POST',
    json: {
      ...payload,
      date: toApiDateTimeWithZone(payload.date),
    },
  })

export const updateSchedule = (scheduleId: number, payload: ScheduleSimplePatchRequest) =>
  httpClient<ScheduleResponse>(buildApiUrl(`/schedules/${scheduleId}`, 'v1'), {
    method: 'PATCH',
    json: payload.date ? { ...payload, date: toApiDateTimeWithZone(payload.date) } : payload,
  })

export const deleteSchedule = (scheduleId: number) =>
  httpClient<void>(buildApiUrl(`/schedules/${scheduleId}`, 'v1'), {
    method: 'DELETE',
  })

export const fetchScheduleDetail = (scheduleId: number) =>
  httpClient<ScheduleResponse>(buildApiUrl(`/schedules/${scheduleId}`, 'v1'))

export const startSchedule = (scheduleId: number, at: DateTimeWithZone | string | Date = new Date()) =>
  httpClient<void>(buildApiUrl(`/schedules/${scheduleId}/start?${buildTimeQuery(at)}`, 'v1'), {
    method: 'POST',
  })

export const suspendSchedule = (scheduleId: number, at: DateTimeWithZone | string | Date = new Date()) =>
  httpClient<void>(buildApiUrl(`/schedules/${scheduleId}/suspend?${buildTimeQuery(at)}`, 'v1'), {
    method: 'POST',
  })

export const completeSchedule = (scheduleId: number, at: DateTimeWithZone | string | Date = new Date()) =>
  httpClient<void>(buildApiUrl(`/schedules/${scheduleId}/complete?${buildTimeQuery(at)}`, 'v1'), {
    method: 'POST',
  })

export const cancelSchedule = (scheduleId: number) =>
  httpClient<void>(buildApiUrl(`/schedules/${scheduleId}/cancel`, 'v1'), {
    method: 'POST',
  })

// 현재 진행 중인 일정 ID (v1)
export const fetchActiveScheduleId = () =>
  httpClient<number>(buildApiUrl('/members/now', 'v1'))
