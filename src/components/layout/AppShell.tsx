import { createContext } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import TopBar from './TopBar'
import BottomTabBar from './BottomTabBar'
import MiniPlayerBar from '../schedules/MiniPlayerBar'
import useScheduleModal from '../../hooks/useScheduleModal'
import useScheduleDetail from '../../hooks/useScheduleDetail'
import ScheduleModal from '../modals/ScheduleModal'
import './AppShell.css'

export const ScheduleModalContext = createContext<ReturnType<typeof useScheduleModal> | null>(null)

const TAB_TITLES: Record<string, string> = {
  '/app/schedules': '일정',
  '/app/new': '일정 추가',
  '/app/statistics': '통계',
  '/app/settings': '설정',
}

const AppShell = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname.startsWith('/app')
    ? location.pathname
    : '/app/schedules'

  const title = TAB_TITLES[currentPath] ?? '일정'
  const showSettingsButton = currentPath !== '/app/settings'
  const modalControls = useScheduleModal()
  const editScheduleId = modalControls.editScheduleId
  const editScheduleResult = useScheduleDetail(editScheduleId ? editScheduleId.toString() : undefined)
  const editSchedule = editScheduleResult.schedule

  return (
    <ScheduleModalContext.Provider value={modalControls}>
      <div className="app-shell">
        <TopBar
          title={title}
          onSettings={() => navigate('/app/settings')}
          showSettingsButton={showSettingsButton}
        />
        <main className="app-shell__content">
          <Outlet />
        </main>
        <MiniPlayerBar />
        <BottomTabBar activePath={currentPath} />
        {modalControls.isCreateOpen && (
          <ScheduleModal mode="create" onClose={modalControls.closeCreate} />
        )}
        {modalControls.editScheduleId && (
          <ScheduleModal mode="edit" schedule={editSchedule} onClose={modalControls.closeEdit} />
        )}
      </div>
    </ScheduleModalContext.Provider>
  )
}

export default AppShell
