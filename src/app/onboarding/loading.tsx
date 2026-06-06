import { Spinner } from '@/components/global/Loader/Spinner';

export default function OnboardingLoading() {
  return (
    <div className="flex min-h-[520px] w-full items-center justify-center">
      <div className="rounded-[28px] border border-[#DDE6DA]/80 bg-white/[0.64] px-8 py-7 shadow-[0_18px_54px_rgba(17,17,17,0.06)] backdrop-blur-xl">
        <Spinner
          size="lg"
          tone="brand"
          withBrand
          label="Preparando seu onboarding..."
        />
      </div>
    </div>
  );
}
