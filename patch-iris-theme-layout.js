const fs = require('fs');

const file = 'src/app/layout.tsx';

if (!fs.existsSync(file)) {
  console.error('src/app/layout.tsx não encontrado.');
  process.exit(1);
}

let content = fs.readFileSync(file, 'utf8');

function addImport(line) {
  if (!content.includes(line)) {
    content = `${line}\n${content}`;
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
  content = content.replace(/<body([^>]*)>/, `<body$1>\n        <IrisThemeScript />\n        <IrisThemeProvider>`);
  content = content.replace(/<\/body>/, `        </IrisThemeProvider>\n      </body>`);
}

fs.writeFileSync(file, content, 'utf8');

console.log('Root layout conectado ao IrisThemeProvider.');
