import BottomNav from "@/components/BottomNav";
import Footer from "@/components/footer";
import HeaderNav from "@/components/headerNav";
import { useAuth } from "@/context/authContext";
import { useCarrito } from "@/context/carritoContext";
import { API_BASE_URL, API_IMG_URL } from "@/utils/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

type Producto = {
    id_producto: number;
    nombre_producto: string;
    precio: number;
    imagen_url: string;
};

export default function bolsosScreen() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    const { usuario } = useAuth();
    const { agregarAlCarrito } = useCarrito();
    const router = useRouter();

    useEffect(() => {
        fetch(`${API_BASE_URL}/productosSombreros`)
            .then((res) => res.json())
            .then((data) => {
                setProductos(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener los productos de sombreros", error);
                setLoading(false);
            });
    }, []);

    const handleAgregarCarrito = (producto: Producto) => {
        if (!usuario) {
            Alert.alert(
                "Inicia sesión",
                "Debes iniciar sesión para agregar productos al carrito.",
                [
                    { text: "Ir al login", onPress: () => router.push("/(auth)/login") },
                    { text: "Cancelar", style: "cancel" },
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

        Alert.alert("Producto agregado", `${producto.nombre_producto} se añadió al carrito`);
    };

    const renderItem = ({ item }: { item: Producto }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => router.push(`/detalleProducto/${item.id_producto}`)}>
                <Image
                    source={{ uri: `${API_IMG_URL}/${item.imagen_url}` }}
                    style={styles.image}
                />
            </TouchableOpacity>
            <Text style={styles.name}>{item.nombre_producto}</Text>
            <Text style={styles.price}>${item.precio}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleAgregarCarrito(item)}>
                <Text style={styles.buttonText}>Añadir al carrito</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <HeaderNav />

            <View style={{ flex: 1 }}>
                <Text style={styles.titulo}>Sombreros</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#A67C52" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={productos}
                        renderItem={renderItem}
                        keyExtractor={(item) => `${item.id_producto}`}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={styles.list}
                        ListFooterComponent={<Footer />}
                    />
                )}
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
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#D94F70',
        margin: 16,
        textAlign: 'center',
    },
    list: {
        paddingHorizontal: 12,
        paddingBottom: 80,
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
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
    button: {
        backgroundColor: "#A67C52",
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },

});

