import type { DateTimeWithZone } from './datetime'

export type TaskDependency = {
  fromId: number
  toId: number
}

export type TaskRequest = {
  title: string
  description: string
  dueDate: DateTimeWithZone
  importance: number // 1~9
  difficulty: number // fibonacci values
  addDependencies?: TaskDependency[]
  removeDependencies?: TaskDependency[]
}

export type Task = {
  id: number
  title: string
  description: string
  dueDate: DateTimeWithZone
  importance: number
  difficulty: number
  isCompleted: boolean
  inboundTaskCount?: number
  previousTasks?: Task[]
  nextTasks?: Task[]
  createdAt?: string
  updatedAt?: string
}

export type TaskListResponse = {
  content: Task[]
  page?: number
  size?: number
  totalElements?: number
  totalPages?: number
}

export type TaskCursorResponse = {
  items: Task[]
  nextCursor: string | null
}

export type TaskScheduleRequest = {
  title?: string
  description?: string
  date: DateTimeWithZone
  scheduleType: 'DEEP_WORK' | 'QUICK_TASK' | 'ADMIN_TASK'
}
