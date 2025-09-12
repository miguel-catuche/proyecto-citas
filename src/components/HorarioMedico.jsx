import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default function HorarioMedico() {
  const [mode, setMode] = useState("view");
  const [citas, setCitas] = useState([
    { id: 1, paciente: "Ana López", fecha: "2025-09-11", hora: "07:00:00", estado: "programada" },
    { id: 2, paciente: "Carlos Ruiz", fecha: "2025-09-10", hora: "10:00:00", estado: "programada" },
    { id: 3, paciente: "María Torres", fecha: "2025-09-09", hora: "14:00:00", estado: "cancelada" },
    { id: 4, paciente: "Luis Gómez", fecha: "2025-09-09", hora: "14:00:00", estado: "programada" },
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ paciente: "", correo: "" });

  // (Si en el futuro quieres traer de API, descomenta y adapta)
  // useEffect(() => {
  //   fetch("http://localhost:4000/citas")
  //     .then((res) => res.json())
  //     .then((data) => setCitas(data))
  //     .catch((err) => console.error(err));
  // }, []);

   const getDateForDay = (day) => {
    const current = new Date(selectedDate);
    const monday = new Date(current.setDate(current.getDate() - current.getDay() + 1));
    const dayIndex = days.indexOf(day);
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + dayIndex);
    return targetDate.toISOString().split("T")[0];
  };

  const citasPorDiaYHora = (day, hour) => {
    const fecha = getDateForDay(day);
    return citas.filter((c) => c.fecha === fecha && c.hora === hour);
  };

  const citasPorDia = (day) => {
    const fecha = getDateForDay(day);
    return citas.filter((c) => c.fecha === fecha);
  };

  const handleAddCita = (day, hour) => {
    setFormData({ paciente: "", correo: "" });
    setSelectedCell({ day, hour });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { paciente, correo } = formData;
    if (!paciente || !correo) return;

    const fecha = getDateForDay(selectedCell.day);

    const nuevaCita = {
      id: citas.length + 1,
      paciente,
      correo,
      fecha,
      hora: selectedCell.hour,
      estado: "programada",
    };

    setCitas([...citas, nuevaCita]);
    setShowForm(false);
  };

  const semanaActual = () => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 4);
    return `${start.toLocaleDateString()} al ${end.toLocaleDateString()}`;
  };

  const cambiarSemana = (offset) => {
    const nuevaFecha = new Date(selectedDate);
    nuevaFecha.setDate(nuevaFecha.getDate() + offset * 7);
    setSelectedDate(nuevaFecha);
  };

  return (
    <div className="p-6 ">
      {/* Header con color según el modo */}
      <div className="flex items-center justify-between mb-4">
        <Button className={"cursor-pointer bg-gradient-to-r from-purple-700 via-purple-700 to-blue-700 hover:from-purple-500 hover:via-purple-500 hover:to-blue-500 transition"} 
        onClick={() => cambiarSemana(-1)}>← Semana anterior</Button>
        <h2
          className={`text-xl font-bold text-center ${
            mode === "view" ? "text-blue-600" : "text-orange-600"
          }`}
        >
          Semana de {semanaActual()} {mode === "edit" && "(Editando)"}
        </h2>
        <Button className={"cursor-pointer bg-gradient-to-r from-purple-700 via-purple-700 to-blue-700 hover:from-purple-500 hover:via-purple-500 hover:to-blue-500 transition"} 
        onClick={() => cambiarSemana(1)}>Semana siguiente →</Button>
      </div>

      <div className="flex justify-center mb-4">
        <Button
          className="cursor-pointer"
          onClick={() => setMode(mode === "view" ? "edit" : "view")}
        >
          Cambiar a {mode === "view" ? "Editar" : "Ver"}
        </Button>
      </div>

      <div className="grid grid-cols-6 gap-2">
        <div></div>

        {/* Días (encabezado): azul claro fondo + texto azul oscuro */}
        {days.map((day) => (
          <div
            key={day}
            className="font-bold text-white shadow-md py-2 rounded text-center cursor-pointer
            bg-gradient-to-r from-blue-500 via-blue-500/75 to-green-400
            hover:from-blue-400 hover:to-green-300 transition"
            onClick={() => {
              setSelectedDay(day);
              setShowModal(true);
            }}
          >
            {day}
          </div>
        ))}

        {/* Horas y celdas */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Hora (columna izquierda): morado suave */}
            <div className="font-bold shadow-md text-white py-2 rounded flex items-center justify-center
            bg-gradient-to-r from-teal-400 via-teal-400 to-green-300">
              {hour.slice(0, 5)}
            </div>

            {days.map((day) => {
              const citasEnCelda = citasPorDiaYHora(day, hour);
              const tieneCitas = citasEnCelda.length > 0;

              return (
                <Card
                  key={day + hour}
                  className={`cursor-pointer h-20 flex items-center justify-center text-sm transition-colors rounded-lg
                    ${mode === "edit"
                      ? "bg-yellow-100 hover:bg-yellow-200"
                      : tieneCitas
                        ? "bg-green-200 hover:bg-green-300"
                        : "bg-blue-50 hover:bg-blue-100"
                    }`}
                  onClick={() => {
                    setSelectedCell({ day, hour });
                    if (mode === "edit") {
                      handleAddCita(day, hour);
                    } else {
                      setShowModal(true);
                    }
                  }}
                >
                  <CardContent className="text-center">
                    {mode === "edit" ? (
                      <p className="text-gray-800 font-medium">✏️ Añadir</p>
                    ) : tieneCitas ? (
                      <p className="font-semibold text-gray-800">
                        {citasEnCelda.length} cita(s)
                      </p>
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

      {/* Botón flotante en modo edición */}
      {mode === "edit" && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => setMode("view")}
            className="bg-green-600 text-white shadow-lg cursor-pointer"
          >
            Guardar cambios
          </Button>
        </div>
      )}

      {/* Modal de citas por hora */}
      {showModal && selectedCell && !selectedDay && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="font-bold mb-2 text-gray-800">
              Citas en {selectedCell.day} a las {selectedCell.hour.slice(0, 5)}
            </h3>
            {citasPorDiaYHora(selectedCell.day, selectedCell.hour).length === 0 ? (
              <p className="text-gray-500">No hay citas</p>
            ) : (
              <ul className="list-disc ml-6 text-sm">
                {citasPorDiaYHora(selectedCell.day, selectedCell.hour).map((c) => (
                  <li key={c.id} className="text-gray-700">
                    {c.paciente} ({c.correo || "—"}) - Estado:{" "}
                    <span className={c.estado === "cancelada" ? "text-red-600" : "text-green-700"}>
                      {c.estado}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-4">
              <Button
                className={"cursor-pointer"}
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setSelectedCell(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de citas por día */}
      {showModal && selectedDay && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[28rem]">
            <h3 className="font-bold mb-4 text-gray-800">Citas en {selectedDay}</h3>
            {citasPorDia(selectedDay).length === 0 ? (
              <p className="text-gray-500">No hay citas este día</p>
            ) : (
              <div className="space-y-3">
                {hours.map((hour) => {
                  const citasHora = citasPorDiaYHora(selectedDay, hour);
                  return (
                    <div key={hour}>
                      <p className="font-semibold text-gray-700">{hour.slice(0, 5)}</p>
                      {citasHora.length === 0 ? (
                        <p className="text-gray-400 text-sm">Sin citas</p>
                      ) : (
                        <ul className="list-disc ml-6 text-sm">
                          {citasHora.map((c) => (
                            <li key={c.id} className="text-gray-700">
                              {c.paciente} ({c.correo || "—"}) - Estado:{" "}
                              <span className={c.estado === "cancelada" ? "text-red-600" : "text-green-700"}>
                                {c.estado}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Button className={"cursor-pointer"}
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setSelectedDay(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && selectedCell && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="font-bold mb-4 text-gray-800">
              Nueva cita en {selectedCell.day} a las {selectedCell.hour.slice(0, 5)}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700">Nombre del paciente</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={formData.paciente}
                  onChange={(e) =>
                    setFormData({ ...formData, paciente: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Correo</label>
                <input
                  type="email"
                  className="w-full border rounded p-2"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  className={"cursor-pointer"}
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button className={"cursor-pointer"} type="submit">Guardar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
