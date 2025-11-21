import BottomNav from '@/components/BottomNav';
import Footer from '@/components/footer';
import HeaderNav from '@/components/headerNav';
import { API_BASE_URL, API_IMG_URL } from '@/utils/api';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function VerCompraScreen() {
    const { id } = useLocalSearchParams();
    const [pedido, setPedido] = useState<any>(null);
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompra = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/verCompraMovil/${id}`);
                const data = await res.json();
                setPedido(data.pedido);
                setProductos(data.productos);
            } catch (error) {
                console.error('Error al cargar la compra:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompra();
    }, [id]);

    if (loading || !pedido) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A67C52" />
            </View>
        );
    }

    const fechaCompra = new Date(pedido.fecha_pedido);
    const fechaEntrega = new Date(pedido.fecha_entrega_estimada);

    return (
        <View style={styles.container}>
            <HeaderNav />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>📦 Resumen de tu compra</Text>

                {/* Productos comprados */}
                <Text style={styles.sectionTitle}>🛍️ Productos comprados</Text>
                {productos.map((prod, index) => (
                    <View key={index} style={styles.productCard}>
                        <Image
                            source={{ uri: `${API_IMG_URL}/${prod.imagen_url}` }}
                            style={styles.productImage}
                        />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{prod.nombre_producto}</Text>
                            <Text>Cantidad: {prod.cantidad}</Text>
                            <Text>Precio unitario: ${prod.precio_unitario}</Text>
                            <Text>Subtotal: ${prod.precio_unitario * prod.cantidad}</Text>
                        </View>
                    </View>
                ))}

                {/* Información de envío */}
                <Text style={styles.sectionTitle}>🚚 Información de envío</Text>
                <View style={styles.infoBox}>
                    <Text>Dirección: {pedido.direccion}, {pedido.municipio}, {pedido.estado2}</Text>
                    <Text>Ciudad: {pedido.ciudad}</Text>
                    <Text>Código Postal: {pedido.codigo_postal}</Text>
                    <Text>Teléfono: {pedido.telefono}</Text>
                    <Text>Número de seguimiento: {pedido.numero_seguimiento ?? 'Sin asignar'}</Text>
                    <Text>Fecha estimada de entrega: {fechaEntrega.toLocaleDateString()}</Text>
                </View>

                {/* Detalles de pago */}
                <Text style={styles.sectionTitle}>💳 Detalles de pago</Text>
                <View style={styles.infoBox}>
                    <Text>Método: {pedido.metodo_pago}</Text>
                    <Text>Total pagado: ${pedido.total}</Text>
                    <Text>Fecha de compra: {fechaCompra.toLocaleDateString()}</Text>
                </View>

                <Footer />
            </ScrollView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDF6EC' },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDF6EC',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4B3F2F',
        textAlign: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D94F70',
        marginTop: 20,
        marginBottom: 8,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2,
    },
    productImage: {
        width: 100,
        height: 100,
    },
    productInfo: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        elevation: 1,
        marginBottom: 16,
    },
});
