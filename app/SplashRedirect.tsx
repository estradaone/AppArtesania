import { useAuth } from '@/context/authContext';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function SplashRedirect() {
    const { usuario, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (usuario) {
                router.replace('/(user)/tienda');
            } else {
                router.replace('/(auth)/login');
            }
        }
    }, [usuario, isLoading]);

    return null; // o una animación de carga si quieres
}
