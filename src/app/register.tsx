import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as yup from 'yup';

import { FormField } from '@/components/form-field';
import { authStyles } from '@/constants/auth-styles';
import { Colors } from '@/constants/theme';

// Turns an empty text box into "not provided", so optional fields can be left blank.
const emptyToUndefined = (value: unknown) => (value === '' ? undefined : value);

const registrationSchema = yup.object({
  firstName: yup
    .string()
    .transform(emptyToUndefined)
    .trim()
    .notRequired()
    .min(4, 'სახელი უნდა შეიცავდეს მინიმუმ 4 სიმბოლოს.')
    .max(20, 'სახელი უნდა შეიცავდეს მაქსიმუმ 20 სიმბოლოს.'),
  lastName: yup
    .string()
    .transform(emptyToUndefined)
    .trim()
    .notRequired()
    .min(4, 'გვარი უნდა შეიცავდეს მინიმუმ 4 სიმბოლოს.')
    .max(20, 'გვარი უნდა შეიცავდეს მაქსიმუმ 20 სიმბოლოს.'),
  age: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || Number.isNaN(value) ? undefined : value,
    )
    .notRequired()
    .typeError('ასაკი უნდა იყოს რიცხვი.')
    .min(13, 'ასაკი უნდა იყოს მინიმუმ 13.')
    .max(120, 'ასაკი უნდა იყოს მაქსიმუმ 120.'),
  username: yup
    .string()
    .trim()
    .required('მომხმარებლის სახელი სავალდებულოა.')
    .min(4, 'მომხმარებლის სახელი უნდა შეიცავდეს მინიმუმ 4 სიმბოლოს.')
    .max(20, 'მომხმარებლის სახელი უნდა შეიცავდეს მაქსიმუმ 20 სიმბოლოს.'),
  email: yup
    .string()
    .trim()
    .required('ელფოსტა სავალდებულოა.')
    .email('შეიყვანეთ სწორი ელფოსტის მისამართი.'),
  password: yup
    .string()
    .required('პაროლი სავალდებულოა.')
    .min(6, 'პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს.')
    .max(20, 'პაროლი უნდა შეიცავდეს მაქსიმუმ 20 სიმბოლოს.'),
  phone: yup
    .string()
    .transform(emptyToUndefined)
    .notRequired()
    .min(10, 'ტელეფონის ნომერი უნდა შეიცავდეს მინიმუმ 10 ციფრს.')
    .max(100, 'ტელეფონის ნომერი უნდა შეიცავდეს მაქსიმუმ 100 ციფრს.')
    .matches(/^\d+$/, 'ტელეფონის ნომერი მხოლოდ ციფრებს უნდა შეიცავდეს.'),
});

type RegistrationValues = yup.InferType<typeof registrationSchema>;

