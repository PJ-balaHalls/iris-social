# IRIS Social – Estrutura e Arquitetura

IRIS é uma rede social focada em identidade, memória e conexões profundas. Este repositório contém toda a estrutura front-end (Next.js 14), integração com Supabase, sistema de feature flags, temas personalizáveis e design system NÓS.

Arquitetura Geral

iris-social/
├── public/               # Arquivos estáticos (imagens, fontes, documentos, sitemap.xml)
├── src/
│   ├── app/              # Next.js App Router (páginas públicas, autenticação, onboarding, app protegido)
│   ├── components/       # Componentes reutilizáveis (globais, navbar, empty states, forms, UI)
│   ├── feature-flags/    # Sistema de feature flags (toggles para funcionalidades)
│   ├── lib/              # Lógica de negócio: API clients, hooks, stores, utilities, Supabase
│   ├── styles/           # Estilos globais e temas (claro, escuro, alto contraste, dislexia)
│   └── types/            # Definições TypeScript globais
├── env/                  # Variáveis de ambiente (development.env, staging.env, production.env, validation.js)
├── docs/                 # Documentação complementar (feature-flags-sql.sql, etc.)
├── examples/             # Exemplos de integração (feature flags, etc.)
├── tests/                # Testes unitários, integração e e2e
└── arquivos de configuração: package.json, tsconfig.json, next.config.js, tailwind.config.js, postcss.config.js, .gitignore, .env.example, .env.local, .env.production

Tecnologias principais

- Next.js 14 (App Router, Server Components)
- React 18 (Client Components)
- Supabase (autenticação, banco de dados, storage, realtime)
- Tailwind CSS 3.4.1 (estilização utilitária)
- TypeScript (tipagem estática)
- Zustand (gerenciamento de estado local – opcional)
- Feature Flags (sistema próprio com suporte a rollout percentual)

Instalação e Execução

Pré-requisitos:
- Node.js 18+ e npm/yarn/pnpm
- Conta no Supabase (gratuita)

Passos:

1. Clone o repositório (ou extraia o conteúdo gerado pelo stepstart.js)
   cd iris-social

2. Instale as dependências (já configuradas no package.json)
   npm install

3. Configure as variáveis de ambiente
   cp .env.example .env.local
   Edite .env.local com suas credenciais do Supabase:
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima

4. Execute o servidor de desenvolvimento
   npm run dev

5. Acesse http://localhost:3000

Scripts disponíveis:
- npm run dev – modo desenvolvimento
- npm run build – build de produção
- npm run start – servidor de produção
- npm run lint – verificação de código

Mapa de Telas e Rotas

Todo o mapeamento completo está descrito no arquivo original MAPA IRIS (1).pdf. Abaixo, um resumo das principais rotas implementadas:

Categoria: Site público
Rotas: /, /manifesto, /produto, /planos, /seguranca, /marketplace, /comunidades, /kids, /blog, /faq, /legal

Categoria: Autenticação
Rotas: /auth/login, /auth/register, /auth/forgot-password, /auth/reset-password, /auth/verify-email, /auth/security-code

Categoria: Onboarding (15 etapas)
Rotas: /onboarding/welcome, /onboarding/basic-info, /onboarding/avatar, /onboarding/username, /onboarding/personality, /onboarding/values, /onboarding/culture, /onboarding/integrations, /onboarding/intention, /onboarding/privacy, /onboarding/accessibility, /onboarding/kids, /onboarding/uslife-invite, /onboarding/plan, /onboarding/finish

Categoria: App protegido (grupo /app)
Rotas: /app/home, /app/ilife, /app/ilife/journals, /app/ilife/albums, /app/ilife/letters, /app/ilife/library, /app/ilife/dreams, /app/ilife/timeline, /app/uslife, /app/uslife/create, /app/uslife/journal, /app/uslife/albums, /app/uslife/letters, /app/uslife/ceremony, /app/uslife/relic, /app/profile/[username], /app/profile/edit, /app/profile/blocks/new, /app/feed, /app/feed/[topic], /app/post/[id], /app/communities, /app/communities/new, /app/communities/[id], /app/communities/[id]/library, /app/messages, /app/messages/[id], /app/messages/requests, /app/ai, /app/ai/agents, /app/ai/agents/[id], /app/videos, /app/videos/upload, /app/marketplace, /app/marketplace/item/[id], /app/creator, /app/notifications, /app/search, /app/me, /app/settings, /app/settings/account, /app/settings/privacy, /app/settings/security, /app/settings/appearance, /app/settings/accessibility, /app/settings/language, /app/settings/integrations, /app/settings/subscription, /app/settings/data-export, /app/settings/sensitive-content, /app/settings/kids, /app/settings/devices, /app/settings/delete-account

Categoria: IRIS Kids (modo protegido)
Rotas: /kids/home, /kids/guardian

Categoria: Segurança e pagamento
Rotas: /safety, /billing, /billing/checkout

Categoria: Erros e estados vazios
Rotas: /error/404, /error/401, /error/403, /error/500, /error/offline
Componentes de estado vazio: NoMemories, NoLetters, NoAlbums, NoCommunities, NoMessages, NoNotifications, NoUslife, NoSearchResults, NoPurchases, NoFeedTopic

Todas as rotas do grupo /app são protegidas por autenticação e usam o AppShell (MobileBottomNav + Topbar + Sidebar desktop).

Temas e Estilos

Os temas ficam em src/styles/themes/:
- defaultTheme.ts – tema oficial do design system NÓS
- lightTheme.ts – tema claro personalizável
- darkTheme.ts – tema escuro personalizável
- highContrastTheme.ts – alto contraste para acessibilidade
- dyslexiaFriendlyTheme.ts – modo dislexia

