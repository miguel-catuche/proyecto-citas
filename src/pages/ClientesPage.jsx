import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useCitas } from '@/hooks/useCitas';
import Icon from '@/components/Icons';

// Función para asignar colores a los estados de la cita
const getEstadoColor = (estado) => {
    switch (estado) {
        case 'cancelada':
            return 'bg-red-200';
        case 'no-se-presentó':
            return 'bg-orange-200';
        case 'programada':
            return 'bg-blue-200';
        case 'completada':
            return 'bg-green-200';
        default:
            return 'bg-gray-200';
    }
};
const estadoLabels = {
    programada: "Programada",
    completada: "Completada",
    cancelada: "Cancelada",
    "no-se-presentó": "No se presentó",
};

const soloNumerosRegex = /^[0-9]*$/;

const ClientesPage = ({ clientes, onAddClient, onUpdateClient, onDeleteClient }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [formData, setFormData] = useState({ id: '', nombre: '' });

    const citas = useCitas();

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

        const id = formData.id?.trim();
        const nombre = formData.nombre?.trim();

        if (!id || !nombre) {
            toast.error("Debes completar todos los campos");
            return;
        }

        if (!/^\d+$/.test(id)) {
            toast.error("El número de documento debe contener solo dígitos");
            return;
        }

        onAddClient({ id, nombre });
        setShowAddModal(false);
        setFormData({ id: "", nombre: "" });
    };


    const handleEditSubmit = (e) => {
        e.preventDefault();
        setShowEditModal(false);
        setShowEditConfirmModal(true);
    };

    const handleEditConfirm = () => {
        onUpdateClient(formData.id, formData);
        setShowEditConfirmModal(false);
    };

    const handleDeleteConfirm = () => {
        onDeleteClient(selectedClient.id);
        setShowDeleteModal(false);
    };

    const historialCitas = Array.isArray(citas) && selectedClient?.id
        ? citas.filter((cita) => String(cita.clienteId) === String(selectedClient.id))
        : [];


    return (
        <div className="p-2 mx-auto">

            <Card className="mb-6">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700">Administración de Clientes</h3>
                        <p className="text-gray-500">Gestiona la información de todos tus pacientes</p>
                    </div>
                    <div className="flex justify-center md:justify-end">                        
                    <Button className={"cursor-pointer gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"}
                        onClick={openAddModal}>
                        <Icon name={"plus"} />Añadir Nuevo Cliente
                    </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="">
                    <h3 class="text-lg font-bold text-gray-900 mb-1">Lista de Clientes</h3>
                    <p class="text-sm text-gray-500">3 clientes registrados</p>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center w-[50px]">Cliente</TableHead>
                            <TableHead>Documento</TableHead>
                            <TableHead className="text-center w-[240px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clientes.map(cliente => (
                            <TableRow key={cliente.id}>
                                <TableCell className="font-semibold text-sm px-4 py-4 gap-2">
                                    <div className='flex items-center gap-3'>
                                        <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                                            <Icon className='text-blue-400' name={"person"} />
                                        </div>
                                        {cliente.nombre}
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm px-6">{cliente.id}</TableCell>
                                <TableCell className="flex justify-end space-x-2">
                                    <Button className={"cursor-pointer"} variant="outline" size="sm" onClick={() => openHistoryModal(cliente)}>
                                       <Icon className='text-blue-500' name={"calendar"}/> Historial
                                    </Button>
                                    <Button className={"cursor-pointer"} variant="outline" size="sm" onClick={() => openEditModal(cliente)}>
                                        <Icon className='text-green-600' name={"edit"}/>Editar
                                    </Button>
                                    <Button className={"cursor-pointer"} variant="destructive" size="sm" onClick={() => openDeleteModal(cliente)}>
                                        <Icon name={"delete"}/>Eliminar
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
                    <div className="bg-white rounded-xl shadow-lg p-6 w-84 md:w-96">
                        <h3 className="font-bold mb-4 text-gray-800 text-center">Añadir Nuevo Cliente</h3>
                        <form onSubmit={handleAddSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-700">Número de documento</label>
                                <Input
                                    inputMode="numeric"
                                    value={formData.id}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if (/^\d*$/.test(v)) {
                                            setFormData({ ...formData, id: v });
                                        }
                                    }}
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
                    <div className="bg-white rounded-xl shadow-lg p-6 w-84 md:w-96">
                        <h3 className="font-bold mb-4 text-gray-800 text-center">Editar Cliente</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-700">Número de documento</label>
                                <Input
                                    type="text"
                                    readOnly
                                    value={formData.id}
                                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                    className="bg-gray-100 cursor-not-allowed"
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
                    <div className="bg-white rounded-xl shadow-lg p-6 w-84 md:w-96 text-center">
                        <h3 className="font-bold mb-4 text-gray-800">Confirmar Edición</h3>
                        <p className="text-gray-700 mb-6">
                            ¿Estás seguro de que deseas guardar los cambios para este cliente?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <Button className={"cursor-pointer"} variant="outline" onClick={() => setShowEditConfirmModal(false)}>
                                Cancelar
                            </Button>
                            <Button className={"cursor-pointer"} onClick={handleEditConfirm}>
                                Confirmar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación para Eliminar */}
            {showDeleteModal && selectedClient && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-84 md:w-96 text-center">
                        <h3 className="font-bold mb-4 text-gray-800">Confirmar Eliminación</h3>
                        <p className="text-gray-700 mb-6">
                            ¿Estás seguro de que deseas eliminar a "{selectedClient.nombre}"?
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

                    <div className="bg-white rounded-xl shadow-lg p-6 w-84 md:w-[600px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 text-2xl">Historial de Citas de {selectedClient?.nombre || "Cliente"}</h3>
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
                                                        <span className={`inline-block min-w-[15px] px-1 text-sm font-medium text-center rounded ${getEstadoColor(cita.estado)}`}>
                                                            {estadoLabels[cita.estado] || cita.estado}
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