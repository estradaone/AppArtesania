import BottomNav from '@/components/BottomNav';
import Footer from '@/components/footer';
import HeaderNav from '@/components/headerNav';
import { useAuth } from '@/context/authContext';
import { API_BASE_URL } from '@/utils/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function NuevaDireccionScreen() {
    const { usuario } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        telefono: '',
        direccion: '',
        ciudad: '',
        municipio: '',
        estado2: '',
        codigo_postal: '',
    });

    const placeholders: Record<keyof typeof form, string> = {
        telefono: 'Teléfono',
        direccion: 'Calle',
        ciudad: 'Ciudad',
        municipio: 'Municipio',
        estado2: 'Estado',
        codigo_postal: 'Código postal',
    };

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleGuardar = () => {
        if (!usuario) {
            Alert.alert('Sesión inválida', 'Debes iniciar sesión para guardar una dirección.');
            return;
        }

        fetch(`${API_BASE_URL}/direccionNueva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: usuario.id_usuario, ...form }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    Alert.alert('Dirección guardada correctamente');
                    router.push('/(user)/direcciones');
                } else {
                    Alert.alert('Error', data.message || 'No se pudo guardar la dirección');
                }
            })
            .catch((error) => {
                console.error('Error al guardar dirección:', error);
                Alert.alert('Error de red');
            });
    };

    return (
        <View style={styles.container}>
            <HeaderNav />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Agregar nueva dirección</Text>

                {(Object.keys(form) as (keyof typeof form)[]).map((field) => (
                    <TextInput
                        key={field}
                        style={styles.input}
                        placeholder={placeholders[field]}
                        placeholderTextColor="#999"
                        value={form[field]}
                        onChangeText={(text) => handleChange(field, text)}
                    />
                ))}

                <TouchableOpacity style={styles.button} onPress={handleGuardar}>
                    <Text style={styles.buttonText}>Guardar dirección</Text>
                </TouchableOpacity>

                <Footer />
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
