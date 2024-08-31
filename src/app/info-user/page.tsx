"use client"
import React, { useEffect, useState } from 'react';
import { getMyDetails } from '../../services/authService';
import styles from './UserProfile.module.css';

const UserProfile = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token no encontrado');
                }

                const userData = await getMyDetails(token);
                setUser(userData);
            } catch (error) {
                setError('Error al obtener los detalles del usuario');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    if (loading) {
        return <p className={styles.errorMessage}>Cargando...</p>;
    }

    if (error) {
        return <p className={styles.errorMessage}>{error}</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {user && (
                    <div>
                        <img src={user.image} alt={`${user.username}'s profile`} className={styles.profileImage} />
                        <div className={styles.userInfo}>
                            <h2>{user.username} {user.lastname}</h2>
                            <p><strong>Correo:</strong> {user.email}</p>
                            <p><strong>Teléfono:</strong> {user.phone}</p>
                            <p><strong>País:</strong> {user.country}</p>
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.securityQuestions}>
                <h3>Preguntas de Seguridad</h3>
                {user && (
                    <>
                        <p><strong>Comida Favorita:</strong> {user.questions.favoriteFood}</p>
                        <p><strong>Artista Favorito:</strong> {user.questions.favoriteArtist}</p>
                        <p><strong>Lugar Favorito:</strong> {user.questions.favoritePlace}</p>
                        <p><strong>Color Favorito:</strong> {user.questions.favoriteColor}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;