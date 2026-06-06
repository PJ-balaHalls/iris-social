'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function WelcomeContinueButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="auth"
      size="lg"
      className="min-h-12 rounded-[18px] px-8"
      onClick={() => router.push('/onboarding/basic-info')}
    >
      Começar jornada
    </Button>
  );
}
