import { useCarrito } from '@/context/carritoContext';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/authContext';
import ModalBusqueda from './modals/modalBusqueda';

const screenHeight = Dimensions.get('window').height;

export default function HeaderNav({ scrollY }: { scrollY?: Animated.Value }) {
    const router = useRouter();
    const pathname = usePathname();
    const { usuario, logout, isLoading } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [visible, setVisible] = useState(true);
    const [modalBusquedaVisible, setModalBusquedaVisible] = useState(false);
    const translateY = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const categorias = [
        { label: '🪄 Accesorios', route: '/(user)/categorias/accesorios' },
        { label: '👜 Bolsos', route: '/(user)/categorias/bolsos' },
        { label: '👒 Sombreros', route: '/(user)/categorias/sombreros' },
        { label: '👚 Blusas', route: '/(user)/categorias/blusas' },
        { label: '🧸 Peluches', route: '/(user)/categorias/peluches' },
        { label: '🖇️ Llaveros', route: '/(user)/categorias/llaveros' },
    ];

    useEffect(() => {
        if (!scrollY) return;
        let lastY = 0;

        const listenerId = scrollY.addListener(({ value }) => {
            if (value > lastY && value > 50 && visible) {
                Animated.timing(translateY, {
                    toValue: -80,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
                setVisible(false);
            } else if (value < lastY && !visible) {
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
                setVisible(true);
            }
            lastY = value;
        });

        return () => {
            scrollY.removeListener(listenerId);
        };
    }, [scrollY, visible]);

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: showMenu ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [showMenu]);

    const goToHome = () => router.push('/');
    const goBack = () => router.back();
    const { vaciarCarrito } = useCarrito();
    const cerrarSesion = async () => {
        await vaciarCarrito();        //  limpia el carrito en contexto
        await logout();         //  espera a que se borre la sesión
        router.replace('/');    //  redirige al home sin dejar rastro en el stack
    };


    const translateYMenu = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-screenHeight, 0],
    });

    const opacityMenu = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const { carrito } = useCarrito();

    return (
        <View style={styles.wrapper}>
            <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
                <SafeAreaView>
                    <View style={styles.navBar}>
                        <View style={styles.leftIcons}>
                            {pathname !== '/' && (
                                <TouchableOpacity style={styles.icon} onPress={goBack}>
                                    <Ionicons name="arrow-back-outline" size={24} color="#fff" />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.icon} onPress={() => setShowMenu(true)}>
                                <Ionicons name="menu-outline" size={26} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={goToHome}>
                            <Image source={require('../assets/images/logoBuena.png')} style={styles.logo} />
                        </TouchableOpacity>

                        <View style={styles.right}>
                            <TouchableOpacity style={styles.icon} onPress={() => setModalBusquedaVisible(true)}>
                                <Ionicons name="search-outline" size={22} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.icon} onPress={() => router.push('/(user)/carrito')}>
                                {carrito.length > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{carrito.length}</Text>
                                    </View>
                                )}
                                <Ionicons name="cart-outline" size={22} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Animated.View>

            {/* Menú desplegable */}
            <Animated.View
                style={[
                    styles.menuOverlay,
                    {
                        transform: [{ translateY: translateYMenu }],
                        opacity: opacityMenu,
                        pointerEvents: showMenu ? 'auto' : 'none',
                        minHeight: screenHeight,
                    },
                ]}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={styles.menuContent}>
                            <TouchableOpacity style={styles.closeIcon} onPress={() => setShowMenu(false)}>
                                <Ionicons name="close-outline" size={28} color="#FFF8E7" />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={goToHome}>
                                <Text style={styles.menuItem}>🏠 Inicio</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/(user)/tienda')}>
                                <Text style={styles.menuItem}>🛍️ Tienda</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/screens/cameraLiteScreen')}>
                                <Text style={styles.menuItem}> Permisos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/(user)/nosotros')}>
                                <Text style={styles.menuItem}>👥 Nosotros</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/(user)/ayuda')}>
                                <Text style={styles.menuItem}>¿Te ayudamos?</Text>
                            </TouchableOpacity>

                            {!isLoading && usuario && (
                                <>
                                    <TouchableOpacity onPress={() => router.push('/(user)/misCompras')}>
                                        <Text style={styles.menuItem}>📦 Mis compras</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => router.push('/(user)/perfil')}>
                                        <Text style={styles.menuItem}>👤 Mi cuenta</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            <Text style={styles.menuTitle}>🎨 Categorías</Text>
                            {categorias.map((cat) => (
                                <TouchableOpacity
                                    key={cat.route}
                                    onPress={() => {
                                        router.push(cat.route);
                                        setShowMenu(false);
                                    }}
                                >
                                    <Text style={styles.menuItem}>{cat.label}</Text>
                                </TouchableOpacity>
                            ))}

                            {usuario && (
                                <TouchableOpacity onPress={cerrarSesion}>
                                    <Text style={[styles.menuItem, { color: '#ffdddd' }]}>🚪 Cerrar sesión</Text>
                                </TouchableOpacity>
                            )}

                            {!usuario && (
                                <>
                                    <Text style={styles.menuTitle}>👤 Mi cuenta</Text>
                                    <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                        <Text style={styles.menuItem}>🔐 Acceso</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => router.push('/(auth)/registrar')}>
                                        <Text style={styles.menuItem}>📝 Registro</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Animated.View>

            <ModalBusqueda
                onClose={() => setModalBusquedaVisible(false)}
                visible={modalBusquedaVisible}
            />



        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        zIndex: 100,
    },
    container: {
        backgroundColor: '#4B7FBF',
        zIndex: 10,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 10,
        height: 60,
    },
    leftIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
        backgroundColor: 'transparent',
    },
    right: {
        flexDirection: 'row',
        gap: 12,
    },
    icon: {
        padding: 4,
    },
    menuOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '70%',
        height: '100%',
        backgroundColor: 'rgba(75, 127, 191, 0.85)',
        zIndex: 9999,
        paddingHorizontal: 30,
        // paddingTop: 10,
        paddingBottom: 30,
        borderRightWidth: 1,
        borderColor: '#FFF8E7',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    menuContent: {
        paddingBottom: 40,
    },
    closeIcon: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    menuItem: {
        fontSize: 20,
        color: '#FFF8E7',
        fontWeight: 'bold',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: '#FFF8E7',
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    menuTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF8E7',
        marginTop: 24,
        marginBottom: 12,
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    //Carrito
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