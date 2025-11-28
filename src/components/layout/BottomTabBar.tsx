import { NavLink } from 'react-router-dom'
import './BottomTabBar.css'

type BottomTabBarProps = {
  activePath: string
}

const tabs = [
  { key: 'schedules', label: '일정', path: '/app/schedules', icon: '📅' },
  { key: 'new', label: '추가', path: '/app/new', icon: '＋' },
  { key: 'statistics', label: '통계', path: '/app/statistics', icon: '📊' },
]

const BottomTabBar = ({ activePath }: BottomTabBarProps) => {
  const normalized = activePath.startsWith('/app') ? activePath : '/app/schedules'

  return (
    <nav className="bottom-tab">
      {tabs.map((tab) => (
        <NavLink
          key={tab.key}
          to={tab.path}
          className={['bottom-tab__item', normalized === tab.path ? 'is-active' : '']
            .join(' ')
            .trim()}
        >
          <span className="bottom-tab__icon" aria-hidden>
            {tab.icon}
          </span>
          <span className="bottom-tab__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomTabBar

