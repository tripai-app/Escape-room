import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCFqvRejgdR4t6ptjNIK40QJ_N7bH62psE",
  authDomain: "escape-room-3cb9f.firebaseapp.com",
  databaseURL: "https://escape-room-3cb9f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "escape-room-3cb9f",
  storageBucket: "escape-room-3cb9f.firebasestorage.app",
  messagingSenderId: "1064919907942",
  appId: "1:1064919907942:web:b44a869da440fc0baa77a7",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);
