const WELCOME_BACKGROUNDS = {
  desktop: '/iris/brand/backgrounds/desktop/fundo-botanico-suave.svg',
  tablet: '/iris/brand/backgrounds/tablet/fundo-botanico-suave.svg',
  mobile: '/iris/brand/backgrounds/mobile/fundo-botanico-suave.svg',
};

export function WelcomeBotanicalBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[#FAF7F2]" />

      <div
        className="iris-welcome-breathe absolute inset-y-0 left-0 hidden w-[72%] opacity-[0.96] mix-blend-multiply lg:block"
        style={{
          backgroundImage: `url(${WELCOME_BACKGROUNDS.desktop})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center',
          backgroundSize: 'auto 100%',
          WebkitMaskImage:
            'linear-gradient(to right, black 0%, black 62%, rgba(0,0,0,0.74) 76%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, black 0%, black 62%, rgba(0,0,0,0.74) 76%, transparent 100%)',
        }}
      />

      <div
        className="iris-welcome-breathe absolute inset-y-0 left-0 hidden w-[76%] opacity-[0.94] mix-blend-multiply md:block lg:hidden"
        style={{
          backgroundImage: `url(${WELCOME_BACKGROUNDS.tablet})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center',
          backgroundSize: 'auto 100%',
          WebkitMaskImage:
            'linear-gradient(to right, black 0%, black 60%, rgba(0,0,0,0.70) 78%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, black 0%, black 60%, rgba(0,0,0,0.70) 78%, transparent 100%)',
        }}
      />

      <div
        className="iris-welcome-breathe absolute inset-0 opacity-[0.94] mix-blend-multiply md:hidden"
        style={{
          backgroundImage: `url(${WELCOME_BACKGROUNDS.mobile})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      />

      <div className="absolute inset-y-0 left-[36%] hidden w-[46%] bg-gradient-to-r from-transparent via-[#FAF7F2]/82 to-[#FAF7F2] md:block" />
      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-b from-transparent via-[#FAF7F2]/78 to-[#FAF7F2] md:hidden" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(0,44,31,0.07),transparent_34%),radial-gradient(circle_at_86%_76%,rgba(154,124,167,0.09),transparent_36%)]" />
    </div>
  );
}
