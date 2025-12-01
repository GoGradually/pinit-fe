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

    const hasSameDate =
      current.date.dateTime === previous.date.dateTime &&
      current.date.zoneId === previous.date.zoneId
    const hasSameDeadline =
      current.deadline.dateTime === previous.deadline.dateTime &&
      current.deadline.zoneId === previous.deadline.zoneId

    const isSame =
      current.id === previous.id &&
      current.ownerId === previous.ownerId &&
      current.title === previous.title &&
      current.description === previous.description &&
      hasSameDate &&
      hasSameDeadline &&
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
