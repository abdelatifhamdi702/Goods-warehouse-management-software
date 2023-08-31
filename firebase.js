import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDPFtzjx7wJbAj1J6M42ZMbgz_l8dtZLCY',
  authDomain: 'soummam-laghouat.firebaseapp.com',
  projectId: 'soummam-laghouat',
  storageBucket: 'soummam-laghouat.appspot.com',
  messagingSenderId: '544865440695',
  appId: '1:544865440695:web:7f5232e83800566dd00e32',
  measurementId: 'G-K00PRM2PT5',
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const db = getFirestore()

export { auth, db }
