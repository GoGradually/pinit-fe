import useWeeklyStatistics from '../hooks/useWeeklyStatistics'
import StatisticCard from '../components/statistics/StatisticCard'
import DonutChart from '../components/statistics/DonutChart'
import WeeklyBarChart from '../components/statistics/WeeklyBarChart'
import './StatisticsTabPage.css'

const StatisticsTabPage = () => {
  const { stats, isLoading, refetch } = useWeeklyStatistics()

  if (isLoading || !stats) {
    return <p className="statistics-tab__loading">통계를 불러오는 중...</p>
  }

  const { weekStartLabel, deepWorkMinutes, adminWorkMinutes, totalMinutes, deepWorkRatio, adminWorkRatio } = stats

  return (
    <section className="statistics-tab">
      <header className="statistics-tab__header">
        <h1>이번 주 통계</h1>
        <p>{weekStartLabel}</p>
        <button type="button" onClick={refetch}>새로고침</button>
      </header>
      <div className="statistics-tab__cards">
        <StatisticCard label="집중 작업" value={`${deepWorkMinutes}분`} description="딥워크" />
        <StatisticCard label="행정 작업" value={`${adminWorkMinutes}분`} description="행정 업무" />
        <StatisticCard label="총 작업 시간" value={`${totalMinutes}분`} />
      </div>
      <DonutChart deepWorkRatio={deepWorkRatio} adminWorkRatio={adminWorkRatio} />
      <WeeklyBarChart deepWorkMinutes={deepWorkMinutes} adminWorkMinutes={adminWorkMinutes} totalMinutes={totalMinutes} />
    </section>
  )
}

export default StatisticsTabPage
