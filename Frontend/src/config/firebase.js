import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyBF98ILyxYcBoCnEcnO8uLcuffq-BwuSu8",
  authDomain: "udhaar-1f2cb.firebaseapp.com",
  projectId: "udhaar-1f2cb",
  storageBucket: "udhaar-1f2cb.firebasestorage.app",
  messagingSenderId: "854491583731",
  appId: "1:854491583731:web:d6f78db468396fe5665386",
  measurementId: "G-TY6QW8S5YL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;