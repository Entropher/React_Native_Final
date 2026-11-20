import { yupResolver } from '@hookform/resolvers/yup';
import * as SecureStore from 'expo-secure-store';
import { Link, router, useFocusEffect } from 'expo-router';
import {
  Check,
  CircleCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  ShoppingBag,
  UserRound,
} from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as yup from 'yup';

import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { PressableScale } from '@/components/ui/pressable-scale';
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

const enterSection = (delay: number) => FadeInDown.delay(delay).springify().damping(18);

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
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

  const pagePadding = { paddingTop: insets.top + 24 };

  if (isRemembered) {
    return (
      <ScrollView contentContainerStyle={[authStyles.page, pagePadding]}>
        <Animated.View entering={enterSection(0)} style={[authStyles.card, styles.rememberedCard]}>
          <Animated.View entering={ZoomIn.delay(150).springify()} style={styles.successCircle}>
            <CircleCheck size={40} color={Colors.success} />
          </Animated.View>
          <Text style={authStyles.title} accessibilityRole="header">
            შესვლა
          </Text>
          <Text style={authStyles.description}>თქვენ უკვე შესული ხართ (Remember me).</Text>
          <Button
            label="პროფილის ნახვა"
            icon={UserRound}
            onPress={() => router.navigate('/profile')}
            style={styles.fullWidth}
          />
          <Button
            label="გასვლა"
            icon={LogOut}
            variant="outline"
            onPress={logOut}
            style={styles.fullWidth}
          />
        </Animated.View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[authStyles.page, pagePadding]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets>
      <Animated.View entering={enterSection(0)} style={authStyles.hero}>
        <View style={authStyles.logo}>
          <ShoppingBag size={28} color="#fff" />
        </View>
        <Text style={authStyles.eyebrow}>კეთილი იყოს თქვენი დაბრუნება</Text>
        <Text style={authStyles.title} accessibilityRole="header">
          შესვლა
        </Text>
        <Text style={authStyles.description}>შედით ანგარიშზე, რომ მაღაზიით ისარგებლოთ</Text>
      </Animated.View>

      <Animated.View entering={enterSection(100)} style={authStyles.card}>
        <FormField
          control={control}
          name="username"
          placeholder="მომხმარებლის სახელი"
          icon={UserRound}
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
          icon={LockKeyhole}
          autoComplete="current-password"
          textContentType="password"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.password}
          rightAccessory={
            <Pressable
              onPress={() => setShowPassword((visible) => !visible)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'პაროლის დამალვა' : 'პაროლის ნახვა'}>
              {showPassword ? (
                <EyeOff size={19} color={Colors.textSecondary} />
              ) : (
                <Eye size={19} color={Colors.textSecondary} />
              )}
            </Pressable>
          }
        />

        <PressableScale
          style={styles.rememberMe}
          onPress={() => setRememberMe((checked) => !checked)}
          hitSlop={6}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: rememberMe }}>
          <Animated.View
            style={[
              styles.checkbox,
              rememberMe && styles.checkboxChecked,
              { transitionProperty: ['backgroundColor', 'borderColor'], transitionDuration: 150 },
            ]}>
            {rememberMe && (
              <Animated.View entering={ZoomIn.duration(150)}>
                <Check size={13} color="#fff" strokeWidth={3} />
              </Animated.View>
            )}
          </Animated.View>
          <Text style={styles.rememberMeText}>Remember me</Text>
        </PressableScale>

        {submitMessage !== '' && (
          <Animated.Text
            key={submitMessage}
            entering={FadeIn.duration(200)}
            style={[authStyles.message, isLoginSuccessful && authStyles.messageSuccess]}
            accessibilityRole="alert">
            {submitMessage}
          </Animated.Text>
        )}

        <Button
          label={isSubmitting ? 'მიმდინარეობს...' : 'შესვლა'}
          loading={isSubmitting}
          onPress={() => handleSubmit(onSubmit)()}
        />
      </Animated.View>

      <Animated.View entering={enterSection(200)}>
        <Text style={authStyles.accountPrompt}>
          არ გაქვთ ანგარიში?{' '}
          <Link href="/register" style={authStyles.accountLink}>
            რეგისტრაცია
          </Link>
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    borderRadius: 6,
    backgroundColor: Colors.surface,
  },
  checkboxChecked: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  rememberMeText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  rememberedCard: {
    alignItems: 'center',
  },
  successCircle: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 38,
    backgroundColor: Colors.successSoft,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
});
