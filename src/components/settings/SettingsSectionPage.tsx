import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Database, Save, ShieldCheck } from 'lucide-react';
import { updateSettingsSectionAction } from '@/lib/actions/settings.actions';
import { getSettingByKey } from '@/lib/settings/settingsCatalog';
import { getFieldsForSetting } from '@/lib/settings/settingsFields';
import { createServer } from '@/lib/supabase/server';
import { SettingsFieldRenderer } from './SettingsFieldRenderer';
import { SettingsIcon } from './SettingsIcon';

type SettingsSectionPageProps = {
  sectionKey: string;
};

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

function isEditableField(type: string, readonly?: boolean) {
  return !readonly && type !== 'readonly';
}

async function getSettingsData() {
  const supabase = createServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return {
    user,
    profile: profile || {},
    subscription: subscription || {},
  };
}

export async function SettingsSectionPage({
  sectionKey,
}: SettingsSectionPageProps) {
  const option = getSettingByKey(sectionKey);
  const fields = getFieldsForSetting(option.key, option.columns);
  const { profile, subscription } = await getSettingsData();

  const sourceData = option.source === 'subscriptions' ? subscription : profile;

  const canEdit =
    option.source === 'profiles' &&
    fields.some((field) => isEditableField(field.type, ('readonly' in field ? field.readonly : false)));

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-5 text-[#1B3A2E] sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1440px] gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="rounded-[34px] border border-white/75 bg-white/45 p-5 shadow-[0_24px_80px_rgba(27,58,46,0.08)] backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="flex flex-col justify-between gap-5 border-b border-emerald-950/10 pb-6 lg:flex-row lg:items-start">
            <div>
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#476153] transition hover:bg-white"
              >
                <ArrowLeft size={14} strokeWidth={1.8} />
                Configurações
              </Link>

              <div className="mt-6 flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] border border-emerald-950/10 bg-[#F2F4F3] text-[#1B3A2E]">
                  <SettingsIcon name={option.icon} size={23} />
                </span>

                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#747D79]">
                    {option.group}
                  </p>

                  <h1 className="mt-2 font-display text-5xl leading-[0.95] tracking-[-0.07em] text-[#1B3A2E] sm:text-6xl">
                    {option.title}
                  </h1>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-[#476153]">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>

            <span className="inline-flex w-fit rounded-full border border-emerald-950/10 bg-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#476153]">
              {option.status}
            </span>
          </div>

          <form action={updateSettingsSectionAction} className="mt-6">
            <input type="hidden" name="sectionKey" value={option.key} />

            <div className="grid gap-4 lg:grid-cols-2">
              {fields.map((field) => (
                <SettingsFieldRenderer
                  key={field.name}
                  field={field}
                  value={(sourceData as Record<string, unknown>)?.[field.name]}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {canEdit ? (
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] bg-[#1B3A2E] px-5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(27,58,46,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0F1512]"
                >
                  <Save size={16} strokeWidth={1.8} />
                  Salvar ajustes
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-12 items-center justify-center rounded-[18px] border border-emerald-950/10 bg-white/45 px-5 text-sm font-semibold text-[#747D79]"
                >
                  Área somente leitura
                </button>
              )}

              <Link
                href="/settings"
                className="inline-flex min-h-12 items-center justify-center rounded-[18px] border border-emerald-950/10 bg-white/55 px-5 text-sm font-semibold text-[#1B3A2E] transition hover:bg-white"
              >
                Voltar ao hub
              </Link>
            </div>
          </form>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-5 xl:self-start">
          <div className="rounded-[30px] border border-white/75 bg-[#1B3A2E] p-5 text-white shadow-[0_24px_70px_rgba(27,58,46,0.16)]">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={19}
                strokeWidth={1.8}
                className="mt-0.5 text-white/75"
              />

              <div>
                <h2 className="font-display text-3xl leading-none tracking-[-0.045em]">
                  Ajuste seguro
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/72">
                  Cada área tem sua própria rota e salva somente campos permitidos.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/75 bg-white/45 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <Database size={17} strokeWidth={1.8} className="text-[#1B3A2E]" />
              <h2 className="text-sm font-semibold text-[#1B3A2E]">
                Dados relacionados
              </h2>
            </div>

            <div className="space-y-3">
              {option.columns.map((column) => (
                <div
                  key={column}
                  className="rounded-[18px] border border-white/70 bg-white/45 p-3"
                >
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#747D79]">
                    {option.source} · {column}
                  </p>

                  <pre className="mt-2 max-h-36 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-[#1B3A2E]">
                    {formatValue((sourceData as Record<string, unknown>)?.[column])}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}