// stepstart.js
const fs = require('fs');
const path = require('path');

const root = process.cwd(); // deve ser a pasta iris-social

// Função auxiliar para criar diretórios e arquivos
function createFile(filePath, content = '') {
  const fullPath = path.join(root, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Criado: ${filePath}`);
  } else {
    console.log(`Já existe: ${filePath}`);
  }
}

// ============================================================
// LISTA COMPLETA DE ARQUIVOS (pastas e arquivos)
// ============================================================

// Arquivos raiz
const rootFiles = [
  '.env.example',
  '.env.local',
  '.env.production',
  '.gitignore',
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'README.md',
];

// env/ pasta
const envFiles = [
  'env/development.env',
  'env/staging.env',
  'env/production.env',
  'env/validation.js',
];

// public/ arquivos e subpastas
const publicFiles = [
  'public/favicon.ico',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/manifest.webmanifest',
  'public/images/logo/iris-logo.svg',
  'public/images/logo/iris-logo-dark.svg',
  'public/images/logo/iris-icon.png',
  'public/images/mockups/app-mockup-1.png',
  'public/images/mockups/app-mockup-2.png',
  'public/images/mockups/app-mockup-3.png',
  'public/images/heroes/hero-home.jpg',
  'public/images/heroes/hero-manifesto.jpg',
  'public/images/icons/google.svg',
  'public/images/icons/apple.svg',
  'public/images/icons/iris-ai-icon.svg',
  'public/images/og-images/home-og.png',
  'public/images/og-images/manifesto-og.png',
  'public/images/og-images/produto-og.png',
  'public/fonts/inter/Inter-Regular.woff2',
  'public/fonts/inter/Inter-Medium.woff2',
  'public/fonts/inter/Inter-Bold.woff2',
  'public/fonts/iris-symbolic.woff2',
  'public/videos/hero-background.mp4',
  'public/videos/manifesto-explainer.mp4',
  'public/documents/termos-de-uso.pdf',
  'public/documents/politica-de-privacidade.pdf',
];

// src/app raiz e providers
const appRootFiles = [
  'src/app/layout.tsx',
  'src/app/providers.tsx',
];

// Site público
const publicPages = [
  'src/app/page.tsx',
  'src/app/manifesto/page.tsx',
  'src/app/produto/page.tsx',
  'src/app/planos/page.tsx',
  'src/app/seguranca/page.tsx',
  'src/app/marketplace/page.tsx',
  'src/app/comunidades/page.tsx',
  'src/app/kids/page.tsx',
  'src/app/blog/page.tsx',
  'src/app/faq/page.tsx',
  'src/app/legal/page.tsx',
];

// Autenticação
const authFiles = [
  'src/app/auth/login/page.tsx',
  'src/app/auth/login/components/LoginForm.tsx',
  'src/app/auth/login/components/SocialLoginButtons.tsx',
  'src/app/auth/register/page.tsx',
  'src/app/auth/register/components/RegisterForm.tsx',
  'src/app/auth/register/components/PasswordStrengthIndicator.tsx',
  'src/app/auth/forgot-password/page.tsx',
  'src/app/auth/forgot-password/ForgotPasswordForm.tsx',
  'src/app/auth/reset-password/page.tsx',
  'src/app/auth/reset-password/ResetPasswordForm.tsx',
  'src/app/auth/verify-email/page.tsx',
  'src/app/auth/verify-email/VerifyEmailStatus.tsx',
  'src/app/auth/security-code/page.tsx',
  'src/app/auth/security-code/SecurityCodeInput.tsx',
];

// Onboarding (15 telas + layout)
const onboardingFiles = [
  'src/app/onboarding/layout.tsx',
  'src/app/onboarding/welcome/page.tsx',
  'src/app/onboarding/basic-info/page.tsx',
  'src/app/onboarding/avatar/page.tsx',
  'src/app/onboarding/username/page.tsx',
  'src/app/onboarding/personality/page.tsx',
  'src/app/onboarding/values/page.tsx',
  'src/app/onboarding/culture/page.tsx',
  'src/app/onboarding/integrations/page.tsx',
  'src/app/onboarding/intention/page.tsx',
  'src/app/onboarding/privacy/page.tsx',
  'src/app/onboarding/accessibility/page.tsx',
  'src/app/onboarding/kids/page.tsx',
  'src/app/onboarding/uslife-invite/page.tsx',
  'src/app/onboarding/plan/page.tsx',
  'src/app/onboarding/finish/page.tsx',
];

// App principal (grupo (app))
const appGroupLayout = ['src/app/(app)/layout.tsx'];

// Home
const homeFiles = [
  'src/app/(app)/home/page.tsx',
  'src/app/(app)/home/components/GreetingCard.tsx',
  'src/app/(app)/home/components/IrisAiCard.tsx',
  'src/app/(app)/home/components/QuickActions.tsx',
  'src/app/(app)/home/components/TodayInIris.tsx',
  'src/app/(app)/home/components/RecentMemories.tsx',
  'src/app/(app)/home/components/ActiveCommunities.tsx',
  'src/app/(app)/home/components/AffinityPeople.tsx',
  'src/app/(app)/home/components/SymbolicJourney.tsx',
];

// Profile (Identity Space)
const profileFiles = [
  'src/app/(app)/profile/[username]/page.tsx',
  'src/app/(app)/profile/[username]/components/ProfileCover.tsx',
  'src/app/(app)/profile/[username]/components/ProfileAvatar.tsx',
  'src/app/(app)/profile/[username]/components/AffinityBadge.tsx',
  'src/app/(app)/profile/[username]/components/ActionButtons.tsx',
  'src/app/(app)/profile/[username]/components/Tabs/BlocksTab.tsx',
  'src/app/(app)/profile/[username]/components/Tabs/PublicMemoriesTab.tsx',
  'src/app/(app)/profile/[username]/components/Tabs/LibraryTab.tsx',
  'src/app/(app)/profile/[username]/components/Tabs/OpenLettersTab.tsx',
  'src/app/(app)/profile/[username]/components/Tabs/CommunitiesTab.tsx',
  'src/app/(app)/profile/[username]/components/Tabs/RelicsTab.tsx',
  'src/app/(app)/profile/edit/page.tsx',
  'src/app/(app)/profile/edit/EditProfileForm.tsx',
  'src/app/(app)/profile/blocks/new/page.tsx',
  'src/app/(app)/profile/blocks/new/BlockTypeSelector.tsx',
];

// iLIFE
const ilifeFiles = [
  'src/app/(app)/ilife/page.tsx',
  'src/app/(app)/ilife/journals/page.tsx',
  'src/app/(app)/ilife/journals/new/page.tsx',
  'src/app/(app)/ilife/journals/new/JournalEditor.tsx',
  'src/app/(app)/ilife/journals/[id]/page.tsx',
  'src/app/(app)/ilife/albums/page.tsx',
  'src/app/(app)/ilife/albums/new/page.tsx',
  'src/app/(app)/ilife/albums/new/AlbumCreator.tsx',
  'src/app/(app)/ilife/albums/[id]/page.tsx',
  'src/app/(app)/ilife/albums/[id]/AlbumDetail.tsx',
  'src/app/(app)/ilife/letters/page.tsx',
  'src/app/(app)/ilife/letters/new/page.tsx',
  'src/app/(app)/ilife/letters/new/LetterEditor.tsx',
  'src/app/(app)/ilife/letters/[id]/page.tsx',
  'src/app/(app)/ilife/library/page.tsx',
  'src/app/(app)/ilife/library/ImportButtons.tsx',
  'src/app/(app)/ilife/dreams/page.tsx',
  'src/app/(app)/ilife/dreams/DreamTimeline.tsx',
  'src/app/(app)/ilife/timeline/page.tsx',
  'src/app/(app)/ilife/timeline/PersonalTimeline.tsx',
];

// usLIFE
const uslifeFiles = [
  'src/app/(app)/uslife/page.tsx',
  'src/app/(app)/uslife/create/page.tsx',
  'src/app/(app)/uslife/create/CreateUslifeForm.tsx',
  'src/app/(app)/uslife/[spaceId]/journal/page.tsx',
  'src/app/(app)/uslife/[spaceId]/albums/page.tsx',
  'src/app/(app)/uslife/[spaceId]/letters/page.tsx',
  'src/app/(app)/uslife/[spaceId]/ceremony/page.tsx',
  'src/app/(app)/uslife/[spaceId]/relic/page.tsx',
  'src/app/(app)/uslife/shared/journal/page.tsx',
  'src/app/(app)/uslife/shared/albums/page.tsx',
  'src/app/(app)/uslife/shared/letters/page.tsx',
  'src/app/(app)/uslife/shared/ceremony/page.tsx',
  'src/app/(app)/uslife/shared/relic/page.tsx',
];

// Feed
const feedFiles = [
  'src/app/(app)/feed/page.tsx',
  'src/app/(app)/feed/[topic]/page.tsx',
  'src/app/(app)/feed/[topic]/FeedFilters.tsx',
  'src/app/(app)/feed/components/TopicSelector.tsx',
  'src/app/(app)/feed/components/FeedPost.tsx',
];

// Post
const postFiles = [
  'src/app/(app)/post/[id]/page.tsx',
  'src/app/(app)/post/[id]/PostDetail.tsx',
];

// Comunidades
const communitiesFiles = [
  'src/app/(app)/communities/page.tsx',
  'src/app/(app)/communities/new/page.tsx',
  'src/app/(app)/communities/new/CreateCommunityForm.tsx',
  'src/app/(app)/communities/[id]/page.tsx',
  'src/app/(app)/communities/[id]/library/page.tsx',
  'src/app/(app)/communities/[id]/components/CommunityHeader.tsx',
  'src/app/(app)/communities/[id]/components/CommunityFeed.tsx',
  'src/app/(app)/communities/[id]/components/CommunityEvents.tsx',
];

// Mensagens
const messagesFiles = [
  'src/app/(app)/messages/page.tsx',
  'src/app/(app)/messages/requests/page.tsx',
  'src/app/(app)/messages/[id]/page.tsx',
  'src/app/(app)/messages/[id]/ChatWindow.tsx',
];

// AI
const aiFiles = [
  'src/app/(app)/ai/page.tsx',
  'src/app/(app)/ai/agents/page.tsx',
  'src/app/(app)/ai/agents/[id]/page.tsx',
  'src/app/(app)/ai/agents/[id]/AgentChat.tsx',
];

// Vídeos
const videosFiles = [
  'src/app/(app)/videos/page.tsx',
  'src/app/(app)/videos/[id]/page.tsx',
  'src/app/(app)/videos/upload/page.tsx',
  'src/app/(app)/videos/upload/VideoUploadForm.tsx',
];

// Marketplace
const marketplaceFiles = [
  'src/app/(app)/marketplace/page.tsx',
  'src/app/(app)/marketplace/item/[id]/page.tsx',
  'src/app/(app)/marketplace/creator/page.tsx',
];

// Notificações, busca, perfil
const miscAppFiles = [
  'src/app/(app)/notifications/page.tsx',
  'src/app/(app)/notifications/NotificationList.tsx',
  'src/app/(app)/search/page.tsx',
  'src/app/(app)/search/SearchFilters.tsx',
  'src/app/(app)/me/page.tsx',
  'src/app/(app)/me/MyProfileOverview.tsx',
];

// Configurações (settings)
const settingsFiles = [
  'src/app/(app)/settings/page.tsx',
  'src/app/(app)/settings/account/page.tsx',
  'src/app/(app)/settings/account/AccountForm.tsx',
  'src/app/(app)/settings/privacy/page.tsx',
  'src/app/(app)/settings/privacy/PrivacyControls.tsx',
  'src/app/(app)/settings/security/page.tsx',
  'src/app/(app)/settings/security/TwoFactorSetup.tsx',
  'src/app/(app)/settings/security/SessionsList.tsx',
  'src/app/(app)/settings/appearance/page.tsx',
  'src/app/(app)/settings/appearance/ThemeSelector.tsx',
  'src/app/(app)/settings/accessibility/page.tsx',
  'src/app/(app)/settings/accessibility/AccessibilityOptions.tsx',
  'src/app/(app)/settings/language/page.tsx',
  'src/app/(app)/settings/integrations/page.tsx',
  'src/app/(app)/settings/subscription/page.tsx',
  'src/app/(app)/settings/data-export/page.tsx',
  'src/app/(app)/settings/sensitive-content/page.tsx',
  'src/app/(app)/settings/kids/page.tsx',
  'src/app/(app)/settings/devices/page.tsx',
  'src/app/(app)/settings/delete-account/page.tsx',
];

// IRIS Kids (modo protegido)
const kidsFiles = [
  'src/app/kids/layout.tsx',
  'src/app/kids/home/page.tsx',
  'src/app/kids/home/KidsDashboard.tsx',
  'src/app/kids/guardian/page.tsx',
  'src/app/kids/guardian/GuardianPanel.tsx',
];

// Segurança, billing, erros
const safetyBillingErrorFiles = [
  'src/app/safety/page.tsx',
  'src/app/billing/page.tsx',
  'src/app/billing/Checkout/page.tsx',
  'src/app/error/404/page.tsx',
  'src/app/error/401/page.tsx',
  'src/app/error/403/page.tsx',
  'src/app/error/500/page.tsx',
  'src/app/error/offline/page.tsx',
];

// Componentes globais
const globalComponents = [
  'src/components/global/Modal/Modal.tsx',
  'src/components/global/Modal/ConfirmModal.tsx',
  'src/components/global/Toast/Toast.tsx',
  'src/components/global/Toast/ToastContainer.tsx',
  'src/components/global/Loader/LoaderSkeleton.tsx',
  'src/components/global/Loader/Spinner.tsx',
  'src/components/global/FabButton/FabButton.tsx',
  'src/components/global/PrivacySelector/PrivacySelector.tsx',
  'src/components/global/AffinityIndicator/AffinityIndicator.tsx',
  'src/components/global/VerificationBadge/VerificationBadge.tsx',
  'src/components/global/NotificationBadge/NotificationBadge.tsx',
  'src/components/global/ContextMenu/ContextMenu.tsx',
];

// Navbar, empty-states, forms, ui
const otherComponents = [
  'src/components/navbar/MobileBottomNav.tsx',
  'src/components/navbar/Topbar.tsx',
  'src/components/navbar/SidebarDesktop.tsx',
  'src/components/empty-states/NoMemories.tsx',
  'src/components/empty-states/NoLetters.tsx',
  'src/components/empty-states/NoAlbums.tsx',
  'src/components/empty-states/NoCommunities.tsx',
  'src/components/empty-states/NoMessages.tsx',
  'src/components/empty-states/NoNotifications.tsx',
  'src/components/empty-states/NoUslife.tsx',
  'src/components/empty-states/NoSearchResults.tsx',
  'src/components/empty-states/NoPurchases.tsx',
  'src/components/empty-states/NoFeedTopic.tsx',
  'src/components/forms/RichTextEditor.tsx',
  'src/components/forms/ImageUploader.tsx',
  'src/components/forms/AudioRecorder.tsx',
  'src/components/forms/TagInput.tsx',
  'src/components/ui/Button.tsx',
  'src/components/ui/Card.tsx',
  'src/components/ui/Input.tsx',
  'src/components/ui/Select.tsx',
  'src/components/ui/Slider.tsx',
  'src/components/ui/Switch.tsx',
  'src/components/ui/Tabs.tsx',
  'src/components/ui/Avatar.tsx',
];

// Lib (API, hooks, store, utils, constants)
const libFiles = [
  'src/lib/api/client.ts',
  'src/lib/api/auth.ts',
  'src/lib/api/profile.ts',
  'src/lib/api/ilife.ts',
  'src/lib/api/uslife.ts',
  'src/lib/api/feed.ts',
  'src/lib/api/communities.ts',
  'src/lib/api/messages.ts',
  'src/lib/api/ai.ts',
  'src/lib/api/marketplace.ts',
  'src/lib/api/kids.ts',
  'src/lib/hooks/useAuth.ts',
  'src/lib/hooks/useOnboarding.ts',
  'src/lib/hooks/useTheme.ts',
  'src/lib/hooks/useMediaQuery.ts',
  'src/lib/hooks/useAffinity.ts',
  'src/lib/store/authStore.ts',
  'src/lib/store/themeStore.ts',
  'src/lib/store/notificationStore.ts',
  'src/lib/store/onboardingStore.ts',
  'src/lib/utils/validators.ts',
  'src/lib/utils/formatters.ts',
  'src/lib/utils/encryption.ts',
  'src/lib/utils/analytics.ts',
  'src/lib/constants/routes.ts',
  'src/lib/constants/plans.ts',
  'src/lib/constants/symbols.ts',
];

// Styles e temas
const styleFiles = [
  'src/styles/globals.css',
  'src/styles/tailwind.css',
  'src/styles/themes/index.ts',
  'src/styles/themes/defaultTheme.ts',
  'src/styles/themes/lightTheme.ts',
  'src/styles/themes/darkTheme.ts',
  'src/styles/themes/highContrastTheme.ts',
  'src/styles/themes/dyslexiaFriendlyTheme.ts',
  'src/styles/themes/themeTypes.ts',
];

// Types globais
const typeFiles = [
  'src/types/user.d.ts',
  'src/types/profile.d.ts',
  'src/types/memory.d.ts',
  'src/types/community.d.ts',
  'src/types/theme.d.ts',
];

// Testes (opcional)
const testFiles = [
  'tests/unit/example.test.ts',
  'tests/integration/example.test.ts',
  'tests/e2e/example.spec.ts',
];

// Conteúdos padrão para arquivos específicos
const packageJsonContent = `{
  "name": "iris-social",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.x",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  }
}`;

const gitignoreContent = `node_modules/
.next/
.env.local
.env.production
.DS_Store
*.log
dist/
build/
`;

const tsconfigContent = `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;

const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig`;

const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {} },
  plugins: [],
}`;

const postcssConfigContent = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

const globalsCssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --iris-primary: #6366f1;
  --iris-secondary: #8b5cf6;
}

body {
  font-family: 'Inter', sans-serif;
}`;

// Função para escrever arquivo com conteúdo especial
function writeWithContent(filePath, content) {
  const fullPath = path.join(root, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Criado: ${filePath}`);
  }
}

