import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { Button, Image, Linking, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

import BottomNav from '@/components/BottomNav';
import Footer from '@/components/footer';
import HeaderNav from '@/components/headerNav';

export default function CameraLiteScreen() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('📷 Cámara no activada');
    const [permisoCamara, setPermisoCamara] = useState<boolean | null>(null);
    const [permisoMicrofono, setPermisoMicrofono] = useState<boolean | null>(null);
    const [permisoGaleria, setPermisoGaleria] = useState<boolean | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        solicitarPermisos();
    }, []);

    const solicitarPermisos = async () => {
        const cam = await ImagePicker.requestCameraPermissionsAsync();
        const mic = await Audio.requestPermissionsAsync();
        const gal = await MediaLibrary.requestPermissionsAsync();

        setPermisoCamara(cam.granted);
        setPermisoMicrofono(mic.granted);
        setPermisoGaleria(gal.granted);

        if (cam.granted && mic.granted && gal.granted) {
            setStatus('✅ Todos los permisos concedidos');
            setModalVisible(false);
        } else {
            setStatus('⚠️ Permisos incompletos');
            setModalVisible(true);
        }
    };

    const abrirCamara = async () => {
        if (!permisoCamara || !permisoGaleria) {
            setStatus('❌ Permisos insuficientes');
            setModalVisible(true);
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
        });

        if (!resultado.canceled && resultado.assets.length > 0) {
            const uri = resultado.assets[0].uri;
            setImageUri(uri);
            setStatus('✅ Imagen capturada');

            // ✅ Guardar en galería
            await MediaLibrary.saveToLibraryAsync(uri);
        } else {
            setStatus('⚠️ Cámara cancelada');
        }
    };

    const getStatusColor = () => {
        if (status.includes('✅')) return '#4CAF50';
        if (status.includes('❌')) return '#F44336';
        if (status.includes('⚠️')) return '#FF9800';
        return '#333';
    };

    return (
        <View style={styles.container}>
            <HeaderNav />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.status, { color: getStatusColor() }]}>{status}</Text>

                <View style={styles.card}>
                    <Text style={styles.title}>Permisos de Cámara, Micrófono y Galería</Text>
                    <Text style={styles.permiso}>🎥 Cámara: {permisoCamara ? 'Permitido ✅' : 'Denegado ❌'}</Text>
                    <Text style={styles.permiso}>🎙️ Micrófono: {permisoMicrofono ? 'Permitido ✅' : 'Denegado ❌'}</Text>
                    <Text style={styles.permiso}>🖼️ Galería: {permisoGaleria ? 'Permitido ✅' : 'Denegado ❌'}</Text>

                    <View style={styles.buttonGroup}>
                        <Button title="Abrir cámara" onPress={abrirCamara} />
                        <View style={{ height: 10 }} />
                        <Button title="Revalidar permisos" onPress={solicitarPermisos} />
                    </View>
                </View>

                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                )}
            </ScrollView>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Permisos requeridos</Text>
                        <Text style={styles.modalText}>
                            Para usar la cámara correctamente, necesitas permitir acceso a la cámara, micrófono y galería.
                        </Text>
                        <Button title="Abrir configuración del sistema" onPress={() => Linking.openSettings()} />
                        <View style={{ height: 10 }} />
                        <Button title="Reintentar permisos" onPress={solicitarPermisos} />
                    </View>
                </View>
            </Modal>

            <Footer />
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDF6EC' },
    content: { padding: 20, alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#4B3F2F' },
    status: { fontSize: 16, marginBottom: 20 },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    permiso: { fontSize: 16, marginBottom: 10, color: '#555' },
    image: { width: 300, height: 400, borderRadius: 12, marginBottom: 20 },
    buttonGroup: { width: '100%', marginTop: 10 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    modalText: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#333' },
});
