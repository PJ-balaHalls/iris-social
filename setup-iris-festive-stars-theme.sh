#!/usr/bin/env bash
set -euo pipefail

echo "==> IRIS: adicionando tema Festive Stars"

mkdir -p \
  "public/iris/themes/festive-stars" \
  "src/lib/themes" \
  "src/styles"

# ------------------------------------------------------------
# 1. Assets visuais do tema
# ------------------------------------------------------------

cat > "public/iris/themes/festive-stars/cover.svg" <<'SVG'
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="skyGlow" cx="50%" cy="35%" r="72%">
      <stop offset="0%" stop-color="#2E3B91"/>
      <stop offset="42%" stop-color="#11183D"/>
      <stop offset="100%" stop-color="#050714"/>
    </radialGradient>

    <radialGradient id="goldGlow" cx="76%" cy="18%" r="38%">
      <stop offset="0%" stop-color="#FFD98A" stop-opacity="0.72"/>
      <stop offset="54%" stop-color="#D6A84F" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#D6A84F" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="violetGlow" cx="18%" cy="28%" r="42%">
      <stop offset="0%" stop-color="#A98CFF" stop-opacity="0.50"/>
      <stop offset="55%" stop-color="#A98CFF" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#A98CFF" stop-opacity="0"/>
    </radialGradient>

    <filter id="blur">
      <feGaussianBlur stdDeviation="38"/>
    </filter>

    <filter id="starGlow">
      <feGaussianBlur stdDeviation="2.2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#skyGlow)"/>
  <rect width="1600" height="900" fill="url(#goldGlow)"/>
  <rect width="1600" height="900" fill="url(#violetGlow)"/>

  <circle cx="1230" cy="170" r="190" fill="#FFD98A" opacity="0.09" filter="url(#blur)"/>
  <circle cx="250" cy="260" r="230" fill="#A98CFF" opacity="0.10" filter="url(#blur)"/>

  <g filter="url(#starGlow)">
    <circle cx="126" cy="120" r="2.2" fill="#FFF8E7"/>
    <circle cx="232" cy="205" r="1.7" fill="#FFD98A"/>
    <circle cx="352" cy="94" r="1.4" fill="#FFF8E7"/>
    <circle cx="488" cy="170" r="2" fill="#FFFFFF"/>
    <circle cx="620" cy="78" r="1.5" fill="#FFD98A"/>
    <circle cx="742" cy="215" r="2.4" fill="#FFF8E7"/>
    <circle cx="914" cy="118" r="1.6" fill="#FFFFFF"/>
    <circle cx="1058" cy="196" r="2.1" fill="#FFD98A"/>
    <circle cx="1208" cy="82" r="1.8" fill="#FFFFFF"/>
    <circle cx="1378" cy="154" r="2.6" fill="#FFF8E7"/>
    <circle cx="1480" cy="86" r="1.5" fill="#FFD98A"/>

    <circle cx="94" cy="382" r="1.6" fill="#FFF8E7"/>
    <circle cx="260" cy="462" r="2.5" fill="#FFFFFF"/>
    <circle cx="430" cy="336" r="1.8" fill="#FFD98A"/>
    <circle cx="585" cy="420" r="1.3" fill="#FFF8E7"/>
    <circle cx="758" cy="350" r="2.1" fill="#FFFFFF"/>
    <circle cx="930" cy="475" r="1.7" fill="#FFD98A"/>
    <circle cx="1112" cy="360" r="2.2" fill="#FFF8E7"/>
    <circle cx="1290" cy="450" r="1.5" fill="#FFFFFF"/>
    <circle cx="1458" cy="330" r="2.1" fill="#FFD98A"/>

    <circle cx="160" cy="700" r="1.8" fill="#FFFFFF"/>
    <circle cx="338" cy="635" r="2.2" fill="#FFD98A"/>
    <circle cx="520" cy="760" r="1.5" fill="#FFF8E7"/>
    <circle cx="690" cy="650" r="2.1" fill="#FFFFFF"/>
    <circle cx="860" cy="720" r="1.7" fill="#FFD98A"/>
    <circle cx="1042" cy="635" r="2.4" fill="#FFF8E7"/>
    <circle cx="1230" cy="742" r="1.4" fill="#FFFFFF"/>
    <circle cx="1438" cy="650" r="2.3" fill="#FFD98A"/>
  </g>

  <g opacity="0.9">
    <path d="M1180 260L1194 294L1230 300L1204 325L1212 360L1180 342L1148 360L1156 325L1130 300L1166 294L1180 260Z" fill="#FFD98A"/>
    <path d="M380 255L390 279L416 283L397 301L402 327L380 314L358 327L363 301L344 283L370 279L380 255Z" fill="#FFF8E7"/>
    <path d="M1320 585L1330 608L1355 612L1337 630L1342 655L1320 642L1298 655L1303 630L1285 612L1310 608L1320 585Z" fill="#A98CFF"/>
  </g>

  <rect x="92" y="594" width="560" height="170" rx="54" fill="white" fill-opacity="0.08" stroke="white" stroke-opacity="0.16"/>
  <text x="132" y="662" fill="#FFF8E7" font-family="Inter, Arial, sans-serif" font-size="22" letter-spacing="5">IRIS THEME</text>
  <text x="132" y="724" fill="white" font-family="Georgia, serif" font-size="64" letter-spacing="-4">Festive Stars</text>
