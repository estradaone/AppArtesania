import { ProductoCarrito, useCarrito } from '@/context/carritoContext';
import { API_IMG_URL } from '@/utils/api';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../components/footer';
import HeaderNav from '../../components/headerNav';


export default function CarritoScreen() {
    const { carrito, eliminarDelCarrito, total } = useCarrito();
    const router = useRouter();

    const renderItem = ({ item }: { item: ProductoCarrito }) => (
        <View style={styles.card}>
            <Image source={{ uri: `${API_IMG_URL}/${item.imagen_url}` }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{item.nombre_producto}</Text>
                <Text style={styles.price}>${item.precio} x {item.cantidad}</Text>
                <Text style={styles.subtotal}>Subtotal: ${item.precio * (item.cantidad ?? 1)}</Text>
                <TouchableOpacity onPress={() => eliminarDelCarrito(item.id_producto)}>
                    <Text style={styles.remove}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <HeaderNav />

            <Text style={styles.title}>🛒 Tu carrito</Text>

            {carrito.length === 0 ? (
                <Text style={styles.empty}>Tu carrito está vacío.</Text>
            ) : (
                <>
                    <FlatList<ProductoCarrito>
                        data={carrito}
                        keyExtractor={(item) => item.id_producto.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />


                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Total: ${total}</Text>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={() => router.push('/(user)/direcciones')}
                        >
                            <Text style={styles.checkoutText}>Continuar compra</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <Footer />
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
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 12,
    },
    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        color: '#A67C52',
    },
    subtotal: {
        fontSize: 14,
        color: '#4B3F2F',
        marginTop: 4,
    },
    remove: {
        marginTop: 8,
        color: 'red',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    totalContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff8f0',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4B3F2F',
        marginBottom: 12,
        textAlign: 'center',
    },
    checkoutButton: {
        backgroundColor: '#A67C52',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
