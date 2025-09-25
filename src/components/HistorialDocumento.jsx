import React from "react";

const HistorialDocumento = ({ cliente, citas }) => {
  const fechaActual = new Date().toLocaleDateString("es-CO");
  const horaActual = new Date().toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-[#ffffff] text-[#1f2937] font-sans max-w-[800px] mx-auto p-8 border border-[#d1d5db] rounded-lg">
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">Registro histórico de citas</h1>
        <div className="text-sm text-right">
          <p><span className="font-semibold">Expedido:</span></p>
          <p>Fecha: {fechaActual}</p>
          <p>Hora: {horaActual}</p>
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="mb-6 space-y-1">
        <p><span className="font-semibold">Nombre de cliente:</span> {cliente?.nombre || "—"}</p>
        <p><span className="font-semibold">Documento (ID):</span> {cliente?.id || "—"}</p>
      </div>

      {/* Tabla de citas */}
      <table className="w-full border border-[#d1d5db] text-sm">
        <thead className="bg-[#f3f4f6] text-[#374151]">
          <tr>
            <th className="border px-3 py-2 text-left">Fecha</th>
            <th className="border px-3 py-2 text-left">Hora</th>
            <th className="border px-3 py-2 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {citas.length > 0 ? (
            citas.map((cita, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-2">{cita.fecha}</td>
                <td className="px-3 py-2">{cita.hora}</td>
                <td className="px-3 py-2">{cita.estado}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-3 py-4 text-center text-[#6b7280]">
                No hay citas registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialDocumento;