</svg>
SVG

cat > "public/iris/themes/festive-stars/preview.svg" <<'SVG'
<svg width="900" height="900" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#2E3B91"/>
      <stop offset="52%" stop-color="#11183D"/>
      <stop offset="100%" stop-color="#050714"/>
    </radialGradient>
  </defs>

  <rect width="900" height="900" fill="url(#bg)"/>
  <circle cx="675" cy="160" r="180" fill="#FFD98A" opacity="0.12"/>
  <circle cx="185" cy="260" r="220" fill="#A98CFF" opacity="0.14"/>

  <g>
    <circle cx="90" cy="80" r="2" fill="#FFF8E7"/>
    <circle cx="170" cy="180" r="1.5" fill="#FFD98A"/>
    <circle cx="280" cy="90" r="2.4" fill="#FFFFFF"/>
    <circle cx="410" cy="190" r="1.6" fill="#FFF8E7"/>
    <circle cx="540" cy="105" r="2" fill="#FFD98A"/>
    <circle cx="700" cy="220" r="1.8" fill="#FFFFFF"/>
    <circle cx="812" cy="110" r="2.2" fill="#FFF8E7"/>
    <circle cx="120" cy="430" r="1.8" fill="#FFFFFF"/>
    <circle cx="330" cy="370" r="2.2" fill="#FFD98A"/>
    <circle cx="500" cy="460" r="1.5" fill="#FFF8E7"/>
    <circle cx="690" cy="410" r="2.1" fill="#FFFFFF"/>
    <circle cx="780" cy="620" r="1.7" fill="#FFD98A"/>
  </g>

  <rect x="86" y="570" width="728" height="210" rx="58" fill="white" fill-opacity="0.09" stroke="white" stroke-opacity="0.16"/>
  <text x="138" y="650" fill="#FFF8E7" font-family="Inter, Arial, sans-serif" font-size="20" letter-spacing="5">FESTIVE</text>
  <text x="138" y="724" fill="white" font-family="Georgia, serif" font-size="76" letter-spacing="-5">Stars</text>
</svg>
SVG

# ------------------------------------------------------------
# 2. Patch nos tipos para aceitar starry-sky e twinkle
# ------------------------------------------------------------

node - <<'NODE'
const fs = require('fs');

const file = 'src/lib/themes/themeTypes.ts';

if (!fs.existsSync(file)) {
  console.error('Arquivo não encontrado:', file);
  process.exit(1);
}

let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /'plain' \| 'radial-soft' \| 'aurora-lilac' \| 'editorial-grid'/,
  "'plain' | 'radial-soft' | 'aurora-lilac' | 'editorial-grid' | 'starry-sky'"
);

content = content.replace(
  /'none' \| 'slow-aurora' \| 'grain' \| 'float'/,
  "'none' | 'slow-aurora' | 'grain' | 'float' | 'twinkle'"
);

fs.writeFileSync(file, content, 'utf8');
console.log('themeTypes.ts atualizado.');
NODE

# ------------------------------------------------------------
# 3. Patch no mapper para ler starry-sky e twinkle vindos do banco
# ------------------------------------------------------------

node - <<'NODE'
const fs = require('fs');

const file = 'src/lib/themes/themeMappers.ts';

if (!fs.existsSync(file)) {
  console.error('Arquivo não encontrado:', file);
  process.exit(1);
}

let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /source\.type === 'editorial-grid'/,
  "source.type === 'editorial-grid' ||\n      source.type === 'starry-sky'"
);

