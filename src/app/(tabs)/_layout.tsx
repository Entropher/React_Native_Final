import { House, ShoppingCart, UserRound, UserRoundPlus } from 'lucide-react-native';
import { Tabs } from 'expo-router/js-tabs';

import { Colors } from '@/constants/theme';
import { selectCartItemCount } from '@/store/cart-slice';
import { useAppSelector } from '@/store/store';

export default function TabLayout() {
  const cartItemCount = useAppSelector(selectCartItemCount);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.brand },
        headerTintColor: '#fff',
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: '#292929',
        sceneStyle: { backgroundColor: Colors.page },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Fake Store',
          tabBarIcon: ({ color, size }) => <House color={color} size={size} strokeWidth={1.9} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'პროფილი',
          tabBarIcon: ({ color, size }) => (
            <UserRound color={color} size={size} strokeWidth={1.9} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          headerTitle: 'კალათა',
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: Colors.brand, color: '#fff' },
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart color={color} size={size} strokeWidth={1.9} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          headerTitle: 'შესვლა',
          tabBarIcon: ({ color, size }) => (
            <UserRoundPlus color={color} size={size} strokeWidth={1.9} />
          ),
        }}
      />
    </Tabs>
  );
}
