import { Spinner } from '@/components/global/Loader/Spinner';

export default function GlobalLoading() {
  return (
    <Spinner
      fullScreen
      size="lg"
      withBrand
      label="Preparando seu espaço..."
    />
  );
}