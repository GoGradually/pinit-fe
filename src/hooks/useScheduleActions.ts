import { startSchedule, suspendSchedule, completeSchedule, cancelSchedule } from '../api/schedules'
import { useScheduleCache } from '../context/ScheduleCacheContext'
import { useEffect, useMemo, useState } from 'react'
import type { ScheduleState } from '../types/schedule'

const allowedStartStates: ScheduleState[] = ['PENDING', 'SUSPENDED']
const allowedCompleteStates: ScheduleState[] = ['IN_PROGRESS']
const allowedPauseStates: ScheduleState[] = ['IN_PROGRESS']
const allowedCancelStates: ScheduleState[] = ['PENDING', 'IN_PROGRESS']

type UseScheduleActionsResult = {
  currentState: ScheduleState
  isMutating: boolean
  lastMessage: string | null
  canStart: boolean
  canPause: boolean
  canComplete: boolean
  canCancel: boolean
  start: () => Promise<void>
  pause: () => Promise<void>
  complete: () => Promise<void>
  cancel: () => Promise<void>
}

const useScheduleActions = (scheduleId: number | null, initialState: ScheduleState): UseScheduleActionsResult => {
  const [currentState, setCurrentState] = useState<ScheduleState>(initialState)
  const [isMutating, setIsMutating] = useState(false)
  const [lastMessage, setLastMessage] = useState<string | null>(null)
  const { updateScheduleState } = useScheduleCache()

  useEffect(() => {
    setCurrentState(initialState)
  }, [initialState])

  const canStart = useMemo(() => allowedStartStates.includes(currentState), [currentState])
  const canPause = useMemo(() => allowedPauseStates.includes(currentState), [currentState])
  const canComplete = useMemo(() => allowedCompleteStates.includes(currentState), [currentState])
  const canCancel = useMemo(() => allowedCancelStates.includes(currentState), [currentState])

  const mutate = async (handler: (id: number) => Promise<void>, nextState: ScheduleState, message: string) => {
    if (!scheduleId) return
    setIsMutating(true)
    try {
      await handler(scheduleId)
      setCurrentState(nextState)
      updateScheduleState(scheduleId, nextState)
      setLastMessage(message)
    } finally {
      setIsMutating(false)
    }
  }

  const start = async () => {
    if (!canStart || isMutating) return
    await mutate(startSchedule, 'IN_PROGRESS', '일정을 시작했습니다.')
  }

  const pause = async () => {
    if (!canPause || isMutating) return
    await mutate(suspendSchedule, 'SUSPENDED', '일정을 일시 중지했습니다.')
  }

  const complete = async () => {
    if (!canComplete || isMutating) return
    await mutate(completeSchedule, 'COMPLETED', '일정을 완료했습니다.')
  }

  const cancel = async () => {
    if (!canCancel || isMutating) return
    await mutate(cancelSchedule, 'CANCELED', '일정을 취소했습니다.')
  }

  return {
    currentState,
    isMutating,
    lastMessage,
    canStart,
    canPause,
    canComplete,
    canCancel,
    start,
    pause,
    complete,
    cancel,
  }
}

export default useScheduleActions
