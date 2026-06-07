'use client';

import { useMemo, useState } from 'react';
import { updateSettingsSectionAction } from '@/lib/actions/settings.actions';
import { PrivacyHeader } from './_components/PrivacyHeader';
import { PrivacyToolbar, PrivacyFormFooter } from './_components/PrivacyToolbar';
import { PrivacyReadFields, PrivacyEditFields } from './_components/PrivacyFields';
import { PrivacyInsightPanel } from './_components/PrivacyInsightPanel';
import { PrivacySidebar } from './_components/PrivacySidebar';
import {
  normalizePrivacyData,
  normalizePrivacyLevel,
  type PrivacyData,
  type PrivacyProfile,
  type PrivacySectionKey,
} from './_utils/privacySettings';

type PrivacySettingsClientProps = {
  profile: PrivacyProfile;
  feedback?: {
    saved?: string;
    error?: string;
    readonly?: string;
  };
};

export function PrivacySettingsClient({
  profile,
  feedback,
}: PrivacySettingsClientProps) {
  const initialLevel = normalizePrivacyLevel(profile.privacy_level);
  const initialData = normalizePrivacyData(profile.privacy_data);

  const [isEditing, setIsEditing] = useState(false);
  const [openSection, setOpenSection] = useState<PrivacySectionKey>('');
  const [privacyLevel, setPrivacyLevel] = useState(initialLevel);
  const [privacyData, setPrivacyData] = useState<PrivacyData>(initialData);

  const completion = useMemo(() => {
    const required = [
      privacyLevel,
      privacyData.visibility,
      privacyData.discovery,
      privacyData.interactions,
      privacyData.intelligence,
    ];

    return Math.round((required.filter(Boolean).length / required.length) * 100);
  }, [privacyLevel, privacyData]);

  function startEditing() {
    setIsEditing(true);
    setOpenSection('visibility');
  }

  function cancelEditing() {
    setPrivacyLevel(initialLevel);
    setPrivacyData(initialData);
    setIsEditing(false);
    setOpenSection('');
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1B3A2E]">
      <div className="mx-auto w-full max-w-[1540px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <PrivacyHeader privacyLevel={privacyLevel} completion={completion} />

        <div className="grid gap-14 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <section className="min-w-0">
            <PrivacyToolbar
              isEditing={isEditing}
              onEdit={startEditing}
              onCancel={cancelEditing}
              feedback={feedback}
            />

            {!isEditing ? (
              <PrivacyReadFields
                level={privacyLevel}
                data={privacyData}
                openSection={openSection}
                onOpenSectionChange={setOpenSection}
              />
            ) : (
              <form action={updateSettingsSectionAction}>
                <input type="hidden" name="sectionKey" value="privacy" />

                <PrivacyEditFields
                  level={privacyLevel}
                  onLevelChange={setPrivacyLevel}
                  data={privacyData}
                  onDataChange={setPrivacyData}
                  openSection={openSection}
                  onOpenSectionChange={setOpenSection}
                />

                <PrivacyFormFooter />
              </form>
            )}

            <PrivacyInsightPanel level={privacyLevel} data={privacyData} />
          </section>

          <PrivacySidebar
            level={privacyLevel}
            data={privacyData}
            completion={completion}
          />
        </div>
      </div>
    </main>
  );
}
