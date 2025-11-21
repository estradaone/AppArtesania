import { API_BASE_URL } from '@/utils/api';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './authContext';

export interface ProductoCarrito {
    id_producto: number;
    nombre_producto: string;
    precio: number;
    imagen_url: string;
    cantidad?: number;
}

interface CarritoContextType {
    carrito: ProductoCarrito[];
    total: number;
    agregarAlCarrito: (producto: ProductoCarrito) => Promise<void>;
    eliminarDelCarrito: (id_producto: number) => Promise<void>;
    cargarCarrito: () => Promise<void>;
    vaciarCarrito: () => Promise<void>
}

interface CarritoProviderProps {
    children: ReactNode;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: CarritoProviderProps) => {
    const { usuario } = useAuth();
    const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
    const [total, setTotal] = useState<number>(0);

    // 📦 Cargar carrito desde backend
    const cargarCarrito = async () => {
        if (!usuario?.id_usuario) return;
        try {
            const res = await fetch(`${API_BASE_URL}/carritoMovil/${usuario.id_usuario}`);
            const data: ProductoCarrito[] = await res.json();
            setCarrito(data);
            calcularTotal(data);
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            Alert.alert('Error', 'No se pudo cargar el carrito');
        }
    };

    // ➕ Agregar producto al carrito
    const agregarAlCarrito = async (producto: ProductoCarrito) => {
        if (!usuario?.id_usuario) return;
        try {
            await fetch(`${API_BASE_URL}/agregar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    id_producto: producto.id_producto,
                    nombre_producto: producto.nombre_producto,
                    precio: producto.precio,
                    imagen_url: producto.imagen_url,
                }),
            });
            cargarCarrito();
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            Alert.alert('Error', 'No se pudo agregar el producto');
        }
    };

    // 🗑️ Eliminar producto del carrito
    const eliminarDelCarrito = async (id_producto: number) => {
        if (!usuario?.id_usuario) return;
        try {
            await fetch(`${API_BASE_URL}/eliminar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    id_producto,
                }),
            });
            cargarCarrito();
        } catch (error) {
            console.error('Error al eliminar del carrito:', error);
            Alert.alert('Error', 'No se pudo eliminar el producto');
        }
    };

    // 💰 Calcular total
    const calcularTotal = (items: ProductoCarrito[]) => {
        const totalCalculado = items.reduce((acc: number, item: ProductoCarrito) => {
            return acc + item.precio * (item.cantidad ?? 1);
        }, 0);
        setTotal(totalCalculado);
    };
    const vaciarCarrito = async () => {
        if (!usuario?.id_usuario) return;
        try {
            await fetch(`${API_BASE_URL}/eliminar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: usuario.id_usuario }),
            });
            cargarCarrito(); // ✅ actualiza el estado local
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            Alert.alert('Error', 'No se pudo vaciar el carrito');
        }
    };


    useEffect(() => {
        cargarCarrito();
    }, [usuario]);

    return (
        <CarritoContext.Provider value={{ carrito, total, agregarAlCarrito, eliminarDelCarrito, cargarCarrito, vaciarCarrito }}>
            {children}
        </CarritoContext.Provider>
    );

};

export const useCarrito = (): CarritoContextType => {
    const context = useContext(CarritoContext);
    if (!context) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
    return context;
};