O tema é controlado via themeStore.ts (Zustand) e pode ser alterado nas configurações de aparência (/app/settings/appearance). O usuário pode escolher entre seguir o sistema, tema claro, escuro, alto contraste ou modo dislexia.

Feature Flags

O sistema de feature flags permite ativar/desativar funcionalidades sem deploy. Localização: src/feature-flags/

Flags disponíveis (exemplo):
- uslife – módulo de relacionamento
- iris-ai – assistente IA
- marketplace – loja de temas/widgets
- kids-mode – modo crianças
- video-upload – upload de vídeos
- symbolic-ceremony – casamento simbólico
- new-feed-ui – experimento A/B (novo layout do feed)
- unlimited-blocks – blocos ilimitados no Identity Space

Como usar em componentes:

import { useFeatureFlag, FeatureFlag } from '@/feature-flags';

function MeuComponente() {
  const isUslifeEnabled = useFeatureFlag('uslife');
  return isUslifeEnabled ? <UslifeModule /> : null;
}

Ou com componente condicional:
<FeatureFlag name="marketplace" fallback={<VersaoBasica />}>
  <MarketplaceCompleto />
</FeatureFlag>

As flags podem ser estáticas (via flags.config.ts) ou dinâmicas (via tabela feature_flags no Supabase). O script SQL para criar a tabela está em docs/feature-flags-sql.sql. A integração com Supabase suporta rollout percentual (ex: ativar para 20% dos usuários baseado no hash do userId). O arquivo src/lib/supabase/featureFlags.ts contém a função getUserFeatureFlags que carrega as flags do banco e aplica as regras.

Supabase – Estrutura de Dados

As principais tabelas (a serem criadas):
- users – estende a auth.users padrão do Supabase
- profiles – nome, @username, bio, avatar, configurações de privacidade, plano
- memories – diários, cartas, álbuns, sonhos (com campos: tipo, título, conteúdo, mídia, tags, privacidade)
- uslife_spaces – espaços compartilhados (tipo: casal, amizade íntima, família, parceria criativa)
- uslife_entries – entradas em diários compartilhados, álbuns, cartas do usLIFE
- communities – comunidades temáticas (nome, descrição, capa, regras, privacidade)
- community_members – relacionamento usuário-comunidade com papel
- feature_flags – controle de toggles (flag_name, enabled, percentage, user_id, environment)
- subscriptions – planos (free, premium, duo, creator) com data de início, fim, status

Consulte os arquivos em docs/supabase-schema.sql (a ser criado) para o esquema completo com relacionamentos e políticas de segurança (RLS).

Componentes Globais

A pasta src/components/global/ contém:
- Modal/Modal.tsx e ConfirmModal.tsx
- Toast/Toast.tsx e ToastContainer.tsx
- Loader/LoaderSkeleton.tsx e Spinner.tsx
- FabButton/FabButton.tsx
- PrivacySelector/PrivacySelector.tsx
- AffinityIndicator/AffinityIndicator.tsx
- VerificationBadge/VerificationBadge.tsx
- NotificationBadge/NotificationBadge.tsx
- ContextMenu/ContextMenu.tsx

Navbar: MobileBottomNav, Topbar, SidebarDesktop (responsivo).
Empty-states: componentes para cada tipo de lista vazia.
Forms: RichTextEditor, ImageUploader, AudioRecorder, TagInput.
UI: Button, Card, Input, Select, Slider, Switch, Tabs, Avatar.

Testes

- Unitários: tests/unit/ (ex: example.test.ts)
- Integração: tests/integration/ (ex: example.test.ts)
- E2E: tests/e2e/ (ex: example.spec.ts) com Playwright ou Cypress.

Para executar (após configurar scripts no package.json):
npm run test        # unitários
npm run test:integration
npm run test:e2e

Scripts de Automação

- stepstart.js – cria toda a estrutura de pastas e arquivos (executar apenas uma vez na inicialização do projeto)
- setup-feature-flags.js – adiciona o sistema de feature flags e exemplos

Ambos estão na raiz do projeto e podem ser executados com node [nome-do-script.js].

Sitemap

O arquivo public/sitemap.xml contém todas as rotas públicas e protegidas (com prioridade e frequência). Ele é gerado manualmente e deve ser atualizado quando novas rotas forem adicionadas. Exemplo de uso para SEO.

Variáveis de Ambiente

A pasta env/ contém arquivos de ambiente por estágio: development.env, staging.env, production.env. O arquivo validation.js valida as variáveis obrigatórias. No código, use process.env.NEXT_PUBLIC_* para variáveis expostas ao cliente. Exemplos:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_APP_URL

Segurança e Privacidade

- Criptografia de ponta a ponta (E2EE) para mensagens diretas e cartas privadas.
- Autenticação via Supabase com 2FA opcional.
- Políticas de segurança (RLS) no banco de dados.
- Moderação ética e central de segurança (/safety).
- Conformidade com LGPD e GDPR.

Contribuição

1. Fork o projeto
2. Crie uma branch (git checkout -b feature/nova-funcionalidade)
3. Commit suas mudanças (git commit -m 'Adiciona X')
4. Push para a branch (git push origin feature/nova-funcionalidade)
5. Abra um Pull Request

Licença

Este projeto está sob a licença MIT. Consulte o arquivo LICENSE para mais informações.

Contato e Redes

- Site: https://iris.social
- E-mail: contato@iris.social
- Instagram: @iris.social
- GitHub: github.com/iris-social

Ultima atualizacao: 04 de junho de 2026
Estrutura gerada automaticamente a partir do Product Book IRIS Social.