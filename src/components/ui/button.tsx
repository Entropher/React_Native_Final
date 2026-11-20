import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, type StyleProp, StyleSheet, Text, type ViewStyle } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Colors, Radius } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'outline';
type Size = 'md' | 'lg';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const textColors: Record<Variant, string> = {
  primary: Colors.textOnPrimary,
  secondary: Colors.primary,
  outline: Colors.primary,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon: Icon,
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}: Props) {
  const color = textColors[variant];
  const isDisabled = disabled || loading;

  return (
    <PressableScale
      style={[styles.base, styles[size], styles[variant], isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: loading }}>
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        Icon && <Icon size={size === 'lg' ? 18 : 16} color={color} strokeWidth={2.2} />
      )}
      <Text style={[styles.label, size === 'md' && styles.labelMd, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
  },
  lg: {
    minHeight: 52,
    borderRadius: Radius.md,
  },
  md: {
    minHeight: 40,
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
  },
  primary: {
    backgroundColor: Colors.primary,
    boxShadow: '0 6px 16px rgba(35, 75, 199, 0.25)',
  },
  secondary: {
    backgroundColor: Colors.primarySoft,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Colors.primaryBorder,
    backgroundColor: Colors.surface,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
  labelMd: {
    fontSize: 13,
  },
});
