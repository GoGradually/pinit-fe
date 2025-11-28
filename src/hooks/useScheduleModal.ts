import { useCallback, useState } from 'react'

const useScheduleModal = () => {
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [editScheduleId, setEditScheduleId] = useState<number | null>(null)

  const openCreate = useCallback(() => setCreateOpen(true), [])
  const closeCreate = useCallback(() => setCreateOpen(false), [])

  const openEdit = useCallback((scheduleId: number) => setEditScheduleId(scheduleId), [])
  const closeEdit = useCallback(() => setEditScheduleId(null), [])

  return {
    isCreateOpen,
    openCreate,
    closeCreate,
    editScheduleId,
    openEdit,
    closeEdit,
  }
}

export default useScheduleModal
