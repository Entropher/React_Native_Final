import { yupResolver } from '@hookform/resolvers/yup';
import * as SecureStore from 'expo-secure-store';
import { Link, router, useFocusEffect } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as yup from 'yup';

import { FormField } from '@/components/form-field';
import { authStyles } from '@/constants/auth-styles';
import { Colors } from '@/constants/theme';

const TOKEN_STORAGE_KEY = 'authToken';
const DEMO_CREDENTIALS = {
  username: 'johnd',
  password: 'm38rmF$',
};

const loginSchema = yup.object({
  username: yup.string().trim().required('მომხმარებლის სახელი სავალდებულოა.'),
  password: yup.string().required('პაროლი სავალდებულოა.'),
});

type LoginValues = yup.InferType<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  // True when a token was saved with "Remember me" on an earlier login.
  const [isRemembered, setIsRemembered] = useState(false);

  // Each time this tab is opened, check whether a remembered token exists.
  useFocusEffect(
    useCallback(() => {
      SecureStore.getItemAsync(TOKEN_STORAGE_KEY)
        .then((token) => setIsRemembered(Boolean(token)))
        .catch(() => setIsRemembered(false));
    }, []),
  );

  const logOut = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
    } catch {
      // Nothing stored or storage unavailable; either way the user is logged out.
    }
    setIsRemembered(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: DEMO_CREDENTIALS,
  });

  // After a successful login, wait a second (so the success message is visible) then open Profile.
  useEffect(() => {
    if (!isLoginSuccessful) return;

    const redirectTimeout = setTimeout(() => {
      router.navigate('/profile');
      // This tab stays mounted, so clear the message for the next visit.
      setIsLoginSuccessful(false);
      setSubmitMessage('');
    }, 1000);

    return () => clearTimeout(redirectTimeout);
  }, [isLoginSuccessful]);

  const onSubmit = async (values: LoginValues) => {
    setSubmitMessage('');
    setIsLoginSuccessful(false);

    try {
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: values.username, password: values.password }),
      });

      if (!response.ok) {
        setSubmitMessage(
          response.status === 401
            ? 'მომხმარებლის სახელი ან პაროლი არასწორია.'
            : 'შესვლა ვერ მოხერხდა. სცადეთ მოგვიანებით.',
        );
        return;
      }

      let result: { token?: unknown };
      try {
        result = await response.json();
      } catch {
        setSubmitMessage('სერვერის პასუხის წაკითხვა ვერ მოხერხდა. სცადეთ მოგვიანებით.');
        return;
      }

      if (typeof result.token !== 'string' || !result.token) {
        setSubmitMessage('სერვერის პასუხი არასწორია. სცადეთ მოგვიანებით.');
        return;
      }

      // The web app used localStorage; on a phone the token goes in the encrypted
      // device keychain (iOS Keychain / Android Keystore) instead.
      try {
        if (rememberMe) {
          await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, result.token);
        } else {
          await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
        }
      } catch {
        setSubmitMessage('ავტორიზაცია შესრულდა, მაგრამ ტოკენის შენახვა ვერ მოხერხდა.');
        return;
      }

      setIsLoginSuccessful(true);
      setSubmitMessage('შესვლა წარმატებით შესრულდა.');
    } catch {
      setSubmitMessage(
        'სერვერთან დაკავშირება ვერ მოხერხდა. შეამოწმეთ ინტერნეტკავშირი და სცადეთ ხელახლა.',
      );
    }
  };

  if (isRemembered) {
    return (
      <ScrollView contentContainerStyle={authStyles.page}>
        <View style={authStyles.card}>
          <Text style={authStyles.title} accessibilityRole="header">
            შესვლა
          </Text>
          <Text style={[authStyles.message, styles.success, styles.rememberedMessage]}>
            თქვენ უკვე შესული ხართ (Remember me).
          </Text>
          <Pressable
            style={({ pressed }) => [
              authStyles.submitButton,
              styles.rememberedButton,
              pressed && authStyles.submitButtonPressed,
            ]}
            onPress={logOut}
            accessibilityRole="button">
            <Text style={authStyles.submitText}>გასვლა</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={authStyles.page}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <View style={authStyles.card}>
        <Text style={authStyles.title} accessibilityRole="header">
          შესვლა
        </Text>
        <Text style={[authStyles.eyebrow, styles.eyebrow]}>კეთილი იყოს თქვენი დაბრუნება</Text>
        <Text style={authStyles.description}>შედით ანგარიშზე, რომ მაღაზიით ისარგებლოთ</Text>

        <View style={authStyles.form}>
          <FormField
            control={control}
            name="username"
            placeholder="მომხმარებლის სახელი"
            autoComplete="username"
            textContentType="username"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.username}
          />
          <FormField
            control={control}
            name="password"
            placeholder="პაროლი"
            autoComplete="current-password"
            textContentType="password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.password}
          />

          <Pressable
            style={styles.passwordToggle}
            onPress={() => setShowPassword((visible) => !visible)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityState={{ selected: showPassword }}>
            <Text style={styles.passwordToggleText}>
              {showPassword ? 'პაროლის დამალვა' : 'პაროლის ნახვა'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.rememberMe}
            onPress={() => setRememberMe((checked) => !checked)}
            hitSlop={6}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: rememberMe }}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Check size={12} color="#fff" strokeWidth={3} />}
            </View>
            <Text style={styles.rememberMeText}>Remember me</Text>
          </Pressable>

          {submitMessage !== '' && (
            <Text
              style={[authStyles.message, isLoginSuccessful && styles.success]}
              accessibilityRole="alert">
              {submitMessage}
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
              {isSubmitting ? 'მიმდინარეობს...' : 'შესვლა'}
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={authStyles.accountPrompt}>
        არ გაქვთ ანგარიში?{' '}
        <Link href="/register" style={authStyles.accountLink}>
          რეგისტრაცია
        </Link>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    marginTop: 14,
  },
  passwordToggle: {
    alignSelf: 'flex-end',
  },
  passwordToggleText: {
    color: Colors.authLabel,
    fontSize: 12,
    fontWeight: '600',
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 9,
  },
  checkbox: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.authLabel,
    borderRadius: 4,
  },
  checkboxChecked: {
    borderColor: Colors.authInk,
    backgroundColor: Colors.authInk,
  },
  rememberMeText: {
    color: Colors.authLabel,
    fontSize: 13,
  },
  success: {
    backgroundColor: Colors.successBg,
    color: Colors.successText,
  },
  rememberedMessage: {
    marginTop: 20,
  },
  rememberedButton: {
    marginTop: 16,
  },
});
