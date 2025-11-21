import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Footer from '../../components/footer';
import HeaderNav from '../../components/headerNav';
import { useAuth } from '../../context/authContext';
import { API_BASE_URL } from '../../utils/api';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState({ correo: false, contrasena: false });
    const [ultimoNombre, setUltimoNombre] = useState<string | null>(null);

    //  Recuperar datos del último login
    useEffect(() => {
        const cargarUltimaSesion = async () => {
            try {
                const data = await AsyncStorage.getItem('ultimoLogin');
                if (data) {
                    const ultimo = JSON.parse(data);
                    setCorreo(ultimo.email); // ✅ autocompleta el correo
                    setUltimoNombre(ultimo.nombre); // ✅ muestra saludo
                }
            } catch (error) {
                console.error('Error al cargar última sesión:', error);
            }
        };
        cargarUltimaSesion();
    }, []);
    const validarEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLogin = async () => {
        const camposVacios = {
            correo: correo.trim() === '',
            contrasena: contrasena.trim() === '',
        };

        const correoInvalido = !validarEmail(correo.trim());

        setErrores({
            correo: camposVacios.correo || correoInvalido,
            contrasena: camposVacios.contrasena
        });

        if (camposVacios.correo || correoInvalido || camposVacios.contrasena) {
            console.log('Correo Inválido, intente de nuevo');
            Alert.alert(
                'Campos inválidos',
                correoInvalido
                    ? 'Por favor ingresa un correo electrónico válido.'
                    : 'Por favor ingresa tu correo y contraseña'
            );
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: correo,
                password: contrasena,
            });

            const usuario = response.data.usuario;

            await login(usuario); // ✅ Guarda en contexto y Shared Preferences
            console.log('Login iniciado correctamente');
            Alert.alert('Bienvenido', `Hola ${usuario.nombre}`);
            router.replace('/(user)/tienda');
        } catch (error: unknown) {
            const response = (error as any)?.response;
            const status = response?.status;
            const mensaje = response?.data?.error;

            if (status === 403 && mensaje === 'Cuenta suspendida') {
                console.log('Cuenta suspendida por el administrador');
                Alert.alert('Acceso denegado', 'Tu cuenta está suspendida.');
            } else if (status === 401) {
                Alert.alert('Error de acceso', 'Credenciales inválidas.');
            } else {
                console.log('No se puede acceder al sistema');
                Alert.alert('Error', 'No se pudo conectar con el servidor.');
            }

            console.error('Error en login:', error);
        } finally {
            setLoading(false);
        }
    };


    return (

        <View style={styles.container}>
            <HeaderNav />

            <View style={styles.content}>
                {ultimoNombre && (
                    <Text style={styles.saludo}>Bienvenido de nuevo, {ultimoNombre}</Text>
                )}
                <Text style={styles.title}>Iniciar Sesión</Text>

                <TextInput
                    style={[styles.input, errores.correo && styles.inputError]}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#999"
                    value={correo}
                    onChangeText={setCorreo}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={[styles.input, errores.contrasena && styles.inputError]}
                    placeholder="Contraseña"
                    placeholderTextColor="#999"
                    value={contrasena}
                    onChangeText={setContrasena}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/(user)/recuperarContrasenia')}>
                    <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/(auth)/registrar')}>
                    <Text style={styles.link}>¿No tienes cuenta? Registrarse</Text>
                </TouchableOpacity>
            </View>

            <Footer />
        </View>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDF6EC' },
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
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    inputError: {
        borderColor: 'red',
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
    link: {
        marginTop: 12,
        textAlign: 'center',
        color: '#4B3F2F',
        fontSize: 15,
        textDecorationLine: 'underline',
    },
    saludo: {
        fontSize: 16,
        color: '#4B3F2F',
        textAlign: 'center',
        marginBottom: 12,
    },

});
