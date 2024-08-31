"use client";

import React, { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { login } from '../../services/authService';
import styles from './LoginForm.module.css';

type FormValues = {
    email: string;
    password: string;
};

interface LoginFormProps {
    onRegisterClick: () => void;
}

const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
};

const LoginForm: FC<LoginFormProps> = ({ onRegisterClick }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoading(true); // Iniciar estado de carga
        try {
            const response = await login(data.email, data.password);
            console.log('Respuesta del servidor:', response);

            // Guardar el token en el almacenamiento local
            localStorage.setItem('token', response.token);

            // Decodificar el token para obtener la información del usuario
            const userData = parseJwt(response.token);
            console.log('Datos del usuario:', userData);

            // Verificar si el usuario es administrador
            if (userData && userData.isAdmin) {
                router.push('/admin'); // Redirigir a la página de administración
            } else {
                router.push('/info-user'); // Redirigir a la página de información del usuario
            }
        } catch (error) {
            // Mostrar mensaje de error en caso de que la autenticación falle
            setErrorMessage('Email o contraseña incorrectos');
        } finally {
            setLoading(false); // Detener estado de carga
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Iniciar sesión</h1>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            {loading && <div className={styles.loader}>Loading...</div>} {/* Mostrar loader */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email:</label>
                    <input
                        id="email"
                        type="email"
                        className={styles.input}
                        {...register('email', { required: 'El email es obligatorio' })}
                    />
                    {errors.email && <p className={styles.error}>{errors.email.message}</p>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Contraseña:</label>
                    <input
                        id="password"
                        type="password"
                        className={styles.input}
                        {...register('password', {
                            required: 'La contraseña es obligatoria',
                            minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                        })}
                    />
                    {errors.password && <p className={styles.error}>{errors.password.message}</p>}
                </div>

                <button type="submit" className={styles.button}>Iniciar sesión</button>
            </form>

            <div className={styles.registerLink}>
                <p>¿No tienes cuenta? <span className={styles.link} onClick={onRegisterClick}>Registrarse</span></p>
            </div>
        </div>
    );
};

export default LoginForm;
