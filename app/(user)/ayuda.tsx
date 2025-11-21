import BottomNav from '@/components/BottomNav';
import Footer from '@/components/footer';
import HeaderNav from '@/components/headerNav';
import { API_BASE_URL } from '@/utils/api';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ContactoScreen() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [asunto, setAsunto] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleEnviar = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/enviarMensajeMovil`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, email, asunto, mensaje }),
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert('Éxito', 'Tu mensaje ha sido enviado');
                setNombre('');
                setEmail('');
                setAsunto('');
                setMensaje('');
            } else {
                Alert.alert('Error', 'No se pudo enviar el mensaje');
            }
        } catch (error) {
            console.error('Error al enviar:', error);
            Alert.alert('Error', 'Hubo un problema al enviar tu mensaje');
        }
    };

    return (
        <View style={styles.container}>
            <HeaderNav />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>¿Te ayudamos?</Text>
                <Text style={styles.subtitle}>Envíanos un mensaje</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    placeholderTextColor="#A67C52"
                    value={nombre}
                    onChangeText={setNombre}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    placeholderTextColor="#A67C52"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Asunto"
                    placeholderTextColor="#A67C52"
                    value={asunto}
                    onChangeText={setAsunto}
                />
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Mensaje"
                    multiline
                    numberOfLines={4}
                    placeholderTextColor="#A67C52"
                    value={mensaje}
                    onChangeText={setMensaje}
                />

                <TouchableOpacity style={styles.button} onPress={handleEnviar}>
                    <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>

                <View style={styles.details}>
                    <Text style={styles.detailsTitle}>📍 Detalles de contacto</Text>
                    <Text style={styles.detailsText}>3 de Octubre, 7a Avenida Poniente Sur</Text>
                    <Text style={styles.detailsText}>Rayón, Chiapas, Pueblo de Rayón</Text>
                    <Text style={styles.detailsText}>C.P. 29740</Text>
                    <Text style={styles.detailsText}>📞 +52 9938032111 / +52 9938032113</Text>
                    <Text style={styles.detailsText}>✉️ marketplacelocal@gmail.com</Text>
                </View>

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
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#A67C52',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#FFF',
        borderColor: '#A67C52',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        color: '#4B3F2F',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#A67C52',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 32,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    details: {
        backgroundColor: '#FFF8F0',
        padding: 16,
        borderRadius: 12,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4B3F2F',
        marginBottom: 12,
    },
    detailsText: {
        fontSize: 14,
        color: '#4B3F2F',
        marginBottom: 6,
    },
});
