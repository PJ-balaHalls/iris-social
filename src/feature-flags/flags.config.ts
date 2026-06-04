// src/feature-flags/flags.config.ts
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
