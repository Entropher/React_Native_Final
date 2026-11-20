import { Image } from 'expo-image';
import { router } from 'expo-router';
import { RotateCcw, Star, X } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { AddToCartButton } from '@/components/add-to-cart-button';
import { Button } from '@/components/ui/button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Skeleton } from '@/components/ui/skeleton';
import { Colors, Radius, Shadow } from '@/constants/theme';
import type { Product } from '@/types/product';

type ProductCardProps = {
  product: Product;
  width: number;
  onDelete: (productId: number) => void;
};

export function ProductCard({ product, width, onDelete }: ProductCardProps) {
  return (
    <PressableScale
      style={[styles.card, { width }]}
      scaleTo={0.97}
      onPress={() => router.push(`/product/${product.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${product.title} - დეტალები`}>
      <View style={styles.imageFrame}>
        <Image style={styles.image} source={product.image} contentFit="contain" transition={250} />

        <PressableScale
          style={styles.deleteButton}
          scaleTo={0.85}
          onPress={() => onDelete(product.id)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`${product.title} - წაშლა`}>
          <X size={15} color={Colors.textSecondary} strokeWidth={2.4} />
        </PressableScale>
      </View>

      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View
          style={styles.rating}
          accessible
          accessibilityLabel={`${product.rating.rate} out of 5 stars, ${product.rating.count} reviews`}>
          <Star size={13} color={Colors.star} fill={Colors.star} />
          <Text style={styles.ratingValue}>{product.rating.rate.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({product.rating.count.toLocaleString()})</Text>
        </View>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <AddToCartButton product={product} />
      </View>
    </PressableScale>
  );
}

type DeletedProductCardProps = {
  product: Product;
  width: number;
  onRestore: (productId: number) => void;
};

export function DeletedProductCard({ product, width, onRestore }: DeletedProductCardProps) {
  return (
    <View style={[styles.card, styles.deletedCard, { width }]}>
      <View style={styles.imageFrame}>
        <Image
          style={[styles.image, styles.deletedImage]}
          source={product.image}
          contentFit="contain"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Button
          label="დაბრუნება"
          icon={RotateCcw}
          variant="secondary"
          size="md"
          onPress={() => onRestore(product.id)}
          accessibilityLabel={`${product.title} - დაბრუნება`}
        />
      </View>
    </View>
  );
}

// Grey placeholder with the same shape as a product card, shown while loading.
export function ProductCardSkeleton({ width }: { width: number }) {
  return (
    <View style={[styles.card, { width }]}>
      <Skeleton style={styles.imageFrame} />
      <View style={styles.info}>
        <Skeleton style={styles.skeletonLineShort} />
        <Skeleton style={styles.skeletonLine} />
        <Skeleton style={styles.skeletonLineShort} />
        <Skeleton style={styles.skeletonButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    boxShadow: Shadow.card,
  },
  deletedCard: {
    opacity: 0.85,
  },
  imageFrame: {
    aspectRatio: 1,
    margin: 8,
    marginBottom: 0,
    padding: 18,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deletedImage: {
    opacity: 0.5,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.12)',
  },
  info: {
    flex: 1,
    gap: 4,
    padding: 12,
  },
  category: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    minHeight: 36,
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  reviewCount: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  price: {
    marginTop: 'auto',
    marginBottom: 6,
    paddingTop: 4,
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  skeletonLine: {
    height: 14,
  },
  skeletonLineShort: {
    width: '55%',
    height: 12,
  },
  skeletonButton: {
    height: 40,
    marginTop: 8,
  },
});
