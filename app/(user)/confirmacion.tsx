import BottomNav from '@/components/BottomNav';
import HeaderNav from '@/components/headerNav';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ConfirmacionScreen() {
    const router = useRouter();
    const [pedido, setPedido] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Simulación de carga del pedido (puedes reemplazar con fetch real si tienes el id_pedido)
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPedido(Math.floor(Math.random() * 1000000)); // número de seguimiento simulado
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={styles.container}>
            <HeaderNav />
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color="#A67C52" />
                ) : (
                    <>
                        <Text style={styles.title}>🎉 ¡Gracias por tu compra!</Text>
                        <Text style={styles.subtitle}>Tu pedido ha sido registrado correctamente.</Text>
                        <Text style={styles.tracking}>Número de seguimiento:</Text>
                        <Text style={styles.code}>#{pedido}</Text>

                        
                        <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
                            <Text style={styles.buttonText}>Volver al inicio</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.push('/(user)/misCompras')}>
                            <Text style={styles.buttonText}>Ver compra</Text>
                        </TouchableOpacity>
                    </>
                    
                )}
            </View>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#D94F70',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    tracking: {
        fontSize: 14,
        color: '#555',
    },
    code: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#A67C52',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#088327',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    secondaryButton: {
        backgroundColor: '#A67C52',
        marginTop: 12,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
