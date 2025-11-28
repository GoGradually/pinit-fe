import './StatisticCard.css'

type StatisticCardProps = {
  label: string
  value: string
  description?: string
}

const StatisticCard = ({ label, value, description }: StatisticCardProps) => {
  return (
    <article className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {description && <p className="stat-card__description">{description}</p>}
    </article>
  )
}

export default StatisticCard

