import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import 'dayjs/locale/en'

dayjs.extend(relativeTime)

export const formatTimeAgo = (date: string | number | Date, locale: 'ko' | 'en' = 'ko') => {
  if (!date) return ''
  return dayjs(date).locale(locale).fromNow()
}

export const elapsedTime = (date: string | number | Date, locale: 'ko' | 'en' = 'ko') => {
  if (!date) return ''
  const now = dayjs()
  const target = dayjs(date)
  const diffInMinutes = now.diff(target, 'minute')

  if (locale === 'ko') {
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    const diffInHours = now.diff(target, 'hour')
    if (diffInHours < 24) return `${diffInHours}시간 전`
    const diffInDays = now.diff(target, 'day')
    return `${diffInDays}일 전`
  } else {
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = now.diff(target, 'hour')
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = now.diff(target, 'day')
    return `${diffInDays}d ago`
  }
}
