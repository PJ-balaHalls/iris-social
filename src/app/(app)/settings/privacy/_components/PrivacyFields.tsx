'use client';

import { Check, LockKeyhole } from 'lucide-react';
import { IrisDisclosureSection } from '@/components/ui/IrisDisclosureSection';
import { IrisSelectField } from '@/components/ui/IrisSelectField';
import { IrisSwitch } from '@/components/ui/IrisSwitch';
import {
  privacyCopy,
  privacyLevelLabels,
  privacyLevelOptions,
  setPrivacyBoolean,
  type PrivacyData,
  type PrivacyLevel,
  type PrivacySectionKey,
} from '../_utils/privacySettings';

function toggleSection(
  current: PrivacySectionKey,
  target: Exclude<PrivacySectionKey, ''>,
  onChange: (section: PrivacySectionKey) => void,
) {
  onChange(current === target ? '' : target);
}

function ReadLine({
  title,
  description,
  active,
}: {
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div className="grid gap-3 border-b border-[#E2E7E3] py-5 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="text-sm font-semibold text-[#1B3A2E]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[#747D79]">{description}</p>
      </div>

      <span
        className={[
          'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold',
          active
            ? 'border-[#DDE6DA] bg-[#F2F7F3] text-[#1B3A2E]'
            : 'border-[#E2E7E3] bg-white/60 text-[#747D79]',
        ].join(' ')}
      >
        {active ? <Check size={13} strokeWidth={1.8} /> : <LockKeyhole size={13} strokeWidth={1.8} />}
        {active ? 'Ativo' : 'Desativado'}
      </span>
    </div>
  );
}

function EditLine({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="border-b border-[#E2E7E3] py-5 last:border-b-0">
      <IrisSwitch
        checked={checked}
        onChange={onChange}
        label={title}
        description={description}
      />
    </div>
  );
}

function PrivacyLevelRead({ level }: { level: PrivacyLevel }) {
  return (
    <div className="border-b border-[#E2E7E3] py-5">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#747D79]">
        Nível de privacidade
      </p>
      <p className="mt-2 text-base font-semibold text-[#1B3A2E]">
        {privacyLevelLabels[level]}
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#747D79]">
        Esse nível resume o comportamento geral da conta. Os controles abaixo refinam
        a experiência.
      </p>
    </div>
  );
}

function PrivacyLevelEdit({
  level,
  onChange,
}: {
  level: PrivacyLevel;
  onChange: (value: PrivacyLevel) => void;
}) {
  return (
    <div className="border-b border-[#E2E7E3] py-5">
      <IrisSelectField
        id="privacy-level"
        name="privacy_level"
        label="Nível de privacidade"
        value={level}
        onChange={(value) => onChange(value as PrivacyLevel)}
        options={privacyLevelOptions}
        placeholder="Selecionar nível"
        helper="Esse nível ajuda a IRIS a interpretar sua preferência geral de exposição."
      />
    </div>
  );
}

function renderReadSection(section: Exclude<PrivacySectionKey, ''>, data: PrivacyData) {
  const copy = privacyCopy[section];
  const entries = Object.entries(copy.fields) as Array<[
    string,
    { title: string; description: string },
  ]>;

  return (
    <div className="border-t border-[#E2E7E3]">
      {entries.map(([key, item]) => (
        <ReadLine
          key={key}
          title={item.title}
          description={item.description}
          active={Boolean(data[section][key as keyof typeof data[typeof section]])}
        />
      ))}
    </div>
  );
}

function renderEditSection(
  section: Exclude<PrivacySectionKey, ''>,
  data: PrivacyData,
  onChange: (data: PrivacyData) => void,
) {
  const copy = privacyCopy[section];
  const entries = Object.entries(copy.fields) as Array<[
    string,
    { title: string; description: string },
  ]>;

  return (
    <div className="border-t border-[#E2E7E3]">
      {entries.map(([key, item]) => (
        <EditLine
          key={key}
          title={item.title}
          description={item.description}
          checked={Boolean(data[section][key as keyof typeof data[typeof section]])}
          onChange={(value) => onChange(setPrivacyBoolean(data, section, key, value))}
        />
      ))}
    </div>
  );
}

export function PrivacyReadFields({
  level,
  data,
  openSection,
  onOpenSectionChange,
}: {
  level: PrivacyLevel;
  data: PrivacyData;
  openSection: PrivacySectionKey;
  onOpenSectionChange: (section: PrivacySectionKey) => void;
}) {
  return (
    <div className="space-y-2">
      <IrisDisclosureSection
        eyebrow="Nível"
        title="Base de privacidade"
        description="Abra para ver o nível geral aplicado à sua conta."
        open={openSection === 'visibility'}
        onToggle={() => toggleSection(openSection, 'visibility', onOpenSectionChange)}
      >
        <PrivacyLevelRead level={level} />
        {renderReadSection('visibility', data)}
      </IrisDisclosureSection>

      <IrisDisclosureSection
        eyebrow={privacyCopy.discovery.eyebrow}
        title={privacyCopy.discovery.title}
        description={privacyCopy.discovery.description}
        open={openSection === 'discovery'}
        onToggle={() => toggleSection(openSection, 'discovery', onOpenSectionChange)}
      >
        {renderReadSection('discovery', data)}
      </IrisDisclosureSection>

      <IrisDisclosureSection
        eyebrow={privacyCopy.interactions.eyebrow}
        title={privacyCopy.interactions.title}
        description={privacyCopy.interactions.description}
        open={openSection === 'interactions'}
        onToggle={() => toggleSection(openSection, 'interactions', onOpenSectionChange)}
      >
        {renderReadSection('interactions', data)}
      </IrisDisclosureSection>

      <IrisDisclosureSection
        eyebrow={privacyCopy.intelligence.eyebrow}
        title={privacyCopy.intelligence.title}
        description={privacyCopy.intelligence.description}
        open={openSection === 'intelligence'}
        onToggle={() => toggleSection(openSection, 'intelligence', onOpenSectionChange)}
      >
        {renderReadSection('intelligence', data)}
      </IrisDisclosureSection>
    </div>
  );
}

export function PrivacyEditFields({
  level,
  onLevelChange,
  data,
  onDataChange,
  openSection,
  onOpenSectionChange,
}: {
  level: PrivacyLevel;
  onLevelChange: (level: PrivacyLevel) => void;
  data: PrivacyData;
  onDataChange: (data: PrivacyData) => void;
  openSection: PrivacySectionKey;
  onOpenSectionChange: (section: PrivacySectionKey) => void;
}) {
  return (
    <div className="space-y-2">
      <input type="hidden" name="privacy_data" value={JSON.stringify(data)} />

      <IrisDisclosureSection
        eyebrow="Nível"
        title="Editar base de privacidade"
        description="Abra para alterar o nível geral e controles de visibilidade."
        open={openSection === 'visibility'}
        onToggle={() => toggleSection(openSection, 'visibility', onOpenSectionChange)}
      >
        <PrivacyLevelEdit level={level} onChange={onLevelChange} />
        {renderEditSection('visibility', data, onDataChange)}
      </IrisDisclosureSection>

      <IrisDisclosureSection
        eyebrow={privacyCopy.discovery.eyebrow}
        title={privacyCopy.discovery.title}
        description={privacyCopy.discovery.description}
        open={openSection === 'discovery'}
        onToggle={() => toggleSection(openSection, 'discovery', onOpenSectionChange)}
      >
        {renderEditSection('discovery', data, onDataChange)}
      </IrisDisclosureSection>

      <IrisDisclosureSection
        eyebrow={privacyCopy.interactions.eyebrow}
        title={privacyCopy.interactions.title}
        description={privacyCopy.interactions.description}
        open={openSection === 'interactions'}
        onToggle={() => toggleSection(openSection, 'interactions', onOpenSectionChange)}
      >
        {renderEditSection('interactions', data, onDataChange)}
      </IrisDisclosureSection>

      <IrisDisclosureSection
        eyebrow={privacyCopy.intelligence.eyebrow}
        title={privacyCopy.intelligence.title}
        description={privacyCopy.intelligence.description}
        open={openSection === 'intelligence'}
        onToggle={() => toggleSection(openSection, 'intelligence', onOpenSectionChange)}
      >
        {renderEditSection('intelligence', data, onDataChange)}
      </IrisDisclosureSection>
    </div>
  );
}
