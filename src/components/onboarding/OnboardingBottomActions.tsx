import type { ReactNode } from 'react';
import { OnboardingStepInfoDrawer } from './OnboardingStepInfoDrawer';

type OnboardingBottomActionsProps = {
  helpTitle: string;
  help: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function OnboardingBottomActions({
  helpTitle,
  help,
  left,
  right,
  className = '',
}: OnboardingBottomActionsProps) {
  return (
    <div
      className={[
        'grid grid-cols-1 items-center gap-3 pt-8 sm:grid-cols-[1fr_auto_1fr]',
        className,
      ].join(' ')}
    >
      <div className="sm:justify-self-start">
        {left}
      </div>

      <div className="justify-self-center">
        <OnboardingStepInfoDrawer title={helpTitle}>
          {help}
        </OnboardingStepInfoDrawer>
      </div>

      <div className="sm:justify-self-end">
        {right}
      </div>
    </div>
  );
}
