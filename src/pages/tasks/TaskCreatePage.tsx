import TaskForm from '../../components/tasks/TaskForm'
import type { TaskFormValues } from '../../components/tasks/TaskForm'
import { createTask } from '../../api/tasks'
import { toApiDateTimeWithZone } from '../../utils/datetime'
import './TaskPages.css'

const TaskCreatePage = () => {
  const handleSubmit = async (values: TaskFormValues) => {
    const payload = {
      title: values.title,
      description: values.description,
      dueDate: toApiDateTimeWithZone(values.dueDate),
      importance: values.importance,
      difficulty: values.difficulty,
      addDependencies: [
        // 새 작업 이전에 해야 할 작업: fromId=선행, toId=0
        ...values.previousTaskIds.map((fromId) => ({ fromId, toId: 0 })),
        // 새 작업 이후에 해야 할 작업: fromId=0, toId=후행
        ...values.nextTaskIds.map((toId) => ({ fromId: 0, toId })),
      ],
    }
    await createTask(payload)
  }

  return (
    <section className="task-page">
      <header className="task-page__header">
        <p className="task-page__eyebrow">새 작업</p>
        <h1 className="task-page__title">작업 추가</h1>
        <p className="task-page__description">Task 폼과 의존성 선택 모달을 연결할 예정입니다.</p>
      </header>
      <TaskForm onSubmit={handleSubmit} submitLabel="작업 생성" />
    </section>
  )
}

export default TaskCreatePage
