import BottomNav from '@/components/BottomNav';
import Footer from '@/components/footer';
import HeaderNav from '@/components/headerNav';
import { API_BASE_URL } from '@/utils/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditarDireccionScreen() {
    const { id_direccion } = useLocalSearchParams();
    const router = useRouter();
    const [form, setForm] = useState({
        telefono: '',
        direccion: '',
        ciudad: '',
        municipio: '',
        estado2: '',
        codigo_postal: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/direccion/${id_direccion}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const d = data.direccion;
                    setForm({
                        telefono: d.telefono,
                        direccion: d.direccion,
                        ciudad: d.ciudad,
                        municipio: d.municipio,
                        estado2: d.estado2,
                        codigo_postal: d.codigo_postal,
                    });
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error al cargar dirección:', error);
                setLoading(false);
            });
    }, [id_direccion]);

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleActualizar = () => {
        fetch(`${API_BASE_URL}/direccion/${id_direccion}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    Alert.alert('Dirección actualizada');
                    router.push('/(user)/direcciones');
                } else {
                    Alert.alert('Error', data.message || 'No se pudo actualizar');
                }
            })
            .catch((error) => {
                console.error('Error al actualizar dirección:', error);
                Alert.alert('Error de red');
            });
    };

    return (
        <View style={styles.container}>
            <HeaderNav />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Editar dirección</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#A67C52" style={{ marginTop: 20 }} />
                ) : (
                    <>
                        {['telefono', 'direccion', 'ciudad', 'municipio', 'estado2', 'codigo_postal'].map((field) => (
                            <TextInput
                                key={field}
                                style={styles.input}
                                placeholder={field.replace('_', ' ').toUpperCase()}
                                value={form[field as keyof typeof form]}
                                onChangeText={(text) => handleChange(field, text)}
                            />
                        ))}

                        <TouchableOpacity style={styles.button} onPress={handleActualizar}>
                            <Text style={styles.buttonText}>Actualizar dirección</Text>
                        </TouchableOpacity>

                        <Footer />
                    </>
                )}
            </ScrollView>
            <BottomNav />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF6EC',
    },
    scroll: {
        padding: 16,
        paddingBottom: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000ff',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#088327ff',
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
});
