import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import SchedulesTabPage from './pages/schedule/tab/SchedulesTabPage.tsx'
import ScheduleCreateTabPage from './pages/schedule/create/ScheduleCreateTabPage.tsx'
import StatisticsTabPage from './pages/statistics/StatisticsTabPage.tsx'
import SettingsPage from './pages/setting/SettingsPage.tsx'
import ScheduleDetailPage from './pages/schedule/detail/ScheduleDetailPage.tsx'
import { ScheduleCacheProvider } from './context/ScheduleCacheContext'

function App() {
  return (
    <ScheduleCacheProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/app/schedules" replace />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/schedules" replace />} />
            <Route path="schedules" element={<SchedulesTabPage />} />
            <Route path="schedules/:scheduleId" element={<ScheduleDetailPage />} />
            <Route path="new" element={<ScheduleCreateTabPage />} />
            <Route path="statistics" element={<StatisticsTabPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ScheduleCacheProvider>
  )
}

export default App
