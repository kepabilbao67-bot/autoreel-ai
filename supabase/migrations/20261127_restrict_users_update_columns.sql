-- Ejecutar en el SQL Editor de Supabase en bases ya creadas con schema.sql.
-- RLS permitia a cada usuario actualizar TODA su fila de users, incluida la
-- columna plan (subirse a 'business' gratis) y videos_count (saltarse limites).
-- Plan y contadores solo deben cambiarlos el servidor (service role / webhook).
REVOKE UPDATE ON users FROM authenticated, anon;
GRANT UPDATE (full_name, avatar_url) ON users TO authenticated;

-- Los triggers de contador se ejecutaban con los permisos del usuario; tras
-- el REVOKE fallarian al crear/borrar videos. Pasan a SECURITY DEFINER.
CREATE OR REPLACE FUNCTION increment_video_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET videos_count = videos_count + 1 WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION decrement_video_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET videos_count = GREATEST(0, videos_count - 1) WHERE id = OLD.user_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