content = content.replace(
  /source\.backgroundAnimation === 'float'/,
  "source.backgroundAnimation === 'float' ||\n      source.backgroundAnimation === 'twinkle'"
);

fs.writeFileSync(file, content, 'utf8');
console.log('themeMappers.ts atualizado.');
NODE

# ------------------------------------------------------------
# 4. Patch no Creator para permitir criar temas com céu estrelado
# ------------------------------------------------------------

node - <<'NODE'
const fs = require('fs');

const file = 'src/app/(app)/marketplace/creator/ThemeCreatorClient.tsx';

if (!fs.existsSync(file)) {
  console.log('Creator ainda não existe. Pulando patch.');
  process.exit(0);
}

let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "['plain', 'radial-soft', 'aurora-lilac', 'editorial-grid']",
  "['plain', 'radial-soft', 'aurora-lilac', 'editorial-grid', 'starry-sky']"
);

content = content.replace(
  "['none', 'slow-aurora', 'grain', 'float']",
  "['none', 'slow-aurora', 'grain', 'float', 'twinkle']"
);

fs.writeFileSync(file, content, 'utf8');
console.log('ThemeCreatorClient.tsx atualizado.');
NODE

# ------------------------------------------------------------
# 5. CSS global do tema: céu, estrelas e botões estrelados
# ------------------------------------------------------------

cat >> "src/styles/iris-theme.css" <<'CSS'

/* =========================================================
   IRIS Theme — Festive Stars
   ========================================================= */

html[data-iris-theme='iris-festive-stars'] {
  --iris-festive-star-gold: #FFD98A;
  --iris-festive-star-violet: #A98CFF;
  --iris-festive-night-deep: #060817;
}

