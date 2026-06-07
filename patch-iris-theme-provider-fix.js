const fs = require('fs');

const appLayout = 'src/app/(app)/layout.tsx';
const rootLayout = 'src/app/layout.tsx';

function patchAppLayout() {
  if (!fs.existsSync(appLayout)) {
    fs.writeFileSync(
      appLayout,
      `import type { ReactNode } from 'react';
import { IrisAppProviders } from './IrisAppProviders';

export default function AppLayout({ children }: { children: ReactNode }) {
  return <IrisAppProviders>{children}</IrisAppProviders>;
}
`,
      'utf8',
    );

    console.log('Criado:', appLayout);
    return;
  }

  let content = fs.readFileSync(appLayout, 'utf8');

  if (!content.includes("from './IrisAppProviders'")) {
    content = `import { IrisAppProviders } from './IrisAppProviders';\n${content}`;
  }

  if (!content.includes('<IrisAppProviders>')) {
    content = content.replace(
      /\{children\}/,
      '<IrisAppProviders>{children}</IrisAppProviders>',
    );
  }

  fs.writeFileSync(appLayout, content, 'utf8');
  console.log('Corrigido:', appLayout);
}

function patchRootLayout() {
  if (!fs.existsSync(rootLayout)) {
    console.log('Ignorado, root layout não encontrado:', rootLayout);
    return;
  }

  let content = fs.readFileSync(rootLayout, 'utf8');

  if (!content.includes("@/styles/iris-theme.css")) {
    content = `import '@/styles/iris-theme.css';\n${content}`;
  }

  if (!content.includes("from '@/components/theme/IrisThemeScript'")) {
    content = `import { IrisThemeScript } from '@/components/theme/IrisThemeScript';\n${content}`;
  }

  if (!content.includes('<IrisThemeScript />')) {
    content = content.replace(
      /<body([^>]*)>/,
      '<body$1>\n        <IrisThemeScript />',
    );
  }

  content = content.replace(/<html([^>]*)>/, (match, attrs) => {
    if (attrs.includes('suppressHydrationWarning')) return match;
    return `<html${attrs} suppressHydrationWarning>`;
  });

  fs.writeFileSync(rootLayout, content, 'utf8');
  console.log('Corrigido:', rootLayout);
}

patchAppLayout();
patchRootLayout();
