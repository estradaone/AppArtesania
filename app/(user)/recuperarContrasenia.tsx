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

export default function RecuperarContraseñaScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEnviar = async () => {
        if (!email.trim()) {
            Alert.alert('Campo vacío', 'Por favor ingresa tu correo electrónico.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/sendResetTokenMovil`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert('Correo enviado', 'Revisa tu bandeja de entrada para restablecer tu contraseña.');
                setEmail('');
                router.push('/(user)/restablecerContrasenia');
            } else {
                Alert.alert('Error', data.message || 'No se pudo enviar el correo.');
            }
        } catch (error) {
            console.error('Error al enviar token:', error);
            Alert.alert('Error', 'Hubo un problema al enviar el correo.');
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
                <Text style={styles.title}>Recuperar contraseña</Text>
                <Text style={styles.subtitle}>Ingresa tu correo para recibir el enlace de recuperación</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <TouchableOpacity style={styles.button} onPress={handleEnviar} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Enviar enlace</Text>
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
