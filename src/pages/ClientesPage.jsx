import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// Función para asignar colores a los estados de la cita
const getEstadoColor = (estado) => {
    switch (estado) {
        case 'programada':
            return 'text-blue-500';
        case 'completada':
            return 'text-green-500';
        case 'cancelada':
            return 'text-red-500';
        case 'no vino':
            return 'text-orange-500';
        default:
            return 'text-gray-500';
    }
};

const ClientesPage = ({ clientes, citas, onAddClient, onUpdateClient, onDeleteClient }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [formData, setFormData] = useState({ id: '', nombre: '' });

    const openAddModal = () => {
        setFormData({ id: '', nombre: '' });
        setShowAddModal(true);
    };

    const openEditModal = (cliente) => {
        setSelectedClient(cliente);
        setFormData({ id: cliente.id, nombre: cliente.nombre });
        setShowEditModal(true);
    };

    const openDeleteModal = (cliente) => {
        setSelectedClient(cliente);
        setShowDeleteModal(true);
    };
    
    const openHistoryModal = (cliente) => {
        setSelectedClient(cliente);
        setShowHistoryModal(true);
    }

    const handleAddSubmit = (e) => {
        e.preventDefault();
        onAddClient(formData);
        setShowAddModal(false);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setShowEditModal(false);
        setShowEditConfirmModal(true);
    };

    const handleEditConfirm = () => {
        onUpdateClient(formData);
        setShowEditConfirmModal(false);
    };

    const handleDeleteConfirm = () => {
        onDeleteClient(selectedClient.id);
        setShowDeleteModal(false);
    };

    const historialCitas = selectedClient ? citas.filter(cita => cita.clienteId === selectedClient.id) : [];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Administración de Clientes</h2>
            
            <Card className="mb-6">
                <CardContent className="p-4 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-700">Lista de Clientes</h3>
                    <Button className={"cursor-pointer"} onClick={openAddModal}>
                        Añadir Nuevo Cliente
                    </Button>
                </CardContent>
            </Card>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Documento</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="text-right w-[250px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientes.map(cliente => (
                            <TableRow key={cliente.id}>
                                <TableCell className="font-medium">{cliente.id}</TableCell>
                                <TableCell>{cliente.nombre}</TableCell>
                                <TableCell className="flex justify-end space-x-2">
                                    <Button className={"cursor-pointer"} variant="outline" size="sm" onClick={() => openHistoryModal(cliente)}>
                                        Historial
                                    </Button>
                                    <Button className={"cursor-pointer"} variant="outline" size="sm" onClick={() => openEditModal(cliente)}>
                                        Editar
                                    </Button>
                                    <Button className={"cursor-pointer"} variant="destructive" size="sm" onClick={() => openDeleteModal(cliente)}>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal para Añadir Cliente */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h3 className="font-bold mb-4 text-gray-800 text-center">Añadir Nuevo Cliente</h3>
                        <form onSubmit={handleAddSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-700">Número de documento</label>
                                <Input
                                    type="text"
                                    value={formData.id}
                                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700">Nombre completo</label>
                                <Input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <Button className={"cursor-pointer"} type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                                    Cancelar
                                </Button>
                                <Button className={"cursor-pointer"} type="submit">Guardar</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para Editar Cliente */}
            {showEditModal && selectedClient && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h3 className="font-bold mb-4 text-gray-800 text-center">Editar Cliente</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-700">Número de documento</label>
                                <Input
                                    type="text"
                                    value={formData.id}
                                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700">Nombre completo</label>
                                <Input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <Button className={"cursor-pointer"} type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                                    Cancelar
                                </Button>
                                <Button className={"cursor-pointer"} type="submit">Guardar Cambios</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación para Editar */}
            {showEditConfirmModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
                        <h3 className="font-bold mb-4 text-gray-800">Confirmar Edición</h3>
                        <p className="text-gray-700 mb-6">
                            ¿Estás seguro de que deseas guardar los cambios para este cliente?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowEditConfirmModal(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleEditConfirm}>
                                Confirmar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación para Eliminar */}
            {showDeleteModal && selectedClient && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">
                        <h3 className="font-bold mb-4 text-gray-800">Confirmar Eliminación</h3>
                        <p className="text-gray-700 mb-6">
                            ¿Estás seguro de que deseas eliminar a **{selectedClient.nombre}**?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <Button className={"cursor-pointer"} variant="outline" onClick={() => setShowDeleteModal(false)}>
                                No
                            </Button>
                            <Button className={"cursor-pointer"} variant="destructive" onClick={handleDeleteConfirm}>
                                Sí, eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Ver Historial */}
            {showHistoryModal && selectedClient && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[600px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 text-2xl">Historial de Citas de {selectedClient.nombre}</h3>
                            <Button variant="ghost" onClick={() => setShowHistoryModal(false)} className="cursor-pointer hover:text-white bg-black text-white hover:bg-gray-800">Cerrar</Button>
                        </div>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {historialCitas.length > 0 ? (
                                historialCitas.map((cita, index) => (
                                    <Card key={index} className="p-4 bg-gray-50">
                                        <CardContent className="p-0">
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-700">
                                                    <p><strong>Fecha:</strong> {cita.fecha}</p>
                                                    <p><strong>Hora:</strong> {cita.hora}</p>
                                                    <p>
                                                        <strong>Estado:</strong>{" "}
                                                        <span className={getEstadoColor(cita.estado)}>
                                                            {cita.estado}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">
                                    <p>No se encontraron citas para este cliente.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientesPage;