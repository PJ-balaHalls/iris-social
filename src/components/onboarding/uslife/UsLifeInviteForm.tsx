'use client';

import { Mail, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/Input';

type UsLifeInviteFormProps = {
  partnerName: string;
  partnerContact: string;
  contactError?: string;
  onPartnerNameChange: (value: string) => void;
  onPartnerContactChange: (value: string) => void;
};

export function UsLifeInviteForm({
  partnerName,
  partnerContact,
  contactError,
  onPartnerNameChange,
  onPartnerContactChange,
}: UsLifeInviteFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-800/10 bg-emerald-800/[0.055] text-[#002c1f]">
          <Mail size={17} strokeWidth={1.8} />
        </span>

        <h2 className="font-display text-3xl leading-tight tracking-[-0.04em] text-[#002c1f] sm:text-4xl">
          Para quem será o convite?
        </h2>
      </div>

      <div className="space-y-4">
        <Input
          id="partnerName"
          name="partnerName"
          label="Nome da pessoa"
          value={partnerName}
          onChange={(event) => onPartnerNameChange(event.target.value)}
          placeholder="Nome ou apelido"
          autoComplete="name"
          helper="Opcional. Serve apenas para personalizar o convite."
        />

        <Input
          id="partnerContact"
          name="partnerContact"
          label="E-mail ou @"
          value={partnerContact}
          onChange={(event) => onPartnerContactChange(event.target.value)}
          placeholder="email@exemplo.com ou @username"
          autoComplete="email"
          error={contactError}
          helper="Use e-mail para convite externo ou @ para pessoa já cadastrada."
        />

        <div className="rounded-[22px] border border-white/70 bg-white/[0.26] p-4">
          <div className="flex items-start gap-3">
            <UserRound size={17} strokeWidth={1.8} className="mt-0.5 text-[#002c1f]" />

            <p className="text-sm leading-6 text-[#476153]">
              O convite será preparado, mas o envio real pode ser conectado depois ao sistema de e-mail/notificação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
