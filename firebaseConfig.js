// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // 👈 para Realtime Database

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUK53kiF3T-sih9KHgLE1vacWVZnsEhl0",
  authDomain: "agenda-terapias-3f6b6.firebaseapp.com",
  databaseURL: "https://agenda-terapias-3f6b6-default-rtdb.firebaseio.com",
  projectId: "agenda-terapias-3f6b6",
  storageBucket: "agenda-terapias-3f6b6.firebasestorage.app",
  messagingSenderId: "352538854602",
  appId: "1:352538854602:web:19e8b7405bdbf7ab97a033",
  measurementId: "G-RJRKY7YELN"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exporta la base de datos para usar en tu app
export const db = getDatabase(app);
