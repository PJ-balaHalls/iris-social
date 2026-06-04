// setup-feature-flags.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const root = process.cwd();

// Função para criar arquivo com conteúdo
function createFile(filePath, content, force = false) {
  const fullPath = path.join(root, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(fullPath) || force) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Criado: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  Já existe: ${filePath} (pulado)`);
    return false;
  }
}

// Função para perguntar ao usuário
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

// Conteúdo dos arquivos

const flagsConfig = `// src/feature-flags/flags.config.ts
export type FeatureFlag = 
  | 'uslife'              // módulo de relacionamento
  | 'iris-ai'             // assistente IA
  | 'marketplace'         // loja de temas/widgets
  | 'kids-mode'           // modo crianças
  | 'video-upload'        // upload de vídeos
  | 'symbolic-ceremony'   // casamento simbólico
  | 'new-feed-ui'         // experimento A/B (novo layout)
  | 'unlimited-blocks';   // blocos ilimitados no Identity Space

export interface FeatureFlags {
  [key: string]: boolean;
}

// Flags padrão (usado quando não há carregamento dinâmico)
export const defaultFlags: Record<FeatureFlag, boolean> = {
  'uslife': true,
  'iris-ai': true,
  'marketplace': true,
  'kids-mode': true,
  'video-upload': false,      // só libera depois
  'symbolic-ceremony': true,
  'new-feed-ui': false,
  'unlimited-blocks': false,
};

// Mapeamento de flags para planos (exemplo)
export const planFlags = {
  free: ['uslife', 'kids-mode'],
  premium: ['uslife', 'kids-mode', 'iris-ai', 'marketplace', 'symbolic-ceremony'],
  duo: ['uslife', 'kids-mode', 'iris-ai', 'marketplace', 'symbolic-ceremony', 'unlimited-blocks'],
  creator: ['uslife', 'kids-mode', 'iris-ai', 'marketplace', 'symbolic-ceremony', 'unlimited-blocks', 'video-upload'],
};
`;

const featureFlagContext = `// src/feature-flags/FeatureFlagContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { FeatureFlag, defaultFlags } from './flags.config';

const FeatureFlagContext = createContext<Record<FeatureFlag, boolean>>(defaultFlags);

export function FeatureFlagProvider({ 
  children, 
  flags = defaultFlags 
}: { 
  children: ReactNode;
  flags?: Record<FeatureFlag, boolean>;
}) {
  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag(flag: FeatureFlag): boolean {
  const flags = useContext(FeatureFlagContext);
  return flags[flag] ?? false;
}
`;

const useFeatureFlagHook = `// src/feature-flags/useFeatureFlag.ts
// Re-export para facilitar importação
export { useFeatureFlag } from './FeatureFlagContext';
`;

const featureFlagComponent = `// src/feature-flags/FeatureFlag.tsx
'use client';

import { useFeatureFlag } from './FeatureFlagContext';
import { FeatureFlag as FeatureFlagType } from './flags.config';

interface FeatureFlagProps {
  name: FeatureFlagType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureFlag({ name, children, fallback = null }: FeatureFlagProps) {
  const isEnabled = useFeatureFlag(name);
  return isEnabled ? <>{children}</> : <>{fallback}</>;
}
`;

const indexExport = `// src/feature-flags/index.ts
export { FeatureFlagProvider, useFeatureFlag } from './FeatureFlagContext';
export { FeatureFlag } from './FeatureFlag';
export { defaultFlags, planFlags, type FeatureFlag } from './flags.config';
`;

const supabaseIntegration = `// src/lib/supabase/featureFlags.ts
import { createClient } from './server';
import { FeatureFlag, defaultFlags } from '@/feature-flags/flags.config';

export async function getUserFeatureFlags(userId?: string): Promise<Record<FeatureFlag, boolean>> {
  // Se não houver userId, retorna flags padrão
  if (!userId) {
    return defaultFlags;
  }

  const supabase = createClient();
  
  // Buscar flags globais e específicas do usuário
  const { data: globalFlags, error: globalError } = await supabase
    .from('feature_flags')
    .select('flag_name, enabled, percentage, user_id')
    .is('user_id', null);
    
  const { data: userFlags, error: userError } = await supabase
    .from('feature_flags')
    .select('flag_name, enabled, percentage, user_id')
    .eq('user_id', userId);
    
  if (globalError || userError) {
    console.error('Erro ao carregar feature flags:', globalError || userError);
    return defaultFlags;
  }
  
  const allFlags = [...(globalFlags || []), ...(userFlags || [])];
  const flagsResult: Partial<Record<FeatureFlag, boolean>> = {};
  
  for (const flag of allFlags) {
    const flagName = flag.flag_name as FeatureFlag;
    if (flag.percentage && flag.percentage < 100) {
      // Rollout percentual baseado no userId
      const hash = (userId + flagName).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      flagsResult[flagName] = (hash % 100) < flag.percentage;
    } else {
      flagsResult[flagName] = flag.enabled;
    }
  }
  
  // Preenche com defaultFlags para flags não definidas
  for (const key of Object.keys(defaultFlags) as FeatureFlag[]) {
    if (flagsResult[key] === undefined) {
      flagsResult[key] = defaultFlags[key];
    }
  }
  
  return flagsResult as Record<FeatureFlag, boolean>;
}
`;

const exampleIntegration = `// EXEMPLO DE INTEGRAÇÃO NO LAYOUT DO APP PRINCIPAL
// Adicione isto em src/app/(app)/layout.tsx:

/*
import { FeatureFlagProvider } from '@/feature-flags';
import { getUserFeatureFlags } from '@/lib/supabase/featureFlags';

export default async function AppLayout({ children }) {
  // Obter userId da sessão (substitua pela sua lógica real)
  const userId = 'user-123'; // viria do cookie/session
  
  const flags = await getUserFeatureFlags(userId);
  
  return (
    <FeatureFlagProvider flags={flags}>
      {/* seu AppShell original */}
      {children}
    </FeatureFlagProvider>
  );
}
*/
`;

const exampleNavbarUsage = `// EXEMPLO DE USO NO MobileBottomNav.tsx (ou Topbar)
// Adicione nos componentes que precisam de flags:

