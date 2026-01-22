import { useState } from 'react'
import dayjs from 'dayjs'
import './TaskScheduleModal.css'
import { toApiDateTimeWithZone } from '../../utils/datetime'
import type { TaskScheduleRequest } from '../../types/task'

type TaskScheduleModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: TaskScheduleRequest) => Promise<void>
}

const TaskScheduleModal = ({ isOpen, onClose, onSubmit }: TaskScheduleModalProps) => {
  const [date, setDate] = useState(() => dayjs().minute(0).second(0).toDate())
  const [scheduleType, setScheduleType] = useState<TaskScheduleRequest['scheduleType']>('DEEP_WORK')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({
        title: title || undefined,
        description: description || undefined,
        scheduleType,
        date: toApiDateTimeWithZone(date),
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="task-sched-modal__backdrop" onClick={onClose}>
      <div className="task-sched-modal__content" onClick={(e) => e.stopPropagation()}>
        <header className="task-sched-modal__header">
          <h1>일정으로 배정</h1>
          <button onClick={onClose} aria-label="닫기">✕</button>
        </header>
        <form className="task-sched-modal__body" onSubmit={handleSubmit}>
          <label>
            <span>시작 시각</span>
            <input
              type="datetime-local"
              value={dayjs(date).format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => setDate(dayjs(e.target.value).toDate())}
            />
          </label>
          <label>
            <span>유형</span>
            <select value={scheduleType} onChange={(e) => setScheduleType(e.target.value as TaskScheduleRequest['scheduleType'])}>
              <option value="DEEP_WORK">집중</option>
              <option value="QUICK_TASK">빠른</option>
              <option value="ADMIN_TASK">행정</option>
            </select>
          </label>
          <label>
            <span>일정 제목 (선택)</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            <span>일정 설명 (선택)</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </label>
          <footer className="task-sched-modal__footer">
            <button type="button" onClick={onClose}>취소</button>
            <button type="submit" disabled={submitting}>{submitting ? '배정 중...' : '배정'}</button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default TaskScheduleModal
