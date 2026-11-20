import * as Haptics from 'expo-haptics';
import { ShoppingCart } from 'lucide-react-native';
import { type StyleProp, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { QuantityStepper } from '@/components/quantity-stepper';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Colors, Radius } from '@/constants/theme';
import { addToCart, selectItemQuantity } from '@/store/cart-slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import type { Product } from '@/types/product';

type Props = {
  product: Product;
  label?: string;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
};

// Shows an "add" button until the product is in the cart, then morphs into a quantity stepper.
export function AddToCartButton({ product, label = 'კალათაში', size = 'md', style }: Props) {
  const dispatch = useAppDispatch();
  const quantity = useAppSelector(selectItemQuantity(product.id));
  const height = size === 'lg' ? 52 : 40;

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch(addToCart(product));
  };

  return (
    <View style={[{ height }, style]}>
      {quantity > 0 ? (
        <Animated.View key="stepper" entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
          <QuantityStepper
            productId={product.id}
            productTitle={product.title}
            quantity={quantity}
            size={size}
          />
        </Animated.View>
      ) : (
        <Animated.View key="add" entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
          <PressableScale
            style={[
              styles.button,
              { height, borderRadius: size === 'lg' ? Radius.md : Radius.sm },
            ]}
            onPress={handleAdd}
            accessibilityRole="button"
            accessibilityLabel="კალათაში დამატება">
            <ShoppingCart size={size === 'lg' ? 18 : 16} color="#fff" strokeWidth={2.2} />
            <Text style={[styles.label, size === 'lg' && styles.labelLg]}>{label}</Text>
          </PressableScale>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    backgroundColor: Colors.primary,
  },
  label: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  labelLg: {
    fontSize: 15,
  },
});
