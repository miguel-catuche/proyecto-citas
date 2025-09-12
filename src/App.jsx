import React, { useState } from "react";
import HorarioMedico from "./components/HorarioMedico";
import Header from "./components/Header";
import ClientesPage from "./components/ClientesPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState('horario');
  const [clientes, setClientes] = useState([
    { id: "1020304050", nombre: "Ana López" },
    { id: "1030405060", nombre: "Carlos Ruiz" },
    { id: "1040506070", nombre: "María Torres" },
    { id: "1050607080", nombre: "Luis Gómez" },
    { id: "1060708090", nombre: "Sofía Pérez" },
    { id: "1070809000", nombre: "Diego Vargas" },
    { id: "1080900010", nombre: "Elena Díaz" },
    { id: "1090001020", nombre: "Javier Castro" },
    { id: "1100102030", nombre: "Gabriela Rios" },
    { id: "9876543210", nombre: "Laura Mendoza" },
    { id: "5432109876", nombre: "Roberto Fernández" },
  ]);

  // Simulación de datos de citas con los estados correctos
  const [citas] = useState([
    { clienteId: "1020304050", fecha: "2024-08-15", hora: "10:00", estado: "completada" },
    { clienteId: "1020304050", fecha: "2024-09-10", hora: "15:30", estado: "programada" },
    { clienteId: "1020304050", fecha: "2024-07-22", hora: "11:00", estado: "cancelada" },
    { clienteId: "1020304050", fecha: "2024-06-05", hora: "08:30", estado: "no vino" },
    { clienteId: "1020304050", fecha: "2024-05-18", hora: "14:45", estado: "completada" },
    { clienteId: "1030405060", fecha: "2024-09-01", hora: "09:00", estado: "cancelada" },
    { clienteId: "1080900010", fecha: "2024-08-20", hora: "11:00", estado: "completada" },
    { clienteId: "1080900010", fecha: "2024-09-05", hora: "14:00", estado: "no vino" },
    { clienteId: "9876543210", fecha: "2024-09-12", hora: "16:00", estado: "programada" },
  ]);

  const handleAddClient = (newClient) => {
    setClientes([...clientes, newClient]);
  };

  const handleUpdateClient = (updatedClient) => {
    setClientes(clientes.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDeleteClient = (id) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex justify-center items-center p-6">
        <div className="w-full max-w-6xl">
          {currentPage === 'horario' && <HorarioMedico clientes={clientes} />}
          {currentPage === 'clientes' && (
            <ClientesPage
              clientes={clientes}
              citas={citas}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
            />
          )}
        </div>
      </div>
    </div>
  );
}