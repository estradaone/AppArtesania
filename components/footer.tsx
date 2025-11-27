import { FontAwesome } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Footer() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Redes sociales</Text>

            <View style={styles.icons}>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/soluciones.hadik')}>
                    <FontAwesome name="facebook" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/soluciones_hadik')}>
                    <FontAwesome name="instagram" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/529932802311')}>
                    <FontAwesome name="whatsapp" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:solucioneshadik@gmail.com')}>
                    <FontAwesome name="envelope" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.links}>
                <TouchableOpacity onPress={() => router.push('/(user)/nosotros')}>
                    <Text style={styles.link}>Nosotros</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(user)/ayuda')}>
                    <Text style={styles.link}>¿Te ayudamos?</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.legal}>© Tu tienda 2025. © Todos los derechos reservados</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF5E8',
        paddingVertical: 16,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    subtitle: { fontWeight: 'bold', color: '#333', fontSize: 14, marginBottom: 8 },
    icons: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 12,
    },
    links: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 8,
    },
    link: {
        fontSize: 14,
        color: '#4B3F2F',
        textDecorationLine: 'underline',
    },
    legal: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 8 },
});
