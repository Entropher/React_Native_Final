import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AvatarPicker } from '@/components/avatar-picker';
import { Colors } from '@/constants/theme';

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
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.profile}>
        {hasError ? (
          <Text style={styles.error} accessibilityRole="alert">
            პროფილის ჩატვირთვა ვერ მოხერხდა. სცადეთ მოგვიანებით.
          </Text>
        ) : !user ? (
          <ActivityIndicator color={Colors.brand} />
        ) : (
          <>
            <AvatarPicker
              initials={`${user.name.firstname[0]}${user.name.lastname[0]}`.toUpperCase()}
            />
            <View style={styles.identity}>
              <Text style={styles.name}>
                {user.name.firstname} {user.name.lastname}
              </Text>
              <Text style={styles.username}>@{user.username}</Text>
            </View>

            <View style={styles.details}>
              <Detail label="ელფოსტა" value={user.email} />
              <Detail label="ტელეფონი" value={user.phone} />
              <Detail
                label="მისამართი"
                value={`${user.address.number} ${user.address.street}, ${user.address.city}`}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 16,
    paddingVertical: 28,
  },
  profile: {
    paddingHorizontal: 18,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  identity: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  name: {
    color: '#202020',
    fontSize: 20,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  username: {
    marginTop: 4,
    color: '#6c6c6c',
    fontSize: 14,
  },
  details: {
    gap: 20,
    paddingTop: 24,
  },
  detailLabel: {
    marginBottom: 5,
    color: '#707070',
    fontSize: 13,
  },
  detailValue: {
    color: '#202020',
    fontSize: 15,
  },
  error: {
    padding: 18,
    borderLeftWidth: 3,
    borderLeftColor: '#b83a32',
    backgroundColor: '#fff4f2',
    color: '#872b25',
    lineHeight: 22,
  },
});
