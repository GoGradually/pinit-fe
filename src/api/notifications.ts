import { httpClient } from './httpClient'

const NOTIFICATION_BASE_URL =
  import.meta.env.VITE_NOTIFICATION_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://notification.pinit.go-gradually.me' : 'http://localhost:8082')

export const getNotificationBaseUrl = () => NOTIFICATION_BASE_URL

export type VapidPublicKeyResponse = {
  publicKey: string
}

export type PushTokenRequest = {
  token: string
}

export const fetchVapidPublicKey = async (): Promise<VapidPublicKeyResponse> => {
  const publicKey = await httpClient<string>(`${NOTIFICATION_BASE_URL}/push/vapid`)
  return { publicKey }
}

export const subscribePushToken = (token: string) =>
  httpClient<void>(`${NOTIFICATION_BASE_URL}/push/subscribe`, {
    method: 'POST',
    json: { token } satisfies PushTokenRequest,
  })

export const unsubscribePushToken = (token: string) =>
  httpClient<void>(`${NOTIFICATION_BASE_URL}/push/unsubscribe`, {
    method: 'POST',
    json: { token } satisfies PushTokenRequest,
  })

export const registerPushSubscription = (token: string) => subscribePushToken(token)
