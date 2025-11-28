import ScheduleForm from '../components/schedules/ScheduleForm'
import './ScheduleCreateTabPage.css'

const ScheduleCreateTabPage = () => {
  return (
    <section className="schedule-create">
      <header className="schedule-create__header">
        <h1>새 일정 추가</h1>
        <p>집중/빠른/행정 작업을 선택하고, 중요도·긴급도를 지정해 주세요.</p>
      </header>
      <ScheduleForm />
    </section>
  )
}

export default ScheduleCreateTabPage
