import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

const LOGO_PATH = '/iris/brand/logotipo/svg/iris-logotipo-colorido.svg';

const AUTH_BACKGROUNDS = {
  desktop: '/iris/brand/backgrounds/desktop/fundo-botanico-suave.svg',
  tablet: '/iris/brand/backgrounds/tablet/fundo-botanico-suave.svg',
  mobile: '/iris/brand/backgrounds/mobile/fundo-botanico-suave.svg',
};

function DesktopBotanicalBackground({ src }: { src: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[#FAF7F2]" />

      <div
        className="absolute inset-y-0 left-0 w-[70vw] opacity-[0.96] mix-blend-multiply"
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center',
          backgroundSize: 'auto 100%',
          WebkitMaskImage:
            'linear-gradient(to right, black 0%, black 68%, rgba(0,0,0,0.72) 82%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, black 0%, black 68%, rgba(0,0,0,0.72) 82%, transparent 100%)',
        }}
      />

      <div className="absolute inset-y-0 left-[38vw] w-[40vw] bg-gradient-to-r from-transparent via-[#FAF7F2]/80 to-[#FAF7F2]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(0,44,31,0.08),transparent_34%),radial-gradient(circle_at_50%_82%,rgba(154,124,167,0.08),transparent_38%)]" />
    </div>
  );
}

function MobileBotanicalBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.98] mix-blend-multiply"
        style={{
          backgroundImage: `url(${AUTH_BACKGROUNDS.mobile})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(0,44,31,0.08),transparent_34%),radial-gradient(circle_at_82%_86%,rgba(154,124,167,0.08),transparent_36%)]" />

      <div className="absolute inset-x-0 bottom-0 h-[42svh] bg-gradient-to-b from-transparent via-[#FAF7F2]/76 to-[#FAF7F2]" />
    </div>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FAF7F2] font-sans text-[var(--color-text-primary)]">
      <style>
        {`
          @keyframes iris-scroll-cue {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.72;
            }
            50% {
              transform: translateY(8px);
              opacity: 1;
            }
          }

          .iris-scroll-cue {
            animation: iris-scroll-cue 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .iris-scroll-cue {
              animation: none;
            }
          }
        `}
      </style>

      {/* Desktop */}
      <section className="relative hidden min-h-screen lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(430px,0.92fr)]">
        <DesktopBotanicalBackground src={AUTH_BACKGROUNDS.desktop} />

        <aside className="relative z-10 flex min-h-screen flex-col justify-between px-12 py-10 xl:px-16">
          <div>
            <img src={LOGO_PATH} alt="IRIS" className="h-auto w-[74px]" />
          </div>

          <div className="max-w-[440px] pb-10">
            <p className="font-display text-[2.8rem] leading-[1.03] tracking-[-0.035em] text-[#002c1f] xl:text-[3.35rem]">
              O tempo passa,
              <br />
              mas o que sentimos permanece.
            </p>

            <p className="mt-6 max-w-sm text-base leading-8 text-[#476153] xl:text-lg">
              Um espaço protegido para sua identidade, suas memórias e conexões profundas.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-[#747D79]">
            <span className="h-px w-10 bg-[#B9C8B5]" />
            Presença, privacidade e cuidado
          </div>
        </aside>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-10 py-12 xl:px-16">
          <Card
            hover={false}
            className="w-full max-w-[430px] rounded-[32px] border border-[#E2E7E3]/90 !bg-white/[0.88] p-8 shadow-[0_24px_74px_rgba(17,17,17,0.08)] backdrop-blur-xl"
          >
            {children}
          </Card>
        </div>
      </section>

      {/* Tablet */}
      <section className="relative hidden min-h-screen md:grid md:grid-cols-[0.94fr_1.06fr] lg:hidden">
        <DesktopBotanicalBackground src={AUTH_BACKGROUNDS.tablet} />

        <aside className="relative z-10 flex min-h-screen flex-col justify-between px-8 py-9">
          <div>
            <img src={LOGO_PATH} alt="IRIS" className="h-auto w-[70px]" />
          </div>

          <div className="max-w-[350px] pb-8">
            <p className="font-display text-[2.35rem] leading-[1.04] tracking-[-0.035em] text-[#002c1f]">
              O tempo passa,
              <br />
              mas o que sentimos permanece.
            </p>

            <p className="mt-5 text-sm leading-7 text-[#476153]">
              Um espaço protegido para sua identidade, suas memórias e conexões profundas.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[0.64rem] font-medium uppercase tracking-[0.2em] text-[#747D79]">
            <span className="h-px w-8 bg-[#B9C8B5]" />
            Privacidade e cuidado
          </div>
        </aside>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-8 py-10">
          <Card
            hover={false}
            className="w-full max-w-[420px] rounded-[32px] border border-[#E2E7E3]/90 !bg-white/[0.9] p-7 shadow-[0_22px_66px_rgba(17,17,17,0.08)] backdrop-blur-xl"
          >
            {children}
          </Card>
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden">
        <div className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 pb-8 pt-7">
          <MobileBotanicalBackground />

          <div className="relative z-10">
            <img src={LOGO_PATH} alt="IRIS" className="h-auto w-[68px]" />
          </div>

          <div className="relative z-10 mt-auto pb-2 text-center">
            <p className="mx-auto max-w-[335px] font-display text-[2.18rem] leading-[1.04] tracking-[-0.035em] text-[#002c1f]">
              O tempo passa, mas o que sentimos permanece.
            </p>

            <p className="mx-auto mt-4 max-w-[300px] text-sm leading-6 text-[#476153]">
              Seu espaço seguro de memórias está logo abaixo.
            </p>

            <a
              href="#auth-form"
              className="mx-auto mt-7 inline-flex flex-col items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#002c1f]"
              aria-label="Descer para continuar"
            >
              <span>Deslize para continuar</span>
              <span className="iris-scroll-cue flex h-10 w-10 items-center justify-center rounded-full border border-[#DDE6DA] bg-white/82 text-base shadow-[0_8px_22px_rgba(17,17,17,0.08)] backdrop-blur">
                ↓
              </span>
            </a>
          </div>
        </div>

        <div
          id="auth-form"
          className="relative flex min-h-screen scroll-mt-0 items-center justify-center bg-[#FAF7F2] px-5 py-10"
        >
          <Card
            hover={false}
            className="w-full max-w-[430px] rounded-[32px] border border-[#E2E7E3]/90 !bg-white/[0.92] p-6 shadow-[0_18px_54px_rgba(17,17,17,0.08)] backdrop-blur-xl"
          >
            {children}
          </Card>
        </div>
      </section>
    </main>
  );
}