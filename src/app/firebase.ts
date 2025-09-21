// src/app/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMHWjC-Ugu2vTj39ciIaeClafCrTlNzkg",
  authDomain: "primal-f6693.firebaseapp.com",
  projectId: "primal-f6693",
  storageBucket: "primal-f6693.firebasestorage.app",
  messagingSenderId: "747058632175",
  appId: "1:747058632175:web:c48a755f22e5ce3946921a",
  measurementId: "G-4T1K6D3QMD",
};

// ป้องกัน init ซ้ำ
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ใช้เฉพาะฝั่ง client (เพราะหน้า signin/signup เป็น "use client")
const auth = getAuth(app);

export { app, auth };
