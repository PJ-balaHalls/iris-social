'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  defaultAppearancePreferences,
  defaultThemeMode,
  defaultThemeSlug,
  getThemeBySlug,
  irisThemeCatalog,
  normalizeAppearancePreferences,
  normalizeThemeMode,
  normalizeThemeSlug,
} from '@/lib/themes/themeCatalog';
import type {
  IrisAppearancePreferences,
  IrisThemeDefinition,
  IrisThemeMode,
} from '@/lib/themes/themeTypes';

type IrisThemeContextValue = {
  themeSlug: string;
  mode: IrisThemeMode;
  resolvedMode: 'light' | 'dark';
  preferences: IrisAppearancePreferences;
  themes: IrisThemeDefinition[];
  setMode: (mode: IrisThemeMode) => void;
  setPreferences: (preferences: IrisAppearancePreferences) => void;
  activateTheme: (
    themeSlug: string,
    mode?: IrisThemeMode,
    preferences?: IrisAppearancePreferences,
    themes?: IrisThemeDefinition[],
  ) => void;
};

const IrisThemeContext = createContext<IrisThemeContextValue | null>(null);

const storageKeys = {
  themeSlug: 'iris:theme:slug',
  mode: 'iris:theme:mode',
  preferences: 'iris:theme:preferences',
};

function getSystemMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolveMode(mode: IrisThemeMode): 'light' | 'dark' {
  return mode === 'system' ? getSystemMode() : mode;
}

function setVariables(tokens: Record<string, string>) {
  const root = document.documentElement;

  const map: Record<string, string> = {
    primary: '--iris-color-primary',
    primaryDeep: '--iris-color-primary-deep',
    primarySoft: '--iris-color-primary-soft',
    accent: '--iris-color-accent',
    accentSoft: '--iris-color-accent-soft',
    emotion: '--iris-color-emotion',
    background: '--iris-bg-primary',
    surface: '--iris-bg-surface',
    surfaceSoft: '--iris-bg-soft',
    text: '--iris-text-primary',
    textSecondary: '--iris-text-secondary',
    textMuted: '--iris-text-muted',
    border: '--iris-color-border',
  };

  Object.entries(map).forEach(([key, cssVar]) => {
    if (tokens[key]) root.style.setProperty(cssVar, tokens[key]);
  });

  if (tokens.primary) {
    root.style.setProperty('--iris-color-ring', `${tokens.primary}29`);
    root.style.setProperty('--iris-color-shadow', `${tokens.primary}1F`);
  }
}

export function applyIrisThemeToDOM(
  themeSlug: string,
  mode: IrisThemeMode,
  preferences: IrisAppearancePreferences = defaultAppearancePreferences,
  themes: IrisThemeDefinition[] = irisThemeCatalog,
) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const resolvedMode = resolveMode(mode);
  const theme = getThemeBySlug(themeSlug, themes);
  const tokens = resolvedMode === 'dark' ? theme.darkTokens : theme.lightTokens;

  setVariables(tokens);

  root.setAttribute('data-iris-theme', theme.slug);
  root.setAttribute('data-theme', resolvedMode);
  root.setAttribute('data-theme-mode', mode);
  root.setAttribute('data-font-style', preferences.fontStyle);
  root.setAttribute('data-font-scale', preferences.fontScale);
  root.setAttribute('data-spacing', preferences.spacing);
  root.setAttribute('data-radius', preferences.radius);
  root.setAttribute('data-motion', preferences.motion);
  root.setAttribute('data-glass', preferences.glass);
  root.setAttribute('data-theme-bg', theme.background.type);
  root.setAttribute('data-bg-animated', String(theme.background.animated));
  root.style.colorScheme = resolvedMode;

  window.dispatchEvent(
    new CustomEvent('iris-theme-change', {
      detail: {
        themeSlug: theme.slug,
        mode,
        resolvedMode,
        preferences,
      },
    }),
  );
}

function getLocalThemeSlug() {
  if (typeof window === 'undefined') return defaultThemeSlug;
  return localStorage.getItem(storageKeys.themeSlug) || defaultThemeSlug;
}

function getLocalMode() {
  if (typeof window === 'undefined') return defaultThemeMode;
  return normalizeThemeMode(localStorage.getItem(storageKeys.mode));
}

function getLocalPreferences() {
  if (typeof window === 'undefined') return defaultAppearancePreferences;

  try {
    return normalizeAppearancePreferences(
      JSON.parse(localStorage.getItem(storageKeys.preferences) || '{}'),
    );
  } catch {
    return defaultAppearancePreferences;
  }
}

function persistLocal(
  themeSlug: string,
  mode: IrisThemeMode,
  preferences: IrisAppearancePreferences,
) {
  localStorage.setItem(storageKeys.themeSlug, themeSlug);
  localStorage.setItem(storageKeys.mode, mode);
  localStorage.setItem(storageKeys.preferences, JSON.stringify(preferences));
}

