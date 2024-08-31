"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jwt-decode';

interface DecodedToken {
    isAdmin: boolean;
    exp: number;
    [key: string]: any;
}

const useAuth = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                // No hay token, redirige al login
                router.push('/');
                setLoading(false);
                return;
            }

            try {
                const decodedToken: DecodedToken = jwtDecode(token);
                const now = Date.now() / 1000; // Hora actual en segundos

                if (decodedToken.exp < now || !decodedToken.isAdmin) {
                    // Token expirado o el usuario no es admin
                    localStorage.removeItem('token');
                    router.push('/');
                } else {
                    // Usuario autorizado
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                localStorage.removeItem('token');
                router.push('/');
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {

    }

    return null; // No renderiza nada si está cargando
};

export default useAuth;
