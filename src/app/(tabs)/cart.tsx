import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ShoppingBag, Trash2 } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, SlideOutLeft } from 'react-native-reanimated';

import { QuantityStepper } from '@/components/quantity-stepper';
import { EmptyState } from '@/components/ui/empty-state';
import { PressableScale } from '@/components/ui/pressable-scale';
import { enterStaggered, layoutTransition } from '@/constants/motion';
import { Colors, Radius, Shadow } from '@/constants/theme';
import {
  removeFromCart,
  selectCartItemCount,
  selectCartItems,
  selectCartTotal,
} from '@/store/cart-slice';
import { useAppDispatch, useAppSelector } from '@/store/store';

export default function CartScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const total = useAppSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="კალათა ცარიელია."
        message="დაამატეთ პროდუქტები კატალოგიდან."
        actionLabel="პროდუქტების ნახვა"
        onAction={() => router.navigate('/')}
      />
    );
  }

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.list}>
        {items.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={enterStaggered(index)}
            exiting={SlideOutLeft.duration(250)}
            layout={layoutTransition}
            style={styles.item}>
            <View style={styles.imageFrame}>
              <Image style={styles.image} source={item.image} contentFit="contain" />
            </View>

            <View style={styles.body}>
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <PressableScale
                  style={styles.remove}
                  scaleTo={0.85}
                  onPress={() => dispatch(removeFromCart(item.id))}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title} კალათიდან წაშლა`}>
                  <Trash2 size={17} color={Colors.danger} strokeWidth={2} />
                </PressableScale>
              </View>
              <Text style={styles.category}>{item.category}</Text>

              <View style={styles.controls}>
                <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
                <QuantityStepper
                  productId={item.id}
                  productTitle={item.title}
                  quantity={item.quantity}
                />
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      <Animated.View
        entering={FadeInDown.springify().damping(20)}
        style={styles.summary}
        accessibilityLabel="კალათის შეჯამება">
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>პროდუქტების რაოდენობა</Text>
          <Text style={styles.summaryValue}>{itemCount}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>ჯამური გადასახადი</Text>
          <Text style={styles.total}>${total.toFixed(2)}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    gap: 12,
    padding: 16,
    paddingBottom: 150,
  },
  item: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    boxShadow: Shadow.card,
  },
  imageFrame: {
    width: 84,
    height: 96,
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
  },
  remove: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: Colors.dangerSoft,
  },
  category: {
    color: Colors.textMuted,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 'auto',
    paddingTop: 8,
  },
  price: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  summary: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    backgroundColor: Colors.surface,
    boxShadow: Shadow.bar,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  total: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: '800',
  },
});
