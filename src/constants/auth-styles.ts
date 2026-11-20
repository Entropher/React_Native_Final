import { StyleSheet } from 'react-native';

import { BrandGradient, Colors, Radius, Shadow } from '@/constants/theme';

// Styles shared by the login and register screens.
export const authStyles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  hero: {
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderRadius: 20,
    backgroundImage: BrandGradient,
    backgroundColor: Colors.primary,
    boxShadow: '0 10px 24px rgba(35, 75, 199, 0.3)',
  },
  eyebrow: {
    marginBottom: 6,
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    marginTop: 6,
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  card: {
    gap: 14,
    padding: 20,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    boxShadow: Shadow.raised,
  },
  message: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.sm,
    backgroundColor: Colors.warningSoft,
    color: Colors.warning,
    fontSize: 13,
    lineHeight: 19,
  },
  messageSuccess: {
    backgroundColor: Colors.successSoft,
    color: Colors.success,
  },
  accountPrompt: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  accountLink: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
