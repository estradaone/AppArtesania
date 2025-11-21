import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';

type Usuario = {
    id_usuario: number;
    nombre: string;
    email: string;
    rol: 'usuario';
    estado: string;
};

type AuthContextType = {
    usuario: Usuario | null;
    login: (usuario: Usuario) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    usuario: null,
    login: async () => { },
    logout: async () => { },
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (user: Usuario) => {
        setUsuario(user);
        await AsyncStorage.setItem('usuario', JSON.stringify(user));
        await AsyncStorage.setItem('ultimoLogin', JSON.stringify(user));
    };

    const logout = async () => {
        try {
            setUsuario(null);
            await AsyncStorage.removeItem('usuario');
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Error al cerrar sesión');
        }
    };

    useEffect(() => {
        const cargarSesion = async () => {
            const data = await AsyncStorage.getItem('usuario');
            if (data) {
                const user: Usuario = JSON.parse(data);
                setUsuario(user);
            }
            setIsLoading(false);
        };
        cargarSesion();
    }, []);

    return (
        <AuthContext.Provider value={{ usuario, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
