import type { ReactNode } from 'react';

type OnboardingMinimalStepProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function OnboardingMinimalStep({
  eyebrow,
  title,
  children,
}: OnboardingMinimalStepProps) {
  return (
    <section className="mx-auto w-full">
      <style>
        {`
          @keyframes iris-minimal-enter {
            from {
              opacity: 0;
              transform: translateY(14px);
              filter: blur(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          .iris-minimal-enter {
            animation: iris-minimal-enter 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          @media (prefers-reduced-motion: reduce) {
            .iris-minimal-enter {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
            }
          }
        `}
      </style>

      <div className="iris-minimal-enter">
        <header className="mb-9 min-w-0">
          <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
            {eyebrow}
          </p>

          <h1 className="font-display text-[2.55rem] leading-[1] tracking-[-0.055em] text-[#002c1f] sm:text-[3.15rem] lg:text-[3.6rem] xl:text-[3.9rem] md:whitespace-nowrap">
            {title}
          </h1>
        </header>

        {children}
      </div>
    </section>
  );
}
