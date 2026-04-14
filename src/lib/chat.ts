import { Message, User } from '@/types'

export const ALERT_PROFILE = {
  image: 'https://coinsect.io/favicon/logo.png',
  nickname: '알림',
}

export const isMessageMine = (
  message: Message,
  meId: number | undefined,
  chatUser: User | null
) => {
  if (!message.user) return false
  if (meId && message.user.id) return meId === message.user.id

  return message.user.token === chatUser?.token
}

export const processChatMessage = (
  m: Message,
  meId: number | undefined,
  chatUser: User | null
): Message => {
  const processed = { ...m }

  if (processed.type === 'alert') {
    processed.user = {
      ...processed.user,
      profile: { ...ALERT_PROFILE },
    }
    processed.id = Math.round(Math.random() * 1000000)
  }

  return {
    ...processed,
    isMine: isMessageMine(processed, meId, chatUser),
  }
}
