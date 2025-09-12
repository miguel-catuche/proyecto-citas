import React from 'react';
import { Button } from "@/components/ui/button";

const Header = ({ currentPage, onPageChange }) => {
    return (
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
            <nav className="space-x-4 flex items-center">
                <Button 
                    variant={currentPage === 'horario' ? 'default' : 'ghost'} 
                    onClick={() => onPageChange('horario')}
                    className="transition-colors bg-gradient-to-r from-purple-700 via-purple-700 to-blue-700 text-white hover:from-purple-500 hover:via-purple-500 hover:to-blue-500"
                >
                    Horario
                </Button>
                <Button 
                    variant={currentPage === 'clientes' ? 'default' : 'ghost'} 
                    onClick={() => onPageChange('clientes')}
                    className="transition-colors bg-gradient-to-r from-purple-700 via-purple-700 to-blue-700 text-white hover:from-purple-500 hover:via-purple-500 hover:to-blue-500"
                >
                    Clientes
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:bg-gray-100 transition-colors">
                    Salir
                </Button>
            </nav>
        </header>
    );
};

export default Header;