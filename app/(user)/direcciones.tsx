import BottomNav from '@/components/BottomNav';
import Footer from '@/components/footer';
import HeaderNav from '@/components/headerNav';
import { useAuth } from '@/context/authContext';
import { API_BASE_URL } from '@/utils/api';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Direccion = {
    id_direccion: number;
    telefono: string;
    direccion: string;
    ciudad: string;
    municipio: string;
    estado2: string;
    codigo_postal: string;
};

export default function DireccionesScreen() {
    const { usuario } = useAuth();
    const router = useRouter();
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!usuario || !usuario.id_usuario) return;

        fetch(`${API_BASE_URL}/direcciones/${usuario.id_usuario}`)
            .then(async (res) => {
                const text = await res.text();
                try {
                    const json = JSON.parse(text);
                    if (json.success) {
                        setDirecciones(json.direcciones);
                    }
                } catch (error) {
                    console.error('Respuesta no es JSON:', text);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error al obtener direcciones:', error);
                setLoading(false);
            });
    }, [usuario]);

    const renderItem = ({ item }: { item: Direccion }) => (
        <View style={styles.card}>
            <Text style={styles.label}>📍 Dirección:</Text>
            <Text style={styles.text}>{item.direccion}</Text>
            <Text style={styles.text}>{item.municipio}, {item.ciudad}, {item.estado2}</Text>
            <Text style={styles.text}>CP: {item.codigo_postal}</Text>
            <Text style={styles.text}>📞 {item.telefono}</Text>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push(`/(user)/editarDireccion/${item.id_direccion}`)}
                >
                    <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => router.push(`/(user)/pago`)}
                >
                    <Text style={styles.continueText}>Continuar</Text>
                </TouchableOpacity>
            </View>
        </View>

    );

    return (
        <View style={styles.container}>
            <HeaderNav />

            <View style={{ flex: 1 }}>
                <Text style={styles.title}>Mis direcciones</Text>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/(user)/nuevaDireccion')}
                >
                    <Text style={styles.addText}>➕ Agregar nueva dirección</Text>
                </TouchableOpacity>

                {loading ? (
                    <ActivityIndicator size="large" color="#A67C52" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={direcciones}
                        renderItem={renderItem}
                        keyExtractor={(item) => `${item.id_direccion}`}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={<Text style={styles.empty}>No tienes direcciones registradas.</Text>}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#020101ff',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 80,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    label: {
        fontWeight: '600',
        color: '#2f3e4bff',
        marginBottom: 4,
    },
    text: {
        fontSize: 15,
        color: '#333',
        marginBottom: 2,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 12,
        marginTop: 12,
    },

    editButton: {
        backgroundColor: '#10bbff',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
    },

    editText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 14,
    },

    continueButton: {
        backgroundColor: '#088327',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
    },

    continueText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 14,
    },

    addButton: {
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#088327',
        paddingVertical: 6,           // antes 12
        paddingHorizontal: 16,        // nuevo para controlar el ancho
        borderRadius: 8,              // antes 12
        alignItems: 'center',
        alignSelf: 'flex-start',      // evita que se estire al ancho completo
    },
    addText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 14,                 // antes 16
    },

    empty: {
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
        marginTop: 20,
    },
});
