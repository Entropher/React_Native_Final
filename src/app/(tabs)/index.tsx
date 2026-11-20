import { CircleAlert, PackageOpen, Truck } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeletedProductCard, ProductCard, ProductCardSkeleton } from '@/components/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { enterStaggered, layoutTransition } from '@/constants/motion';
import { BrandGradient, Colors, Fonts, Radius } from '@/constants/theme';
import type { Product } from '@/types/product';

const PADDING = 16;
const GAP = 12;

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [deletedProducts, setDeletedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // Changing this number re-runs the fetch effect (used by the "retry" button).
  const [reloadKey, setReloadKey] = useState(0);
  const insets = useSafeAreaInsets();
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
  }, [reloadKey]);

  const retry = () => {
    setError('');
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

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

  if (error) {
    return (
      <View style={[styles.flex, { paddingTop: insets.top }]}>
        <EmptyState
          icon={CircleAlert}
          tone="danger"
          title={error}
          message="შეამოწმეთ ინტერნეტკავშირი და სცადეთ ხელახლა."
          actionLabel="ხელახლა ცდა"
          onAction={retry}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
      <Animated.View entering={FadeIn.duration(400)}>
        <Text style={styles.eyebrow}>FAKE STORE</Text>
        <Text style={styles.title} accessibilityRole="header">
          პროდუქტები
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).springify().damping(18)} style={styles.banner}>
        <View style={styles.bannerIcon}>
          <Truck size={22} color="#fff" />
        </View>
        <View style={styles.flex}>
          <Text style={styles.bannerTitle}>Ships to Georgia</Text>
          <Text style={styles.bannerText}>მიწოდება საქართველოში</Text>
        </View>
      </Animated.View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>ყველა პროდუქტი</Text>
        {!isLoading && (
          <Animated.View entering={FadeIn} style={styles.countChip}>
            <Text style={styles.countText}>{products.length} პროდუქტი</Text>
          </Animated.View>
        )}
      </View>

      {isLoading ? (
        <View style={styles.grid} accessibilityLabel="პროდუქტები იტვირთება...">
          {Array.from({ length: 6 }, (_, index) => (
            <ProductCardSkeleton key={index} width={cardWidth} />
          ))}
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyList}>
          <PackageOpen size={28} color={Colors.textMuted} />
          <Text style={styles.emptyText}>პროდუქტები სიაში აღარ არის.</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {products.map((product, index) => (
            <Animated.View
              key={product.id}
              entering={enterStaggered(index)}
              exiting={ZoomOut.duration(200)}
              layout={layoutTransition}>
              <ProductCard product={product} width={cardWidth} onDelete={deleteProduct} />
            </Animated.View>
          ))}
        </View>
      )}

      {deletedProducts.length > 0 && (
        <Animated.View
          entering={FadeInDown.springify().damping(18)}
          layout={layoutTransition}
          style={styles.deletedSection}>
          <View style={styles.sectionHeading}>
            <Text style={styles.deletedTitle}>წაშლილი პროდუქტები</Text>
            <View style={styles.countChip}>
              <Text style={styles.countText}>{deletedProducts.length} პროდუქტი</Text>
            </View>
          </View>
          <View style={styles.grid}>
            {deletedProducts.map((product) => (
              <Animated.View
                key={product.id}
                entering={FadeInDown.springify().damping(18)}
                exiting={ZoomOut.duration(200)}
                layout={layoutTransition}>
                <DeletedProductCard product={product} width={cardWidth} onRestore={restoreProduct} />
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: PADDING,
    paddingBottom: 32,
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  title: {
    marginTop: 2,
    color: Colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
    padding: 16,
    borderRadius: Radius.lg,
    backgroundImage: BrandGradient,
    backgroundColor: Colors.primary,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  bannerText: {
    marginTop: 2,
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  countChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primarySoft,
  },
  countText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  emptyList: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 36,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  deletedSection: {
    marginTop: 12,
  },
  deletedTitle: {
    flexShrink: 1,
    color: Colors.text,
    fontFamily: Fonts.serif,
    fontSize: 20,
    fontWeight: '500',
  },
});
