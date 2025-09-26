import React from "react";

const HistorialDocumento = ({ cliente, citas }) => {
  const fechaActual = new Date().toLocaleDateString("es-CO");
  const horaActual = new Date().toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const estadoLabels = {
    programada: "Programada",
    completada: "Completada",
    cancelada: "Cancelada",
    "no-se-presento": "No se presentó",
  };
  return (
    <div className="bg-white text-black max-w-[800px] mx-auto p-8 border border-black text-sm leading-tight">

      {/* Encabezado con bordes completos */}
      <div className="border border-black mb-6">
        <div className="flex items-stretch">
          {/* Logo con borde derecho */}
          <div className="border-r border-black flex items-center justify-center overflow-hidden">
            <img
              src="/ruta-del-logo.png" // ← reemplaza con la ruta real
              alt="Logo institucional"
              className="object-contain w-full h-full"
            />
          </div>

          {/* Texto institucional con línea divisoria */}
          <div className="flex-1 py-2 text-center">
            <h1 className="text-base font-bold uppercase">
              NOMBRE DE EMPRESA
            </h1>
            <div className="border-b border-black my-1" />
            <p className="uppercase">FORMATO REGISTRO DE ASISTENCIA</p>
          </div>

          {/* Expedición con borde izquierdo */}
          <div className="border-l border-black px-3 py-2 text-sm text-right">
            <p>Expedido:</p>
            <p>Fecha: {fechaActual}</p>
            <p>Hora: {horaActual}</p>
          </div>
        </div>
      </div>

      {/* Sección 1: Registro de asistencia */}
      <div className="mb-6">
        <div className="bg-[#fff3a8] text-black font-bold uppercase px-3 py-1 border border-black text-center h-10">
          1. Registro de Asistencia
        </div>

        <table className="w-full border border-black border-t-0 text-sm table-fixed">
          <tbody>
            <tr className="border-b border-black">
              <td className="border-r border-black px-2 py-2 w-1/2">
                EMPRESA: <span className="font-normal">Nombre empresa</span>
              </td>
              <td className="px-2 py-2 w-1/2">
                SERVICIO: <span className="font-normal">TERAPIA Y REHABILITACIÓN FÍSICA</span>
              </td>
            </tr>
            <tr>
              <td className="border-r border-black px-2 py-2">
                PACIENTE: <span className="font-normal">{cliente?.nombre || "—"}</span>
              </td>
              <td className="px-2 py-2">
                Documento de identidad: <span className="font-normal">{cliente?.id || "—"}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección 2: Seguimiento */}
      <div>
        <div className="bg-[#fff3a8] text-black font-bold uppercase text-center px-3 py-1 border border-black h-10">
          2. Seguimiento
        </div>

        {/* Encabezado */}
        <div className="grid grid-cols-3 text-sm font-semibold border-x border-black">
          <div className="flex justify-center items-center border-r border-black border-black h-10">
            FECHA
          </div>
          <div className="flex justify-center items-center border-r border-black border-black h-10">
            HORA
          </div>
          <div className="flex justify-center items-center border-black h-10">
            ESTADO
          </div>
        </div>

        {/* Filas dinámicas */}
        {citas.length > 0 ? (
          citas.map((cita, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 text-sm border-x border-black ${i === citas.length - 1 ? "border-b border-black" : ""
                }`}
            >
              <div className="flex justify-center items-center border-r border-black border-t border-black h-10">
                {cita.fecha}
              </div>
              <div className="flex justify-center items-center border-r border-black border-t border-black h-10">
                {`${cita.hora} ${parseInt(cita.hora.split(":")[0], 10) >= 12 ? "p.m" : "a.m"}`}
              </div>
              <div className="flex justify-center items-center border-t border-black h-10">
                {estadoLabels[cita.estado]}
              </div>
            </div>
          ))
        ) : (
          <div className="border border-black py-4 text-center text-[#555555] text-sm">
            No hay citas registradas
          </div>
        )}
      </div>




    </div>
  );
};

export default HistorialDocumento;
