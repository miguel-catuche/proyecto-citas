import React from "react";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icons";
const Header = ({ onLogout }) => {
  const navigate = useNavigate();

  const activeColorClasses = "bg-white text-blue-600 hover:bg-white ronded-lg shadow-sm";
  const inactiveColorClasses = "text-gray-600 bg-transparent hover:bg-transparent border-none outline-none shadow-none";


  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>

      <nav className="flex items-center gap-4">
        <div className="flex items-center bg-gray-100 rounded-xl p-2 ">
          <NavLink to="/horario">
            {({ isActive }) => (
              <Button
                className={`cursor-pointer px-6 py-2.5 ${isActive ? activeColorClasses : inactiveColorClasses}`}
              >
                <Icon name={"calendar"}/>Horario
              </Button>
            )}
          </NavLink>

          <NavLink to="/clientes">
            {({ isActive }) => (
              <Button
                className={`cursor-pointer px-6 py-2.5 ${isActive ? activeColorClasses : inactiveColorClasses}`}
              >
               <Icon name={"people"}/>Clientes
              </Button>
            )}
          </NavLink>
          </div>
        <Button
          variant="ghost"
          className="text-white bg-red-500 hover:bg-red-600 cursor-pointer hover:text-white"
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
