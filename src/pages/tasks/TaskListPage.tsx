import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { fetchTasks } from '../../api/tasks'
import type { Task } from '../../types/task'
import { getDifficultyStyle, getImportanceStyle } from '../../utils/priorityStyles'
import { useTaskCache } from '../../context/TaskCacheContext'
import './TaskPages.css'

const TaskListPage = () => {
  const navigate = useNavigate()
  const { tasksById, setTask } = useTaskCache()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchTasks({ page: 0, size: 20, readyOnly: false })
      setTasks(response.content ?? [])
      ;(response.content ?? []).forEach(setTask)
    } catch (err) {
      setError(err instanceof Error ? err.message : '작업을 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [setTask])

  useEffect(() => {
    load().catch(() => {})
  }, [load])

  useEffect(() => {
    const refetchOnChange = () => load()
    window.addEventListener('task:changed', refetchOnChange)
    window.addEventListener('schedule:changed', refetchOnChange)
    return () => {
      window.removeEventListener('task:changed', refetchOnChange)
      window.removeEventListener('schedule:changed', refetchOnChange)
    }
  }, [load])

  return (
    <section className="task-page">
      <header className="task-page__header">
        <p className="task-page__eyebrow">작업</p>
        <h1 className="task-page__title">작업 목록</h1>
        <p className="task-page__description">v1 Task API 연동 후 작업/의존성/마감일을 표시합니다.</p>
        <div className="task-page__actions">
          <button type="button" onClick={() => navigate('/app/tasks/new')} className="task-page__primary">
            새 작업 추가
          </button>
        </div>
      </header>
      {isLoading ? (
        <div className="task-page__placeholder">
          <p>작업을 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="task-page__placeholder">
          <p>작업을 불러오지 못했습니다.</p>
          <p>{error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="task-page__placeholder">
          <p>등록된 작업이 없습니다.</p>
        </div>
      ) : (
        <ul className="task-page__list">
          {tasks.map((task) => {
            const cached = tasksById[task.id]
            const item = cached ?? task
            return (
            <li key={task.id} className="task-page__item" onClick={() => navigate(`/app/tasks/${task.id}`)}>
              <div>
                <strong>{item.title}</strong>
                <p className="task-page__item-desc">{item.description}</p>
              </div>
              <div className="task-page__item-meta">
                {item.dueDate && (
                  <span className="task-page__pill">
                    마감 {dayjs(item.dueDate.dateTime).format('M/D HH:mm')}
                  </span>
                )}
                <span className="task-page__pill" style={getImportanceStyle(item.importance)}>
                  중요도 {item.importance}
                </span>
                <span className="task-page__pill" style={getDifficultyStyle(item.difficulty)}>
                  난이도 {item.difficulty}
                </span>
                <span className="task-page__pill">{item.isCompleted ? '완료' : '미완료'}</span>
              </div>
            </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default TaskListPage
