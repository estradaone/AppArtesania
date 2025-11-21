import { useCarrito } from '@/context/carritoContext';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();
    const { carrito } = useCarrito();

    return (

        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.push('/')}>
                <Ionicons
                    name="home-outline"
                    size={24}
                    color={pathname === '/' ? '#4B7FBF' : '#999'}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(user)/carrito')}>
                <Ionicons
                    name="cart-outline"
                    size={24}
                    color={pathname.includes('/carrito') ? '#4B7FBF' : '#999'}
                />
                {carrito.length > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{carrito.length}</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(user)/tienda')}>
                <Ionicons
                    name="storefront-outline" // ✅ actualizado
                    size={24}
                    color={pathname.includes('/tienda') ? '#4B7FBF' : '#999'}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        height: 60,
        backgroundColor: '#FFF5E8',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    iconWrapper: {
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#D94F70',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 1,
        minWidth: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },


});
