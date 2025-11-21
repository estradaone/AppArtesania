import BottomNav from '@/components/BottomNav';
import Footer from '@/components/footer';
import HeaderNav from '@/components/headerNav';
import { useAuth } from '@/context/authContext';
import { API_BASE_URL, API_IMG_URL } from '@/utils/api';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Pedido {
    id_pedido: number;
    id_producto: number;
    nombre_producto: string;
    cantidad: number;
    total: number;
    vendedor: string | null;
    estado: string;
    fecha_pedido: string;
    fecha_entrega_estimada: string;
    imagen_url: string;
    numero_seguimiento?: string;
}

export default function MisComprasScreen() {
    const { usuario } = useAuth();
    const router = useRouter();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/pedidosMovil/${usuario?.id_usuario}`);
                const data = await res.json();
                setPedidos(data);
            } catch (error) {
                console.error('Error al cargar pedidos:', error);
                Alert.alert('Error', 'No se pudieron cargar tus compras');
            } finally {
                setLoading(false);
            }
        };
        fetchPedidos();
    }, []);

    const renderPedido = ({ item }: { item: Pedido }) => {
        const fechaPedido = new Date(item.fecha_pedido);
        const fechaEntrega = new Date(item.fecha_entrega_estimada);
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const estadoColor = {
            entregado: '#088327',
            enviado: '#17a2b8',
            cancelado: '#dc3545',
            procesado: '#007bff',
            pendiente: '#6c757d',
        };

        return (
            <View style={styles.card}>
                <Image source={{ uri: `${API_IMG_URL}/${item.imagen_url}` }} style={styles.image} />
                <View style={styles.info}>
                    <Text style={styles.date}>
                        Pedido realizado el {fechaPedido.getDate()} de {meses[fechaPedido.getMonth()]} de {fechaPedido.getFullYear()}
                    </Text>
                    <Text style={styles.name}>{item.nombre_producto}</Text>
                    <Text style={styles.detail}>Cantidad: {item.cantidad}</Text>
                    <Text style={styles.detail}>Total: ${item.total} MXN</Text>
                    <Text style={styles.detail}>Vendedor: {item.vendedor ?? 'Sin asignar'}</Text>
                    <Text style={[styles.detail, { color: estadoColor[item.estado as keyof typeof estadoColor] }]}>
                        Estado: {item.estado.toUpperCase()}
                    </Text>
                    {item.numero_seguimiento && (
                        <Text style={styles.detail}>Número de seguimiento: {item.numero_seguimiento}</Text>
                    )}
                    <Text style={styles.detail}>
                        {item.estado === 'cancelado' ? 'Cancelado el:' : 'Entrega estimada:'}{' '}
                        <Text style={{ color: item.estado === 'cancelado' ? '#dc3545' : '#088327' }}>
                            {fechaEntrega.getDate()} de {meses[fechaEntrega.getMonth()]}
                        </Text>
                    </Text>
                    {item.estado === 'cancelado' && (
                        <Text style={styles.warning}>Este pedido fue cancelado. Si realizaste un pago, el reembolso está en proceso.</Text>
                    )}
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => router.push(`/(user)/verCompra/${item.id_pedido}`)} style={styles.btnPrimary}>
                            <Text style={styles.btnText}>Ver compra</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push(`/(user)/detalleProducto/${item.id_producto}`)} style={styles.btnSecondary}>
                            <Text style={styles.btnText}>Volver a comprar</Text>
                        </TouchableOpacity>
                        {(item.estado === 'procesado' || item.estado === 'enviado') && (
                            <TouchableOpacity
                                onPress={() => Alert.alert('Cancelar compra', 'Función aún no implementada')}
                                style={styles.btnDanger}
                            >
                                <Text style={styles.btnText}>Cancelar compra</Text>
                            </TouchableOpacity>
                        )}
                        {item.estado === 'cancelado' && (
                            <TouchableOpacity
                                onPress={() => router.push(`/(user)/reembolso/${item.id_pedido}`)}
                                style={styles.btnDark}
                            >
                                <Text style={styles.btnText}>Ver reembolso</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <HeaderNav />
            <Text style={styles.title}>Mis Compras 🛒</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#A67C52" style={{ marginTop: 40 }} />
            ) : pedidos.length === 0 ? (
                <Text style={styles.empty}>No tienes pedidos registrados aún.</Text>
            ) : (
                <FlatList
                    data={pedidos}
                    keyExtractor={(item, index) => `${item.id_pedido}-${item.id_producto}-${index}`}
                    renderItem={renderPedido}
                    contentContainerStyle={styles.list}
                    ListFooterComponent={<Footer />}
                    showsVerticalScrollIndicator={false}
                />
            )}
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDF6EC' },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4B3F2F',
        textAlign: 'center',
        marginVertical: 20,
    },
    empty: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 40,
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 180,
    },
    info: {
        padding: 12,
    },
    date: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    detail: {
        fontSize: 14,
        color: '#4B3F2F',
        marginBottom: 2,
    },
    warning: {
        fontSize: 12,
        color: '#dc3545',
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    btnPrimary: {
        backgroundColor: '#007bff',
        padding: 8,
        borderRadius: 8,
    },
    btnSecondary: {
        backgroundColor: '#6c757d',
        padding: 8,
        borderRadius: 8,
    },
    btnDanger: {
        backgroundColor: '#dc3545',
        padding: 8,
        borderRadius: 8,
    },
    btnDark: {
        backgroundColor: '#343a40',
        padding: 8,
        borderRadius: 8,
    },
    btnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
});
