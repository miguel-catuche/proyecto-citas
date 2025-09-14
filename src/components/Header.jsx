import React from "react";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
const Header = ({ onLogout }) => {
  const navigate = useNavigate();

  const baseBtnClasses = "min-w-[120px] px-4 py-2 rounded transition-colors cursor-pointer font-medium";
const activeColorClasses = "bg-gradient-to-r from-purple-700 via-purple-700 to-blue-700 text-white hover:from-purple-500 hover:via-purple-500 hover:to-blue-600";
const inactiveColorClasses = "bg-gray-300 text-black hover:bg-gray-300";


  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
  <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>

  <nav className="flex items-center gap-4">
    <NavLink to="/horario">
      {({ isActive }) => (
        <Button
          className={`cursor-pointer ${isActive ? activeColorClasses : inactiveColorClasses}`}
        > 
          Horario
        </Button>
      )}
    </NavLink>

    <NavLink to="/clientes">
      {({ isActive }) => (
        <Button
          className={`cursor-pointer ${isActive ? activeColorClasses : inactiveColorClasses}`}
        >
          Clientes
        </Button>
      )}
    </NavLink>

    <Button
      variant="ghost"
      className="text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
      onClick={() => {
        onLogout?.();
        navigate("/login");
      }}
    >
      Salir
    </Button>
  </nav>
</header>

  );
};

export default Header;
