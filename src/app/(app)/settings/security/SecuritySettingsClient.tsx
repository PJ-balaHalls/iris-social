'use client';

import { useMemo, useState } from 'react';
import { updateSecurityPreferencesAction } from '@/lib/actions/security.actions';
import { SecurityHeader } from './_components/SecurityHeader';
import {
  SecurityFormFooter,
  SecurityToolbar,
} from './_components/SecurityToolbar';
import {
  SecurityEditPreferences,
  SecurityReadPreferences,
} from './_components/SecurityPreferencesFields';
import { MemoryAccessPanel } from './_components/MemoryAccessPanel';
import { DevicesSessionsPanel } from './_components/DevicesSessionsPanel';
import { SecuritySidebar } from './_components/SecuritySidebar';
import {
  getSecurityScore,
  normalizeSecurityPreferences,
  type MemoryQuestion,
  type SecurityDevice,
  type SecurityPreferences,
  type SecuritySectionKey,
  type SecuritySession,
} from './_utils/securitySettings';

type SecuritySettingsClientProps = {
  preferences: Partial<SecurityPreferences> | null;
  memoryQuestions: MemoryQuestion[];
  devices: SecurityDevice[];
  sessions: SecuritySession[];
  currentUserAgent?: string | null;
  feedback?: {
    saved?: string;
    error?: string;
    readonly?: string;
  };
};

export function SecuritySettingsClient({
  preferences,
  memoryQuestions,
  devices,
  sessions,
  currentUserAgent,
  feedback,
}: SecuritySettingsClientProps) {
  const initialPreferences = normalizeSecurityPreferences(preferences);
  const [isEditing, setIsEditing] = useState(false);
  const [openSection, setOpenSection] = useState<SecuritySectionKey>('');
  const [securityPreferences, setSecurityPreferences] =
    useState<SecurityPreferences>(initialPreferences);

  const score = useMemo(
    () => getSecurityScore(securityPreferences, memoryQuestions.length),
    [securityPreferences, memoryQuestions.length],
  );

  function startEditing() {
    setIsEditing(true);
    setOpenSection('access');
  }

  function cancelEditing() {
    setSecurityPreferences(initialPreferences);
    setIsEditing(false);
    setOpenSection('');
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1B3A2E]">
      <div className="mx-auto w-full max-w-[1540px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <SecurityHeader score={score} questionsCount={memoryQuestions.length} />

        <div className="grid gap-14 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <section className="min-w-0">
            <SecurityToolbar
              isEditing={isEditing}
              onEdit={startEditing}
              onCancel={cancelEditing}
              feedback={feedback}
            />

            {!isEditing ? (
              <SecurityReadPreferences
                preferences={securityPreferences}
                openSection={openSection}
                onOpenSectionChange={setOpenSection}
              />
            ) : (
              <form action={updateSecurityPreferencesAction}>
                <SecurityEditPreferences
                  preferences={securityPreferences}
                  onChange={setSecurityPreferences}
                  openSection={openSection}
                  onOpenSectionChange={setOpenSection}
                />

                <SecurityFormFooter />
              </form>
            )}

            <MemoryAccessPanel
              preferences={securityPreferences}
              questions={memoryQuestions}
              openSection={openSection}
              onOpenSectionChange={setOpenSection}
            />

            <DevicesSessionsPanel
              devices={devices}
              sessions={sessions}
              currentUserAgent={currentUserAgent}
              openSection={openSection}
              onOpenSectionChange={setOpenSection}
            />
          </section>

          <SecuritySidebar
            preferences={securityPreferences}
            questionsCount={memoryQuestions.length}
            devicesCount={devices.length}
            sessionsCount={sessions.length}
          />
        </div>
      </div>
    </main>
  );
}
