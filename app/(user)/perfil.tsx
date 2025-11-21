import BottomNav from "@/components/BottomNav";
import Footer from "@/components/footer";
import HeaderNav from "@/components/headerNav";
import { useAuth } from "@/context/authContext";
import { API_BASE_URL } from "@/utils/api";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PeriflScreen() {
    const { usuario} = useAuth();
    const id_usuario = usuario?.id_usuario;
    const [ nombre, setNombre ] = useState('')
    const [ apellidos, setApellidos ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ estado, setEstado ] = useState('');
    const [ rol, setRol ] = useState('');

    useEffect(() => {
        if (!usuario) return;

        const cargarPerfil = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/verPerfilMovil`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_usuario: usuario.id_usuario }),
                });
                const data = await response.json();
                if (data.success) {
                    const usuario = data.usuario;
                    setNombre(usuario.nombre);
                    setApellidos(usuario.apellidos);
                    setEmail(usuario.email);
                    setEstado(usuario.estado);
                    setRol(usuario.rol);
                } else {
                    Alert.alert('Error', 'No se pudo cargar el perfil');
                }
            } catch (error) {
                console.error('Error al cargar perfil:', error);
                Alert.alert('Error', 'Hubo un problema al cargar el perfil');
            }
        };

        cargarPerfil();
    }, [usuario]);

    const handleGuardar = async () => {
        if(!usuario) return;
        try {
            const response = await fetch(`${API_BASE_URL}/actualizarPerfilMovil`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario: usuario.id_usuario, nombre, apellidos, email }),
            });
            const data = await response.json();
            if(data.success) {
                Alert.alert('Exito', 'Perfil actualizado correctamente');
            } else {
                Alert.alert('Error', 'No se pudo actualizar el perfil');
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            Alert.alert('Error', 'Hubo un problema al guardar los cambios');
        }
    };

    return(
        <View style={styles.container}>
            <HeaderNav />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Mi Perfil</Text>

                <View style={styles.field}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Apellidos</Text>
                    <TextInput style={styles.input} value={apellidos} onChangeText={setApellidos} />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Estado de cuenta</Text>
                    <Text style={styles.staticText}>{estado}</Text>
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Rol</Text>
                    <Text style={styles.staticText}>{rol}</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleGuardar}>
                    <Text style={styles.buttonText}>Guardar cambios</Text>
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
    content: {
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4B3F2F',
        marginBottom: 24,
        textAlign: 'center',
    },
    field: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#A67C52',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#FFF',
        borderColor: '#A67C52',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        color: '#4B3F2F',
    },
    staticText: {
        fontSize: 16,
        color: '#4B3F2F',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FFF8F0',
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#A67C52',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 32,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});