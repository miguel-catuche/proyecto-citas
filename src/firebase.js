// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 👈 Importa Auth

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUK53kiF3T-sih9KHgLE1vacWVZnsEhl0",
  authDomain: "agenda-terapias-3f6b6.firebaseapp.com",
  projectId: "agenda-terapias-3f6b6",
  storageBucket: "agenda-terapias-3f6b6.firebasestorage.app",
  messagingSenderId: "352538854602",
  appId: "1:352538854602:web:19e8b7405bdbf7ab97a033",
  measurementId: "G-RJRKY7YELN",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exporta Firestore y Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

