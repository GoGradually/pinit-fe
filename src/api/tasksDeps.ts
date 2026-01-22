import { httpClient } from './httpClient'
import { buildApiUrl } from './config'
import type { Task } from '../types/task'

export const fetchTaskDetailForDeps = (taskId: number) =>
  httpClient<Task>(buildApiUrl(`/tasks/${taskId}`, 'v1'))
