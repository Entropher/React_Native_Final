import { ShoppingCart } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { QuantityStepper } from '@/components/quantity-stepper';
import { Colors } from '@/constants/theme';
import { addToCart, selectItemQuantity } from '@/store/cart-slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import type { Product } from '@/types/product';

// Shows a cart button until the product is in the cart, then a quantity stepper.
export function AddToCartButton({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const quantity = useAppSelector(selectItemQuantity(product.id));

  if (quantity > 0) {
    return (
      <QuantityStepper productId={product.id} productTitle={product.title} quantity={quantity} />
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={() => dispatch(addToCart(product))}
      accessibilityRole="button"
      accessibilityLabel="კალათაში დამატება">
      <ShoppingCart size={16} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: Colors.brand,
  },
  pressed: {
    backgroundColor: Colors.brandDark,
  },
});
