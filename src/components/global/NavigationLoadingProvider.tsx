'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/global/Loader/Spinner';

type NavigationLoadingProviderProps = {
  children: ReactNode;
};

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function isSamePageUrl(url: URL) {
  return (
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  );
}

export function NavigationLoadingProvider({
  children,
}: NavigationLoadingProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setIsLoading(false);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');

      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute('href');

      if (!href || href.startsWith('#')) {
        return;
      }

      if (anchor.target && anchor.target !== '_self') {
        return;
      }

      let url: URL;

      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin || isSamePageUrl(url)) {
        return;
      }

      setIsLoading(true);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsLoading(false);
        timeoutRef.current = null;
      }, 12000);
    }

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {children}

      {isLoading ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF7F2]/60 px-6 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[#E2E7E3] bg-white/85 px-8 py-7 text-center shadow-[0_24px_70px_rgba(27,58,46,0.14)]">
            <div className="font-display text-2xl font-semibold tracking-[0.18em] text-[#1B3A2E]">
              IRIS
            </div>

            <Spinner
              size="lg"
              tone="brand"
              label="Abrindo página..."
              withBrand
            />
          </div>
        </div>
      ) : null}
    </>
  );
}