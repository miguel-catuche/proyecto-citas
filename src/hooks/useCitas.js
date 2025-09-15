// src/hooks/useCitas.js
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

export const useCitas = () => {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "citas"), (snapshot) => {
      const citasData = snapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id,
      }));
      setCitas(citasData);
    });

    return () => unsubscribe();
  }, []);

  return citas;
};
