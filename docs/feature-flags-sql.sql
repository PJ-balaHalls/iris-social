-- SQL para criar a tabela de feature_flags no Supabase
CREATE TABLE IF NOT EXISTS feature_flags (
  id SERIAL PRIMARY KEY,
  flag_name VARCHAR(100) NOT NULL,
  enabled BOOLEAN DEFAULT false,
  percentage INT DEFAULT 100,  -- 0 a 100, para rollout gradual
  user_id UUID DEFAULT NULL,   -- NULL = global, UUID = específico do usuário
  environment VARCHAR(20) DEFAULT 'production',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(flag_name, user_id, environment)
);

-- Índices
CREATE INDEX idx_feature_flags_flag_name ON feature_flags(flag_name);
CREATE INDEX idx_feature_flags_user_id ON feature_flags(user_id);

-- Exemplo de inserções
INSERT INTO feature_flags (flag_name, enabled, percentage, environment) VALUES
('uslife', true, 100, 'production'),
('iris-ai', true, 100, 'production'),
('marketplace', true, 100, 'production'),
('video-upload', false, 0, 'production'),
('new-feed-ui', false, 20, 'production');  -- 20% dos usuários
