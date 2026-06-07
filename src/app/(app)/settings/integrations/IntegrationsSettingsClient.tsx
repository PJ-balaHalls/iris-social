'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { updateIntegrationPreferencesAction } from '@/lib/actions/integrations.actions';
import { IrisSwitch } from '@/components/ui/IrisSwitch';
import { IntegrationsHeader } from './_components/IntegrationsHeader';
import { IntegrationPluginCard } from './_components/IntegrationPluginCard';
import { IntegrationDetailsPanel } from './_components/IntegrationDetailsPanel';
import { IntegrationsSidebar } from './_components/IntegrationsSidebar';
import { IntegrationsToolbar } from './_components/IntegrationsToolbar';
import {
  filterPlugins,
  getPluginById,
  getPreparedCount,
  integrationCategories,
  integrationPlugins,
  normalizeIntegrationData,
  normalizeIntegrationPreferences,
  type IntegrationCategory,
  type IntegrationData,
  type IntegrationPreferences,
} from './_utils/integrationsCatalog';

type IntegrationsSettingsClientProps = {
  profile: Record<string, unknown>;
  feedback?: {
    saved?: string;
    error?: string;
  };
};

export function IntegrationsSettingsClient({
  profile,
  feedback,
}: IntegrationsSettingsClientProps) {
  const initialPreferences = normalizeIntegrationPreferences(
    profile.integration_preferences,
  );
  const initialData = normalizeIntegrationData(profile.integration_data);

  const [category, setCategory] = useState<IntegrationCategory>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(
    initialPreferences.lastViewed || integrationPlugins[0].id,
  );
  const [preferences, setPreferences] =
    useState<IntegrationPreferences>(initialPreferences);
  const [integrationData, setIntegrationData] =
    useState<IntegrationData>(initialData);

  const selectedPlugin = getPluginById(selectedId);
  const filteredPlugins = useMemo(
    () => filterPlugins(category, query),
    [category, query],
  );

  const preparedSet = useMemo(
    () => new Set(preferences.enabled),
    [preferences.enabled],
  );

  const preparedPlugins = useMemo(
    () =>
      integrationPlugins.filter((plugin) => preferences.enabled.includes(plugin.id)),
    [preferences.enabled],
  );

  function togglePrepared(pluginId: string) {
    const plugin = getPluginById(pluginId);
    const prepared = preferences.enabled.includes(pluginId);
    const now = new Date().toISOString();

    const nextEnabled = prepared
      ? preferences.enabled.filter((id) => id !== pluginId)
      : [...preferences.enabled, pluginId];

    const nextPlugins = {
      ...integrationData.plugins,
      [pluginId]: {
        status: prepared ? 'disabled' : 'prepared',
        scopes: plugin.scopes,
        updated_at: now,
      },
    } satisfies IntegrationData['plugins'];

    setPreferences({
      ...preferences,
      enabled: nextEnabled,
      lastViewed: pluginId,
      updated_at: now,
    });

    setIntegrationData({
      ...integrationData,
      plugins: nextPlugins,
      updated_at: now,
    });

    setSelectedId(pluginId);
  }

  function setQuickPreference(key: 'autoMusic' | 'storyMode' | 'apiAccessRequested', value: boolean) {
    setPreferences({
      ...preferences,
      [key]: value,
      updated_at: new Date().toISOString(),
    });
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1B3A2E]">
      <div className="mx-auto w-full max-w-[1640px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <IntegrationsHeader
          preparedCount={getPreparedCount(preferences)}
          totalCount={integrationPlugins.length}
        />

        <form action={updateIntegrationPreferencesAction}>
          <input
            type="hidden"
            name="integration_preferences"
            value={JSON.stringify(preferences)}
          />
          <input
            type="hidden"
            name="integration_data"
            value={JSON.stringify(integrationData)}
          />

          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_380px]">
            <section className="min-w-0">
              <IntegrationsToolbar
                saved={feedback?.saved}
                error={feedback?.error}
              />

              <section className="mb-8 rounded-[34px] border border-[#E2E7E3] bg-white/52 p-5 shadow-[0_20px_70px_rgba(27,58,46,0.06)] backdrop-blur-xl">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
                  <div>
                    <div className="relative">
                      <Search
                        size={17}
                        strokeWidth={1.8}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA4A1]"
                      />
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar Spotify, Instagram, API, memórias..."
                        className="min-h-12 w-full rounded-full border border-[#DDE6DA] bg-[#FFFDF8]/80 pl-11 pr-4 text-sm font-medium text-[#1B3A2E] outline-none transition placeholder:text-[#9AA4A1] focus:border-[#1B3A2E] focus:ring-4 focus:ring-[#1B3A2E]/10"
                      />
                    </div>

                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                      {integrationCategories.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setCategory(item.key)}
                          className={[
                            'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition',
                            category === item.key
                              ? 'border-[#1B3A2E] bg-[#1B3A2E] text-white'
                              : 'border-[#DDE6DA] bg-white/70 text-[#476153] hover:bg-white hover:text-[#1B3A2E]',
                          ].join(' ')}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#E2E7E3] bg-[#FFFDF8]/80 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <SlidersHorizontal
                        size={17}
                        strokeWidth={1.8}
                        className="text-[#1B3A2E]"
                      />
                      <p className="text-sm font-semibold text-[#1B3A2E]">
                        Preferências rápidas
                      </p>
                    </div>

                    <div className="space-y-4">
                      <IrisSwitch
                        checked={Boolean(preferences.autoMusic)}
                        onChange={(value) => setQuickPreference('autoMusic', value)}
                        label="Música enquanto navega"
                        description="Preparar player ambiental para Spotify ou Apple Music."
                      />

                      <IrisSwitch
                        checked={Boolean(preferences.storyMode)}
                        onChange={(value) => setQuickPreference('storyMode', value)}
                        label="Stories personalizados"
                        description="Preparar templates para Instagram e compartilhamento."
                      />

                      <IrisSwitch
                        checked={Boolean(preferences.apiAccessRequested)}
                        onChange={(value) =>
                          setQuickPreference('apiAccessRequested', value)
                        }
                        label="Solicitar acesso à API"
                        description="Marca interesse na futura camada developer."
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                {filteredPlugins.map((plugin) => (
                  <IntegrationPluginCard
                    key={plugin.id}
                    plugin={plugin}
                    prepared={preparedSet.has(plugin.id)}
                    selected={selectedId === plugin.id}
                    onSelect={() => {
                      setSelectedId(plugin.id);
                      setPreferences({
                        ...preferences,
                        lastViewed: plugin.id,
                      });
                    }}
                    onTogglePrepared={() => togglePrepared(plugin.id)}
                  />
                ))}
              </div>

              {filteredPlugins.length === 0 ? (
                <div className="mt-8 rounded-[30px] border border-dashed border-[#C7CFCC] bg-white/40 p-8 text-center">
                  <p className="font-display text-3xl tracking-[-0.05em] text-[#1B3A2E]">
                    Nenhum plugin encontrado.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#747D79]">
                    Tente buscar por música, stories, API, memórias, fotos ou filmes.
                  </p>
                </div>
              ) : null}
            </section>

            <IntegrationDetailsPanel
              plugin={selectedPlugin}
              prepared={preparedSet.has(selectedPlugin.id)}
              onTogglePrepared={() => togglePrepared(selectedPlugin.id)}
            />
          </div>

          <div className="mt-14 grid gap-10 xl:grid-cols-[minmax(0,1fr)_380px]">
            <section className="rounded-[36px] border border-[#E2E7E3] bg-[#111A16] p-7 text-white shadow-[0_32px_110px_rgba(15,21,18,0.18)] lg:p-9">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/48">
                Developer Preview
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-[2.4rem] leading-none tracking-[-0.06em]">
                Conecte outros apps à IRIS com escopos claros.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/64">
                A camada de API ficará preparada para OAuth Apps, webhooks, widgets,
                leitura de memórias autorizadas e escrita controlada por permissões.
              </p>

              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {['OAuth Apps', 'Webhooks assinados', 'Widgets seguros'].map((item) => (
                  <div
                    key={item}
                    className="rounded-[26px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl"
                  >
                    <p className="text-sm font-semibold text-white">{item}</p>
                    <p className="mt-2 text-sm leading-6 text-white/56">
                      Pré-configurado no catálogo para implementação futura.
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <IntegrationsSidebar
              preferences={preferences}
              preparedPlugins={preparedPlugins}
            />
          </div>
        </form>
      </div>
    </main>
  );
}
