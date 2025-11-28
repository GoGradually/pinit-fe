import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import TopBar from './TopBar'
import BottomTabBar from './BottomTabBar'
import './AppShell.css'

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

  return (
    <div className="app-shell">
      <TopBar
        title={title}
        onSettings={() => navigate('/app/settings')}
        showSettingsButton={showSettingsButton}
      />
      <main className="app-shell__content">
        <Outlet />
      </main>
      <BottomTabBar activePath={currentPath} />
    </div>
  )
}

export default AppShell

