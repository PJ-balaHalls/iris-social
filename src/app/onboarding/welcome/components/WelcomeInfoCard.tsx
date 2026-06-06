import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

type WelcomeInfoCardProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
  index: number;
};

export function WelcomeInfoCard({ eyebrow, title, children, index }: WelcomeInfoCardProps) {
  return (
    <div
      className="iris-welcome-card"
      style={{ animationDelay: `${180 + index * 90}ms` }}
    >
      <Card
        hover={false}
        className="rounded-[28px] border border-[#DDE6DA]/90 !bg-white/[0.78] p-5 shadow-[0_18px_48px_rgba(17,17,17,0.06)] backdrop-blur-xl"
      >
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
          {eyebrow}
        </p>

        <h2 className="mt-3 font-display text-2xl leading-tight tracking-[-0.025em] text-[#002c1f]">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#476153]">
          {children}
        </p>
      </Card>
    </div>
  );
}
