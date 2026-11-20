import type { LucideIcon } from 'lucide-react-native';
import { type ReactNode, useState } from 'react';
import {
  type Control,
  Controller,
  type FieldError,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Colors, Radius } from '@/constants/theme';

type Props<T extends FieldValues> = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  control: Control<T>;
  name: Path<T>;
  /** Visible label above the input. Without it, the placeholder is used for screen readers. */
  label?: string;
  icon?: LucideIcon;
  /** Extra element inside the input on the right, e.g. a show-password button. */
  rightAccessory?: ReactNode;
  error?: FieldError;
};

// A TextInput wired to react-hook-form. On the web the original used `register()`;
// React Native inputs have no DOM, so `Controller` passes value/onChange explicitly instead.
export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  icon: Icon,
  rightAccessory,
  error,
  style,
  ...inputProps
}: Props<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const iconColor = error ? Colors.danger : isFocused ? Colors.primary : Colors.textMuted;

  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* CSS-style transition (Reanimated 4): colors animate when focus/error state changes. */}
      <Animated.View
        style={[
          styles.inputWrap,
          isFocused && styles.inputWrapFocused,
          error && styles.inputWrapInvalid,
          { transitionProperty: ['backgroundColor', 'borderColor'], transitionDuration: 180 },
        ]}>
        {Icon && <Icon size={18} color={iconColor} />}
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextInput
              ref={ref}
              value={value == null ? '' : String(value)}
              onChangeText={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              placeholderTextColor={Colors.textMuted}
              accessibilityLabel={label ?? inputProps.placeholder}
              accessibilityHint={error?.message}
              style={[styles.input, style]}
              {...inputProps}
            />
          )}
        />
        {rightAccessory}
      </Animated.View>

      {error?.message && (
        <Animated.Text
          entering={FadeInDown.duration(200)}
          style={styles.error}
          accessibilityRole="alert">
          {error.message}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: Colors.surfaceMuted,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceMuted,
  },
  inputWrapFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  inputWrapInvalid: {
    borderColor: Colors.danger,
    backgroundColor: Colors.surface,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    color: Colors.text,
    fontSize: 15,
  },
  error: {
    color: Colors.danger,
    fontSize: 13,
    lineHeight: 18,
  },
});
