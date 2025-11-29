import type { ScheduleSummary } from '../types/schedule'

export const areScheduleListsEqual = (
  next: ScheduleSummary[] = [],
  prev: ScheduleSummary[] = [],
) => {
  if (next === prev) return true
  if (next.length !== prev.length) return false

  for (let index = 0; index < next.length; index += 1) {
    const current = next[index]
    const previous = prev[index]
    if (!previous) return false

    const isSame =
      current.id === previous.id &&
      current.title === previous.title &&
      current.description === previous.description &&
      current.date === previous.date &&
      current.deadline === previous.deadline &&
      current.importance === previous.importance &&
      current.urgency === previous.urgency &&
      current.state === previous.state &&
      current.taskType === previous.taskType

    if (!isSame) {
      return false
    }
  }

  return true
}

