import { useEffect } from 'react'
import ScheduleForm from '../schedules/ScheduleForm'
import { createSchedule, updateSchedule } from '../../api/schedules'
import type { ScheduleFormValues, ScheduleResponse } from '../../types/schedule'
import './ScheduleModal.css'

type ScheduleModalProps = {
  mode: 'create' | 'edit'
  schedule?: ScheduleResponse | null
  onClose: () => void
}

const ScheduleModal = ({ mode, schedule, onClose }: ScheduleModalProps) => {
  useEffect(() => {
    return () => {
      // ensure cleanup closes modal state via onClose if unmounted externally
    }
  }, [])

  const handleSubmit = async (values: ScheduleFormValues) => {
    if (mode === 'create') {
      await createSchedule({
        ...values,
        date: values.date.toISOString(),
        deadline: values.deadline.toISOString(),
      })
    } else if (schedule) {
      await updateSchedule(schedule.id, {
        ...values,
        date: values.date.toISOString(),
        deadline: values.deadline.toISOString(),
      })
    }
    onClose()
  }

  const initialValues: Partial<ScheduleFormValues> | undefined = schedule
    ? {
        title: schedule.title,
        description: schedule.description,
        date: new Date(schedule.date),
        deadline: new Date(schedule.deadline),
        importance: schedule.importance,
        urgency: schedule.urgency,
        taskType: schedule.taskType,
        estimatedMinutes: schedule.estimatedMinutes,
      }
    : undefined

  return (
    <div className="schedule-modal__backdrop">
      <div className="schedule-modal__content">
        <header>
          <h1>{mode === 'create' ? '일정 추가' : '일정 수정'}</h1>
          <button onClick={onClose}>닫기</button>
        </header>
        <ScheduleForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={mode === 'create' ? '일정 추가' : '일정 수정'}
        />
      </div>
    </div>
  )
}

export default ScheduleModal
