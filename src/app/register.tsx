import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import {
  AtSign,
  Calendar,
  ChevronDown,
  LockKeyhole,
  Phone,
  ShieldCheck,
  UserRound,
  UserRoundPlus,
} from 'lucide-react-native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import * as yup from 'yup';

import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { authStyles } from '@/constants/auth-styles';
import { layoutTransition } from '@/constants/motion';
import { Colors, Radius } from '@/constants/theme';

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

const enterSection = (delay: number) => FadeInDown.delay(delay).springify().damping(18);

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

  // Kept open while an optional field has an error, so the message is never hidden.
  const optionalHasErrors = Boolean(
    errors.firstName || errors.lastName || errors.age || errors.phone,
  );
  const isOptionalOpen = showOptional || optionalHasErrors;

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
      contentContainerStyle={[authStyles.page, styles.page]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <Animated.View entering={enterSection(0)} style={authStyles.hero}>
        <View style={authStyles.logo}>
          <UserRoundPlus size={28} color="#fff" />
        </View>
        <Text style={authStyles.eyebrow}>ანგარიშის შექმნა</Text>
        <Text style={authStyles.title} accessibilityRole="header">
          რეგისტრაცია
        </Text>
        <Text style={authStyles.description}>შეუერთდით ჩვენს ბაზარს და დაიწყეთ აღმოჩენა.</Text>
      </Animated.View>

      <Animated.View entering={enterSection(100)} layout={layoutTransition} style={authStyles.card}>
        <View style={styles.securityNote}>
          <ShieldCheck size={18} color={Colors.primary} />
          <Text style={styles.securityText}>
            პაროლი გამოიყენება მხოლოდ ადგილობრივი ვალიდაციისთვის და სატესტო endpoint-ზე არ
            იგზავნება.
          </Text>
        </View>

        <FormField
          control={control}
          name="username"
          label="მომხმარებლის სახელი"
          icon={UserRound}
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
          icon={AtSign}
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
          icon={LockKeyhole}
          autoComplete="new-password"
          textContentType="newPassword"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.password}
        />

        {/* Replaces the web app's <details>/<summary> collapsible section. */}
        <Animated.View layout={layoutTransition} style={styles.optional}>
          <PressableScale
            style={styles.optionalToggle}
            scaleTo={0.98}
            onPress={() => setShowOptional((open) => !open)}
            accessibilityRole="button"
            accessibilityState={{ expanded: isOptionalOpen }}>
            <Text style={styles.optionalToggleText}>დამატებითი მონაცემები (არასავალდებულო)</Text>
            <Animated.View
              style={{
                transform: [{ rotate: isOptionalOpen ? '180deg' : '0deg' }],
                transitionProperty: 'transform',
                transitionDuration: 220,
              }}>
              <ChevronDown size={18} color={Colors.textSecondary} />
            </Animated.View>
          </PressableScale>

          {isOptionalOpen && (
            <Animated.View
              entering={FadeInDown.duration(220)}
              exiting={FadeOut.duration(150)}
              style={styles.optionalFields}>
              <FormField
                control={control}
                name="firstName"
                label="სახელი"
                icon={UserRound}
                autoComplete="given-name"
                textContentType="givenName"
                error={errors.firstName}
              />
              <FormField
                control={control}
                name="lastName"
                label="გვარი"
                icon={UserRound}
                autoComplete="family-name"
                textContentType="familyName"
                error={errors.lastName}
              />
              <FormField
                control={control}
                name="age"
                label="ასაკი"
                icon={Calendar}
                autoComplete="off"
                keyboardType="number-pad"
                error={errors.age}
              />
              <FormField
                control={control}
                name="phone"
                label="ტელეფონი"
                icon={Phone}
                autoComplete="tel"
                textContentType="telephoneNumber"
                keyboardType="phone-pad"
                error={errors.phone}
              />
            </Animated.View>
          )}
        </Animated.View>

        {submitError !== '' && (
          <Animated.Text
            entering={FadeIn.duration(200)}
            layout={layoutTransition}
            style={authStyles.message}
            accessibilityRole="alert">
            {submitError}
          </Animated.Text>
        )}

        <Animated.View layout={layoutTransition}>
          <Button
            label={isSubmitting ? 'რეგისტრაცია...' : 'რეგისტრაცია'}
            loading={isSubmitting}
            onPress={() => handleSubmit(onSubmit)()}
          />
        </Animated.View>
      </Animated.View>

      <Animated.View entering={enterSection(200)}>
        <Text style={authStyles.accountPrompt}>
          უკვე გაქვთ ანგარიში?{' '}
          <Text
            style={authStyles.accountLink}
            onPress={() => router.dismissTo('/login')}
            accessibilityRole="link">
            შესვლა
          </Text>
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 8,
  },
  securityNote: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.primarySoft,
  },
  securityText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  optional: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
  },
  optionalToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  optionalToggleText: {
    flexShrink: 1,
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  optionalFields: {
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
});
