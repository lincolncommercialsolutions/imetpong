// Firebase Configuration
// Copy .env.example to .env and fill in your Firebase credentials

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Instructions for setup:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing one
// 3. Enable Authentication > Sign-in method > Email/Password
// 4. Enable Realtime Database or Firestore
// 5. Set database rules (see firebase-rules.json)
// 6. Get your config from Project Settings > General > Your apps
// 7. Copy .env.example to .env and fill in the values
