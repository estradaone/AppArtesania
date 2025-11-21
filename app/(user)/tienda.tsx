import { useAuth } from '@/context/authContext';
import { useCarrito } from '@/context/carritoContext';
import { API_BASE_URL, API_IMG_URL } from '@/utils/api';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import BottomNav from '../../components/BottomNav';
import Footer from '../../components/footer';
import HeaderNav from '../../components/headerNav';

const screenWidth = Dimensions.get('window').width;

const categorias = [
    { label: '🪄 Accesorios', route: '/(user)/categorias/accesorios' },
    { label: '👜 Bolsos', route: '/(user)/categorias/bolsos' },
    { label: '👒 Sombreros', route: '/(user)/categorias/sombreros' },
    { label: '👚 Blusas', route: '/(user)/categorias/blusas' },
    { label: '🧸 Peluches', route: '/(user)/categorias/peluches' },
    { label: '🖇️ Llaveros', route: '/(user)/categorias/llaveros' },
];

type Producto = {
    id_producto: number;
    nombre_producto: string;
    precio: number;
    imagen_url: string;
};

export default function TiendaScreen() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    const { usuario } = useAuth();
    const { agregarAlCarrito } = useCarrito();
    const router = useRouter();

    useEffect(() => {
        fetch(`${API_BASE_URL}/todosProductos`)
            .then((res) => res.json())
            .then((data) => {
                setProductos(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error al obtener productos:', error);
                setLoading(false);
            });
    }, []);

    const handleAgregarCarrito = (producto: Producto) => {
        if (!usuario) {
            Alert.alert(
                'Inicia sesión',
                'Debes de iniciar sesión para agregar productos al carrito',
                [
                    { text: 'Ir al login', onPress: () => router.push('/(auth)/login') },
                    { text: 'Cancelar', style: 'cancel' },
                ]
            );
            return;
        }

        agregarAlCarrito({
            id_producto: producto.id_producto,
            nombre_producto: producto.nombre_producto,
            precio: producto.precio,
            imagen_url: producto.imagen_url,
            cantidad: 1,
        });

        Alert.alert('Producto agregado', `${producto.nombre_producto} se añadió al carrito`);

    }
    const renderItem = ({ item }: { item: Producto }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: `${API_IMG_URL}/${item.imagen_url}` }}
                style={styles.image}
            />
            <Text style={styles.name}>{item.nombre_producto}</Text>
            <Text style={styles.price}>${item.precio}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleAgregarCarrito(item)}>
                <Text style={styles.buttonText}>Añadir al carrito</Text>
            </TouchableOpacity>
        </View>
    )
    return (
        <View style={styles.container}>
            <HeaderNav />

            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.titulo}>Categorías</Text>

                    <View style={styles.grid}>
                        {categorias.map((cat) => (
                            <TouchableOpacity
                                key={cat.route}
                                style={styles.categoria}
                                onPress={() => router.push(cat.route)}
                            >
                                <Text style={styles.icono}>{cat.label}</Text>
                                <Text style={styles.texto}>{cat.route.split('/').pop()?.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.titulo}>Productos</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#A67C52" style={{ marginTop: 20 }} />
                    ) : (
                        <View style={styles.productosGrid}>
                            {productos.map((item) => (
                                <View key={item.id_producto} style={styles.card}>
                                    <Image
                                        source={{ uri: `${API_IMG_URL}/${item.imagen_url}` }}
                                        style={styles.image}
                                    />
                                    <Text style={styles.name}>{item.nombre_producto}</Text>
                                    <Text style={styles.price}>${item.precio}</Text>
                                    <TouchableOpacity style={styles.button} onPress={() => handleAgregarCarrito(item)}>
                                        <Text style={styles.buttonText}>Añadir al carrito</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}

                        </View>
                    )}

                    <Footer />
                </ScrollView>
            </View>

            <BottomNav />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF6EC',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 80,
    },
    button: {
        backgroundColor: '#A67C52',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },

    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#D94F70',
        marginBottom: 16,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
    },
    categoria: {
        width: '47%',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    icono: {
        fontSize: 28,
        marginBottom: 8,
    },
    texto: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4B3F2F',
    },
    card: {
        width: '48%', // ✅ más flexible que usar screenWidth
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // ✅ mantiene dos columnas
    },

    image: {
        width: '100%',
        height: 140,
        borderRadius: 12,
        marginBottom: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    price: {
        fontSize: 15,
        color: '#A67C52',
        textAlign: 'center',
    },
});
