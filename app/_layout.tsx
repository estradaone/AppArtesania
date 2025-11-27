import { CarritoProvider } from '@/context/carritoContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../context/authContext';

export default function UserLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <CarritoProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false, // 👈 oculta el header en todas las pantallas dentro de (user)
            }}
          >
            {/* Si tienes pantallas específicas, puedes declararlas aquí */}
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="tienda" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </CarritoProvider>
    </AuthProvider>
  );
}
