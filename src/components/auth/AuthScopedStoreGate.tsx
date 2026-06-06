'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useOnboardingStore } from '@/lib/store/onboardingStore';

type AuthScopedStoreGateProps = {
  children: ReactNode;
};

export function AuthScopedStoreGate({ children }: AuthScopedStoreGateProps) {
  const router = useRouter();

  const ownerUserId = useOnboardingStore((state) => state.ownerUserId);
  const updateField = useOnboardingStore((state) => state.updateField);
  const clearStore = useOnboardingStore((state) => state.clearStore);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function scopeStoreToUser() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        clearStore();
        router.replace('/auth/login');
        return;
      }

      if (ownerUserId && ownerUserId !== user.id) {
        clearStore();
      }

      updateField('ownerUserId', user.id);

      if (active) setReady(true);
    }

    scopeStoreToUser();

    return () => {
      active = false;
    };
  }, [clearStore, ownerUserId, router, updateField]);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-full border border-white/70 bg-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#747D79] shadow-[0_18px_45px_rgba(0,44,31,0.10)] backdrop-blur-xl">
          Validando sessão
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
