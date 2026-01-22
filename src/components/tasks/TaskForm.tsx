import { useState } from 'react'
import dayjs from 'dayjs'
import { FIBONACCI_DIFFICULTIES } from '../../constants/difficulty'
import type { DifficultyValue } from '../../constants/difficulty'
import './TaskForm.css'
import TaskDependencyModal from './modals/TaskDependencyModal'

export type TaskFormValues = {
  title: string
  description: string
  dueDate: Date
  importance: number
  difficulty: DifficultyValue
  previousTaskIds: number[]
  nextTaskIds: number[]
}

type TaskFormProps = {
  initialValues?: Partial<TaskFormValues>
  onSubmit: (values: TaskFormValues) => Promise<void>
  submitLabel?: string
}

const buildDefaultValues = (initial?: Partial<TaskFormValues>): TaskFormValues => {
  const now = dayjs().minute(0).second(0)
  return {
    title: '',
    description: '',
    dueDate: initial?.dueDate ?? now.add(1, 'day').toDate(),
    importance: initial?.importance ?? 5,
    difficulty: initial?.difficulty ?? 2,
    previousTaskIds: initial?.previousTaskIds ?? [],
    nextTaskIds: initial?.nextTaskIds ?? [],
    ...initial,
  }
}

const formatDateTimeLocal = (value: Date) => dayjs(value).format('YYYY-MM-DDTHH:mm')
const parseDateTimeLocal = (value: string) => dayjs(value).toDate()

const TaskForm = ({ initialValues, onSubmit, submitLabel = '저장' }: TaskFormProps) => {
  const [values, setValues] = useState<TaskFormValues>(() => buildDefaultValues(initialValues))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [modalMode, setModalMode] = useState<null | 'previous' | 'next'>(null)
  const [dependencyMeta, setDependencyMeta] = useState<Record<number, { title: string }>>({})
  const isSubmitting = false // mutation 상태 필요시 state로 확장

  const validate = () => {
    const next: Record<string, string> = {}
    if (!values.title.trim()) next.title = '제목을 입력하세요.'
    if (!values.description.trim()) next.description = '설명을 입력하세요.'
    if (values.importance < 1 || values.importance > 9) next.importance = '중요도는 1~9'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    await onSubmit(values)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="task-form__field">
        <span>제목</span>
        <input
          value={values.title}
          onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="예: 발표 준비"
        />
        {errors.title && <small>{errors.title}</small>}
      </label>

      <label className="task-form__field">
        <span>설명</span>
        <textarea
          value={values.description}
          onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
          placeholder="무엇을 해야 하나요?"
        />
        {errors.description && <small>{errors.description}</small>}
      </label>

      <label className="task-form__field">
        <span>마감 시각</span>
        <input
          type="datetime-local"
          value={formatDateTimeLocal(values.dueDate)}
          onChange={(e) => setValues((prev) => ({ ...prev, dueDate: parseDateTimeLocal(e.target.value) }))}
        />
      </label>

      <label className="task-form__field">
        <span>중요도 (1~9)</span>
        <input
          type="number"
          min={1}
          max={9}
          value={values.importance}
          onChange={(e) => setValues((prev) => ({ ...prev, importance: Number(e.target.value) }))}
        />
        {errors.importance && <small>{errors.importance}</small>}
      </label>

      <label className="task-form__field">
        <span>난이도</span>
        <div className="task-form__chips">
          {FIBONACCI_DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              type="button"
              className={['task-form__chip', values.difficulty === diff ? 'is-active' : ''].join(' ').trim()}
              onClick={() => setValues((prev) => ({ ...prev, difficulty: diff }))}
              aria-pressed={values.difficulty === diff}
            >
              {diff}
            </button>
          ))}
        </div>
      </label>

      <div className="task-form__actions">
        <button type="submit" className="task-form__primary" disabled={isSubmitting}>
          {submitLabel}
        </button>
      </div>

      <div className="task-form__dependency">
        <div className="task-form__dependency-row">
          <h3>이전 작업</h3>
          <button type="button" onClick={() => setModalMode('previous')}>선택</button>
        </div>
        {values.previousTaskIds.length === 0 ? (
          <p className="task-form__note">선택된 이전 작업이 없습니다.</p>
        ) : (
          <div className="task-form__tags">
            {values.previousTaskIds.map((id) => (
              <span key={id} className="task-form__tag">
                {dependencyMeta[id]?.title ?? `작업 #${id}`}
                <button
                  type="button"
                  onClick={() =>
                    setValues((prev) => ({
                      ...prev,
                      previousTaskIds: prev.previousTaskIds.filter((v) => v !== id),
                    }))
                  }
                  aria-label="이전 작업 제거"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="task-form__dependency">
        <div className="task-form__dependency-row">
          <h3>이후 작업</h3>
          <button type="button" onClick={() => setModalMode('next')}>선택</button>
        </div>
        {values.nextTaskIds.length === 0 ? (
          <p className="task-form__note">선택된 이후 작업이 없습니다.</p>
        ) : (
          <div className="task-form__tags">
            {values.nextTaskIds.map((id) => (
              <span key={id} className="task-form__tag is-next">
                {dependencyMeta[id]?.title ?? `작업 #${id}`}
                <button
                  type="button"
                  onClick={() =>
                    setValues((prev) => ({
                      ...prev,
                      nextTaskIds: prev.nextTaskIds.filter((v) => v !== id),
                    }))
                  }
                  aria-label="이후 작업 제거"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <TaskDependencyModal
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        selectedIds={modalMode === 'previous' ? values.previousTaskIds : values.nextTaskIds}
        title={modalMode === 'previous' ? '이전에 해야 할 작업 선택' : '이후에 해야 할 작업 선택'}
        onApply={(tasks) => {
          const ids = tasks.map((t) => t.id)
          const metas = tasks.reduce<Record<number, { title: string }>>((acc, t) => {
            acc[t.id] = { title: t.title }
            return acc
          }, {})
          setDependencyMeta((prev) => ({ ...prev, ...metas }))
          setValues((prev) => {
            if (modalMode === 'previous') {
              const nextPrev = Array.from(new Set([...prev.previousTaskIds, ...ids])).filter(
                (id) => !prev.nextTaskIds.includes(id),
              )
              const nextNext = prev.nextTaskIds.filter((id) => !ids.includes(id))
              return { ...prev, previousTaskIds: nextPrev, nextTaskIds: nextNext }
            }
            const nextNext = Array.from(new Set([...prev.nextTaskIds, ...ids])).filter(
              (id) => !prev.previousTaskIds.includes(id),
            )
            const nextPrev = prev.previousTaskIds.filter((id) => !ids.includes(id))
            return { ...prev, previousTaskIds: nextPrev, nextTaskIds: nextNext }
          })
          setModalMode(null)
        }}
      />
    </form>
  )
}

export default TaskForm
