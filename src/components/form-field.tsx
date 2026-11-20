import { useState } from 'react';
import {
  type Control,
  Controller,
  type FieldError,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import { Colors } from '@/constants/theme';

type Props<T extends FieldValues> = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  control: Control<T>;
  name: Path<T>;
  /** Visible label above the input. Without it, the placeholder is used for screen readers. */
  label?: string;
  error?: FieldError;
};

// A TextInput wired to react-hook-form. On the web the original used `register()`;
// React Native inputs have no DOM, so `Controller` passes value/onChange explicitly instead.
export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  error,
  style,
  ...inputProps
}: Props<T>) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}
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
            placeholderTextColor={Colors.authPlaceholder}
            accessibilityLabel={label ?? inputProps.placeholder}
            accessibilityHint={error?.message}
            style={[
              styles.input,
              isFocused && styles.inputFocused,
              error && styles.inputInvalid,
              style,
            ]}
            {...inputProps}
          />
        )}
      />
      {error?.message && (
        <Text style={styles.error} accessibilityRole="alert">
          {error.message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    color: Colors.authText,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.authBorder,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    color: Colors.authText,
    fontSize: 15,
  },
  inputFocused: {
    borderColor: '#243244',
  },
  inputInvalid: {
    borderColor: Colors.errorBorder,
  },
  error: {
    color: Colors.error,
    fontSize: 13,
    lineHeight: 18,
  },
});