html[data-theme-bg='starry-sky'] body {
  background:
    radial-gradient(circle at 16% 14%, color-mix(in srgb, var(--iris-color-emotion) 22%, transparent), transparent 28rem),
    radial-gradient(circle at 84% 12%, color-mix(in srgb, var(--iris-color-accent) 22%, transparent), transparent 26rem),
    radial-gradient(circle at 50% 110%, color-mix(in srgb, var(--iris-color-primary) 16%, transparent), transparent 36rem),
    linear-gradient(180deg, var(--iris-bg-primary), color-mix(in srgb, var(--iris-bg-primary) 82%, #050714));
}

html[data-theme='dark'][data-theme-bg='starry-sky'] body {
  background:
    radial-gradient(circle at 18% 10%, rgba(169, 140, 255, 0.20), transparent 30rem),
    radial-gradient(circle at 82% 14%, rgba(255, 217, 138, 0.16), transparent 26rem),
    radial-gradient(circle at 44% 112%, rgba(40, 49, 111, 0.30), transparent 38rem),
    linear-gradient(180deg, #060817 0%, #0B0E24 48%, #050714 100%);
}

html[data-theme-bg='starry-sky'] body::before {
  content: "";
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image:
    radial-gradient(circle, rgba(255, 248, 231, 0.95) 0 1px, transparent 1.6px),
    radial-gradient(circle, rgba(255, 217, 138, 0.85) 0 1.2px, transparent 1.9px),
    radial-gradient(circle, rgba(169, 140, 255, 0.72) 0 1px, transparent 1.8px);
  background-size:
    120px 120px,
    190px 190px,
    260px 260px;
  background-position:
    0 0,
    42px 78px,
    120px 30px;
  opacity: 0.36;
}

html[data-theme-bg='starry-sky'][data-bg-animated='true'] body::before {
  animation: iris-stars-drift 28s linear infinite;
}

html[data-theme-bg='starry-sky'][data-bg-animated='true'] body::after {
  content: "";
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 22% 28%, rgba(255, 217, 138, 0.18), transparent 18rem),
    radial-gradient(circle at 74% 22%, rgba(169, 140, 255, 0.14), transparent 20rem);
  opacity: 0.8;
  animation: iris-stars-pulse 7s ease-in-out infinite alternate;
}

html[data-iris-theme='iris-festive-stars'] button,
html[data-iris-theme='iris-festive-stars'] a {
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    background-color 220ms ease,
    border-color 220ms ease;
}

html[data-iris-theme='iris-festive-stars'] button:hover,
html[data-iris-theme='iris-festive-stars'] a:hover {
  transform: translateY(-1px);
}

html[data-iris-theme='iris-festive-stars'] button[class*="bg-[var(--iris-color-primary)]"],
html[data-iris-theme='iris-festive-stars'] a[class*="bg-[var(--iris-color-primary)]"],
html[data-iris-theme='iris-festive-stars'] .bg-\[var\(--iris-color-primary\)\] {
  position: relative;
  overflow: hidden;
  background-image:
    radial-gradient(circle at 18% 28%, rgba(255, 248, 231, 0.95) 0 1.2px, transparent 1.8px),
    radial-gradient(circle at 72% 34%, rgba(255, 217, 138, 0.95) 0 1px, transparent 1.7px),
    radial-gradient(circle at 44% 76%, rgba(255, 248, 231, 0.75) 0 1px, transparent 1.7px),
    linear-gradient(135deg, var(--iris-color-primary), var(--iris-color-accent));
  box-shadow:
    0 16px 40px color-mix(in srgb, var(--iris-color-primary) 28%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.32);
}

html[data-iris-theme='iris-festive-stars'] .iris-theme-card {
  box-shadow:
    0 26px 90px rgba(6, 8, 23, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.38);
}

html[data-theme='dark'][data-iris-theme='iris-festive-stars'] .iris-theme-card {
  background:
    linear-gradient(135deg, rgba(16, 19, 41, 0.82), rgba(23, 26, 53, 0.62));
  box-shadow:
    0 32px 110px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

@keyframes iris-stars-drift {
  from {
    background-position:
      0 0,
      42px 78px,
      120px 30px;
  }

  to {
    background-position:
      240px 180px,
      282px 258px,
      360px 210px;
  }
}

@keyframes iris-stars-pulse {
  from {
    opacity: 0.42;
    filter: blur(0px);
  }

  to {
    opacity: 0.88;
    filter: blur(1px);
  }
}
CSS

# ------------------------------------------------------------
# 6. JSON burro do tema para copiar e criar variações
# ------------------------------------------------------------

cat > "src/lib/themes/themeTemplate.festive-stars.json" <<'JSON'
{
  "slug": "iris-festive-stars",
  "name": "Festive Stars",
  "authorName": "IRIS Studio",
  "category": "seasonal",
  "pricingModel": "free",
  "priceCents": 0,
  "coverImagePath": "/iris/themes/festive-stars/cover.svg",
  "previewImagePath": "/iris/themes/festive-stars/preview.svg",
  "shortDescription": "Tema festivo com céu noturno, estrelas, brilho dourado e botões estrelados.",
  "longDescription": "Um tema comemorativo para a IRIS com fundo de céu estrelado, atmosfera noturna, brilho suave, partículas visuais e botões com sensação de estrelas.",
  "lightTokens": {
    "primary": "#28316F",
    "primaryDeep": "#11183D",
    "primarySoft": "#E9ECFF",
    "accent": "#D6A84F",
    "accentSoft": "#FFF4D8",
    "emotion": "#A98CFF",
    "background": "#F8F5EC",
    "surface": "#FFFFFF",
    "surfaceSoft": "#FFFDF7",
    "text": "#171B3A",
    "textSecondary": "#4C5277",
    "textMuted": "#7B819E",
    "border": "#E5DECA"
  },
  "darkTokens": {
    "primary": "#FFD98A",
    "primaryDeep": "#FFF3CF",
    "primarySoft": "#282344",
    "accent": "#A98CFF",
    "accentSoft": "#1B1734",
    "emotion": "#FFD98A",
    "background": "#060817",
    "surface": "#101329",
    "surfaceSoft": "#171A35",
    "text": "#FFF8E7",
    "textSecondary": "#D9D2EE",
    "textMuted": "#A9A5C1",
    "border": "#2B2F55"
  },
  "background": {
    "type": "starry-sky",
    "animated": true,
    "intensity": "soft"
  },
  "typography": {
    "fontStyle": "editorial"
  },
  "layout": {
    "radius": "dream",
    "spacing": "airy",
    "glass": "soft"
  },
  "animation": {
    "motion": "expressive",
    "backgroundAnimation": "twinkle"
  },
  "tags": ["festivo", "estrelas", "ceu", "noturno", "celebracao"]
}
JSON

rm -rf .next

npx tsc --noEmit --pretty false > type-errors.txt || true

echo ""
echo "==== TYPE ERRORS ===="
cat type-errors.txt

echo ""
echo "Tema Festive Stars aplicado."
echo "Se não houver erros acima, rode:"
echo "npm run build"
