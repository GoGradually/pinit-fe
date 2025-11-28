import useScheduleForm from '../../hooks/useScheduleForm'
import type { ScheduleTaskType } from '../../types/schedule'
import './ScheduleForm.css'

const taskTypeOptions: { value: ScheduleTaskType; label: string }[] = [
  { value: 'DEEP_WORK', label: '집중 작업' },
  { value: 'QUICK_TASK', label: '빠른 일정' },
  { value: 'ADMIN_TASK', label: '행정 작업' },
]

const ScheduleForm = () => {
  const { values, errors, isSubmitting, onChange, onSubmit, reset } = useScheduleForm()

  return (
    <form
      className="schedule-form"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <label className="schedule-form__field">
        <span>일정 제목</span>
        <input
          value={values.title}
          onChange={(event) => onChange('title', event.target.value)}
          placeholder="예: 마케팅 전략 미팅"
        />
        {errors.title && <small>{errors.title}</small>}
      </label>

      <label className="schedule-form__field">
        <span>설명</span>
        <textarea
          value={values.description}
          onChange={(event) => onChange('description', event.target.value)}
          placeholder="세부 설명을 입력해 주세요"
          rows={3}
        />
        {errors.description && <small>{errors.description}</small>}
      </label>

      <label className="schedule-form__field">
        <span>일정 타입</span>
        <select
          value={values.taskType}
          onChange={(event) => onChange('taskType', event.target.value as ScheduleTaskType)}
        >
          {taskTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="schedule-form__field">
        <span>중요도 (1~9)</span>
        <input
          type="number"
          min={1}
          max={9}
          value={values.importance}
          onChange={(event) => onChange('importance', Number(event.target.value))}
        />
        {errors.importance && <small>{errors.importance}</small>}
      </label>

      <label className="schedule-form__field">
        <span>긴급도 (1~9)</span>
        <input
          type="number"
          min={1}
          max={9}
          value={values.urgency}
          onChange={(event) => onChange('urgency', Number(event.target.value))}
        />
        {errors.urgency && <small>{errors.urgency}</small>}
      </label>

      <label className="schedule-form__field">
        <span>시작 시간</span>
        <input
          type="datetime-local"
          value={values.date.toISOString().slice(0, 16)}
          onChange={(event) => onChange('date', new Date(event.target.value))}
        />
      </label>

      <label className="schedule-form__field">
        <span>마감 시간</span>
        <input
          type="datetime-local"
          value={values.deadline.toISOString().slice(0, 16)}
          onChange={(event) => onChange('deadline', new Date(event.target.value))}
        />
        {errors.deadline && <small>{errors.deadline}</small>}
      </label>

      <div className="schedule-form__actions">
        <button type="button" onClick={reset} disabled={isSubmitting}>
          초기화
        </button>
        <button type="submit" className="is-primary" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : '일정 저장'}
        </button>
      </div>
    </form>
  )
}

export default ScheduleForm

