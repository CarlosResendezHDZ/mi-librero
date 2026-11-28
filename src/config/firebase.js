
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKc6jf-pDHJuDvJD1tNIyV071tWgAbH-s",
  authDomain: "mi-librero-85180.firebaseapp.com",
  projectId: "mi-librero-85180",
  storageBucket: "mi-librero-85180.firebasestorage.app",
  messagingSenderId: "45010729843",
  appId: "1:45010729843:web:dd3a24949b49e86d28a306"
};

// Aplicación Firebase
export const app = initializeApp(firebaseConfig);

// Autenticación de usuarios
export const auth = getAuth(app);

// Firestore con persistencia offline
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