/*
import { useFeatureFlag, FeatureFlag } from '@/feature-flags';

export function MobileBottomNav() {
  const isUslifeEnabled = useFeatureFlag('uslife');
  
  return (
    <nav>
      <button>Home</button>
      {isUslifeEnabled && <button>usLIFE</button>}
      
      <FeatureFlag name="marketplace" fallback={null}>
        <button>Marketplace</button>
      </FeatureFlag>
      
      <button>Perfil</button>
    </nav>
  );
}
*/
`;

const supabaseTableSql = `-- SQL para criar a tabela de feature_flags no Supabase
CREATE TABLE IF NOT EXISTS feature_flags (
  id SERIAL PRIMARY KEY,
  flag_name VARCHAR(100) NOT NULL,
  enabled BOOLEAN DEFAULT false,
  percentage INT DEFAULT 100,  -- 0 a 100, para rollout gradual
  user_id UUID DEFAULT NULL,   -- NULL = global, UUID = específico do usuário
  environment VARCHAR(20) DEFAULT 'production',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(flag_name, user_id, environment)
);

-- Índices
CREATE INDEX idx_feature_flags_flag_name ON feature_flags(flag_name);
CREATE INDEX idx_feature_flags_user_id ON feature_flags(user_id);

-- Exemplo de inserções
INSERT INTO feature_flags (flag_name, enabled, percentage, environment) VALUES
('uslife', true, 100, 'production'),
('iris-ai', true, 100, 'production'),
('marketplace', true, 100, 'production'),
('video-upload', false, 0, 'production'),
('new-feed-ui', false, 20, 'production');  -- 20% dos usuários
`;

const readmeInstructions = `# Feature Flags - IRIS Social

## Estrutura criada

