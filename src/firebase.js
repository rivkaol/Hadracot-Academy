import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDwiBnuProvzg5wawVzNpKEW0AmIw5-VY8',
  authDomain: 'hadrcot-management.firebaseapp.com',
  projectId: 'hadrcot-management',
  storageBucket: 'hadrcot-management.firebasestorage.app',
  messagingSenderId: '1070403566876',
  appId: '1:1070403566876:web:2e3c001468931153390ed9',
  measurementId: 'G-FSTTVJS6ZV',
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)
export const db = getFirestore(app)
