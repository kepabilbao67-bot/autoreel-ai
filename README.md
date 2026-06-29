# AutoReel AI v2.0

Plataforma SaaS impulsada por IA para crear videos automaticos y virales para TikTok, Instagram Reels y YouTube Shorts.

## Stack Tecnologico

- **Framework:** Next.js 15.1 con App Router
- **Frontend:** React 19, TypeScript 5.7, Tailwind CSS 3.4
- **Animaciones:** Framer Motion 12
- **IA:** OpenAI GPT-4o, ElevenLabs, Replicate
- **Base de datos:** Supabase (PostgreSQL + Auth + Storage)
- **Pagos:** Stripe
- **Estado:** Zustand 5
- **Validacion:** Zod 3.24
- **Queries:** TanStack React Query 5

## Caracteristicas Principales

- Generacion de videos con un solo clic
- Guiones virales optimizados por GPT-4o
- Subtitulos automaticos con timestamps
- Detector de tendencias en tiempo real
- Multi-plataforma (TikTok, Reels, Shorts)
- Soporte multi-idioma (30+ idiomas)
- Sistema de plantillas
- Analiticas de rendimiento
- Planes de suscripcion (Starter/Creator/Business)
- Tema oscuro con gradientes purpura/azul
- PWA ready

## Inicio Rapido

```bash
# Clonar repositorio
git clone https://github.com/kepabilbao67-bot/autoreel-ai.git
cd autoreel-ai

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus claves

# Iniciar en desarrollo
npm run dev
```

## Variables de Entorno

Copia `.env.example` a `.env.local` y configura:

- `NEXT_PUBLIC_SUPABASE_URL` - URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave anonima de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Clave de servicio de Supabase
- `OPENAI_API_KEY` - Clave de API de OpenAI
- `STRIPE_SECRET_KEY` - Clave secreta de Stripe
- `STRIPE_WEBHOOK_SECRET` - Secreto del webhook de Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Clave publica de Stripe
- `ELEVENLABS_API_KEY` - Clave de ElevenLabs
- `REPLICATE_API_TOKEN` - Token de Replicate

## Base de Datos

Ejecuta `supabase/schema.sql` en tu proyecto de Supabase para crear las tablas necesarias.

## Deploy en Vercel

1. Importa el repositorio en [Vercel](https://vercel.com)
2. Configura las variables de entorno
3. Deploy automatico en cada push a main

```bash
# O usa Vercel CLI
npm i -g vercel
vercel
```

## Estructura del Proyecto

```
src/
  app/
    (auth)/          # Paginas de autenticacion
    dashboard/       # Panel de usuario
    api/             # API Routes
  components/
    ui/              # Componentes UI reutilizables
    shared/          # Componentes compartidos
    video/           # Componentes de video
  hooks/             # Custom hooks
  lib/               # Utilidades y configuracion
supabase/
  schema.sql         # Esquema de base de datos
public/
  manifest.json      # PWA manifest
```

## Scripts

```bash
npm run dev      # Desarrollo local
npm run build    # Build de produccion
npm run start    # Servidor de produccion
npm run lint     # Linting
```

## Roadmap

- [ ] Editor de video in-browser con timeline
- [ ] Integracion directa con APIs de TikTok/Instagram
- [ ] Clonacion de voz con ElevenLabs
- [ ] Generacion de imagenes con DALL-E 3
- [ ] Colaboracion en equipo
- [ ] Scheduler de publicaciones
- [ ] App movil nativa
- [ ] Marketplace de plantillas

## Licencia

Copyright 2025 AutoReel AI. Todos los derechos reservados.

