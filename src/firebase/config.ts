import type { FirebaseOptions } from 'firebase/app'

const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyAlDyEtE2F2iKmQoTTUk4p3fUfaoMdYPZ8",
    authDomain: "pinit-466ce.firebaseapp.com",
    projectId: "pinit-466ce",
    storageBucket: "pinit-466ce.firebasestorage.app",
    messagingSenderId: "729299570668",
    appId: "1:729299570668:web:0faa690e107378556abac9",
    measurementId: "G-RSHCEW8KL7"
};


const requiredConfigKeys: Array<keyof FirebaseOptions> = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
]

let hasWarnedMissingConfig = false

export const getFirebaseConfig = (): FirebaseOptions | null => {
  const missingKeys = requiredConfigKeys.filter((key) => !firebaseConfig[key])

  if (missingKeys.length > 0) {
    if (!hasWarnedMissingConfig) {
      console.warn('[FCM] Missing Firebase config values:', missingKeys.join(', '))
      hasWarnedMissingConfig = true
    }
    return null
  }

  return firebaseConfig
}
