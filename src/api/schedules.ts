import { httpClient } from './httpClient'
import type {
  ScheduleResponse,
  ScheduleRequest,
  ScheduleSummary,
  OverdueSummary,
} from '../types/schedule'

export const fetchScheduleSummaries = (date: string) =>
  httpClient<ScheduleSummary[]>(`/schedules?date=${date}`)

export const fetchScheduleDetail = (scheduleId: number) =>
  httpClient<ScheduleResponse>(`/schedules/${scheduleId}`)

export const createSchedule = (payload: ScheduleRequest) =>
  httpClient<ScheduleResponse>('/schedules', {
    method: 'POST',
    json: payload,
  })

export const updateSchedule = (scheduleId: number, payload: Partial<ScheduleRequest>) =>
  httpClient<ScheduleResponse>(`/schedules/${scheduleId}`, {
    method: 'PATCH',
    json: payload,
  })

export const deleteSchedule = (scheduleId: number) =>
  httpClient<void>(`/schedules/${scheduleId}`, {
    method: 'DELETE',
  })

export const fetchOverdueSummary = () => httpClient<OverdueSummary>('/schedules/overdue-summary')

