-- AutoReel AI - Esquema de base de datos
-- Copyright 2025 AutoReel AI

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- TABLA: users
-- Perfiles de usuario
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'creator', 'business')),
  videos_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- TABLA: videos
-- Videos creados por usuarios
-- ================================================
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  script TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
  platform TEXT NOT NULL DEFAULT 'tiktok' CHECK (platform IN ('tiktok', 'reels', 'shorts')),
  duration INTEGER NOT NULL DEFAULT 30,
  language TEXT NOT NULL DEFAULT 'es',
  style TEXT NOT NULL DEFAULT 'informativo',
  video_url TEXT,
  thumbnail_url TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- TABLA: subscriptions
-- Suscripciones de Stripe
-- ================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'creator', 'business')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- TABLA: assets
-- Archivos subidos (imagenes, audio, video)
-- ================================================
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'audio', 'video', 'subtitle')),
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- TABLA: templates
-- Plantillas predefinidas para videos
-- ================================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  is_premium BOOLEAN NOT NULL DEFAULT false,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- TABLA: analytics
-- Eventos de analitica por video
-- ================================================
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- TABLA: favorites
-- Templates favoritos del usuario
-- ================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

-- ================================================
-- TABLA: scheduled_posts
-- Publicaciones programadas
-- ================================================
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- INDICES
-- ================================================
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_video_id ON assets(video_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_video_id ON analytics(video_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user ON scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;

-- Politicas de usuarios
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Politicas de videos
CREATE POLICY "Users can view own videos" ON videos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own videos" ON videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own videos" ON videos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own videos" ON videos FOR DELETE USING (auth.uid() = user_id);

-- Politicas de suscripciones
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Politicas de assets
CREATE POLICY "Users can manage own assets" ON assets FOR ALL USING (auth.uid() = user_id);

-- Politicas de analytics
CREATE POLICY "Users can view own analytics" ON analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics" ON analytics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politicas de favoritos
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Politicas de publicaciones programadas
CREATE POLICY "Users can manage own scheduled posts" ON scheduled_posts FOR ALL USING (auth.uid() = user_id);

-- Templates son publicos para lectura
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Templates are viewable by all" ON templates FOR SELECT USING (true);

-- ================================================
-- TRIGGERS
-- ================================================

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger para incrementar contador de videos
CREATE OR REPLACE FUNCTION increment_video_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET videos_count = videos_count + 1 WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER video_count_increment
  AFTER INSERT ON videos
  FOR EACH ROW EXECUTE FUNCTION increment_video_count();

-- Trigger para decrementar contador de videos
CREATE OR REPLACE FUNCTION decrement_video_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET videos_count = GREATEST(0, videos_count - 1) WHERE id = OLD.user_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER video_count_decrement
  AFTER DELETE ON videos
  FOR EACH ROW EXECUTE FUNCTION decrement_video_count();

-- ================================================
-- PLANTILLAS INICIALES
-- ================================================
INSERT INTO templates (name, description, category, config, is_premium) VALUES
  ('Tutorial Rapido', 'Explica un concepto en 60 segundos con animaciones simples', 'educacion', '{"duration": 60, "style": "educativo", "transitions": "fade"}', false),
  ('Producto Showcase', 'Muestra tu producto con transiciones elegantes y musica', 'marketing', '{"duration": 30, "style": "review", "transitions": "zoom"}', false),
  ('Story Time', 'Narra una historia cautivadora con fondo cinematografico', 'entretenimiento', '{"duration": 90, "style": "storytelling", "transitions": "dissolve"}', true),
  ('Receta Express', 'Presenta recetas de cocina en formato rapido y visual', 'comida', '{"duration": 60, "style": "informativo", "transitions": "cut"}', false),
  ('Motivacion Diaria', 'Frases motivacionales con fondos dinamicos', 'lifestyle', '{"duration": 15, "style": "motivacional", "transitions": "fade"}', false),
  ('Workout Flow', 'Rutinas de ejercicio con contadores y musica energetica', 'fitness', '{"duration": 45, "style": "informativo", "transitions": "swipe"}', true),
  ('Tips & Tricks', 'Lista de consejos practicos con graficos', 'educacion', '{"duration": 30, "style": "educativo", "transitions": "slide"}', false),
  ('Before/After', 'Transformaciones visuales impactantes', 'marketing', '{"duration": 15, "style": "review", "transitions": "split"}', true)
ON CONFLICT DO NOTHING;
