"use client";

import { getAllUsers, updateUserQuestions } from '@/services/authService';
import React, { useEffect, useState } from 'react';

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any | null>(null); // Para almacenar el usuario seleccionado
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formData, setFormData] = useState<any>({}); // Para almacenar los datos del formulario de edición

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token no encontrado');
                }

                const userData = await getAllUsers(token);
                setUsers(userData);
            } catch (error) {
                setError('Error al obtener los usuarios');
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const openModal = (user: any) => {
        setSelectedUser(user);
        setFormData(user.questions); // Inicializa los datos del formulario con las preguntas del usuario
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setFormData({});
        setModalIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token || !selectedUser?._id) {
                throw new Error('Token no encontrado o usuario no seleccionado');
            }

            const questions = {
                favoriteFood: formData.favoriteFood || '',
                favoriteArtist: formData.favoriteArtist || '',
                favoritePlace: formData.favoritePlace || '',
                favoriteColor: formData.favoriteColor || ''
            };

            await updateUserQuestions(token, selectedUser._id, questions);
            // Actualizar la lista de usuarios con los datos actualizados
            const updatedUsers = users.map(user =>
                user._id === selectedUser._id ? { ...user, questions } : user
            );
            setUsers(updatedUsers);
            closeModal();
        } catch (error) {
            console.error('Error al actualizar las preguntas:', error);
            setError('Error al actualizar las preguntas');
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Mostrar un loader mientras se obtienen los usuarios
    }

    if (error) {
        return <div>{error}</div>; // Mostrar el mensaje de error
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map(user => (
                    <div key={user._id} className="bg-white p-4 rounded shadow-md">
                        <img src={user.image} alt={`${user.username}'s profile`} className="w-24 h-24 rounded-full mx-auto" />
                        <h2 className="text-xl font-semibold text-center">{user.username}</h2>
                        <p className="text-center">{user.email}</p>
                        <button
                            onClick={() => openModal(user)}
                            className="mt-4 block w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            Ver más
                        </button>
                    </div>
                ))}
            </div>

            {modalIsOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-4">{selectedUser.username} {selectedUser.lastname}</h2>
                        <img src={selectedUser.image} alt={`${selectedUser.username}'s profile`} className="w-32 h-32 rounded-full mx-auto mb-4" />
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Teléfono:</strong> {selectedUser.phone}</p>
                        <p><strong>País:</strong> {selectedUser.country}</p>
                        <h3 className="mt-4 text-xl font-semibold">Preguntas de Seguridad</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1"><strong>Comida Favorita:</strong></label>
                                <input
                                    type="text"
                                    name="favoriteFood"
                                    value={formData.favoriteFood || ''}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1"><strong>Artista Favorito:</strong></label>
                                <input
                                    type="text"
                                    name="favoriteArtist"
                                    value={formData.favoriteArtist || ''}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1"><strong>Lugar Favorito:</strong></label>
                                <input
                                    type="text"
                                    name="favoritePlace"
                                    value={formData.favoritePlace || ''}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1"><strong>Color Favorito:</strong></label>
                                <input
                                    type="text"
                                    name="favoriteColor"
                                    value={formData.favoriteColor || ''}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                            >
                                Guardar cambios
                            </button>
                        </form>
                        <button
                            onClick={closeModal}
                            className="mt-4 block w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
