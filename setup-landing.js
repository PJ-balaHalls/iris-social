const fs = require('fs');
const path = require('path');

const root = process.cwd();

const createFile = (filePath, content = '') => {
  const fullPath = path.join(root, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Criado: ${filePath}`);
  } else {
    console.log(`⏩ Já existe: ${filePath}`);
  }
};

// Lista de arquivos a criar (com placeholder)
const files = [
  'src/components/landing/Header.tsx',
  'src/components/landing/HeroSection.tsx',
  'src/components/landing/ManifestoSection.tsx',
  'src/components/landing/ModulesSection.tsx',
  'src/components/landing/TrustSection.tsx',
  'src/components/landing/PricingSection.tsx',
  'src/components/landing/CtaSection.tsx',
  'src/components/landing/Footer.tsx',
];

// Placeholder inicial para cada arquivo
files.forEach(file => createFile(file, '// Componente placeholder. Substitua pelo código real.\n'));

console.log('\n✅ Estrutura da landing page criada! Agora cole os códigos completos em cada arquivo.');