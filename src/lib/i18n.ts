// Sistema de internacionalizacion basico con soporte para espanol e ingles

export type Language = 'es' | 'en'

// Diccionario de traducciones
const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navegacion
    'nav.home': 'Inicio',
    'nav.dashboard': 'Dashboard',
    'nav.create': 'Crear Video',
    'nav.videos': 'Mis Videos',
    'nav.templates': 'Plantillas',
    'nav.analytics': 'Analiticas',
    'nav.settings': 'Configuracion',
    'nav.scheduler': 'Programador',
    'nav.pricing': 'Precios',
    'nav.blog': 'Blog',
    'nav.docs': 'Documentacion',
    'nav.contact': 'Contacto',
    'nav.logout': 'Cerrar Sesion',

    // Autenticacion
    'auth.login': 'Iniciar Sesion',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo electronico',
    'auth.password': 'Contrasena',
    'auth.forgot': 'Olvidaste tu contrasena?',

    // Dashboard
    'dashboard.welcome': 'Bienvenido de vuelta',
    'dashboard.totalVideos': 'Total de Videos',
    'dashboard.totalViews': 'Vistas Totales',
    'dashboard.engagement': 'Engagement',
    'dashboard.scheduled': 'Programados',

    // Videos
    'video.create': 'Crear Nuevo Video',
    'video.processing': 'Procesando',
    'video.completed': 'Completado',
    'video.failed': 'Error',
    'video.draft': 'Borrador',
    'video.delete': 'Eliminar',
    'video.download': 'Descargar',
    'video.share': 'Compartir',

    // Planes
    'plan.starter': 'Starter',
    'plan.creator': 'Creator',
    'plan.business': 'Business',
    'plan.free': 'Gratis',
    'plan.popular': 'Popular',
    'plan.enterprise': 'Empresas',

    // General
    'general.loading': 'Cargando...',
    'general.error': 'Ha ocurrido un error',
    'general.save': 'Guardar',
    'general.cancel': 'Cancelar',
    'general.confirm': 'Confirmar',
    'general.delete': 'Eliminar',
    'general.edit': 'Editar',
    'general.search': 'Buscar',
    'general.filter': 'Filtrar',
    'general.noResults': 'Sin resultados',
    'general.success': 'Operacion exitosa',

    // Notificaciones
    'notifications.title': 'Notificaciones',
    'notifications.empty': 'No tienes notificaciones',
    'notifications.markRead': 'Marcar como leida',
    'notifications.markAllRead': 'Marcar todas como leidas',

    // Scheduler
    'scheduler.title': 'Publicaciones Programadas',
    'scheduler.new': 'Nueva Programacion',
    'scheduler.pending': 'Pendiente',
    'scheduler.published': 'Publicado',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.create': 'Create Video',
    'nav.videos': 'My Videos',
    'nav.templates': 'Templates',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'nav.scheduler': 'Scheduler',
    'nav.pricing': 'Pricing',
    'nav.blog': 'Blog',
    'nav.docs': 'Documentation',
    'nav.contact': 'Contact',
    'nav.logout': 'Log Out',

    // Auth
    'auth.login': 'Log In',
    'auth.register': 'Sign Up',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.forgot': 'Forgot your password?',

    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.totalVideos': 'Total Videos',
    'dashboard.totalViews': 'Total Views',
    'dashboard.engagement': 'Engagement',
    'dashboard.scheduled': 'Scheduled',

    // Videos
    'video.create': 'Create New Video',
    'video.processing': 'Processing',
    'video.completed': 'Completed',
    'video.failed': 'Failed',
    'video.draft': 'Draft',
    'video.delete': 'Delete',
    'video.download': 'Download',
    'video.share': 'Share',

    // Plans
    'plan.starter': 'Starter',
    'plan.creator': 'Creator',
    'plan.business': 'Business',
    'plan.free': 'Free',
    'plan.popular': 'Popular',
    'plan.enterprise': 'Enterprise',

    // General
    'general.loading': 'Loading...',
    'general.error': 'An error occurred',
    'general.save': 'Save',
    'general.cancel': 'Cancel',
    'general.confirm': 'Confirm',
    'general.delete': 'Delete',
    'general.edit': 'Edit',
    'general.search': 'Search',
    'general.filter': 'Filter',
    'general.noResults': 'No results',
    'general.success': 'Operation successful',

    // Notifications
    'notifications.title': 'Notifications',
    'notifications.empty': 'No notifications',
    'notifications.markRead': 'Mark as read',
    'notifications.markAllRead': 'Mark all as read',

    // Scheduler
    'scheduler.title': 'Scheduled Posts',
    'scheduler.new': 'New Schedule',
    'scheduler.pending': 'Pending',
    'scheduler.published': 'Published',
  },
}

/**
 * Funcion de traduccion
 * @param key - Clave de traduccion (ej: 'nav.home')
 * @param lang - Idioma (por defecto 'es')
 * @returns Texto traducido o la clave si no existe
 */
export function t(key: string, lang: Language = 'es'): string {
  return translations[lang][key] || key
}

/**
 * Obtener todas las traducciones de un idioma
 */
export function getTranslations(lang: Language): Record<string, string> {
  return translations[lang]
}

/**
 * Idiomas disponibles
 */
export const availableLanguages: { code: Language; name: string; flag: string }[] = [
  { code: 'es', name: 'Espanol', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]
