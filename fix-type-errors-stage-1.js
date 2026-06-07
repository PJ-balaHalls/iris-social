const fs = require('fs');

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.writeFileSync(file, content, 'utf8');
  console.log('corrigido:', file);
}

function patch(file, fn) {
  if (!exists(file)) {
    console.log('ignorado, não encontrado:', file);
    return;
  }

  const before = read(file);
  const after = fn(before);

  if (after !== before) {
    write(file, after);
  } else {
    console.log('sem alteração:', file);
  }
}

/**
 * 1. Corrige scrollToSection faltando em accountSettings.ts
 */
patch('src/app/(app)/settings/account/_utils/accountSettings.ts', (content) => {
  if (content.includes('export function scrollToSection')) return content;

  return `${content}

export function scrollToSection(sectionId: string) {
  if (typeof window === 'undefined') return;

  const element = document.getElementById(sectionId);

  if (!element) return;

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
`;
});

/**
 * 2. Corrige tipo dos ícones Lucide em /settings/page.tsx
 * O erro acontece porque Lucide aceita size string | number,
 * mas o tipo local aceitava só number.
 */
patch('src/app/(app)/settings/page.tsx', (content) => {
  content = content.replace(/,\s*,/g, ',');

  content = content.replace(
    /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];/,
    (_, imports) => {
      const names = imports
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .filter((item) => item !== 'type LucideIcon');

      const unique = [...new Set(names)];

      return `import {
  ${unique.join(',\n  ')},
  type LucideIcon,
} from 'lucide-react';`;
    },
  );

  content = content.replace(
    /ComponentType\s*<\s*\{\s*size\?:\s*number;\s*className\?:\s*string;\s*strokeWidth\?:\s*number;\s*\}\s*>/g,
    'LucideIcon',
  );

  content = content.replace(
    /ComponentType\s*<\s*\{\s*className\?:\s*string;\s*size\?:\s*number;\s*strokeWidth\?:\s*number;\s*\}\s*>/g,
    'LucideIcon',
  );

  content = content.replace(
    /type\s+IconComponent\s*=\s*[^;]+;/s,
    'type IconComponent = LucideIcon;',
  );

  return content;
});

/**
 * 3. Remove fullWidth inválido do Header landing.
 * O Button atual não aceita essa prop.
 */
patch('src/components/landing/Header.tsx', (content) => {
  return content.replace(/\s+fullWidth(?:=\{true\}|="true")?/g, '');
});

/**
 * 4. Corrige comparações estreitas em SettingsDetailPanel.
 * O TS achou que source/table só poderia ser "profiles" | "none",
 * então comparamos como string.
 */
patch('src/components/settings/SettingsDetailPanel.tsx', (content) => {
  content = content.replace(
    /([A-Za-z0-9_.$\]\)]+)\s*===\s*['"]uslife_invites['"]/g,
    "String($1) === 'uslife_invites'",
  );

  content = content.replace(
    /([A-Za-z0-9_.$\]\)]+)\s*===\s*['"]plan_interest_requests['"]/g,
    "String($1) === 'plan_interest_requests'",
  );

  content = content.replace(
    /([A-Za-z0-9_.$\]\)]+)\s*!==\s*['"]uslife_invites['"]/g,
    "String($1) !== 'uslife_invites'",
  );

  content = content.replace(
    /([A-Za-z0-9_.$\]\)]+)\s*!==\s*['"]plan_interest_requests['"]/g,
    "String($1) !== 'plan_interest_requests'",
  );

  return content;
});

/**
 * 5. Corrige field.readonly em SettingsSectionPage.
 * Nem todo SettingsField tem readonly.
 */
patch('src/components/settings/SettingsSectionPage.tsx', (content) => {
  return content.replace(
    /\bfield\.readonly\b/g,
    "('readonly' in field ? field.readonly : false)",
  );
});

/**
 * 6. Corrige variáveis usadas antes de atribuição em integrations.actions.ts
 */
patch('src/lib/actions/integrations.actions.ts', (content) => {
  content = content.replace(
    /let\s+integration_preferences:\s*Record<string,\s*unknown>;/,
    'let integration_preferences: Record<string, unknown> = {};',
  );

  content = content.replace(
    /let\s+integration_data:\s*Record<string,\s*unknown>;/,
    'let integration_data: Record<string, unknown> = {};',
  );

  return content;
});

/**
 * 7. Corrige featureFlags importando createClient inexistente.
 * Pelo padrão atual do projeto, o server exporta createServer.
 */
patch('src/lib/supabase/featureFlags.ts', (content) => {
  content = content.replace(
    /import\s*\{\s*createClient\s*\}\s*from\s*['"]\.\/server['"];/,
    "import { createServer } from './server';",
  );

  content = content.replace(/\bcreateClient\(\)/g, 'createServer()');

  return content;
});

console.log('\nCorreções aplicadas. Rode agora:');
console.log('npx tsc --noEmit --pretty false > type-errors.txt || true');
console.log('cat type-errors.txt');
console.log('npm run build');
