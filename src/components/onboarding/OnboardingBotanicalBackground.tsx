const ONBOARDING_BACKGROUNDS = {
  desktop: '/iris/brand/backgrounds/desktop/fundo-botanico-suave.svg',
  tablet: '/iris/brand/backgrounds/tablet/fundo-botanico-suave.svg',
  mobile: '/iris/brand/backgrounds/mobile/fundo-botanico-suave.svg',
};

export function OnboardingBotanicalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div data-iris-botanical-base className="absolute inset-0 bg-[#FAF7F2]" />

      <div
        data-iris-botanical-image
        className="iris-onboarding-bg absolute inset-0 hidden opacity-[0.96] mix-blend-multiply lg:block"
        style={{
          backgroundImage: `url(${ONBOARDING_BACKGROUNDS.desktop})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      <div
        data-iris-botanical-image
        className="iris-onboarding-bg absolute inset-0 hidden opacity-[0.96] mix-blend-multiply md:block lg:hidden"
        style={{
          backgroundImage: `url(${ONBOARDING_BACKGROUNDS.tablet})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      <div
        data-iris-botanical-image
        className="iris-onboarding-bg absolute inset-0 opacity-[0.96] mix-blend-multiply md:hidden"
        style={{
          backgroundImage: `url(${ONBOARDING_BACKGROUNDS.mobile})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 14% 12%, rgba(0,44,31,0.08), transparent 32%), radial-gradient(circle at 88% 86%, rgba(154,124,167,0.10), transparent 38%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, var(--iris-accessibility-page-bg) 88%)',
          opacity: 0.68,
        }}
      />
    </div>
  );
}
