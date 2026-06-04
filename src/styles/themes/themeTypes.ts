export type ThemeMode = 'light' | 'dark' | 'highContrast' | 'dyslexiaFriendly';

export interface ThemeTokens {
  // Cores
  colors: {
    forest: string;
    emerald: string;
    lilac: string;
    black: string;
    offWhite: string;
    sageLight: string;
    sageMedium: string;
    sand: string;
    rose: string;
    lavender: string;
    mist: string;
    neutral: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    semantic: {
      bgPrimary: string;
      bgSurface: string;
      bgSubtle: string;
      textPrimary: string;
      textSecondary: string;
      textMuted: string;
      textInverse: string;
      accent: string;
      accentHover: string;
      accentSubtle: string;
      emotion: string;
      emotionSubtle: string;
      border: string;
      borderStrong: string;
      focusRing: string;
      success: string;
      warning: string;
      danger: string;
      info: string;
    };
  };
  // Sombras
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  // Bordas
  borders: {
    subtle: string;
    strong: string;
  };
}

export interface Theme extends ThemeTokens {
  name: ThemeMode;
  displayName: string;
  description?: string;
}