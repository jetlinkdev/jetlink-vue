import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC_Dh16aHJ73AjCbpKMvzSRL5vpSGrdZBg",
  authDomain: "jetlink-47eb8.firebaseapp.com",
  projectId: "jetlink-47eb8",
  storageBucket: "jetlink-47eb8.firebasestorage.app",
  messagingSenderId: "706026144910",
  appId: "1:706026144910:web:9363c4e13dd7d5947475df",
  measurementId: "G-1D4C3Q1HE3"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication
export const auth = getAuth(app);
