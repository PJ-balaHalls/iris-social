const fs = require('fs');

const file = 'src/app/(app)/settings/_components/SettingsHomePage.tsx';

if (!fs.existsSync(file)) {
  console.error(`Arquivo não encontrado: ${file}`);
  process.exit(1);
}

let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];/,
  (match, imports) => {
    if (imports.includes('LucideIcon')) return match;

    const cleanImports = imports.trim();

    return `import {\n${cleanImports},\n  type LucideIcon,\n} from 'lucide-react';`;
  },
);

if (/type\s+IconComponent\s*=/.test(content)) {
  content = content.replace(
    /type\s+IconComponent\s*=\s*[^;]+;/s,
    'type IconComponent = LucideIcon;',
  );
} else {
  content = content.replace(
    /from\s*['"]lucide-react['"];\n/,
    "from 'lucide-react';\n\ntype IconComponent = LucideIcon;\n",
  );
}

fs.writeFileSync(file, content, 'utf8');

console.log('Tipo IconComponent corrigido em SettingsHomePage.tsx');
