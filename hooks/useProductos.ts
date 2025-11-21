import { obtenerProductosConCategoria } from '@/services/productService';
import { useEffect, useState } from 'react';

export type Producto = {
    id_producto: number;
    nombre_producto: string;
    precio: number;
    imagen_url: string;
    nombre_categoria: string;
};

type UseProductosResult = {
    productos: Producto[];
    loading: boolean;
    error: string | null;
};

export const useProductos = (): UseProductosResult => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await obtenerProductosConCategoria();
                setProductos(data);
            } catch (err) {
                setError('Error al cargar productos');
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    return { productos, loading, error };
};
