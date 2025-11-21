import Footer from '@/components/footer';
import HeaderNav from '@/components/headerNav';
import { API_BASE_URL } from '@/utils/api';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RestablecerContraseñaScreen() {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRestablecer = async () => {
        if (!token.trim() || !newPassword.trim()) {
            Alert.alert('Campos incompletos', 'Por favor ingresa el token y la nueva contraseña.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/resetPasswordMovil`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert('Éxito', 'Tu contraseña ha sido actualizada. Ya puedes iniciar sesión.');
                setToken('');
                setNewPassword('');
                router.push('/(auth)/login');
            } else {
                Alert.alert('Error', data.message || 'No se pudo actualizar la contraseña.');
            }
        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            Alert.alert('Error', 'Hubo un problema al actualizar la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <HeaderNav />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.content}
            >
                <Text style={styles.title}>Restablecer contraseña</Text>
                <Text style={styles.subtitle}>Pega el token recibido y escribe tu nueva contraseña</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Token"
                    placeholderTextColor="#999"
                    value={token}
                    onChangeText={setToken}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Nueva contraseña"
                    placeholderTextColor="#999"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleRestablecer} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Actualizar contraseña</Text>
                    )}
                </TouchableOpacity>
            </KeyboardAvoidingView>

            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF6EC',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4B3F2F',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#A67C52',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#A67C52',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
