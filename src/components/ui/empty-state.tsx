import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';

type Props = {
  icon: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'default' | 'danger';
};

// Centered icon + text, used for empty lists and loading errors.
export function EmptyState({ icon: Icon, title, message, actionLabel, onAction, tone }: Props) {
  const isDanger = tone === 'danger';

  return (
    <Animated.View entering={FadeInDown.springify().damping(18)} style={styles.container}>
      <View style={[styles.iconCircle, isDanger && styles.iconCircleDanger]}>
        <Icon size={36} color={isDanger ? Colors.danger : Colors.primary} strokeWidth={1.8} />
      </View>
      <Text style={styles.title} accessibilityRole={isDanger ? 'alert' : 'header'}>
        {title}
      </Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 32,
  },
  iconCircle: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 44,
    backgroundColor: Colors.primarySoft,
  },
  iconCircleDanger: {
    backgroundColor: Colors.dangerSoft,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  action: {
    alignSelf: 'stretch',
    marginTop: 12,
  },
});
