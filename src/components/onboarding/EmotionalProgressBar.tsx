'use client'
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const routeProgress: Record<string, number> = {
  '/onboarding/welcome': 5,
  '/onboarding/basic-info': 15,
  '/onboarding/avatar': 25,
  '/onboarding/username': 40,
  '/onboarding/personality': 55,
  '/onboarding/culture': 70,
  '/onboarding/intention': 85,
  '/onboarding/privacy': 95,
  '/onboarding/plan': 98,
  '/onboarding/finish': 100,
};

export function EmotionalProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Evita mostrar progresso na rota kids
    if (pathname.includes('/kids')) {
      setProgress(0);
      return;
    }
    const currentProgress = routeProgress[pathname] || 0;
    setProgress(currentProgress);
  }, [pathname]);

  if (progress === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto h-1 bg-[#E2E7E3] rounded-full overflow-hidden mt-6">
      <div 
        className="h-full bg-[#9A7CA7] transition-all duration-1000 ease-out-soft"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}