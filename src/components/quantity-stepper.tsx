import * as Haptics from 'expo-haptics';
import { Minus, Plus } from 'lucide-react-native';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Colors, Radius } from '@/constants/theme';
import { decreaseQuantity, increaseQuantity, MAX_QUANTITY } from '@/store/cart-slice';
import { useAppDispatch } from '@/store/store';

type Props = {
  productId: number;
  productTitle: string;
  quantity: number;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
};

export function QuantityStepper({ productId, productTitle, quantity, size = 'md', style }: Props) {
  const dispatch = useAppDispatch();
  const canDecrease = quantity > 1;
  const canIncrease = quantity < MAX_QUANTITY;
  const height = size === 'lg' ? 52 : 40;

  const change = (action: typeof increaseQuantity | typeof decreaseQuantity) => {
    Haptics.selectionAsync();
    dispatch(action(productId));
  };

  return (
    <View
      style={[styles.pill, { height, borderRadius: size === 'lg' ? Radius.md : Radius.sm }, style]}
      accessibilityLabel={`${productTitle} რაოდენობა`}>
      <PressableScale
        style={[styles.button, { width: height, height }]}
        scaleTo={0.85}
        onPress={() => change(decreaseQuantity)}
        disabled={!canDecrease}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel="რაოდენობის შემცირება"
        accessibilityState={{ disabled: !canDecrease }}>
        <Minus size={18} color={canDecrease ? Colors.primary : Colors.textMuted} strokeWidth={2.4} />
      </PressableScale>

      {/* `key` re-mounts the number on every change, which replays the "pop" animation. */}
      <Animated.Text
        key={quantity}
        entering={ZoomIn.duration(180)}
        style={styles.count}
        accessibilityLiveRegion="polite">
        {quantity}
      </Animated.Text>

      <PressableScale
        style={[styles.button, { width: height, height }]}
        scaleTo={0.85}
        onPress={() => change(increaseQuantity)}
        disabled={!canIncrease}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel="რაოდენობის გაზრდა"
        accessibilityState={{ disabled: !canIncrease }}>
        <Plus size={18} color={canIncrease ? Colors.primary : Colors.textMuted} strokeWidth={2.4} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primarySoft,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    minWidth: 28,
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});
