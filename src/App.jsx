// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import Login from "./pages/Login";
import AuthenticatedApp from "./AuthenticatedApp";

const App = () => {
  const [user, setUser] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "clientes"), (snapshot) => {
      const clientesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClientes(clientesData);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "citas"), (snapshot) => {
      const citasData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCitas(citasData);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddClient = async (cliente) => {
    await addDoc(collection(db, "clientes"), {
      nombre: cliente.nombre,
      documento: cliente.documento,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const handleUpdateClient = async (id, updatedData) => {
    const ref = doc(db, "clientes", id);
    await updateDoc(ref, { ...updatedData, updatedAt: serverTimestamp() });
  };

  const handleDeleteClient = async (id) => {
    await deleteDoc(doc(db, "clientes", id));
  };

  const handleAddCita = async (cita) => {
    await addDoc(collection(db, "citas"), {
      clienteId: cita.clienteId,
      fecha: cita.fecha,
      hora: cita.hora,
      servicio: cita.servicio,
      estado: "programada",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const handleUpdateCita = async (id, updatedData) => {
    const ref = doc(db, "citas", id);
    await updateDoc(ref, { ...updatedData, updatedAt: serverTimestamp() });
  };

  const handleDeleteCita = async (id) => {
    await deleteDoc(doc(db, "citas", id));
  };

  const handleLogin = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <Router>
      {user ? (
        <AuthenticatedApp
          clientes={clientes}
          citas={citas}
          onAddClient={handleAddClient}
          onUpdateClient={handleUpdateClient}
          onDeleteClient={handleDeleteClient}
          onAddCita={handleAddCita}
          onUpdateCita={handleUpdateCita}
          onDeleteCita={handleDeleteCita}
          onLogout={handleLogout}
        />
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
