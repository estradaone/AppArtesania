import { API_BASE_URL } from '@/utils/api';
import axios from 'axios';

export const obtenerProductosConCategoria = async () => {
    const response = await axios.get(`${API_BASE_URL}/productos`);
    return response.data;
};
