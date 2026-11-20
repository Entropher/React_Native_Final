import { Image } from 'expo-image';
import { Trash2 } from 'lucide-react-native';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { QuantityStepper } from '@/components/quantity-stepper';
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
      <View style={styles.centered}>
        <Text style={styles.message}>კალათა ცარიელია.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Image style={styles.image} source={item.image} contentFit="contain" />

          <View style={styles.body}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.category}>{item.category}</Text>

            <View style={styles.controls}>
              <QuantityStepper
                productId={item.id}
                productTitle={item.title}
                quantity={item.quantity}
              />
              <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          </View>

          <Pressable
            style={styles.remove}
            onPress={() => dispatch(removeFromCart(item.id))}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`${item.title} კალათიდან წაშლა`}>
            <Trash2 size={22} color="#666" strokeWidth={1.6} />
          </Pressable>
        </View>
      )}
      ListFooterComponent={
        <View style={styles.summary} accessibilityLabel="კალათის შეჯამება">
          <Text style={styles.summaryText}>პროდუქტების რაოდენობა: {itemCount}</Text>
          <Text style={styles.summaryText}>
            ჯამური გადასახადი: <Text style={styles.total}>${total.toFixed(2)}</Text>
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    color: '#666',
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
  },
  image: {
    width: 64,
    height: 88,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#222',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19,
  },
  category: {
    color: '#666',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
  },
  price: {
    color: '#222',
    fontSize: 15,
    fontWeight: '600',
  },
  remove: {
    width: 34,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    alignItems: 'flex-end',
    gap: 8,
    paddingVertical: 24,
  },
  summaryText: {
    color: '#444',
    fontSize: 15,
  },
  total: {
    color: '#222',
    fontSize: 19,
    fontWeight: '700',
  },
});
