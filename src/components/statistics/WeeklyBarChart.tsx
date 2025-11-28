import './WeeklyBarChart.css'

type WeeklyBarChartProps = {
  deepWorkMinutes: number
  adminWorkMinutes: number
  totalMinutes: number
}

const WeeklyBarChart = ({ deepWorkMinutes, adminWorkMinutes, totalMinutes }: WeeklyBarChartProps) => {
  const deepRatio = totalMinutes ? deepWorkMinutes / totalMinutes : 0
  const adminRatio = totalMinutes ? adminWorkMinutes / totalMinutes : 0

  return (
    <section className="weekly-bar">
      <div className="weekly-bar__bar" aria-hidden>
        <span style={{ flexGrow: deepRatio }} className="weekly-bar__segment weekly-bar__segment--deep" />
        <span style={{ flexGrow: adminRatio }} className="weekly-bar__segment weekly-bar__segment--admin" />
      </div>
      <div className="weekly-bar__legend">
        <p>집중 작업 {deepWorkMinutes}분</p>
        <p>행정 작업 {adminWorkMinutes}분</p>
        <p>총 {totalMinutes}분</p>
      </div>
    </section>
  )
}

export default WeeklyBarChart

