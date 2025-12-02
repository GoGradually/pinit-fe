import dayjs from 'dayjs'
import durationPlugin from 'dayjs/plugin/duration'

dayjs.extend(durationPlugin)

const parseHmsDuration = (value: string): number => {
  const match = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/)
  if (!match) return 0

  const [, hours = '0', minutes = '0', seconds = '0'] = match
  const totalMinutes = Number(hours) * 60 + Number(minutes) + Number(seconds) / 60
  return Math.floor(totalMinutes)
}

export const parseDurationToMinutes = (durationString?: string): number => {
  if (!durationString || typeof durationString !== 'string') {
    return 0
  }

  const trimmed = durationString.trim()

  if (trimmed.startsWith('P')) {
    const isoDuration = dayjs.duration(trimmed)
    const totalMinutes = isoDuration.asMinutes()
    if (Number.isFinite(totalMinutes)) {
      return Math.max(0, Math.floor(totalMinutes))
    }
  }

  return parseHmsDuration(trimmed)
}

export const formatDurationToTime = (durationString?: string): string => {
  const totalMinutes = parseDurationToMinutes(durationString)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0 && minutes === 0) {
    return '0시간 0분'
  }

  if (hours === 0) {
    return `${minutes}분`
  }

  if (minutes === 0) {
    return `${hours}시간`
  }

  return `${hours}시간 ${minutes}분`
}
