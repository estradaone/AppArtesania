import { API_BASE_URL, API_IMG_URL } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Producto = {
    id_producto: number;
    nombre_producto: string;
    descripcion?: string;
    precio: number;
    imagen_url: string;
};

type Props = {
    onClose: () => void;
    visible: boolean;
};

export default function ModalBusqueda({ onClose, visible }: Props) {
    const [termino, setTermino] = useState('');
    const [resultados, setResultados] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const buscarProductos = async (texto: string) => {
        const limpio = texto.trim().toLowerCase();
        setTermino(texto);

        if (limpio === '') {
            setResultados([]);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/buscarProductosMovil?search=${encodeURIComponent(limpio)}`);
            const data = await res.json();
            setResultados(Array.isArray(data) ? data : data.productos || []);
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Producto }) => (
        <View style={styles.card}>
            <Image source={{ uri: `${API_IMG_URL}/${item.imagen_url}` }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.nombre_producto}</Text>
                {item.descripcion && <Text style={styles.desc}>{item.descripcion}</Text>}
                <Text style={styles.price}>${item.precio}</Text>
                <TouchableOpacity
                    onPress={() => {
                        onClose();
                        setTimeout(() => {
                            router.push(`/(user)/detalleProducto/${item.id_producto}`);
                        }, 100);
                    }}
                    style={styles.btnSecondary}
                >
                    <Ionicons name="eye-outline" size={16} color="#fff" />
                    <Text style={styles.btnText}>Ver producto</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <Modal animationType="slide" transparent={false} visible={visible} onShow={() => setTermino('')}>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                >
                    <View style={styles.content}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="search-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Buscar productos..."
                                value={termino}
                                onChangeText={buscarProductos}
                            />
                        </View>

                        {loading ? (
                            <ActivityIndicator size="large" color="#A67C52" />
                        ) : (
                            <FlatList
                                data={resultados}
                                keyExtractor={(item) => item.id_producto.toString()}
                                renderItem={renderItem}
                                contentContainerStyle={
                                    resultados.length === 0 ? styles.emptyContainer : styles.listContainer
                                }
                                ListEmptyComponent={<Text style={styles.empty}>No se encontraron productos.</Text>}
                            />
                        )}
                    </View>

                    <TouchableOpacity style={styles.floatingCloseButton} onPress={onClose}>
                        <Ionicons name="close-outline" size={20} color="#fff" />
                        <Text style={styles.closeText}>Cerrar</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 24,
        paddingHorizontal: 16,
        backgroundColor: '#FDF6EC',
    },
    content: {
        flex: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 12,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
    },
    listContainer: {
        paddingBottom: 100,
    },
    emptyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    empty: {
        textAlign: 'center',
        color: '#999',
        fontSize: 15,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2,
    },
    image: { width: 100, height: 100 },
    info: { flex: 1, padding: 12 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#4B3F2F' },
    desc: { fontSize: 14, color: '#555' },
    price: { fontSize: 15, color: 'green', fontWeight: 'bold' },
    btnSecondary: {
        backgroundColor: '#A67C52',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    btnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    floatingCloseButton: {
        position: 'absolute',
        bottom: 24,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: '#A67C52',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        alignItems: 'center',
    },
    closeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 6,
    },
});
