import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Footer() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>FOOTER</Text>
            <Text style={styles.subtitle}>Redes sociales</Text>

            <View style={styles.icons}>
                <FontAwesome name="facebook" size={24} color="#333" />
                <FontAwesome name="instagram" size={24} color="#333" />
                <FontAwesome name="whatsapp" size={24} color="#333" />
                <FontAwesome name="envelope" size={24} color="#333" />
            </View>

            <View style={styles.links}>
                <TouchableOpacity><Text style={styles.link}>Nosotros</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.link}>Contacto</Text></TouchableOpacity>
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
    title: { fontWeight: 'bold', color: '#333', fontSize: 14 },
    subtitle: { color: '#666', marginBottom: 8 },
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
    link: { color: '#666', fontSize: 14 },
    legal: { fontSize: 12, color: '#999', textAlign: 'center' },
});
