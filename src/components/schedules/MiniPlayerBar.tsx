import useActiveSchedule from '../../hooks/scheduledetails/useActiveSchedule.ts'
import useScheduleActions from '../../hooks/scheduledetails/useScheduleActions.ts'
import type { ScheduleState } from '../../types/schedule'
import './MiniPlayerBar.css'

// 진행 중인 일정에 대한 미니 플레이어 바 컴포넌트
// 대체할 이름 없음
const MiniPlayerBar = () => {
  const activeSchedule = useActiveSchedule()
  const scheduleActions = useScheduleActions(
    activeSchedule?.id ?? null,
    (activeSchedule?.state ?? 'NOT_STARTED') as ScheduleState
  )

  // IN_PROGRESS 또는 SUSPENDED 상태일 때만 표시
  if (!activeSchedule || (activeSchedule.state !== 'IN_PROGRESS' && activeSchedule.state !== 'SUSPENDED')) {
    return null
  }

  return (
    <div className="mini-player-wrapper">
      <aside className="mini-player">
        <div>
          <p className="mini-player__title">진행 중인 일정</p>
          <p className="mini-player__description">{activeSchedule.title}</p>
        </div>
        <div className="mini-player__buttons">
          <button
            className="mini-player__button mini-player__button--start"
            onClick={scheduleActions.start}
            disabled={!scheduleActions.canStart}
          >
            ▶
          </button>
          <button
            className="mini-player__button mini-player__button--pause"
            onClick={scheduleActions.pause}
            disabled={!scheduleActions.canPause}
          >
            Ⅱ
          </button>
          <button
            className="mini-player__button mini-player__button--complete"
            onClick={scheduleActions.complete}
            disabled={!scheduleActions.canComplete}
          >
            ✓
          </button>
          <button
            className="mini-player__button mini-player__button--cancel"
            onClick={scheduleActions.cancel}
            disabled={!scheduleActions.canCancel}
          >
            ✕
          </button>
        </div>
      </aside>
    </div>
  )
}

export default MiniPlayerBar
