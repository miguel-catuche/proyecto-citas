// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 👈 Importa Auth

// Configuración de Firebase produccion
//  const firebaseConfig = {
//    apiKey: "AIzaSyDUK53kiF3T-sih9KHgLE1vacWVZnsEhl0",
//    authDomain: "agenda-terapias-3f6b6.firebaseapp.com",
//    projectId: "agenda-terapias-3f6b6",
//    storageBucket: "agenda-terapias-3f6b6.firebasestorage.app",
//    messagingSenderId: "352538854602",
//    appId: "1:352538854602:web:19e8b7405bdbf7ab97a033",
//    measurementId: "G-RJRKY7YELN",
//  };

 const firebaseConfig = {
   apiKey: "AIzaSyBkwUr1vQBij6liAACkceYbqzjL1Ne6Ty0",
   authDomain: "db-agenda-dev.firebaseapp.com",
   projectId: "db-agenda-dev",
   storageBucket: "db-agenda-dev.firebasestorage.app",
   messagingSenderId: "122235695968",
   appId: "1:122235695968:web:cae54ae8a959a8bca9e405",
   measurementId: "G-3QVPGQEQEQ"
 };


// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exporta Firestore y Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

