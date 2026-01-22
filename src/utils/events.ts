export const dispatchTaskChanged = (taskId: number, reason: string) =>
  window.dispatchEvent(new CustomEvent('task:changed', { detail: { taskId, reason } }))

export const dispatchScheduleChanged = (reason: string, payload?: unknown) =>
  window.dispatchEvent(new CustomEvent('schedule:changed', { detail: { reason, payload } }))