export function IrisThemeProvider({ children }: { children: ReactNode }) {
  const [themes, setThemes] = useState<IrisThemeDefinition[]>(irisThemeCatalog);
  const [themeSlug, setThemeSlug] = useState(getLocalThemeSlug);
  const [mode, setModeState] = useState<IrisThemeMode>(getLocalMode);
  const [preferences, setPreferencesState] =
    useState<IrisAppearancePreferences>(getLocalPreferences);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>(() =>
    resolveMode(getLocalMode()),
  );

  const activateTheme = useCallback(
    (
      nextThemeSlug: string,
      nextMode: IrisThemeMode = mode,
      nextPreferences: IrisAppearancePreferences = preferences,
      nextThemes: IrisThemeDefinition[] = themes,
    ) => {
      const normalizedMode = normalizeThemeMode(nextMode);
      const normalizedPreferences = normalizeAppearancePreferences(nextPreferences);

      setThemes(nextThemes);
      setThemeSlug(nextThemeSlug);
      setModeState(normalizedMode);
      setPreferencesState(normalizedPreferences);
      setResolvedMode(resolveMode(normalizedMode));

      persistLocal(nextThemeSlug, normalizedMode, normalizedPreferences);
      applyIrisThemeToDOM(
        nextThemeSlug,
        normalizedMode,
        normalizedPreferences,
        nextThemes,
      );
    },
    [mode, preferences, themes],
  );

  const setMode = useCallback(
    (nextMode: IrisThemeMode) => {
      activateTheme(themeSlug, nextMode, preferences, themes);
    },
    [activateTheme, themeSlug, preferences, themes],
  );

  const setPreferences = useCallback(
    (nextPreferences: IrisAppearancePreferences) => {
      activateTheme(themeSlug, mode, nextPreferences, themes);
    },
    [activateTheme, themeSlug, mode, themes],
  );

  useEffect(() => {
    applyIrisThemeToDOM(themeSlug, mode, preferences, themes);
  }, [themeSlug, mode, preferences, themes]);

  useEffect(() => {
    if (mode !== 'system') return;

    const query = window.matchMedia('(prefers-color-scheme: dark)');

    function handleChange() {
      applyIrisThemeToDOM(themeSlug, 'system', preferences, themes);
      setResolvedMode(resolveMode('system'));
    }

    query.addEventListener('change', handleChange);

    return () => query.removeEventListener('change', handleChange);
  }, [mode, themeSlug, preferences, themes]);

  useEffect(() => {
    let cancelled = false;

    async function syncProfileTheme() {
      try {
        const response = await fetch('/api/theme/me', {
          cache: 'no-store',
        });

        if (!response.ok) return;

        const payload = await response.json();

        if (cancelled) return;

        const serverThemeSlug =
          typeof payload.themeSlug === 'string'
            ? payload.themeSlug
            : defaultThemeSlug;

        const serverMode = normalizeThemeMode(payload.mode);
        const serverPreferences = normalizeAppearancePreferences(payload.preferences);
        const serverThemes = Array.isArray(payload.themes)
          ? [...irisThemeCatalog, ...payload.themes]
          : irisThemeCatalog;

        activateTheme(serverThemeSlug, serverMode, serverPreferences, serverThemes);
      } catch {
        // Mantém tema local.
      }
    }

    syncProfileTheme();

    return () => {
      cancelled = true;
    };
  }, [activateTheme]);

  const value = useMemo<IrisThemeContextValue>(
    () => ({
      themeSlug,
      mode,
      resolvedMode,
      preferences,
      themes,
      setMode,
      setPreferences,
      activateTheme,
    }),
    [
      themeSlug,
      mode,
      resolvedMode,
      preferences,
      themes,
      setMode,
      setPreferences,
      activateTheme,
    ],
  );

  return (
    <IrisThemeContext.Provider value={value}>
      {children}
    </IrisThemeContext.Provider>
  );
}

export function useIrisTheme() {
  const context = useContext(IrisThemeContext);

  if (context) return context;

  return {
    themeSlug: defaultThemeSlug,
    mode: defaultThemeMode,
    resolvedMode: 'light' as const,
    preferences: defaultAppearancePreferences,
    themes: irisThemeCatalog,
    setMode: () => undefined,
    setPreferences: () => undefined,
    activateTheme: (
      themeSlug: string,
      mode: IrisThemeMode = defaultThemeMode,
      preferences: IrisAppearancePreferences = defaultAppearancePreferences,
      themes: IrisThemeDefinition[] = irisThemeCatalog,
    ) => applyIrisThemeToDOM(themeSlug, mode, preferences, themes),
  };
}
