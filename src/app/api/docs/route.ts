import { NextResponse } from 'next/server'

// Especificacion OpenAPI/Swagger del API de AutoReel AI
const openAPISpec = {
  openapi: '3.0.3',
  info: {
    title: 'AutoReel AI API',
    description: 'API para la plataforma de creacion automatica de videos con IA para redes sociales',
    version: '2.0.0',
    contact: {
      name: 'AutoReel AI Team',
      email: 'api@autoreel.ai',
      url: 'https://autoreel.ai',
    },
  },
  servers: [
    {
      url: 'https://autoreel.ai/api',
      description: 'Produccion',
    },
    {
      url: 'http://localhost:3000/api',
      description: 'Desarrollo local',
    },
  ],
  paths: {
    '/videos': {
      get: {
        summary: 'Obtener videos del usuario',
        tags: ['Videos'],
        parameters: [
          {
            name: 'userId',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'ID del usuario',
          },
        ],
        responses: {
          '200': {
            description: 'Lista de videos',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    videos: {
                      type: 'array',
                      items: { '$ref': '#/components/schemas/Video' },
                    },
                  },
                },
              },
            },
          },
          '400': { description: 'Parametros invalidos' },
          '500': { description: 'Error interno' },
        },
      },
      post: {
        summary: 'Crear nuevo video',
        tags: ['Videos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'topic', 'platform', 'duration', 'style', 'language'],
                properties: {
                  userId: { type: 'string' },
                  topic: { type: 'string', description: 'Tema del video' },
                  platform: { type: 'string', enum: ['tiktok', 'reels', 'shorts'] },
                  duration: { type: 'number', description: 'Duracion en segundos' },
                  style: { type: 'string' },
                  language: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Video creado exitosamente' },
          '400': { description: 'Datos invalidos' },
          '500': { description: 'Error interno' },
        },
      },
      delete: {
        summary: 'Eliminar video',
        tags: ['Videos'],
        parameters: [
          { name: 'id', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'userId', in: 'query', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Video eliminado' },
          '400': { description: 'Parametros invalidos' },
          '500': { description: 'Error interno' },
        },
      },
    },
    '/ai/generate': {
      post: {
        summary: 'Generar script con IA',
        tags: ['AI'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['topic', 'platform', 'style'],
                properties: {
                  topic: { type: 'string' },
                  platform: { type: 'string', enum: ['tiktok', 'reels', 'shorts'] },
                  style: { type: 'string' },
                  duration: { type: 'number' },
                  language: { type: 'string', default: 'es' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Script generado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    script: { type: 'string' },
                    title: { type: 'string' },
                    hashtags: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/scheduler': {
      get: {
        summary: 'Obtener publicaciones programadas',
        tags: ['Scheduler'],
        parameters: [
          { name: 'userId', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'published', 'failed'] } },
        ],
        responses: {
          '200': { description: 'Lista de publicaciones programadas' },
        },
      },
      post: {
        summary: 'Crear publicacion programada',
        tags: ['Scheduler'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['videoId', 'platform', 'scheduledAt'],
                properties: {
                  videoId: { type: 'string' },
                  platform: { type: 'string', enum: ['tiktok', 'reels', 'shorts'] },
                  scheduledAt: { type: 'string', format: 'date-time' },
                  userId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Publicacion programada creada' },
          '400': { description: 'Datos invalidos' },
        },
      },
    },
    '/notifications': {
      get: {
        summary: 'Obtener notificaciones del usuario',
        tags: ['Notificaciones'],
        responses: {
          '200': {
            description: 'Lista de notificaciones',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    notifications: { type: 'array' },
                    unreadCount: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Marcar notificacion como leida',
        tags: ['Notificaciones'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  notificationId: { type: 'string' },
                  action: { type: 'string', enum: ['markRead', 'markAllRead'] },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Operacion exitosa' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Iniciar sesion',
        tags: ['Autenticacion'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login exitoso' },
          '401': { description: 'Credenciales invalidas' },
        },
      },
    },
    '/payments/create-checkout': {
      post: {
        summary: 'Crear sesion de checkout con Stripe',
        tags: ['Pagos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['priceId', 'userId'],
                properties: {
                  priceId: { type: 'string' },
                  userId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'URL de checkout generada' },
          '400': { description: 'Datos invalidos' },
        },
      },
    },
  },
  components: {
    schemas: {
      Video: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          user_id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          script: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['draft', 'processing', 'completed', 'failed'] },
          platform: { type: 'string', enum: ['tiktok', 'reels', 'shorts'] },
          duration: { type: 'number' },
          language: { type: 'string' },
          style: { type: 'string' },
          video_url: { type: 'string', nullable: true },
          thumbnail_url: { type: 'string', nullable: true },
          views: { type: 'number' },
          likes: { type: 'number' },
          shares: { type: 'number' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
}

// GET - Devolver especificacion OpenAPI en formato JSON
export async function GET() {
  return NextResponse.json(openAPISpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
