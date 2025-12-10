import { httpClient } from './httpClient'

const NOTIFICATION_BASE_URL =
  import.meta.env.VITE_NOTIFICATION_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://notification.pinit.go-gradually.me' : 'http://localhost:8093')

export const getNotificationBaseUrl = () => NOTIFICATION_BASE_URL

export type VapidPublicKeyResponse = {
  publicKey: string
}

export const fetchVapidPublicKey = () => httpClient<VapidPublicKeyResponse>(`${NOTIFICATION_BASE_URL}/push/vapid`)

export const registerPushSubscription = (subscription: PushSubscriptionJSON) =>
  httpClient<void>(`${NOTIFICATION_BASE_URL}/push/subscriptions`, {
    method: 'POST',
    json: subscription,
  })
