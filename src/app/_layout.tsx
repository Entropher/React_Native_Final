import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';

import { Colors } from '@/constants/theme';
import { restoreAndPersistCart } from '@/store/cart-storage';
import { store } from '@/store/store';

// Runs once when the app starts (module code runs a single time, unlike a component).
restoreAndPersistCart();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.brand },
          headerTintColor: '#fff',
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: Colors.page },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ title: 'დეტალები' }} />
        <Stack.Screen name="register" options={{ title: 'რეგისტრაცია' }} />
      </Stack>
    </Provider>
  );
}
