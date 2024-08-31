import axios from 'axios';

// URL base para las peticiones
const API_URL = 'http://localhost:4000/api/users';

// Función para iniciar sesión
export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;  // Aquí obtendrás el token si el login es exitoso
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};

// Función para registrar un nuevo usuario
export const registerUser = async (userData: {
    username: string;
    lastname: string;
    phone: string;
    country: string;
    email: string;
    password: string;
    questions: {
        favoriteFood: string;
        favoriteArtist: string;
        favoritePlace: string;
        favoriteColor: string;
    };
    image?: string; // El campo 'image' es opcional
}) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        throw error;
    }
};

// Opcional: Función para obtener detalles del usuario autenticado
export const getMyDetails = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;  // Aquí obtendrás la información del usuario
    } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
        throw error;
    }
};


// Función para obtener todos los usuarios (solo para administradores)
export const getAllUsers = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;  // Aquí obtendrás la lista de usuarios
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        throw error; // Re-lanza el error para manejarlo en el componente
    }
};
// Función para actualizar las preguntas de seguridad de un usuario
export const updateUserQuestions = async (token: string, userId: string, questions: any) => {
    try {
        const response = await axios.patch(`${API_URL}/admin/users/${userId}/questions`, questions, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar las preguntas:', error);
        throw error;
    }
};