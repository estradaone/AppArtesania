import BottomNav from '@/components/BottomNav';
import Footer from '@/components/footer';
import HeaderNav from '@/components/headerNav';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function NosotrosScreen() {
    return (
        <View style={styles.container}>
            <HeaderNav />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>MARKPLACES - ARTESANÍA LOCAL</Text>

                {/* Sección Misión */}
                <View style={styles.section}>
                    <Image
                        source={require('../../assets/images/logo2.jpg')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.sectionTitle}>🎯 Misión</Text>
                    <Text style={styles.paragraph}>
                        Proporcionar una plataforma digital inclusiva y segura que permita a los artesanos locales comercializar sus productos de manera justa, garantizando el respeto por la propiedad intelectual, la cultura y la tradición artesanal.
                    </Text>
                </View>

                {/* Sección Visión */}
                <View style={styles.section}>
                    <Image
                        source={require('../../assets/images/logo2.jpg')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.sectionTitle}>🌟 Visión</Text>
                    <Text style={styles.paragraph}>
                        Ser líder en la promoción y venta de artesanías locales, reconocida por su compromiso con la equidad, la sostenibilidad y la protección de los derechos de los artesanos, así como por la calidad excepcional y autenticidad de nuestros productos artesanales.
                    </Text>
                </View>

                {/* Sección Valores */}
                <View style={styles.section}>
                    <Image
                        source={require('../../assets/images/logo2.jpg')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.sectionTitle}>💎 Valores</Text>
                    <Text style={styles.paragraph}>
                        Respeto: Se valora la riqueza cultural y la creatividad única de cada artesano, fomentando un entendimiento común de nuestras tradiciones.
                    </Text>
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
        paddingBottom: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4B3F2F',
        textAlign: 'center',
        marginVertical: 24,
    },
    section: {
        marginBottom: 32,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#A67C52',
        marginBottom: 8,
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#4B3F2F',
        textAlign: 'justify',
    },
    logo: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginBottom: 12,
    },
});
