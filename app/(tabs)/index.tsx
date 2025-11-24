import { useAuth } from '@/context/authContext';
import { useCarrito } from '@/context/carritoContext';
import { API_IMG_URL } from '@/utils/api';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import BottomNav from '../../components/BottomNav';
import Footer from '../../components/footer';
import HeaderNav from '../../components/headerNav';
import { useProductos } from '../../hooks/useProductos';

const { width: screenWidth } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Producto>);

type Producto = {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  imagen_url: string;
  nombre_categoria: string;
};

const carouselItems = [
  {
    title: 'Artesanía en barro',
    image: require('../../assets/images/carusel4.jpg'),
  },
  {
    title: 'Platos de barros',
    image: require('../../assets/images/carusel3.png'),
  },
  {
    title: 'Cestería natural',
    image: require('../../assets/images/img53.jpg'),
  },
];

export default function WelcomeScreen() {
  const { productos, loading, error } = useProductos();
  const { usuario } = useAuth();
  const { agregarAlCarrito } = useCarrito();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleAgregarCarrito = async (producto: Producto) => {
    if (!usuario) {
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión para agregar productos al carrito.',
        [
          { text: 'Ir al login', onPress: () => router.push('/(auth)/login') },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
      return;
    }

    try {
      await agregarAlCarrito({
        id_producto: producto.id_producto,
        nombre_producto: producto.nombre_producto,
        precio: producto.precio,
        imagen_url: producto.imagen_url,
        cantidad: 1,
      });

      Alert.alert('Producto agregado', `${producto.nombre_producto} se añadió al carrito.`);
    } catch (error) {
      console.error('Error al agregar producto:', error);
      Alert.alert('Error', 'No se pudo agregar el producto al carrito.');
    }
  };


  const renderCarouselItem = ({ item }: { item: any }) => (
    <View style={styles.carouselCard}>
      <Image source={item.image} style={styles.carouselImage} />
      <Text style={styles.carouselText}>{item.title}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Producto }) => {
    if (!item?.id_producto) return null;

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => router.push(`/detalleProducto/${item.id_producto}`)}>
          <Image
            source={{ uri: `${API_IMG_URL}/${item.imagen_url}` }}
            style={styles.image}
          />
        </TouchableOpacity>
        <Text style={styles.categoria}>{item.nombre_categoria}</Text>
        <Text style={styles.name}>{item.nombre_producto}</Text>
        <Text style={styles.price}>${item.precio}</Text>
        <TouchableOpacity style={styles.button} onPress={() => handleAgregarCarrito(item)}>
          <Text style={styles.buttonText}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>
    );
  };



  return (
    <View style={styles.container}>
      {/* ✅ Encabezado fijo */}
      <HeaderNav scrollY={scrollY} />

      {/* ✅ Contenido scrollable */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#A67C52" style={{ marginTop: 20 }} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <AnimatedFlatList
            data={productos}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id_producto || index}`}
            contentContainerStyle={styles.list}
            numColumns={2} // ✅ dos columnas
            columnWrapperStyle={styles.row} // ✅ espacio entre columnas
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            ListHeaderComponent={
              <>
                <View style={styles.carouselWrapper}>
                  <Carousel
                    width={screenWidth}
                    height={200}
                    autoPlay
                    autoPlayInterval={3000}
                    loop
                    pagingEnabled
                    data={carouselItems}
                    scrollAnimationDuration={1000}
                    renderItem={renderCarouselItem}
                  />
                </View>
                <Text style={styles.header}>Productos destacados</Text>
              </>
            }
            ListFooterComponent={<Footer />}
          />

        )}
      </View>

      {/* ✅ Pie de navegación fijo */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF6EC' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#4B3F2F', margin: 16 },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 80, // ✅ espacio para que no se tape con el BottomNav
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: '100%', height: 160, borderRadius: 12 },
  categoria: {
    fontSize: 14,
    color: '#A67C52',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 4,
  },
  name: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  price: { fontSize: 16, color: '#A67C52', marginBottom: 8 },
  button: {
    backgroundColor: '#A67C52',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { color: 'red', fontSize: 16, textAlign: 'center', marginTop: 20 },
  empty: { color: '#999', fontSize: 16, textAlign: 'center', marginTop: 20 },
  carouselWrapper: { marginTop: 12, alignItems: 'center' },
  carouselCard: {
    width: screenWidth * 0.9,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  carouselImage: { width: '100%', height: 140, borderRadius: 12 },
  carouselText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#4B3F2F',
    textAlign: 'center',
  },
});
