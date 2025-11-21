import { API_BASE_URL } from '@/utils/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function ReordenarScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/reordenarMovil/${id}`);
                const data = await res.json();

                if (data.id_producto) {
                    router.replace(`/(user)/detalleProducto/${data.id_producto}`);
                } else {
                    router.replace(`/(user)/tienda`);
                }
            } catch (error) {
                console.error('Error al reordenar:', error);
                router.replace(`/(user)/tienda`);
            }
        };
        fetchProducto();
    }, [id]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#A67C52" />
            <Text style={styles.text}>Cargando producto original...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF6EC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 12,
        fontSize: 16,
        color: '#4B3F2F',
    },
});
