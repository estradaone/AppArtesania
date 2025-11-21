import BottomNav from '@/components/BottomNav';
import HeaderNav from '@/components/headerNav';
import { useAuth } from '@/context/authContext';
import { useCarrito } from '@/context/carritoContext';
import { API_BASE_URL } from '@/utils/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PagoScreen() {
    const router = useRouter();
    const { id_direccion } = useLocalSearchParams();
    const { usuario } = useAuth();
    const { carrito, cargarCarrito } = useCarrito(); // ✅ ahora también usamos cargarCarrito

    const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'paypal'>('tarjeta');
    const [form, setForm] = useState({
        nombre: '',
        correo: '',
        direccion: '',
        ciudad: '',
        estado: '',
        codigo_postal: '',
        nombre_tarjeta: '',
        numero_tarjeta: '',
        mes: '',
        año: '',
        cvv: '',
    });

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handlePagoPaypal = async () => {
        if (!usuario || !usuario.id_usuario) {
            Alert.alert('Sesión inválida', 'Debes iniciar sesión para continuar con la compra.');
            return;
        }

        if (carrito.length === 0) {
            Alert.alert('Carrito vacío', 'Agrega productos antes de pagar.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/finalizar-compra`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    carrito,
                    metodo_pago: 'PayPal',
                }),
            });

            const result = await response.json();

            if (result.success) {
                await cargarCarrito(); // ✅ actualiza la vista del carrito
                Alert.alert('Pago exitoso', 'Gracias por tu compra');
                router.push('/(user)/confirmacion');
            } else {
                Alert.alert('Error', result.message || 'No se pudo registrar la compra');
            }
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            Alert.alert('Error de red');
        }
    };

    const handlePagoTarjeta = async () => {
        if (!usuario || !usuario.id_usuario) {
            Alert.alert('Sesión inválida', 'Debes iniciar sesión para continuar con la compra.');
            return;
        }

        if (carrito.length === 0) {
            Alert.alert('Carrito vacío', 'Agrega productos antes de pagar.');
            return;
        }

        // Aquí podrías validar los campos de tarjeta antes de continuar

        try {
            const response = await fetch(`${API_BASE_URL}/finalizar-compra`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    carrito,
                    metodo_pago: 'Tarjeta',
                }),
            });

            const result = await response.json();

            if (result.success) {
                await cargarCarrito(); // ✅ actualiza la vista del carrito
                Alert.alert('Pago exitoso', 'Gracias por tu compra');
                router.push('/(user)/confirmacion');
            } else {
                Alert.alert('Error', result.message || 'No se pudo registrar la compra');
            }
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            Alert.alert('Error de red');
        }
    };

    return (
        <View style={styles.container}>
            <HeaderNav />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Dirección de facturación</Text>

                {['nombre', 'correo', 'direccion', 'ciudad', 'estado', 'codigo_postal'].map((field) => (
                    <TextInput
                        key={field}
                        style={styles.input}
                        placeholder={field.replace('_', ' ').toUpperCase()}
                        value={form[field as keyof typeof form]}
                        onChangeText={(text) => handleChange(field as keyof typeof form, text)}
                    />
                ))}

                <Text style={styles.title}>Método de pago</Text>

                <View style={styles.selector}>
                    <TouchableOpacity
                        style={[styles.option, metodoPago === 'tarjeta' && styles.optionSelected]}
                        onPress={() => setMetodoPago('tarjeta')}
                    >
                        <Text style={styles.optionText}>Tarjeta de crédito</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.option, metodoPago === 'paypal' && styles.optionSelected]}
                        onPress={() => setMetodoPago('paypal')}
                    >
                        <Text style={styles.optionText}>PayPal</Text>
                    </TouchableOpacity>
                </View>

                {metodoPago === 'tarjeta' ? (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre en la tarjeta"
                            value={form.nombre_tarjeta}
                            onChangeText={(text) => handleChange('nombre_tarjeta', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Número de tarjeta"
                            keyboardType="numeric"
                            value={form.numero_tarjeta}
                            onChangeText={(text) => handleChange('numero_tarjeta', text)}
                        />
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, styles.smallInput]}
                                placeholder="Mes"
                                keyboardType="numeric"
                                value={form.mes}
                                onChangeText={(text) => handleChange('mes', text)}
                            />
                            <TextInput
                                style={[styles.input, styles.smallInput]}
                                placeholder="Año"
                                keyboardType="numeric"
                                value={form.año}
                                onChangeText={(text) => handleChange('año', text)}
                            />
                            <TextInput
                                style={[styles.input, styles.smallInput]}
                                placeholder="CVV"
                                keyboardType="numeric"
                                value={form.cvv}
                                onChangeText={(text) => handleChange('cvv', text)}
                            />
                        </View>
                        <TouchableOpacity style={styles.payButton} onPress={handlePagoTarjeta}>
                            <Text style={styles.payText}>Proceder al pago</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.paypalButton} onPress={handlePagoPaypal}>
                        <Text style={styles.paypalText}>PayPal Pagar</Text>
                        <Text style={styles.subtext}>La forma rápida y segura de pagar</Text>
                    </TouchableOpacity>
                )}
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
    scroll: {
        padding: 16,
        paddingBottom: 80,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#D94F70',
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    selector: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    option: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#eee',
        alignItems: 'center',
    },
    optionSelected: {
        backgroundColor: '#A67C52',
    },
    optionText: {
        color: '#333',
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    smallInput: {
        flex: 1,
    },
    paypalButton: {
        backgroundColor: '#0070ba',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    paypalText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    subtext: {
        color: '#fff',
        fontSize: 12,
        marginTop: 4,
    },
    payButton: {
        backgroundColor: '#088327',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
    },
    payText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
