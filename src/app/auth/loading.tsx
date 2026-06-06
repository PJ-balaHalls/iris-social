import { Spinner } from '@/components/global/Loader/Spinner';

export default function AuthLoading() {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center">
      <Spinner
        size="lg"
        withBrand
        label="Abrindo seu espaço seguro..."
      />
    </div>
  );
}