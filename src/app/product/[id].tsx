import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AddToCartButton } from '@/components/add-to-cart-button';
import { Colors } from '@/constants/theme';
import type { Product } from '@/types/product';

type Status = 'loading' | 'ready' | 'not-found' | 'error';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<Status>('loading');

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
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.brand} />
      </View>
    );
  }

  if (status !== 'ready' || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.description} accessibilityRole="alert">
          {status === 'not-found'
            ? 'პროდუქტი ვერ მოიძებნა.'
            : 'პროდუქტის ჩატვირთვა ვერ მოხერხდა.'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.imageFrame}>
        <Image style={styles.image} source={product.image} contentFit="contain" />
      </View>

      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.title} accessibilityRole="header">
        {product.title}
      </Text>

      <View style={styles.rating}>
        <Text
          style={styles.stars}
          accessibilityLabel={`${product.rating.rate} out of 5 stars`}>
          {'★'.repeat(Math.round(product.rating.rate))}
        </Text>
        <Text style={styles.ratingValue}>{product.rating.rate.toFixed(1)} / 5</Text>
        <Text style={styles.reviews}>{product.rating.count.toLocaleString()} reviews</Text>
      </View>

      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.cartControl}>
        <AddToCartButton product={product} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  page: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 48,
  },
  imageFrame: {
    height: 300,
    padding: 28,
    marginBottom: 22,
    backgroundColor: Colors.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  category: {
    marginBottom: 12,
    color: Colors.textSecondary,
    fontSize: 13,
    textTransform: 'capitalize',
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 30,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  stars: {
    color: Colors.star,
    fontSize: 19,
    letterSpacing: 1,
  },
  ratingValue: {
    color: '#292929',
    fontSize: 14,
    fontWeight: '600',
  },
  reviews: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  price: {
    marginTop: 24,
    color: Colors.text,
    fontSize: 30,
    fontWeight: '700',
  },
  description: {
    marginTop: 24,
    color: '#555',
    fontSize: 16,
    lineHeight: 27,
  },
  cartControl: {
    alignItems: 'flex-start',
    marginTop: 40,
  },
});
