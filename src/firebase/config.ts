// The content of this file is dynamically generated and should not be modified directly.
// To change the Firebase configuration, please use the Firebase CLI or the Firebase console.
// For more information, see https://firebase.google.com/docs/web/setup#config-object

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_API_KEY');
}

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
