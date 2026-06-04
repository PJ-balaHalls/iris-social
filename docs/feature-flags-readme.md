# Feature Flags - IRIS Social

## Estrutura criada

- `src/feature-flags/` – toda a lógica de feature flags
- `src/lib/supabase/featureFlags.ts` – integração com Supabase (opcional)
- Exemplos de uso e SQL para criar a tabela no banco.

## Como ativar

1. Se quiser usar flags dinâmicas com Supabase, execute o SQL fornecido no seu banco.
2. Adicione o `FeatureFlagProvider` no layout do app (conforme exemplo).
3. Use `useFeatureFlag` ou o componente `FeatureFlag` nos seus componentes.

## Gerenciamento

- Para flags estáticas, edite `src/feature-flags/flags.config.ts`.
- Para flags dinâmicas, insira/atualize registros na tabela `feature_flags`.

## Recomendações

- Não desative flags que removem dados (apenas esconda UI).
- Remova flags antigas após a funcionalidade estar estável.
- Use rollout percentual com cuidado (ex: `percentage=20`).
