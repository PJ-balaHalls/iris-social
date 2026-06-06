'use client';

import { useEffect } from 'react';
import {
  applyAccessibilityPreferences,
  readStoredAccessibilityPreferences,
} from '@/lib/accessibility/preferences';

export function AccessibilityRuntime() {
  useEffect(() => {
    applyAccessibilityPreferences(readStoredAccessibilityPreferences());

    function handleStorage(event: StorageEvent) {
      if (event.key === 'iris-accessibility-preferences') {
        applyAccessibilityPreferences(readStoredAccessibilityPreferences());
      }
    }

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return null;
}
