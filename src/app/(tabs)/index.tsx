import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { AddToCartButton } from '@/components/add-to-cart-button';
import { Colors } from '@/constants/theme';
import type { Product } from '@/types/product';

const PADDING = 14;
const GAP = 10;

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [deletedProducts, setDeletedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { width } = useWindowDimensions();
  const cardWidth = (width - PADDING * 2 - GAP) / 2;

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('პროდუქტების ჩატვირთვა ვერ მოხერხდა.');
        }
        return response.json();
      })
      .then((result: Product[]) => setProducts(result.slice(0, 20)))
      .catch(() => setError('პროდუქტების ჩატვირთვა ვერ მოხერხდა.'))
      .finally(() => setIsLoading(false));
  }, []);

  const deleteProduct = (productId: number) => {
    const deletedProduct = products.find((product) => product.id === productId);
    if (!deletedProduct) return;

    setDeletedProducts((current) => [...current, deletedProduct]);
    setProducts((current) => current.filter((product) => product.id !== productId));
  };

  const restoreProduct = (productId: number) => {
    const restoredProduct = deletedProducts.find((product) => product.id === productId);
    if (!restoredProduct) return;

    setProducts((current) => [...current, restoredProduct]);
    setDeletedProducts((current) => current.filter((product) => product.id !== productId));
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.brand} />
        <Text style={styles.message}>პროდუქტები იტვირთება...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message} accessibilityRole="alert">
          {error}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(product) => String(product.id)}
      numColumns={2}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <ProductCard product={item} width={cardWidth} onDelete={deleteProduct} />
      )}
      ListEmptyComponent={<Text style={styles.message}>პროდუქტები სიაში აღარ არის.</Text>}
      ListFooterComponent={
        deletedProducts.length > 0 ? (
          <View style={styles.deletedSection}>
            <View style={styles.deletedHeading}>
              <Text style={styles.deletedTitle}>წაშლილი პროდუქტები</Text>
              <Text style={styles.count}>{deletedProducts.length} პროდუქტი</Text>
            </View>
            <View style={styles.deletedGrid}>
              {deletedProducts.map((product) => (
                <DeletedProductCard
                  key={product.id}
                  product={product}
                  width={cardWidth}
                  onRestore={restoreProduct}
                />
              ))}
            </View>
          </View>
        ) : undefined
      }
    />
  );
}

type ProductCardProps = {
  product: Product;
  width: number;
  onDelete: (productId: number) => void;
};

function ProductCard({ product, width, onDelete }: ProductCardProps) {
  const detailsHref = `/product/${product.id}` as const;

  return (
    <View style={[styles.card, { width }]}>
      <Pressable
        onPress={() => router.push(detailsHref)}
        accessibilityRole="link"
        accessibilityLabel={`${product.title} - დეტალები`}>
        <View style={styles.imageFrame}>
          <Image style={styles.image} source={product.image} contentFit="contain" />
        </View>
      </Pressable>

      <View style={styles.info}>
        <Text style={styles.shipping}>Ships to Georgia</Text>
        <Link href={detailsHref} style={styles.title} numberOfLines={2}>
          {product.title}
        </Link>
        <View style={styles.rating}>
          <Text
            style={styles.stars}
            accessibilityLabel={`${product.rating.rate} out of 5 stars`}>
            {'★'.repeat(Math.round(product.rating.rate))}
          </Text>
          <Text style={styles.reviewCount}>
            {product.rating.count.toLocaleString()} reviews
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <View style={styles.actions}>
            <Link href={detailsHref} style={styles.detailsLink}>
              დეტალები
            </Link>
            <AddToCartButton product={product} />
          </View>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
        onPress={() => onDelete(product.id)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`${product.title} - წაშლა`}>
        {({ pressed }) => (
          <Text style={[styles.deleteIcon, pressed && styles.deleteIconPressed]}>×</Text>
        )}
      </Pressable>
    </View>
  );
}

type DeletedProductCardProps = {
  product: Product;
  width: number;
  onRestore: (productId: number) => void;
};

function DeletedProductCard({ product, width, onRestore }: DeletedProductCardProps) {
  return (
    <View style={[styles.card, styles.deletedCard, { width }]}>
      <View style={[styles.imageFrame, styles.deletedCard]}>
        <Image style={styles.image} source={product.image} contentFit="contain" />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Pressable
            style={({ pressed }) => [styles.restoreButton, pressed && styles.restorePressed]}
            onPress={() => onRestore(product.id)}
            accessibilityRole="button"
            accessibilityLabel={`${product.title} - დაბრუნება`}>
            <Text style={styles.restoreText}>დაბრუნება</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  message: {
    paddingVertical: 36,
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
  list: {
    padding: PADDING,
    gap: GAP,
  },
  row: {
    gap: GAP,
  },
  card: {
    overflow: 'hidden',
    backgroundColor: Colors.card,
  },
  imageFrame: {
    aspectRatio: 1,
    padding: 18,
    backgroundColor: Colors.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    paddingHorizontal: 11,
    paddingBottom: 13,
  },
  shipping: {
    marginBottom: 8,
    color: '#727272',
    fontSize: 11,
  },
  title: {
    minHeight: 34,
    color: Colors.text,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 17,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 8,
    minHeight: 22,
    marginTop: 4,
  },
  stars: {
    color: Colors.star,
    fontSize: 15,
    letterSpacing: 1,
  },
  reviewCount: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 'auto',
    paddingTop: 10,
  },
  price: {
    alignSelf: 'flex-start',
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  actions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  detailsLink: {
    color: '#555',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#fff',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.15)',
  },
  deleteButtonPressed: {
    backgroundColor: Colors.danger,
  },
  deleteIcon: {
    color: Colors.danger,
    fontSize: 22,
    lineHeight: 24,
  },
  deleteIconPressed: {
    color: '#fff',
  },
  deletedSection: {
    marginTop: 12,
    paddingTop: 28,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  deletedHeading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 18,
  },
  deletedTitle: {
    flexShrink: 1,
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontSize: 22,
    fontWeight: '500',
    color: Colors.text,
  },
  count: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  deletedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  deletedCard: {
    backgroundColor: Colors.deletedCard,
  },
  restoreButton: {
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.restoreBorder,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  restorePressed: {
    borderColor: Colors.restore,
    backgroundColor: '#eff5ef',
  },
  restoreText: {
    color: Colors.restore,
    fontSize: 12,
  },
});
