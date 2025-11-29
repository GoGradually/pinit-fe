import type { ScheduleSummary } from '../../types/schedule'
import './ScheduleCard.css'

type ScheduleCardProps = {
  schedule: ScheduleSummary
  onOpenDetail: (scheduleId: number) => void
  onDelete: (scheduleId: number) => void
  onStart: (scheduleId: number) => void
  onCancel: (scheduleId: number) => void
}

const taskTypeLabel: Record<NonNullable<ScheduleSummary['taskType']>, string> = {
  DEEP_WORK: '집중 작업',
  QUICK_TASK: '빠른 일정',
  ADMIN_TASK: '행정 작업',
}

const stateLabel: Record<ScheduleSummary['state'], string> = {
  NOT_STARTED: '미시작',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  SUSPENDED: '일시정지',
}

const stateIcon: Record<ScheduleSummary['state'], string> = {
  NOT_STARTED: '☐',  // 빈 박스
  IN_PROGRESS: '▶▶',  // >>
  COMPLETED: '✓',     // 체크
  SUSPENDED: '⏸',     // 일시정지
}

const ScheduleCard = ({ schedule, onOpenDetail, onDelete, onStart, onCancel }: ScheduleCardProps) => {
  const { id, title, description, importance, urgency, taskType, state } = schedule

  const handleClick = () => {
    onOpenDetail(id)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지
    if (window.confirm(`"${title}" 일정을 삭제하시겠습니까?`)) {
      onDelete(id)
    }
  }

  const handleStateIconClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지

    if (state === 'NOT_STARTED') {
      // 미시작 → 시작
      onStart(id)
    } else if (state === 'COMPLETED') {
      // 완료 → 취소 확인 모달
      if (window.confirm(`"${title}" 일정을 취소하시겠습니까?\n미시작 상태로 돌아갑니다.`)) {
        onCancel(id)
      }
    }
  }

  const isStateClickable = state === 'NOT_STARTED' || state === 'COMPLETED'

  return (
    <article
      className="schedule-card"
      aria-label={title}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <header className="schedule-card__header">
        <div className="schedule-card__header-left">
          <button
            className={`schedule-card__state-icon ${isStateClickable ? 'schedule-card__state-icon--clickable' : ''}`}
            onClick={handleStateIconClick}
            disabled={!isStateClickable}
            title={stateLabel[state]}
            aria-label={`${stateLabel[state]} 상태`}
          >
            {stateIcon[state]}
          </button>
          <div>
            <p className="schedule-card__title">{title}</p>
            {taskType && <p className="schedule-card__subtitle">{taskTypeLabel[taskType]}</p>}
          </div>
        </div>
        <div className="schedule-card__header-actions">
          <button
            className="schedule-card__delete-btn"
            onClick={handleDeleteClick}
            title="삭제"
            aria-label="일정 삭제"
          >
            🗑️
          </button>
        </div>
      </header>
      <p className="schedule-card__description">{description}</p>
      <footer className="schedule-card__footer">
        <div className="schedule-card__meta">
          <span className="schedule-card__pill">중요도 {importance}</span>
          <span className="schedule-card__pill">긴급도 {urgency}</span>
        </div>
      </footer>
    </article>
  )
}

export default ScheduleCard

