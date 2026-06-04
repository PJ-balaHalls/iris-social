# IRIS Design System

**O tempo passa, mas o que sentimos permanece.**

## 1. Visão geral

O IRIS Design System é o sistema visual, emocional e funcional da plataforma IRIS. Ele define a identidade da marca, os fundamentos de interface, os padrões visuais, os componentes reutilizáveis e as regras de experiência que garantem consistência em todos os produtos digitais da marca.

O objetivo do design system é criar uma experiência:

- íntima
- elegante
- acessível
- emocional
- silenciosa
- confiável
- memorável
- consistente entre web e mobile

O IRIS não deve parecer apenas um aplicativo. Ele deve parecer um espaço digital seguro para guardar memórias, cultivar presença e fortalecer vínculos reais.

## 2. Essência da marca

### 2.1 Propósito

Ajudar pessoas a preservar o que importa, manter vivas suas histórias e se reconectar com sentimentos, pessoas e momentos significativos.

### 2.2 Missão

Oferecer uma experiência digital simples, privada, elegante e emocional para registrar, organizar, revisitar e compartilhar memórias.

### 2.3 Personalidade

A personalidade visual e verbal do IRIS deve ser:

- íntima
- calma
- acolhedora
- elegante
- confiável
- poética
- humana
- sensível
- contemporânea
- discreta

### 2.4 Tom de voz

O IRIS fala de forma:

- clara
- gentil
- respeitosa
- emocional sem exagero
- poética sem ser artificial
- próxima sem ser invasiva
- simples sem parecer genérica

**Exemplo recomendado:**  
> “Sua memória foi salva. Ela agora faz parte da sua história.”

**Evitar:**  
> “Upload concluído com sucesso.”

**Exemplo recomendado:**  
> “Hoje pode ser um bom dia para revisitar uma lembrança especial.”

**Evitar:**  
> “Você tem novas recomendações disponíveis.”

## 3. Nome da marca

### 3.1 Nome oficial

**IRIS** – sempre escrito em caixa alta quando usado como marca principal.

### 3.2 Significado simbólico

- a íris do olho, associada ao olhar, à percepção e à lembrança
- a flor íris, associada à delicadeza, beleza e presença

### 3.3 Uso correto

- IRIS
- Plataforma IRIS
- Design System IRIS
- Universo IRIS
- Memórias IRIS

### 3.4 Uso incorreto

- Iris
- Íris
- iris
- IRÍS
- NÓS (quando se referindo ao produto principal)

> Observação: NÓS pode continuar existindo como nome interno de um sistema, módulo ou conceito afetivo, mas a marca principal do produto agora é IRIS.

## 4. Slogan

### 4.1 Slogan principal

> O tempo passa, mas o que sentimos permanece.

### 4.2 Slogans auxiliares

- Memórias que conectam.
- Presença que permanece.
- Guarde o que importa.
- Reviva o que te fez sentir.
- Um espaço para lembrar com calma.
- Sua história, guardada com cuidado.
- Onde memórias encontram presença.
- Para o que merece permanecer.

### 4.3 Regras de uso

O slogan principal deve ser usado em materiais de marca, landing pages, telas de abertura, documentos institucionais e apresentações. Evite usar o slogan em excesso dentro da interface operacional. Em telas funcionais, priorize clareza e objetividade.

## 5. Logotipo

### 5.1 Estrutura

1. Símbolo floral ou abstrato inspirado em íris
2. Wordmark serifado “IRIS”
3. Opcionalmente, slogan ou assinatura institucional

### 5.2 Versões oficiais

- **Versão principal:** Símbolo acima ou próximo do wordmark, em Verde Floresta. Uso: capas, landing page, splash screen.
- **Versão horizontal:** Símbolo à esquerda e wordmark à direita. Uso: headers, navbar, rodapés.
- **Versão vertical:** Símbolo acima do wordmark. Uso: telas de abertura, cards institucionais.
- **Versão monocromática:** Logotipo em preto elegante ou branco.

## 6. Área de respiro

O logotipo deve sempre ter espaço suficiente ao redor. Área mínima baseada na altura do símbolo ou na largura da letra “T”.

**Recomendações:** nunca encostar nas bordas, não posicionar texto muito próximo, manter contraste adequado.

