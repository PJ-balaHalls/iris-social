// Definições Globais da Taxonomia Flora
export type FloraEspecie = 'DENTEDELEAO' | 'LOTUS' | 'ORQUIDEA' | 'TULIPA' | 'IRIS';
export type FloraEstagio = 'DORMENTE' | 'BROTO' | 'FLORESCENCIA' | 'BIOMA';
export type FloraInclinacao = 'INTROSPECTIVA' | 'SIMBIOTICA' | 'CULTURAL' | 'NULA';
export type SubscriptionPlan = 'free' | 'premium' | 'duo';

export interface UserFloraContext {
  especie: FloraEspecie;
  estagio: FloraEstagio;
  inclinacao: FloraInclinacao;
}