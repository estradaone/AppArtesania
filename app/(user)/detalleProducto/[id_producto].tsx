import BottomNav from '@/components/BottomNav';
import Footer from '@/components/footer';
import HeaderNav from '@/components/headerNav';
import { useAuth } from '@/context/authContext';
import { useCarrito } from '@/context/carritoContext';
import { API_BASE_URL, API_IMG_URL } from '@/utils/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function DetalleProductoScreen() {
    const { id_producto } = useLocalSearchParams();
    const router = useRouter();
    const { usuario } = useAuth();
    const { agregarAlCarrito } = useCarrito();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [producto, setProducto] = useState<any>(null);
    const [destacados, setDestacados] = useState<any[]>([]);
    const [relacionados, setRelacionados] = useState<any[]>([]);
    const [imagenes, setImagenes] = useState<string[]>([]);
    const [imagenActiva, setImagenActiva] = useState<string>('');

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/detallesProducto/${id_producto}`);
                const data = await res.json();

                if (!data.producto) {
                    setError('Producto no encontrado');
                    return;
                }

                setProducto(data.producto);
                setImagenes(data.imagenes.map((img: any) => `${API_IMG_URL}/${img.url_imagen}`));
                setImagenActiva(`${API_IMG_URL}/${data.imagenes[0]?.url_imagen || data.producto.imagen_url}`);

                setDestacados(data.destacados);
                setRelacionados(data.relacionados);
            } catch (err) {
                console.error('Error al cargar producto:', err);
                setError('Error al conectar con el servidor');
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [id_producto]);

    const handleAgregarCarrito = () => {
        if (!usuario) {
            Alert.alert(
                'Inicia sesión',
                'Debes iniciar sesión para agregar productos al carrito.',
                [
                    { text: 'Ir al login', onPress: () => router.push('/(auth)/login') },
                    { text: 'Cancelar', style: 'cancel' },
                ]
            );
            return;
        }
        if (producto.cantidad <= 0) {
            Alert.alert('Sin stock', 'Este producto no tiene unidades disponibles en este momento.');
            return;
        }

        agregarAlCarrito({
            id_producto: producto.id_producto,
            nombre_producto: producto.nombre_producto,
            precio: producto.precio,
            imagen_url: producto.imagen_url,
            cantidad: 1,
        });


        Alert.alert('Producto agregado', `${producto.nombre_producto} se añadió al carrito.`);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#A67C52" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <HeaderNav />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.cardProducto}>
                    <Image source={{ uri: imagenActiva }} style={styles.image} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.miniaturas}>
                        {imagenes.map((img, index) => (
                            <TouchableOpacity key={index} onPress={() => setImagenActiva(img)}>
                                <Image source={{ uri: img }} style={[styles.miniatura, imagenActiva === img && styles.miniaturaActiva]} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View style={styles.info}>
                        <Text style={styles.name}>{producto.nombre_producto}</Text>
                        <Text style={styles.price}>${producto.precio}</Text>
                        <Text style={styles.stock}>
                            Disponibles: {producto.cantidad > 0 ? producto.cantidad : 0}
                        </Text>
                        <Text style={styles.description}>{producto.descripcion}</Text>

                        <View style={styles.extraInfo}>
                            <Text style={styles.extraText}>🚚 Envíos a Rayón, Pueblo Nuevo, Pantepec, Tapilula</Text>
                            <Text style={styles.extraText}>🔄 Devoluciones gratis dentro de 5 días</Text>
                            <Text style={styles.extraText}>⭐ Producto destacado por calidad artesanal</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, producto.cantidad === 0 && styles.buttonDisabled]}
                            onPress={handleAgregarCarrito}
                            disabled={producto.cantidad === 0}
                        >
                            <Text style={styles.buttonText}>
                                {producto.cantidad === 0 ? 'Sin stock' : 'Agregar al carrito'}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>

                <Text style={styles.section}>🔥 Productos destacados</Text>
                <FlatList
                    data={destacados}
                    horizontal
                    keyExtractor={(item) => item.id_producto.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => router.push(`/detalleProducto/${item.id_producto}`)}
                            style={styles.cardMini}
                        >
                            <Image
                                source={{ uri: `${API_IMG_URL}/${item.imagen_url}` }}
                                style={styles.cardImage}
                            />
                            <Text style={styles.cardName}>{item.nombre_producto}</Text>
                        </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                />

                <Text style={styles.section}>🛍️ Relacionados</Text>
                <FlatList
                    data={relacionados}
                    horizontal
                    keyExtractor={(item) => item.id_producto.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => router.push(`/detalleProducto/${item.id_producto}`)}
                            style={styles.cardMini}
                        >
                            <Image
                                source={{ uri: `${API_IMG_URL}/${item.imagen_url}` }}
                                style={styles.cardImage}
                            />
                            <Text style={styles.cardName}>{item.nombre_producto}</Text>
                        </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                />

                {/* ✅ Footer al final del contenido scrollable */}
                <Footer />
            </ScrollView>

            {/* ✅ BottomNav fijo */}
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDF6EC' },
    content: { padding: 20 },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDF6EC',
    },
    error: { fontSize: 16, color: 'red', textAlign: 'center' },

    cardProducto: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 24,
    },
    image: {
        width: '100%',
        height: 260,
        borderRadius: 12,
        marginBottom: 16,
    },
    info: {
        paddingHorizontal: 8,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4B3F2F',
        marginBottom: 6,
    },
    price: {
        fontSize: 20,
        color: '#A67C52',
        fontWeight: '600',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    extraInfo: {
        marginTop: 16,
        marginBottom: 16,
    },
    extraText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
    },
    button: {
        backgroundColor: '#A67C52',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    section: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4B3F2F',
        marginBottom: 16,
    },
    cardMini: {
        width: 140,
        marginRight: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center',
    },
    cardImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
    },
    cardName: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        color: '#333',
    },
    miniaturas: {
        marginBottom: 16,
        flexDirection: 'row',
        gap: 8,
    },
    miniatura: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    miniaturaActiva: {
        borderColor: '#A67C52',
        borderWidth: 2,
    },
    stock: {
        fontSize: 14,
        color: '#2E7D32',
        marginBottom: 10,
        fontWeight: '600',
    },
    buttonDisabled: {
        backgroundColor: '#c8b7a4',
    },


});
