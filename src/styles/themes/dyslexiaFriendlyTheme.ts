import { Theme } from './themeTypes';

export const dyslexiaFriendlyTheme: Theme = {
  name: 'dyslexiaFriendly',
  displayName: 'Modo Dislexia',
  description: 'Tema otimizado para leitura com fonte OpenDyslexic e contraste reforçado',
  
  colors: {
    forest: '#1B3A2E',
    emerald: '#006D4E',
    lilac: '#9A7CA7',
    black: '#111111',
    offWhite: '#FFF8F0',
    sageLight: '#DDE6DA',
    sageMedium: '#B9C8B5',
    sand: '#EDE6DA',
    rose: '#EAD8D6',
    lavender: '#D7D4E6',
    mist: '#D6DEE6',
    neutral: {
      100: '#F2F4F3',
      200: '#E3E7E6',
      300: '#C7CFCC',
      400: '#9AA4A1',
      500: '#747D79',
      600: '#4F5955',
      700: '#2A3430',
      800: '#161E1A',
      900: '#0F1512',
    },
    semantic: {
      bgPrimary: '#FFF8F0',
      bgSurface: '#FFFFFF',
      bgSubtle: '#F2F4F3',
      textPrimary: '#1B3A2E',
      textSecondary: '#2A4A3F',
      textMuted: '#4F5955',
      textInverse: '#FFFFFF',
      accent: '#006D4E',
      accentHover: '#00563E',
      accentSubtle: '#DDEEE6',
      emotion: '#9A7CA7',
      emotionSubtle: '#E9DDEE',
      border: '#B9C8B5',
      borderStrong: '#9AA4A1',
      focusRing: '#9A7CA7',
      success: '#006D4E',
      warning: '#B8872B',
      danger: '#B94A48',
      info: '#4C6F8F',
    },
  },
  shadows: {
    sm: '0 1px 2px rgba(17, 17, 17, 0.04)',
    md: '0 4px 12px rgba(17, 17, 17, 0.08)',
    lg: '0 10px 24px rgba(17, 17, 17, 0.10)',
    xl: '0 20px 48px rgba(17, 17, 17, 0.12)',
  },
  borders: {
    subtle: '2px solid #B9C8B5',
    strong: '2px solid #9AA4A1',
  },
};

// Adiciona atributos específicos para o modo dislexia (aplicados via CSS global)
export const dyslexiaStyles = {
  fontFamily: 'OpenDyslexic, sans-serif',
  letterSpacing: '0.03em',
  lineHeight: '1.7',
  linkUnderline: true,
  reducedMotion: true,
};