import { buildApiUrl } from './config'
import { httpClient } from './httpClient'
import type { Task, TaskCursorResponse, TaskListResponse, TaskRequest, TaskScheduleRequest } from '../types/task'
import type { DateTimeWithZone } from '../types/datetime'
import { toApiDateTimeWithZone } from '../utils/datetime'

type ListParams = {
  page?: number
  size?: number
  readyOnly?: boolean
}

type CursorParams = {
  size?: number
  cursor?: string | null
  readyOnly?: boolean
}

export const fetchTasks = ({ page = 0, size = 20, readyOnly = false }: ListParams) => {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    readyOnly: String(readyOnly),
  })
  return httpClient<TaskListResponse>(buildApiUrl(`/tasks?${query.toString()}`, 'v1'))
}

export const fetchTasksByCursor = ({ size = 20, cursor, readyOnly = false }: CursorParams) => {
  const query = new URLSearchParams({
    size: String(size),
    readyOnly: String(readyOnly),
  })
  if (cursor) query.set('cursor', cursor)
  return httpClient<TaskCursorResponse>(buildApiUrl(`/tasks/cursor?${query.toString()}`, 'v1'))
}

export const fetchTaskDetail = (taskId: number) =>
  httpClient<Task>(buildApiUrl(`/tasks/${taskId}`, 'v1'))

export const createTask = (payload: TaskRequest) =>
  httpClient<Task>(buildApiUrl('/tasks', 'v1'), {
    method: 'POST',
    json: payload,
  })

export const updateTask = (taskId: number, payload: TaskRequest) =>
  httpClient<Task>(buildApiUrl(`/tasks/${taskId}`, 'v1'), {
    method: 'PATCH',
    json: payload,
  })

export const deleteTask = (taskId: number, deleteSchedules = false) => {
  const query = new URLSearchParams({
    deleteSchedules: String(deleteSchedules),
  })
  return httpClient<void>(buildApiUrl(`/tasks/${taskId}?${query.toString()}`, 'v1'), {
    method: 'DELETE',
  })
}

export const completeTask = (taskId: number) =>
  httpClient<void>(buildApiUrl(`/tasks/${taskId}/complete`, 'v1'), {
    method: 'POST',
  })

export const reopenTask = (taskId: number) =>
  httpClient<void>(buildApiUrl(`/tasks/${taskId}/reopen`, 'v1'), {
    method: 'POST',
  })

export const createScheduleFromTask = (taskId: number, payload: TaskScheduleRequest | { date: DateTimeWithZone; scheduleType: TaskScheduleRequest['scheduleType']; title?: string; description?: string }) =>
  httpClient<void>(buildApiUrl(`/tasks/${taskId}/schedules`, 'v1'), {
    method: 'POST',
    json: {
      ...payload,
      date: toApiDateTimeWithZone(payload.date),
    },
  })
