// This file is the main entry point for all Firebase-related functionality.
// It initializes Firebase and exports all the necessary hooks and providers.
// This is to ensure that Firebase is initialized only once and that the same instance is used throughout the app.

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  const firebaseApp =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return {
    firebaseApp,
    auth,
    firestore,
  };
}
