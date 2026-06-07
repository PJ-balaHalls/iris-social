'use client';

import { useMemo, useState } from 'react';
import { updateSettingsSectionAction } from '@/lib/actions/settings.actions';
import {
  formatDateInput,
  rawString,
  type AccountKnowledgePayload,
  type AccountProfile,
} from './_utils/accountSettings';
import { AccountHeader } from './_components/AccountHeader';
import {
  AccountEditFields,
  AccountReadFields,
  type AccountInfoSection,
} from './_components/AccountFields';
import { AccountKnowledgePanel } from './_components/AccountKnowledgePanel';
import { AccountSidebar } from './_components/AccountSidebar';
import { AccountFormFooter, AccountToolbar } from './_components/AccountToolbar';

type AccountSettingsClientProps = {
  profile: AccountProfile;
  email?: string | null;
  authUser?: AccountKnowledgePayload['account'];
  subscription?: Record<string, unknown> | null;
  feedback?: {
    saved?: string;
    error?: string;
    readonly?: string;
  };
};

export function AccountSettingsClient({
  profile,
  email,
  authUser,
  subscription,
  feedback,
}: AccountSettingsClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [openInfoSection, setOpenInfoSection] = useState<AccountInfoSection>('');
  const [birthDate, setBirthDate] = useState(formatDateInput(profile.birth_date));
  const [language, setLanguage] = useState(rawString(profile.language) || 'pt-BR');

  const completion = useMemo(() => {
    const fields = [
      profile.full_name,
      profile.first_name,
      profile.birth_date,
      profile.country,
      profile.language,
    ];

    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [profile]);

  const knowledgePayload: AccountKnowledgePayload = useMemo(
    () => ({
      account: {
        id: authUser?.id,
        email: authUser?.email ?? email ?? null,
        phone: authUser?.phone ?? null,
        created_at: authUser?.created_at ?? null,
        last_sign_in_at: authUser?.last_sign_in_at ?? null,
        email_confirmed_at: authUser?.email_confirmed_at ?? null,
        user_metadata: authUser?.user_metadata ?? {},
        app_metadata: authUser?.app_metadata ?? {},
      },
      profile,
      subscription: subscription ?? null,
      exported_at: new Date().toISOString(),
    }),
    [authUser, email, profile, subscription],
  );

  function cancelEditing() {
    setBirthDate(formatDateInput(profile.birth_date));
    setLanguage(rawString(profile.language) || 'pt-BR');
    setIsEditing(false);
    setOpenInfoSection('');
  }

  function startEditing() {
    setIsEditing(true);
    setOpenInfoSection('essenciais');
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1B3A2E]">
      <div className="mx-auto w-full max-w-[1540px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <AccountHeader profile={profile} email={email} completion={completion} />

        <div className="grid gap-14 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <section className="min-w-0">
            <AccountToolbar
              isEditing={isEditing}
              onEdit={startEditing}
              onCancel={cancelEditing}
              feedback={feedback}
            />

            {!isEditing ? (
              <AccountReadFields
                profile={profile}
                openSection={openInfoSection}
                onOpenSectionChange={setOpenInfoSection}
              />
            ) : (
              <form action={updateSettingsSectionAction}>
                <input type="hidden" name="sectionKey" value="account" />

                <AccountEditFields
                  profile={profile}
                  birthDate={birthDate}
                  onBirthDateChange={setBirthDate}
                  language={language}
                  onLanguageChange={setLanguage}
                  openSection={openInfoSection}
                  onOpenSectionChange={setOpenInfoSection}
                />

                <AccountFormFooter />
              </form>
            )}

            <AccountKnowledgePanel payload={knowledgePayload} />
          </section>

          <AccountSidebar
            profile={profile}
            email={email}
            completion={completion}
            payload={knowledgePayload}
          />
        </div>
      </div>
    </main>
  );
}
