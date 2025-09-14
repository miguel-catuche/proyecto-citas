import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onLogin(email, pass); // login con Firebase
      navigate("/horario"); // 👈 redirige después de login exitoso
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-200 to-purple-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Iniciar Sesión
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            required
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="cursor-pointer w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