// Criar arquivos raiz com conteúdos específicos
writeWithContent('package.json', packageJsonContent);
writeWithContent('.gitignore', gitignoreContent);
writeWithContent('tsconfig.json', tsconfigContent);
writeWithContent('next.config.js', nextConfigContent);
writeWithContent('tailwind.config.js', tailwindConfigContent);
writeWithContent('postcss.config.js', postcssConfigContent);
writeWithContent('src/styles/globals.css', globalsCssContent);

// Para os demais arquivos, criar com placeholder vazio ou comentário
const allOtherFiles = [
  ...rootFiles.filter(f => !['package.json', '.gitignore', 'tsconfig.json', 'next.config.js', 'tailwind.config.js', 'postcss.config.js'].includes(f)),
  ...envFiles,
  ...publicFiles,
  ...appRootFiles,
  ...publicPages,
  ...authFiles,
  ...onboardingFiles,
  ...appGroupLayout,
  ...homeFiles,
  ...profileFiles,
  ...ilifeFiles,
  ...uslifeFiles,
  ...feedFiles,
  ...postFiles,
  ...communitiesFiles,
  ...messagesFiles,
  ...aiFiles,
  ...videosFiles,
  ...marketplaceFiles,
  ...miscAppFiles,
  ...settingsFiles,
  ...kidsFiles,
  ...safetyBillingErrorFiles,
  ...globalComponents,
  ...otherComponents,
  ...libFiles,
  ...styleFiles.filter(f => f !== 'src/styles/globals.css'), // já criado
  ...typeFiles,
  ...testFiles,
];

allOtherFiles.forEach(file => {
  let content = '';
  if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
    content = `// Placeholder for ${path.basename(file)}\n`;
  } else if (file.endsWith('.json')) {
    content = '{}';
  } else if (file.endsWith('.md')) {
    content = `# IRIS Social\n\nEstrutura criada automaticamente.`;
  } else if (file.endsWith('.env')) {
    content = `# Variáveis de ambiente\nNEXT_PUBLIC_API_URL=http://localhost:3000\n`;
  } else {
    content = '';
  }
  createFile(file, content);
});

console.log('\n✅ Estrutura completa criada com sucesso!');
console.log('Agora instale as dependências com: npm install');
console.log('Depois inicie o projeto com: npm run dev');