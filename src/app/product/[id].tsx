import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { CircleAlert, PackageSearch, Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddToCartButton } from '@/components/add-to-cart-button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Radius, Shadow } from '@/constants/theme';
import type { Product } from '@/types/product';

type Status = 'loading' | 'ready' | 'not-found' | 'error';

const enterSection = (delay: number) => FadeInDown.delay(delay).springify().damping(18);

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadProduct = async () => {
      let response: Response;
      try {
        response = await fetch(`https://fakestoreapi.com/products/${id}`);
      } catch {
        setStatus('error');
        return;
      }

      if (response.status === 404) {
        setStatus('not-found');
        return;
      }
      if (!response.ok) {
        setStatus('error');
        return;
      }

      let result: Product;
      try {
        result = await response.json();
      } catch {
        setStatus('error');
        return;
      }

      if (!result?.id) {
        setStatus('not-found');
        return;
      }

      setProduct(result);
      setStatus('ready');
    };

    loadProduct();
  }, [id]);

  if (status === 'loading') {
    return (
      <View style={styles.page} accessibilityLabel="იტვირთება...">
        <Skeleton style={styles.imageCard} />
        <Skeleton style={styles.skeletonChip} />
        <Skeleton style={styles.skeletonTitle} />
        <Skeleton style={styles.skeletonLine} />
        <Skeleton style={styles.skeletonLine} />
      </View>
    );
  }

  if (status !== 'ready' || !product) {
    return status === 'not-found' ? (
      <EmptyState icon={PackageSearch} title="პროდუქტი ვერ მოიძებნა." />
    ) : (
      <EmptyState icon={CircleAlert} tone="danger" title="პროდუქტის ჩატვირთვა ვერ მოხერხდა." />
    );
  }

  const filledStars = Math.round(product.rating.rate);

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={[styles.page, { paddingBottom: 120 + insets.bottom }]}>
        <Animated.View entering={FadeIn.duration(350)} style={styles.imageCard}>
          <Image style={styles.image} source={product.image} contentFit="contain" transition={250} />
        </Animated.View>

        <Animated.View entering={enterSection(80)}>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
          <Text style={styles.title} accessibilityRole="header">
            {product.title}
          </Text>
        </Animated.View>

        <Animated.View
          entering={enterSection(140)}
          style={styles.rating}
          accessible
          accessibilityLabel={`${product.rating.rate} out of 5 stars, ${product.rating.count} reviews`}>
          <View style={styles.stars}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={18}
                color={Colors.star}
                fill={index < filledStars ? Colors.star : 'transparent'}
              />
            ))}
          </View>
          <Text style={styles.ratingValue}>{product.rating.rate.toFixed(1)} / 5</Text>
          <Text style={styles.reviews}>{product.rating.count.toLocaleString()} reviews</Text>
        </Animated.View>

        <Animated.View entering={enterSection(200)} style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>აღწერა</Text>
          <Text style={styles.description}>{product.description}</Text>
        </Animated.View>
      </ScrollView>

      {/* Sticky bar: price + add to cart always visible while scrolling. */}
      <Animated.View
        entering={SlideInDown.delay(150).springify().damping(20)}
        style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.priceLabel}>ფასი</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </View>
        <AddToCartButton
          product={product}
          label="კალათაში დამატება"
          size="lg"
          style={styles.flex}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  page: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  imageCard: {
    height: 320,
    padding: 32,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    boxShadow: Shadow.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primarySoft,
  },
  categoryText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 29,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  reviews: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  descriptionCard: {
    gap: 8,
    padding: 16,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    boxShadow: Shadow.card,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
  bottomBar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    backgroundColor: Colors.surface,
    boxShadow: Shadow.bar,
  },
  priceLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  price: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  skeletonChip: {
    width: 90,
    height: 24,
    borderRadius: Radius.pill,
  },
  skeletonTitle: {
    width: '85%',
    height: 26,
  },
  skeletonLine: {
    height: 16,
  },
});