**Redução mínima:**  
- Digital: logotipo completo mínimo 120px largura; ícone isolado 24px; favicon 16px.  
- Impressão: completo mínimo 20mm; ícone isolado 8mm.

## 7. Usos incorretos do logotipo

Não é permitido: distorcer, esticar, alterar espaçamento, mudar cores oficiais, aplicar sombra pesada, contorno desnecessário, baixo contraste, rotação, gradientes, efeitos 3D ou trocar a tipografia.

## 8. Paleta de cores

A paleta do IRIS é emocional, silenciosa e elegante, combinando verdes profundos, off-white, preto refinado e um lilás afetivo.

### Cores principais

| Nome | Hex | Uso |
|------|-----|-----|
| Verde Floresta | #1B3A2E | Cor principal da marca, textos importantes, logo |
| Verde Esmeralda | #006D4E | Ações primárias, estados ativos, destaques |
| Lilás Profundo | #9A7CA7 | Emoção, afeto, detalhes sensíveis, foco |
| Preto Elegante | #111111 | Texto principal, contraste, modo escuro |
| Off-White | #FAF7F2 | Fundo principal, atmosfera editorial |

### Cores secundárias

| Nome | Hex | Uso |
|------|-----|-----|
| Sálvia Clara | #DDE6DA | Fundos suaves, cards delicados |
| Sálvia Média | #B9C8B5 | Elementos secundários, divisores suaves |
| Areia Suave | #EDE6DA | Fundos quentes, blocos editoriais |

### Neutros auxiliares

| Nome | Hex |
|------|-----|
| Neutro 100 | #F2F4F3 |
| Neutro 200 | #E3E7E6 |
| Neutro 300 | #C7CFCC |
| Neutro 400 | #9AA4A1 |
| Neutro 500 | #747D79 |
| Neutro 600 | #4F5955 |
| Neutro 700 | #2A3430 |
| Neutro 800 | #161E1A |
| Neutro 900 | #0F1512 |

## 9. Tokens semânticos (Light mode)

