
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

import { auth } from '../config/firebase.js';

const googleProvider = new GoogleAuthProvider();

export async function entrarConGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function entrarComoInvitado() {
  return signInAnonymously(auth);
}

export async function registrarConFirebase(nombre, correo, password) {
  const resultado = await createUserWithEmailAndPassword(
    auth,
    correo.trim(),
    password
  );

  await updateProfile(resultado.user, {
    displayName: nombre.trim()
  });

  return resultado.user;
}

export async function entrarConCorreo(correo, password) {
  return signInWithEmailAndPassword(
    auth,
    correo.trim(),
    password
  );
}

export function observarSesion(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function cerrarSesionFirebase() {
  return signOut(auth);
}
