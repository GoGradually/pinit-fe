import dayjs from 'dayjs'
import useScheduleViewState from '../hooks/useScheduleViewState'
import WeeklyDateStrip from '../components/schedules/WeeklyDateStrip'
import OverdueBanner from '../components/schedules/OverdueBanner'
import useWeeklySchedulePresence from '../hooks/useWeeklySchedulePresence'
import useOverdueSchedulesSummary from '../hooks/useOverdueSchedulesSummary'
import './SchedulesTabPage.css'

const SchedulesTabPage = () => {
  const { currentWeekStart, selectedDate, selectedDateLabel, goToWeek, selectDate } =
    useScheduleViewState()
  const { presenceMap, isLoading: isPresenceLoading, refetch: refetchPresence } =
    useWeeklySchedulePresence({ weekStart: currentWeekStart })
  const { summary: overdueSummary, isLoading: isOverdueLoading, refetch: refetchOverdue } =
    useOverdueSchedulesSummary()

  const handleRefresh = () => {
    refetchPresence()
    refetchOverdue()
  }

  return (
    <section className="schedules-tab">
      {isOverdueLoading ? (
        <div className="schedules-tab__skeleton">미완료 일정 정보를 불러오는 중...</div>
      ) : (
        <OverdueBanner
          summary={overdueSummary}
          onNavigateToDate={(dateKey) => selectDate(dayjs(dateKey).tz())}
        />
      )}
      <WeeklyDateStrip
        weekStart={currentWeekStart}
        selectedDate={selectedDate}
        presenceMap={presenceMap}
        onSelectDate={selectDate}
        onChangeWeek={goToWeek}
      />
      <header className="schedules-tab__header">
        <h2>{selectedDateLabel}</h2>
        <button type="button" className="schedules-tab__refresh" onClick={handleRefresh}>
          새로고침
        </button>
      </header>
      <div className="schedules-tab__list">
        {isPresenceLoading ? (
          <p>일정을 불러오는 중...</p>
        ) : (
          <p>예정된 일정 데이터를 여기에 배치합니다.</p>
        )}
      </div>
    </section>
  )
}

export default SchedulesTabPage
