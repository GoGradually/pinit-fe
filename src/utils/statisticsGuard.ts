export const ensureStatisticsData = <T>(value: T | null | undefined) => {
  if (!value) throw new Error('통계 데이터를 불러올 수 없습니다.')
  return value
}
