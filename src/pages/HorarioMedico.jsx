// src/components/HorarioMedico.jsx
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CitasModal from "../components/CitasModal";
import toast from 'react-hot-toast';
import Icon from "@/components/Icons";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "@/firebase";

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
const allowedHours = ["07", "08", "09", "10", "14", "15", "16", "17"];
const allowedMinutes = ["00", "15", "30", "45"];


// Helper function para obtener la fecha de un día de la semana
const getDateForDay = (date, day) => {
  const daysNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const idx = daysNames.indexOf(day);
  const { monday } = getWeekRange(date);

  const target = new Date(monday);
  target.setDate(monday.getDate() + idx);

  return formatLocalDate(target);
};

const formatLocalDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getWeekRange = (date) => {
  const base = new Date(date);
  const dow = base.getDay();              // 0=domingo
  const offsetToMonday = dow === 0 ? -6 : 1 - dow;

  const monday = new Date(base);
  monday.setDate(base.getDate() + offsetToMonday);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  return {
    monday,
    friday,
    startDateStr: formatLocalDate(monday),
    endDateStr: formatLocalDate(friday),
  };
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

const getInitialMonday = () => {
  const today = new Date();
  const dow = today.getDay();
  const offset = dow === 0 ? -6 : 1 - dow;
  today.setDate(today.getDate() + offset);
  return today;
};

export default function HorarioMedico() {
  const [mode, setMode] = useState("view");
  const [clientes, setClientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getInitialMonday());
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({ hora: "" });
  const headerScrollRef = useRef(null);
  const gridScrollRef = useRef(null);

  useEffect(() => {
    const header = headerScrollRef.current;
    const grid = gridScrollRef.current;
    if (!header || !grid) return;

    let syncing = false;

    const syncScroll = (source, target) => {
      if (syncing) return;
      syncing = true;
      target.scrollLeft = source.scrollLeft;
      requestAnimationFrame(() => {
        syncing = false;
      });
    };

    const onGridScroll = () => syncScroll(grid, header);
    const onHeaderScroll = () => syncScroll(header, grid);

    grid.addEventListener("scroll", onGridScroll, { passive: true });
    header.addEventListener("scroll", onHeaderScroll, { passive: true });

    return () => {
      grid.removeEventListener("scroll", onGridScroll);
      header.removeEventListener("scroll", onHeaderScroll);
    };
  }, []);

  useEffect(() => {
    // 🔄 Escuchar clientes en tiempo real
    const unsubscribeClientes = onSnapshot(collection(db, "clientes"), (snapshot) => {
      const clientesData = snapshot.docs.map(doc => doc.data());
      setClientes(clientesData);
    });

    return () => unsubscribeClientes();
  }, []);

  useEffect(() => {
  }, [citas]);

  useEffect(() => {
    const { startDateStr, endDateStr } = getWeekRange(selectedDate);

    const citasQuery = query(
      collection(db, "citas"),
      where("fecha", ">=", startDateStr),
      where("fecha", "<=", endDateStr)
    );

    const unsubscribe = onSnapshot(citasQuery, (snapshot) => {
      const citasData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id,
      }));
      setCitas(citasData);
    });

    return () => unsubscribe();
  }, [selectedDate]);

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
    setFormData({ hora: hour.slice(0, 5) });
    setSelectedClient(null);
    setSearchTerm('');
    setSearchResults([]);
    setSelectedCell({ day, hour });
    setSelectedDay(null);
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { hora } = formData;

      if (!hora) return;
      if (!selectedClient?.id) {
        toast.error("Debes seleccionar un cliente antes de guardar la cita");
        return;
      }

      const nuevaCita = {
        clienteId: selectedClient.id,
        nombre: selectedClient.nombre,
        fecha: getDateForDay(selectedDate, selectedCell.day),
        hora: `${hora}:00`,
        estado: "programada",
        creadoEn: serverTimestamp(),
        actualizadoEn: serverTimestamp(),
      };

      try {
        await addDoc(collection(db, "citas"), nuevaCita);
        toast.success(`Cita para ${selectedClient.nombre} añadida a las ${hora}`);
        setShowForm(false);
        setSelectedClient(null);
        setFormData({ hora: "" });
      } catch (error) {
        console.error("Error al guardar la cita:", error);
        toast.error("Hubo un problema al guardar la cita");
      }
    },
    [formData, selectedCell, selectedDate, selectedClient]
  );

  const handleUpdate = useCallback(async (e) => {
    e.preventDefault();
    if (!selectedAppointment?.docId) return;

    const { nombre, fecha, hora, estado, clienteId } = selectedAppointment;

    try {
      await updateDoc(doc(db, "citas", selectedAppointment.docId), {
        nombre,
        fecha,
        hora,
        estado,
        clienteId,
        actualizadoEn: serverTimestamp(),
      });

      setShowEditModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
      toast.error("Hubo un problema al actualizar la cita");
    }
  }, [selectedAppointment]);


  const handleDelete = useCallback(async () => {
    if (!selectedAppointment?.docId) return;

    try {
      await deleteDoc(doc(db, "citas", selectedAppointment.docId));
      setShowEditModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error al eliminar la cita:", error);
    }
  }, [selectedAppointment]);

  const semanaActual = useMemo(() => {
    const { monday, friday } = getWeekRange(selectedDate);
    return `${monday.toLocaleDateString()} al ${friday.toLocaleDateString()}`;
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
  }, [clientes]);

  const debouncedSearch = useDebounce(searchClients, 300);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setSearchTerm('');
    setSearchResults([]);
  };

  const validTimes = useMemo(() => {
    const allowedHours = ["07", "08", "09", "10", "14", "15", "16", "17"];
    const minutes = ["00", "15", "30", "45"];
    const result = [];

    allowedHours.forEach((hour) => {
      minutes.forEach((min) => {
        result.push(`${hour}:${min}`);
      });
    });

    return result; // Ej: ["07:00", "07:15", ..., "17:45"]
  }, []);


  return (

    <div className="p-2 w-full">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-full mb-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-black">
            Semana de {semanaActual}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gestión de agenda
          </p>
        </div>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-4 md:items-center">
          <div className="md:flex md:justify-start">
            <Button
              className="w-full md:w-auto cursor-pointer text-blue-600 bg-blue-50 hover:bg-blue-200 font-medium"
              onClick={() => cambiarSemana(-1)}
            >
              ← Semana anterior
            </Button>
          </div>
          <div className="md:flex md:justify-center">
            <Button
              className="w-full md:w-40 cursor-pointer bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              onClick={() => setMode(mode === "view" ? "edit" : "view")}
            >
              {mode === "view" ? (
                <>
                  <Icon name="plus" />
                  Añadir Agenda
                </>
              ) : (
                <>
                  <Icon name="calendar" />
                  Ver Agenda
                </>
              )}
            </Button>
          </div>
          <div className="md:flex md:justify-end">
            <Button
              className="w-full md:w-auto cursor-pointer text-blue-600 bg-blue-50 hover:bg-blue-200 font-medium"
              onClick={() => cambiarSemana(1)}
            >
              Semana siguiente →
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-xl shadow-lg border border-gray-300 bg-white md:overflow-hidden overflow-visible">
        <div ref={headerScrollRef} className="overflow-x-auto no-scrollbar">
          <div className="grid grid-cols-[100px_repeat(5,minmax(0,1fr))] min-w-[700px] md:grid-cols-[160px_repeat(5,minmax(0,1fr))] bg-gray-100 border-b border-gray-300">
            <div className="sticky left-0 z-10 bg-gray-100 w-[100px] md:w-[160px] flex items-center justify-center 
            py-2 text-gray-600 text-sm font-medium">
              <Icon className="text-gray-500 mr-1" name={"clock"} />
              Horario
            </div>

            {days.map((day) => {
              const fechaStr = getDateForDay(selectedDate, day);
              const [y, m, d] = fechaStr.split("-").map(Number);
              const fecha = new Date(y, m - 1, d);
              const numeroDia = fecha.getDate();
              return (
                <div
                  key={day}
                  className="font-bold text-black bg-blue-100 hover:bg-blue-200 py-1 text-center cursor-pointer flex flex-col items-center"
                  onClick={() => {
                    setSelectedDay(day);
                    setSelectedCell(null);
                    setShowModal(true);
                  }}
                >
                  <span>{day}</span>
                  <span className="text-sm text-gray-600 font-normal">{numeroDia}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div
          ref={gridScrollRef}
          className="max-h-[400px] overflow-y-auto overflow-x-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="min-w-[700px] grid grid-cols-[100px_repeat(5,minmax(0,1fr))] md:grid-cols-[160px_repeat(5,minmax(0,1fr))]">
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                {/* Columna de hora sticky */}
                <div className="border-b border-white font-bold text-white flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 text-white border-r border-gray-200 sticky left-0 z-10">
                  {hour.slice(0, 5)}
                </div>

                {/* Celdas por día */}
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
                          <p className="text-gray-800 font-medium flex flex-col items-center">
                            <Icon name={"plus"} size={20} />Añadir Nuevo
                          </p>
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
        </div>

        {/* Botón de guardar */}
        {mode === "edit" && (
          <div className="fixed bottom-6 right-6">
            <Button onClick={() => setMode("view")} className="bg-green-600 text-white shadow-lg cursor-pointer">
              Guardar cambios
            </Button>
          </div>
        )}
      </div>

      {/* Modal para AGREGAR citas */}
      {showForm && selectedCell && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-lg p-6 w-84 md:w-96" onClick={(e) => e.stopPropagation()}>
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
                  <div className="grid grid-cols-2 gap-4">
                    {/* Select de hora */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                      <select
                        value={formData.hora.split(":")[0] || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            hora: `${e.target.value}:${prev.hora.split(":")[1] || "00"}`,
                          }))
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                      >
                        <option value="">--</option>
                        {allowedHours.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minutos</label>
                      <select
                        value={formData.hora.split(":")[1] || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            hora: `${prev.hora.split(":")[0] || "07"}:${e.target.value}`,
                          }))
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                      >
                        <option value="">--</option>
                        {allowedMinutes.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>


                  <div className="flex justify-end space-x-2">
                    <Button className={"cursor-pointer"} type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                    <Button className={"cursor-pointer bg-green-600 hover:bg-green-700"} type="submit">Guardar</Button>
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
        setSelectedCell={setSelectedCell}
        setSelectedDay={setSelectedDay}
        clientes={clientes}
      />
    </div>
  );
}