# Temas do IRIS

## Estrutura

- `defaultTheme.ts` – tema padrão (light mode)
- `lightTheme.ts` – tema claro personalizável
- `darkTheme.ts` – tema escuro elegante
- `highContrastTheme.ts` – alto contraste (WCAG AAA)
- `dyslexiaFriendlyTheme.ts` – otimizado para dislexia

## Como usar no código

```tsx
import { useTheme } from 'next-themes'; // ou seu gerenciador de temas
import { defaultTheme, darkTheme } from '@/styles/themes';

// Para aplicar via CSS-in-JS ou variáveis CSS