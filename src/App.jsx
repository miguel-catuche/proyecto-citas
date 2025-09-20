// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
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
    try {
      if (!cliente.id || cliente.id.trim() === "") {
        throw new Error("ID de cliente inválido");
      }

      const ref = doc(db, "clientes", cliente.id);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        toast.error("Ya existe un cliente con ese número de documento");
        return;
      }
      await setDoc(ref, {
        nombre: cliente.nombre,
        id: cliente.id,
        motivo: cliente.motivo ?? "",
        telefono: cliente.telefono,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success("Cliente agregado correctamente");
    } catch (error) {
      toast.error("Ocurrió un error al agregar el cliente");
    }
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
      nombre: cita.nombre,
      fecha: cita.fecha,
      hora: cita.hora,
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

    <Router basename="/">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "1.2rem",   // 🔥 texto más grande
            padding: "16px 20px", // más espacio interno
            borderRadius: "10px",
          },
          success: {
            style: { background: "#d1fae5", color: "#065f46" }, // verde éxito
          },
          error: {
            style: { background: "#fee2e2", color: "#991b1b" }, // rojo error
          },
        }}
        containerStyle={{ zIndex: 9999 }} // asegura que quede encima de modales
      />
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
