import type { LucideIcon } from 'lucide-react-native';
import { CircleAlert, Mail, MapPin, Phone } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AvatarPicker } from '@/components/avatar-picker';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { BrandGradient, Colors, Radius, Shadow } from '@/constants/theme';

// Shape of https://fakestoreapi.com/users/3 (only the fields shown here).
type User = {
  username: string;
  email: string;
  phone: string;
  name: { firstname: string; lastname: string };
  address: { number: number; street: string; city: string };
};

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [hasError, setHasError] = useState(false);
  // Changing this number re-runs the fetch effect (used by the "retry" button).
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    fetch('https://fakestoreapi.com/users/3')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Profile request failed');
        }
        return response.json();
      })
      .then(setUser)
      .catch(() => setHasError(true));
  }, [reloadKey]);

  if (hasError) {
    return (
      <EmptyState
        icon={CircleAlert}
        tone="danger"
        title="პროფილის ჩატვირთვა ვერ მოხერხდა. სცადეთ მოგვიანებით."
        actionLabel="ხელახლა ცდა"
        onAction={() => {
          setHasError(false);
          setReloadKey((key) => key + 1);
        }}
      />
    );
  }

  if (!user) {
    return (
      <View style={styles.page} accessibilityLabel="იტვირთება...">
        <Skeleton style={styles.skeletonHero} />
        <Skeleton style={styles.skeletonCard} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Animated.View entering={FadeInDown.springify().damping(18)} style={styles.hero}>
        <AvatarPicker
          initials={`${user.name.firstname[0]}${user.name.lastname[0]}`.toUpperCase()}
        />
        <View style={styles.identity}>
          <Text style={styles.name}>
            {user.name.firstname} {user.name.lastname}
          </Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).springify().damping(18)} style={styles.card}>
        <DetailRow icon={Mail} label="ელფოსტა" value={user.email} />
        <View style={styles.divider} />
        <DetailRow icon={Phone} label="ტელეფონი" value={user.phone} />
        <View style={styles.divider} />
        <DetailRow
          icon={MapPin}
          label="მისამართი"
          value={`${user.address.number} ${user.address.street}, ${user.address.city}`}
        />
      </Animated.View>
    </ScrollView>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <View style={styles.rowIcon}>
        <Icon size={18} color={Colors.primary} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: 16,
    padding: 16,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderRadius: Radius.xl,
    backgroundImage: BrandGradient,
    backgroundColor: Colors.primary,
    boxShadow: Shadow.raised,
  },
  identity: {
    alignItems: 'center',
    marginTop: 16,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  username: {
    marginTop: 4,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    boxShadow: Shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  rowIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  rowValue: {
    marginTop: 2,
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginLeft: 54,
    backgroundColor: Colors.border,
  },
  skeletonHero: {
    height: 270,
    borderRadius: Radius.xl,
  },
  skeletonCard: {
    height: 200,
    borderRadius: Radius.lg,
  },
});
