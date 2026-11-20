import { Tabs } from 'expo-router/js-tabs';
import {
  House,
  type LucideIcon,
  ShoppingCart,
  UserRound,
  UserRoundPlus,
} from 'lucide-react-native';
import type { ColorValue } from 'react-native';
import Animated from 'react-native-reanimated';

import { Colors, Shadow } from '@/constants/theme';
import { selectCartItemCount } from '@/store/cart-slice';
import { useAppSelector } from '@/store/store';

type TabIconProps = { icon: LucideIcon; color: ColorValue; focused: boolean };

// The selected tab's icon springs up slightly (CSS-style transition from Reanimated 4).
function TabIcon({ icon: Icon, color, focused }: TabIconProps) {
  return (
    <Animated.View
      style={{
        transform: [{ scale: focused ? 1.1 : 1 }, { translateY: focused ? -1 : 0 }],
        transitionProperty: 'transform',
        transitionDuration: 250,
      }}>
      <Icon color={color} size={23} strokeWidth={focused ? 2.3 : 1.9} />
    </Animated.View>
  );
}

export default function TabLayout() {
  const cartItemCount = useAppSelector(selectCartItemCount);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerTitleStyle: { color: Colors.text, fontSize: 24, fontWeight: '800' },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: Colors.surface,
          boxShadow: Shadow.bar,
        },
        sceneStyle: { backgroundColor: Colors.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: (props) => <TabIcon icon={House} {...props} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'პროფილი',
          tabBarIcon: (props) => <TabIcon icon={UserRound} {...props} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          headerTitle: 'კალათა',
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.danger,
            color: '#fff',
            fontSize: 11,
            fontWeight: '700',
          },
          tabBarIcon: (props) => <TabIcon icon={ShoppingCart} {...props} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false,
          tabBarIcon: (props) => <TabIcon icon={UserRoundPlus} {...props} />,
        }}
      />
    </Tabs>
  );
}
