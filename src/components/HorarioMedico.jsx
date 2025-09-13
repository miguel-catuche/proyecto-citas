// src/components/HorarioMedico.jsx
import React, { useState, useMemo, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CitasModal from "./CitasModal";

const hours = [
  "07:00:00",
  "08:00:00",
  "09:00:00",
  "10:00:00",
  "14:00:00",
  "15:00:00",
  "16:00:00",
  "17:00:00",
];

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Base de datos de clientes (simulada)
const clientes = [
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
];

// Helper function para obtener la fecha de un día de la semana
const getDateForDay = (date, day) => {
  const current = new Date(date);
  const monday = new Date(current.setDate(current.getDate() - current.getDay() + 1));
  const dayIndex = days.indexOf(day);
  const targetDate = new Date(monday);
  targetDate.setDate(monday.getDate() + dayIndex);
  return targetDate.toISOString().split("T")[0];
};

// Hook de React para debouncing
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

export default function HorarioMedico() {
  const [mode, setMode] = useState("view");
  const [citas, setCitas] = useState([
    { id: "1020304050", paciente: "Ana López", fecha: "2025-09-11", hora: "07:00:00", estado: "programada" },
    { id: "1030405060", paciente: "Carlos Ruiz", fecha: "2025-09-10", hora: "10:00:00", estado: "programada" },
    { id: "1040506070", paciente: "María Torres", fecha: "2025-09-09", hora: "14:00:00", estado: "cancelada" },
    { id: "1050607080", paciente: "Luis Gómez", fecha: "2025-09-09", hora: "14:00:00", estado: "programada" },
    { id: "1060708090", paciente: "Sofía Pérez", fecha: "2025-09-11", hora: "09:15:00", estado: "programada" },
    { id: "1070809000", paciente: "Diego Vargas", fecha: "2025-09-08", hora: "08:30:00", estado: "programada" },
    { id: "1080900010", paciente: "Elena Díaz", fecha: "2025-09-10", hora: "15:45:00", estado: "programada" },
    { id: "1090001020", paciente: "Javier Castro", fecha: "2025-09-12", hora: "16:20:00", estado: "programada" },
    { id: "1100102030", paciente: "Gabriela Rios", fecha: "2025-09-12", hora: "17:00:00", estado: "programada" },
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [formData, setFormData] = useState({ documento: "", paciente: "", hora: "" });

  const citasByDate = useMemo(() => {
    return citas.reduce((acc, cita) => {
      const dateKey = `${cita.fecha}-${cita.hora.slice(0, 2)}`;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(cita);
      return acc;
    }, {});
  }, [citas]);

  const citasByDay = useMemo(() => {
    return citas.reduce((acc, cita) => {
      if (!acc[cita.fecha]) {
        acc[cita.fecha] = [];
      }
      acc[cita.fecha].push(cita);
      return acc;
    }, {});
  }, [citas]);

  const handleAddCita = useCallback((day, hour) => {
    setFormData({ documento: "", paciente: "", hora: hour.slice(0, 5) });
    setSelectedClient(null);
    setSearchTerm('');
    setSearchResults([]);
    setSelectedCell({ day, hour });
    setSelectedDay(null);
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { documento, paciente, hora } = formData;
      if (!documento || !paciente || !hora) return;

      const nuevaCita = {
        id: documento,
        paciente,
        fecha: getDateForDay(selectedDate, selectedCell.day),
        hora: `${hora}:00`,
        estado: "programada",
      };

      setCitas((prevCitas) => [...prevCitas, nuevaCita]);
      setShowForm(false);
    },
    [formData, selectedCell, selectedDate]
  );

  const handleUpdate = useCallback((e) => {
    e.preventDefault();
    const { paciente, id, fecha, hora, estado } = selectedAppointment;

    setCitas(prevCitas => prevCitas.map(cita =>
      cita.id === id && cita.fecha === selectedAppointment.fecha ? { ...cita, paciente, id, fecha, hora, estado } : cita
    ));

    setShowEditModal(false);
    setSelectedAppointment(null);
  }, [selectedAppointment]);

  const handleDelete = useCallback(() => {
    if (!selectedAppointment) return;
    setCitas(prevCitas => prevCitas.filter(cita => cita.id !== selectedAppointment.id || cita.fecha !== selectedAppointment.fecha || cita.hora !== selectedAppointment.hora));
    setShowEditModal(false);
    setSelectedAppointment(null);
  }, [selectedAppointment]);

  const semanaActual = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 4);
    return `${start.toLocaleDateString()} al ${end.toLocaleDateString()}`;
  }, [selectedDate]);

  const cambiarSemana = useCallback((offset) => {
    setSelectedDate((prevDate) => {
      const nuevaFecha = new Date(prevDate);
      nuevaFecha.setDate(nuevaFecha.getDate() + offset * 7);
      return nuevaFecha;
    });
  }, []);

  // Lógica de búsqueda optimizada con debouncing
  const searchClients = useCallback((term) => {
    if (term.length > 0) {
      const results = clientes.filter(client =>
        client.nombre.toLowerCase().includes(term.toLowerCase()) ||
        client.id.includes(term)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, []);

  const debouncedSearch = useDebounce(searchClients, 300);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setFormData({
      ...formData,
      documento: client.id,
      paciente: client.nombre,
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="p-6">
      {/* Header y botones de navegación */}
      <div className="flex items-center justify-between mb-4">
        <Button
          className="cursor-pointer bg-gradient-to-r from-purple-700 via-purple-700 to-blue-700 hover:from-purple-500 hover:via-purple-500 hover:to-blue-500 transition"
          onClick={() => cambiarSemana(-1)}
        >
          ← Semana anterior
        </Button>

        <div className="flex flex-col items-center justify-center mb-4 gap-y-4 bg-white rounded shadow-md w-100 h-30">
          <h2 className={`text-xl font-bold text-center ${mode === "view" ? "text-blue-600" : "text-orange-600"}`}>
            Semana de {semanaActual}
          </h2>
          <Button className="cursor-pointer" onClick={() => setMode(mode === "view" ? "edit" : "view")}>
            {mode === "view" ? "Añadir Agenda" : "Ver Agenda"}
          </Button>
        </div>

        <Button
          className="cursor-pointer bg-gradient-to-r from-purple-700 via-purple-700 to-blue-700 hover:from-purple-500 hover:via-purple-500 hover:to-blue-500 transition"
          onClick={() => cambiarSemana(1)}
        >
          Semana siguiente →
        </Button>
      </div>

      <div className="grid grid-cols-6 gap-2">
        <div></div>

        {days.map((day) => (
          <div
            key={day}
            className="font-bold text-white shadow-md py-2 rounded text-center cursor-pointer bg-gradient-to-r from-blue-800 via-blue-600/85 to-blue-500 hover:from-blue-900 hover:to-blue-900 transition"
            onClick={() => {
              setSelectedDay(day);
              setSelectedCell(null);
              setShowModal(true);
            }}
          >
            {day}
          </div>
        ))}

        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="font-bold text-white shadow-md py-2 flex items-center justify-center rounded bg-gradient-to-r from-blue-800 via-blue-600/85 to-blue-500">
              {hour.slice(0, 5)}
            </div>

            {days.map((day) => {
              const fecha = getDateForDay(selectedDate, day);
              const citasEnCelda = citasByDate[`${fecha}-${hour.slice(0, 2)}`] || [];
              const tieneCitas = citasEnCelda.length > 0;

              return (
                <Card
                  key={day + hour}
                  className={`cursor-pointer h-20 flex items-center justify-center text-sm transition-colors rounded-lg ${mode === "edit"
                      ? "bg-yellow-300 hover:bg-yellow-500"
                      : tieneCitas
                        ? "bg-green-400 hover:bg-green-500"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                  onClick={() => {
                    setSelectedCell({ day, hour });
                    setSelectedDay(null);
                    if (mode === "edit") {
                      handleAddCita(day, hour);
                    } else {
                      setShowModal(true);
                    }
                  }}
                >
                  <CardContent className="text-center">
                    {mode === "edit" ? (
                      <p className="text-gray-800 font-medium">Añadir Nuevo</p>
                    ) : tieneCitas ? (
                      <p className="font-semibold text-gray-800">{citasEnCelda.length} cita(s)</p>
                    ) : (
                      <p className="text-gray-500">Sin citas</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {mode === "edit" && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => setMode("view")} className="bg-green-600 text-white shadow-lg cursor-pointer">
            Guardar cambios
          </Button>
        </div>
      )}

      {/* Modal para AGREGAR citas */}
      {showForm && selectedCell && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold mb-4 text-gray-800">
              Nueva cita para el {selectedCell.day} ({getDateForDay(selectedDate, selectedCell.day)})
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {selectedClient ? (
                // Formulario para cliente seleccionado
                <>
                  <div>
                    <label className="block text-sm text-gray-700">Nombre del paciente</label>
                    <Input
                      type="text"
                      value={selectedClient.nombre}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">Número de documento</label>
                    <Input
                      type="text"
                      value={selectedClient.id}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </>
              ) : (
                // Buscador de clientes
                <div>
                  <label className="block text-sm text-gray-700">Buscar paciente</label>
                  <Input
                    type="text"
                    placeholder="Buscar por nombre o documento..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  {searchResults.length > 0 && (
                    <ul className="mt-2 border rounded-md max-h-48 overflow-y-auto">
                      {searchResults.map(client => (
                        <li
                          key={client.id}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSelectClient(client)}
                        >
                          {client.nombre} (Doc: {client.id})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {selectedClient && (
                <>
                  <div>
                    <label className="block text-sm text-gray-700">Hora de la cita</label>
                    <Input
                      type="time"
                      value={formData.hora}
                      onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button className={"cursor-pointer"} type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                    <Button className={"cursor-pointer"} type="submit">Guardar</Button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Componente externo con los modales de gestión de citas */}
      <CitasModal
        selectedDay={selectedDay}
        selectedCell={selectedCell}
        selectedDate={selectedDate}
        showModal={showModal}
        setShowModal={setShowModal}
        citasByDate={citasByDate}
        citasByDay={citasByDay}
        setShowEditModal={setShowEditModal}
        setSelectedAppointment={setSelectedAppointment}
        showEditModal={showEditModal}
        selectedAppointment={selectedAppointment}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      />
    </div>
  );
}