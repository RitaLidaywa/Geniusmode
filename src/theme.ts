export const colors = {
  background: '#FBF7F4',
  surface: '#FFFFFF',
  surfaceMuted: '#F3ECE7',
  primary: '#8C6E63',
  primaryDark: '#5D4037',
  accent: '#B98BA0',
  accentSoft: '#F1DDE6',
  sage: '#8FA98C',
  sageSoft: '#E3ECE1',
  sky: '#8FAEC7',
  skySoft: '#E1EAF1',
  text: '#3B302B',
  textMuted: '#7A6A62',
  textFaint: '#A99C93',
  border: '#E7DDD5',
  danger: '#C1666B',
  dangerSoft: '#F6E3E3',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const typography = {
  title: { fontSize: 28, fontWeight: '700' as const, color: colors.text },
  heading: { fontSize: 20, fontWeight: '700' as const, color: colors.text },
  subheading: { fontSize: 16, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text, lineHeight: 22 },
  bodyMuted: { fontSize: 14, fontWeight: '400' as const, color: colors.textMuted, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500' as const, color: colors.textFaint },
};

export const shadow = {
  shadowColor: '#3B302B',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 2,
};
