import BottomNav from '@/components/BottomNav';
import Footer from '@/components/footer';
import HeaderNav from '@/components/headerNav';
import { API_BASE_URL } from '@/utils/api';
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

export default function ReembolsoScreen() {
    const { id } = useLocalSearchParams();
    const [pedido, setPedido] = useState<any>(null);
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReembolso = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/verReembolsoMovil/${id}`);
                const data = await res.json();
                setPedido(data.pedido);
                setProductos(data.productos);
            } catch (error) {
                console.error('Error al cargar reembolso:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReembolso();
    }, [id]);

    if (loading || !pedido) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A67C52" />
            </View>
        );
    }

    const fechaCancelacion = new Date(pedido.fecha_cancelacion);
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    return (
        <View style={styles.container}>
            <HeaderNav />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>❌ Reembolso de Pedido Cancelado</Text>

                {/* Productos cancelados */}
                <Text style={styles.sectionTitle}>🛍️ Productos cancelados</Text>
                {productos.map((prod, index) => (
                    <View key={index} style={styles.productCard}>
                        <Image
                            source={{ uri: `${API_BASE_URL.replace('/api', '')}${prod.imagen_url}` }}
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
                    <Text>Fecha de cancelación: {fechaCancelacion.getDate()} de {meses[fechaCancelacion.getMonth()]} de {fechaCancelacion.getFullYear()}</Text>
                </View>

                {/* Detalles de reembolso */}
                <Text style={styles.sectionTitle}>💳 Detalles de reembolso</Text>
                <View style={styles.infoBox}>
                    <Text>Método de pago: {pedido.metodo_pago}</Text>
                    <Text>Monto a reembolsar: ${pedido.total}</Text>
                    <Text>Estado actual: {pedido.estado.toUpperCase()}</Text>
                    <Text>Tiempo estimado de reembolso: 3 a 5 días hábiles</Text>
                </View>

                <Text style={styles.footerNote}>
                    Gracias por tu paciencia. Si tienes dudas, contáctanos desde el formulario de ayuda.
                </Text>

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
        color: '#dc3545',
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
    footerNote: {
        fontSize: 14,
        color: '#4B3F2F',
        textAlign: 'center',
        marginVertical: 20,
    },
});
