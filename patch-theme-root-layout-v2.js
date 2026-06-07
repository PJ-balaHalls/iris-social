const fs = require('fs');

const rootLayout = 'src/app/layout.tsx';

if (!fs.existsSync(rootLayout)) {
  console.error('src/app/layout.tsx não encontrado.');
  process.exit(1);
}

let content = fs.readFileSync(rootLayout, 'utf8');

function addImport(importLine) {
  if (!content.includes(importLine)) {
    content = `${importLine}\n${content}`;
  }
}

addImport("import '@/styles/iris-theme.css';");
addImport("import { IrisThemeProvider } from '@/components/theme/IrisThemeProvider';");
addImport("import { IrisThemeScript } from '@/components/theme/IrisThemeScript';");

content = content.replace(/<html([^>]*)>/, (match, attrs) => {
  if (attrs.includes('suppressHydrationWarning')) return match;
  return `<html${attrs} suppressHydrationWarning>`;
});

if (!content.includes('<IrisThemeProvider>')) {
  content = content.replace(
    /<body([^>]*)>/,
    '<body$1>\n        <IrisThemeScript />\n        <IrisThemeProvider>',
  );

  content = content.replace(
    /<\/body>/,
    '        </IrisThemeProvider>\n      </body>',
  );
} else if (!content.includes('<IrisThemeScript />')) {
  content = content.replace(
    /<body([^>]*)>/,
    '<body$1>\n        <IrisThemeScript />',
  );
}

fs.writeFileSync(rootLayout, content, 'utf8');
console.log('Root layout conectado ao sistema de temas.');
