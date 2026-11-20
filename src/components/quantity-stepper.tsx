import { Minus, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { decreaseQuantity, increaseQuantity, MAX_QUANTITY } from '@/store/cart-slice';
import { useAppDispatch } from '@/store/store';

type Props = {
  productId: number;
  productTitle: string;
  quantity: number;
};

export function QuantityStepper({ productId, productTitle, quantity }: Props) {
  const dispatch = useAppDispatch();
  const canDecrease = quantity > 1;
  const canIncrease = quantity < MAX_QUANTITY;

  return (
    <View style={styles.row} accessibilityLabel={`${productTitle} რაოდენობა`}>
      <Pressable
        style={styles.button}
        onPress={() => dispatch(decreaseQuantity(productId))}
        disabled={!canDecrease}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="რაოდენობის შემცირება"
        accessibilityState={{ disabled: !canDecrease }}>
        <Minus size={20} color={canDecrease ? '#222' : Colors.disabled} />
      </Pressable>
      <View style={styles.output}>
        <Text style={styles.outputText} accessibilityLiveRegion="polite">
          {quantity}
        </Text>
      </View>
      <Pressable
        style={styles.button}
        onPress={() => dispatch(increaseQuantity(productId))}
        disabled={!canIncrease}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="რაოდენობის გაზრდა"
        accessibilityState={{ disabled: !canIncrease }}>
        <Plus size={20} color={canIncrease ? '#222' : Colors.disabled} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  button: {
    width: 28,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  output: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    backgroundColor: Colors.surface,
  },
  outputText: {
    color: '#222',
    fontSize: 18,
  },
});
