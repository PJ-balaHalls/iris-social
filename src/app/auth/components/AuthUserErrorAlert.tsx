import { Card } from '@/components/ui/Card';
import type { AuthActionError } from '@/lib/erros/auth';

type AuthUserErrorAlertProps = {
  error: AuthActionError;
};

export function AuthUserErrorAlert({ error }: AuthUserErrorAlertProps) {
  return (
    <Card
      hover={false}
      className="rounded-[22px] border border-[#F3C9C7] !bg-[#FCE8E8] p-4 shadow-none"
    >
      <div role="alert" className="space-y-1">
        <p className="text-sm font-semibold leading-6 text-[#8F312D]">
          {error.title}
        </p>

        <p className="text-sm leading-6 text-[#8F312D]">
          {error.message}
        </p>

        <p className="text-xs leading-5 text-[#8F312D]/80">
          {error.action}
        </p>
      </div>
    </Card>
  );
}