export default function RegisterScreen() {
  const [submitError, setSubmitError] = useState('');
  const [showOptional, setShowOptional] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      age: undefined,
      username: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const optionalHasErrors = Boolean(
    errors.firstName || errors.lastName || errors.age || errors.phone,
  );

  const onSubmit = async (values: RegistrationValues) => {
    setSubmitError('');

    try {
      // The password is only validated locally; it is not sent to the mock API.
      const response = await fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(values.firstName && { firstName: values.firstName }),
          ...(values.lastName && { lastName: values.lastName }),
          ...(Number.isFinite(values.age) && { age: values.age }),
          username: values.username,
          email: values.email,
          ...(values.phone && { phone: values.phone }),
        }),
      });

      if (!response.ok) {
        throw new Error('რეგისტრაციის მოთხოვნა ვერ შესრულდა.');
      }

      let result: { id?: unknown };
      try {
        result = await response.json();
      } catch {
        throw new Error('სერვერის პასუხის წაკითხვა ვერ მოხერხდა.');
      }

      if (!result?.id) {
        throw new Error('სერვერის პასუხი არასწორია.');
      }

      reset();
      router.dismissTo('/');
    } catch {
      setSubmitError('რეგისტრაცია ვერ შესრულდა. შეამოწმეთ ინტერნეტკავშირი და სცადეთ ხელახლა.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={authStyles.page}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <View style={authStyles.card}>
        <Text style={authStyles.eyebrow}>ანგარიშის შექმნა</Text>
        <Text style={authStyles.title} accessibilityRole="header">
          რეგისტრაცია
        </Text>
        <Text style={authStyles.description}>შეუერთდით ჩვენს ბაზარს და დაიწყეთ აღმოჩენა.</Text>
        <Text style={styles.securityNote}>
          პაროლი გამოიყენება მხოლოდ ადგილობრივი ვალიდაციისთვის და სატესტო endpoint-ზე არ
          იგზავნება.
        </Text>

        <View style={authStyles.form}>
          <FormField
            control={control}
            name="username"
            label="მომხმარებლის სახელი"
            autoComplete="username"
            textContentType="username"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            error={errors.username}
          />
          <FormField
            control={control}
            name="email"
            label="ელფოსტა"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
          />
          <FormField
            control={control}
            name="password"
            label="პაროლი"
            autoComplete="new-password"
            textContentType="newPassword"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.password}
          />

          {/* Replaces the web app's <details>/<summary> collapsible section. */}
          <View style={styles.optional}>
            <Pressable
              style={styles.optionalToggle}
              onPress={() => setShowOptional((open) => !open)}
              accessibilityRole="button"
              accessibilityState={{ expanded: showOptional || optionalHasErrors }}>
              <Text style={styles.optionalToggleText}>
                დამატებითი მონაცემები (არასავალდებულო)
              </Text>
              {showOptional || optionalHasErrors ? (
                <ChevronUp size={18} color={Colors.authLabel} />
              ) : (
                <ChevronDown size={18} color={Colors.authLabel} />
              )}
            </Pressable>

            {/* Kept open while an optional field has an error, so the message is never hidden. */}
            {(showOptional || optionalHasErrors) && (
              <View style={styles.optionalFields}>
                <FormField
                  control={control}
                  name="firstName"
                  label="სახელი"
                  autoComplete="given-name"
                  textContentType="givenName"
                  error={errors.firstName}
                />
                <FormField
                  control={control}
                  name="lastName"
                  label="გვარი"
                  autoComplete="family-name"
                  textContentType="familyName"
                  error={errors.lastName}
                />
                <FormField
                  control={control}
                  name="age"
                  label="ასაკი"
                  autoComplete="off"
                  keyboardType="number-pad"
                  error={errors.age}
                />
                <FormField
                  control={control}
                  name="phone"
                  label="ტელეფონი"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  keyboardType="phone-pad"
                  error={errors.phone}
                />
              </View>
            )}
          </View>

          {submitError !== '' && (
            <Text style={authStyles.message} accessibilityRole="alert">
              {submitError}
            </Text>
          )}

          <Pressable
            style={({ pressed }) => [
              authStyles.submitButton,
              pressed && authStyles.submitButtonPressed,
              isSubmitting && authStyles.submitButtonDisabled,
            ]}
            onPress={() => handleSubmit(onSubmit)()}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityState={{ busy: isSubmitting }}>
            <Text style={authStyles.submitText}>
              {isSubmitting ? 'რეგისტრაცია...' : 'რეგისტრაცია'}
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={authStyles.accountPrompt}>
        უკვე გაქვთ ანგარიში?{' '}
        <Text
          style={authStyles.accountLink}
          onPress={() => router.dismissTo('/login')}
          accessibilityRole="link">
          შესვლა
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  securityNote: {
    marginTop: 12,
    padding: 10,
    borderRadius: 7,
    backgroundColor: '#f3f5f7',
    color: Colors.authLabel,
    fontSize: 12,
    lineHeight: 18,
  },
  optional: {
    borderWidth: 1,
    borderColor: Colors.authBorder,
    borderRadius: 8,
  },
  optionalToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  optionalToggleText: {
    flexShrink: 1,
    color: Colors.authText,
    fontSize: 13,
    fontWeight: '600',
  },
  optionalFields: {
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
});
