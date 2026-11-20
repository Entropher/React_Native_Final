import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';

// Styles shared by the login and register screens (from the web app's auth CSS modules).
export const authStyles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  card: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderWidth: 1,
    borderColor: '#e7ebed',
    borderRadius: 16,
    backgroundColor: Colors.surface,
    boxShadow: '0 20px 48px rgba(28, 43, 53, 0.12)',
  },
  eyebrow: {
    marginBottom: 8,
    color: Colors.eyebrow,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.authText,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  description: {
    marginTop: 8,
    color: Colors.authMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  form: {
    gap: 12,
    marginTop: 24,
  },
  submitButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    borderRadius: 8,
    backgroundColor: Colors.authInk,
  },
  submitButtonPressed: {
    backgroundColor: '#26394d',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 7,
    backgroundColor: Colors.warningBg,
    color: Colors.warningText,
    fontSize: 13,
    lineHeight: 19,
  },
  accountPrompt: {
    marginTop: 32,
    color: '#26313c',
    fontSize: 14,
    textAlign: 'center',
  },
  accountLink: {
    color: Colors.authText,
    fontWeight: '700',
  },
});
