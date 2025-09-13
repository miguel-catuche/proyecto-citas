import React from 'react';
import { Button } from "@/components/ui/button";

const Header = ({ currentPage, onPageChange, onLogout }) => {
    // Definimos las clases para el botón de navegación activo
    const activeBtnClasses = "transition-colors cursor-pointer bg-gradient-to-r from-purple-700 via-purple-700 to-blue-700 text-white hover:from-purple-500 hover:via-purple-500 hover:to-blue-600 hover:text-white";

    return (
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
            <nav className="space-x-4 flex items-center">
                <Button
                    variant={currentPage === 'horario' ? 'default' : 'ghost'}
                    onClick={() => onPageChange('horario')}
                    className={currentPage === 'horario' ? activeBtnClasses : "cursor-pointer text-gray-600 hover:bg-gray-100"}
                >
                    Horario
                </Button>
                <Button
                    variant={currentPage === 'clientes' ? 'default' : 'ghost'}
                    onClick={() => onPageChange('clientes')}
                    className={currentPage === 'clientes' ? activeBtnClasses : "cursor-pointer text-gray-600 hover:bg-gray-100"}
                >
                    Clientes
                </Button>
                <Button variant="ghost" className="text-red-600 hover:bg-red-100 transition-colors cursor-pointer" onClick={onLogout}>
                    Salir
                </Button>
            </nav>
        </header>
    );
};

export default Header;