- \`src/feature-flags/\` – toda a lógica de feature flags
- \`src/lib/supabase/featureFlags.ts\` – integração com Supabase (opcional)
- Exemplos de uso e SQL para criar a tabela no banco.

## Como ativar

1. Se quiser usar flags dinâmicas com Supabase, execute o SQL fornecido no seu banco.
2. Adicione o \`FeatureFlagProvider\` no layout do app (conforme exemplo).
3. Use \`useFeatureFlag\` ou o componente \`FeatureFlag\` nos seus componentes.

## Gerenciamento

- Para flags estáticas, edite \`src/feature-flags/flags.config.ts\`.
- Para flags dinâmicas, insira/atualize registros na tabela \`feature_flags\`.

## Recomendações

- Não desative flags que removem dados (apenas esconda UI).
- Remova flags antigas após a funcionalidade estar estável.
- Use rollout percentual com cuidado (ex: \`percentage=20\`).
`;

// ========== Execução principal ==========
async function main() {
  console.log('\n🚀 Setup de Feature Flags para IRIS Social\n');
  
  // 1. Criar arquivos principais
  createFile('src/feature-flags/flags.config.ts', flagsConfig);
  createFile('src/feature-flags/FeatureFlagContext.tsx', featureFlagContext);
  createFile('src/feature-flags/useFeatureFlag.ts', useFeatureFlagHook);
  createFile('src/feature-flags/FeatureFlag.tsx', featureFlagComponent);
  createFile('src/feature-flags/index.ts', indexExport);
  createFile('src/lib/supabase/featureFlags.ts', supabaseIntegration);
  createFile('docs/feature-flags-sql.sql', supabaseTableSql);
  createFile('docs/feature-flags-readme.md', readmeInstructions);
  
  // 2. Criar arquivos de exemplo (não substitui código existente)
  createFile('examples/feature-flag-app-layout-integration.txt', exampleIntegration);
  createFile('examples/feature-flag-navbar-usage.txt', exampleNavbarUsage);
  
  console.log('\n📁 Pasta criada: src/feature-flags/');
  console.log('📁 Pasta criada: docs/ (com SQL e README)');
  console.log('📁 Pasta criada: examples/ (com exemplos de integração)');
  
  // 3. Perguntar se deseja integrar automaticamente no layout existente
  const answer = await askQuestion('\n❓ Deseja tentar integrar o FeatureFlagProvider no arquivo src/app/(app)/layout.tsx automaticamente? (s/N): ');
  if (answer.toLowerCase() === 's') {
    const layoutPath = 'src/app/(app)/layout.tsx';
    const fullLayoutPath = path.join(root, layoutPath);
    if (fs.existsSync(fullLayoutPath)) {
      let layoutContent = fs.readFileSync(fullLayoutPath, 'utf8');
      // Verificar se já tem o provider
      if (!layoutContent.includes('FeatureFlagProvider')) {
        // Adicionar import e provider (simples, pode precisar de ajuste manual)
        const newImport = "import { FeatureFlagProvider } from '@/feature-flags';\nimport { getUserFeatureFlags } from '@/lib/supabase/featureFlags';\n";
        // Inserir após os últimos imports
        const lines = layoutContent.split('\n');
        let lastImportIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ') || lines[i].startsWith('import type')) {
            lastImportIndex = i;
          }
        }
        lines.splice(lastImportIndex + 1, 0, newImport);
        
        // Encontrar a função do componente e adicionar a lógica async
        // (simplificado: apenas avisar que precisa de ajuste manual)
        fs.writeFileSync(fullLayoutPath, lines.join('\n'));
        console.log('⚠️  Importação adicionada, mas você precisará ajustar manualmente o componente para ser async e usar o provider.');
        console.log('   Veja o exemplo em examples/feature-flag-app-layout-integration.txt');
      } else {
        console.log('✅ O layout já parece ter o FeatureFlagProvider.');
      }
    } else {
      console.log(`❌ Arquivo ${layoutPath} não encontrado. Pule a integração automática.`);
    }
  }
  
  console.log('\n✨ Setup concluído! Consulte docs/feature-flags-readme.md para próximos passos.\n');
}

main().catch(console.error);