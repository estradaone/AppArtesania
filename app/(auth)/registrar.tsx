import { useAuth } from '@/context/authContext';
import { API_BASE_URL } from '@/utils/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function RegistrarScreen() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState({
        nombre: false,
        apellido: false,
        correo: false,
        contrasena: false,
    });

    const router = useRouter();
    const { login } = useAuth(); // ✅ usa login del contexto

    // 🔎 Validaciones
    const validarEmail = (email: string): boolean =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const validarNombre = (texto: string): boolean =>
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(texto.trim());

    const validarContrasena = (texto: string): boolean =>
        texto.trim().length >= 6;

    const handleRegistro = async () => {
        const camposVacios = {
            nombre: nombre.trim() === '',
            apellido: apellido.trim() === '',
            correo: correo.trim() === '',
            contrasena: contrasena.trim() === '',
        };

        const nombreInvalido = !validarNombre(nombre);
        const apellidoInvalido = !validarNombre(apellido);
        const correoInvalido = !validarEmail(correo);
        const contrasenaInvalida = !validarContrasena(contrasena);

        setErrores({
            nombre: camposVacios.nombre || nombreInvalido,
            apellido: camposVacios.apellido || apellidoInvalido,
            correo: camposVacios.correo || correoInvalido,
            contrasena: camposVacios.contrasena || contrasenaInvalida,
        });

        if (Object.values(camposVacios).some((v) => v)) {
            Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
            return;
        }

        if (nombreInvalido || apellidoInvalido) {
            Alert.alert('Nombre inválido', 'El nombre y apellido deben contener solo letras.');
            return;
        }

        if (correoInvalido) {
            Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido.');
            return;
        }

        if (contrasenaInvalida) {
            Alert.alert('Contraseña inválida', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/registrarUsuario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    apellidos: apellido,
                    email: correo,
                    password: contrasena,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 409) {
                    setErrores((prev) => ({ ...prev, correo: true }));
                    Alert.alert('Correo duplicado', 'Este correo ya está registrado.');
                } else {
                    Alert.alert('Error', data.error || 'No se pudo registrar.');
                }
                setLoading(false);
                return;
            }

            const usuario = data.usuario;

            if (!usuario || !usuario.id_usuario) {
                console.error('Respuesta inesperada del servidor:', data);
                Alert.alert('Error', 'No se recibió información del usuario.');
                setLoading(false);
                return;
            }

            await login({
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                estado: usuario.estado,
            });

            router.replace('/');
        } catch (error) {
            console.error('Error en registro:', error);
            Alert.alert('Error', 'Hubo un problema al registrar. Intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <HeaderNav />
            <View style={styles.content}>
                <Text style={styles.title}>Crear Cuenta</Text>

                <TextInput
                    style={[styles.input, errores.nombre && styles.inputError]}
                    placeholder="Nombre"
                    placeholderTextColor="#999"
                    value={nombre}
                    onChangeText={setNombre}
                />
                <TextInput
                    style={[styles.input, errores.apellido && styles.inputError]}
                    placeholder="Apellido"
                    placeholderTextColor="#999"
                    value={apellido}
                    onChangeText={setApellido}
                />
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

                <TouchableOpacity style={styles.button} onPress={handleRegistro} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Registrarse</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text style={styles.link}>¿Ya tienes una cuenta? Inicia sesión</Text>
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
});
