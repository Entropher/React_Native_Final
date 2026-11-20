import { Platform } from 'react-native';

export const Colors = {
  // Brand blue kept from the original web app.
  primary: '#234bc7',
  primaryDark: '#123393',
  primarySoft: '#eef2ff',
  primaryBorder: '#d6defb',

  background: '#f4f6fb',
  surface: '#ffffff',
  surfaceMuted: '#f1f3f8',
  border: '#e5e8f0',

  text: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  textOnPrimary: '#ffffff',

  star: '#f5a623',
  danger: '#e5484d',
  dangerSoft: '#fdecec',
  success: '#1f7a45',
  successSoft: '#e8f6ee',
  warning: '#8a5a12',
  warningSoft: '#fff6e8',
  restore: '#1f7a45',
} as const;

// The web navbar's gradient, used for banners and the profile header.
export const BrandGradient = 'linear-gradient(115deg, #123393, #234bc7 55%, #3d5bff)';

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const Shadow = {
  card: '0 4px 16px rgba(15, 23, 42, 0.06)',
  raised: '0 10px 30px rgba(15, 23, 42, 0.10)',
  bar: '0 -6px 24px rgba(15, 23, 42, 0.08)',
} as const;

export const Fonts = {
  serif: Platform.select({ ios: 'Georgia', default: 'serif' }),
};