```css
:root {
  --color-bg-primary: #FAF7F2;
  --color-bg-surface: #FFFFFF;
  --color-bg-subtle: #F2F4F3;
  --color-text-primary: #1B3A2E;
  --color-text-secondary: #476153;
  --color-text-muted: #7A877F;
  --color-text-inverse: #FAF7F2;
  --color-accent: #006D4E;
  --color-accent-hover: #00563E;
  --color-accent-subtle: #DDEEE6;
  --color-emotion: #9A7CA7;
  --color-emotion-subtle: #E9DDEE;
  --color-border: #E2E7E3;
  --color-border-strong: #C7CFCC;
  --color-focus-ring: #9A7CA7;
  --color-success: #006D4E;
  --color-warning: #B8872B;
  --color-danger: #B94A48;
  --color-info: #4C6F8F;
}

[data-theme="dark"] {
  --color-bg-primary: #0F1512;
  --color-bg-surface: #161E1A;
  --color-bg-subtle: #1E2924;
  --color-text-primary: #F6FAF7;
  --color-text-secondary: #C9D3CD;
  --color-text-muted: #98A59F;
  --color-text-inverse: #111111;
  --color-accent: #43C8A1;
  --color-accent-hover: #65D8B7;
  --color-accent-subtle: #1A3E33;
  --color-emotion: #BFA6D6;
  --color-emotion-subtle: #34283D;
  --color-border: #2A3430;
  --color-border-strong: #3E4A45;
  --color-focus-ring: #BFA6D6;
  --color-success: #43C8A1;
  --color-warning: #E1B767;
  --color-danger: #E17B78;
  --color-info: #8EAFC3;
}

10. Acessibilidade e contraste
Mínimo WCAG AA: texto normal 4.5:1, texto grande 3:1, elementos interativos 3:1.

Foco visível sempre obrigatório.

Nunca usar texto lilás claro sobre fundo branco.

Priorizar Verde Floresta para textos importantes.

11. Tipografia
Fontes oficiais
Fonte	Uso
Playfair Display	Títulos principais, chamadas emocionais, hero sections
Inter	Corpo de texto, interface, formulários, menus, botões
JetBrains Mono	Tokens, códigos, documentação técnica
OpenDyslexic	Modo acessível, usuários com dislexia
Escala tipográfica
Estilo	Tamanho	Line-height	Uso
Display	64px	72px	Capa, hero
H1	48px	56px	Títulos principais
H2	32px	40px	Títulos de seção
H3	24px	32px	Subtítulos
Corpo grande	18px	28px	Introduções
Corpo padrão	16px	24px	Texto geral
Corpo pequeno	14px	20px	Apoio
Detalhe	12px	16px	Legendas
12. Espaçamento (base 4px)
Token	Valor
space-1	4px
space-2	8px
space-3	12px
space-4	16px
space-6	24px
space-8	32px
space-12	48px
space-16	64px
space-24	96px
13. Arredondamento
Token	Valor	Uso
radius-sm	4px	Inputs pequenos
radius-md	8px	Botões e tags
radius-lg	16px	Cards
radius-xl	24px	Modais
radius-2xl	32px	Elementos especiais
14. Sombras
css
--shadow-sm: 0 1px 2px rgba(17,17,17,0.04);
--shadow-md: 0 4px 12px rgba(17,17,17,0.08);
--shadow-lg: 0 10px 24px rgba(17,17,17,0.10);
--shadow-xl: 0 20px 48px rgba(17,17,17,0.12);
15. Bordas
css
--border-subtle: 1px solid #E2E7E3;
--border-strong: 1px solid #C7CFCC;
16. Z-index
Token	Valor	Uso
z-base	1	Conteúdo normal
z-header	10	Cabeçalhos fixos
z-dropdown	20	Dropdowns
z-sticky	30	Elementos fixos
z-overlay	40	Overlays
z-modal	50	Modais
z-toast	60	Notificações
z-aurora	70	Chat/assistente IA
17. Movimento e transições
Ação	Duração	Easing
Fade	150ms	ease-out
Hover	120ms	ease-out
Mudança de cor	200ms	ease-out
Abertura de modal	250ms	cubic-bezier(0.22,1,0.36,1)
Transição de página	300ms	ease-out
Redução de movimento
css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
18. Iconografia
Estilo linear, minimalista, arredondado, stroke 1.5px ou 2px, cap/join round.

Ícones principais: Memória, Coração, Mapa, Carta, Biblioteca, Sonho, Brilho, Busca, Perfil, Configurações, Cadeado, Câmera, Calendário, Casa, Pessoas, Notificação, Aurora/IA.

19. Componentes (resumo)
Botões
Primário: fundo var(--color-accent), texto branco, hover mais escuro.

Secundário: transparente, borda, texto var(--color-text-primary).

Ghost: transparente, sem borda, hover com fundo sutil.

Inputs
Largura total, borda suave, padding 0.75rem 1rem, foco com anel lilás.

Estado aria-invalid="true" com borda vermelha.

Cards
Fundo superfície, borda suave, sombra média, padding 1rem, hover com sombra maior.

Tags e Chips
Tag: fundo --color-sage-light, texto verde floresta, border-radius 9999px.

Chip: fundo branco, borda suave, gap pequeno.

Skeleton
Gradiente animado, border-radius médio, desativa com reduced motion.

20. Modo dislexia
Ativar [data-reading-mode="dyslexia"]:

Fonte OpenDyslexic

Letter-spacing 0.03em

Line-height 1.7

Links sublinhados

21. Dark mode
Fundo principal #0F1512

Superfícies #161E1A

Acentos verdes mais luminosos (#43C8A1)

Sombras mais escuras

22. Responsividade
Breakpoints recomendados: 640px, 768px, 1024px, 1280px, 1536px.
Estratégia mobile-first, grids se adaptam, sidebar vira bottom navigation no mobile.

23. Direção visual final
O IRIS deve sempre parecer:

premium, mas não frio

emocional, mas não exagerado

minimalista, mas não vazio

tecnológico, mas humano

poético, mas claro

íntimo, mas seguro

moderno, mas atemporal

24. Frase-guia do sistema
Design não é decoração no IRIS. Design é cuidado, presença e memória transformados em interface.

25. Rodapé institucional
IRIS • Memórias que conectam. Presença que permanece.
