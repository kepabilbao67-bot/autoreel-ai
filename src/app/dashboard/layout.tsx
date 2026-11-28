'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Play,
  LayoutDashboard,
  Video,
  PlusCircle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Layout,
  CalendarClock,
  CalendarDays,
  Film,
  Music,
  Image as ImageIcon,
  History,
  Users,
  Mic,
  Languages,
  Send,
  UsersRound,
  ChevronDown,
  Palette,
  LineChart,
  Rocket,
  UserCog,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { NotificationBell } from '@/components/shared/NotificationBell'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Onboarding } from '@/components/shared/Onboarding'
import { AIChatbot } from '@/components/chat/AIChatbot'

// Definicion de grupos de navegacion con secciones colapsables
interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface NavGroup {
  label: string
  icon: LucideIcon
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Crear',
    icon: Rocket,
    items: [
      { href: '/dashboard/editor', label: 'Editor Video', icon: Film },
      { href: '/dashboard/create', label: 'Crear Video', icon: PlusCircle },
      { href: '/dashboard/thumbnails', label: 'Thumbnails', icon: ImageIcon },
      { href: '/dashboard/narration', label: 'Narracion IA', icon: Mic },
    ],
  },
  {
    label: 'Contenido',
    icon: Palette,
    items: [
      { href: '/dashboard/videos', label: 'Mis Videos', icon: Video },
      { href: '/dashboard/history', label: 'Historial', icon: History },
      { href: '/dashboard/templates', label: 'Plantillas', icon: Layout },
      { href: '/dashboard/images', label: 'Imagenes', icon: ImageIcon },
      { href: '/dashboard/music', label: 'Musica', icon: Music },
    ],
  },
  {
    label: 'Planificar',
    icon: CalendarDays,
    items: [
      { href: '/dashboard/calendar', label: 'Calendario', icon: CalendarDays },
      { href: '/dashboard/scheduler', label: 'Scheduler', icon: CalendarClock },
      { href: '/dashboard/publish', label: 'Publicar', icon: Send },
    ],
  },
  {
    label: 'Analizar',
    icon: LineChart,
    items: [
      { href: '/dashboard/analytics', label: 'Analiticas', icon: BarChart3 },
      { href: '/dashboard/competitors', label: 'Competencia', icon: Users },
      { href: '/dashboard/translate', label: 'Traducir', icon: Languages },
    ],
  },
  {
    label: 'Cuenta',
    icon: UserCog,
    items: [
      { href: '/dashboard/team', label: 'Equipo', icon: UsersRound },
      { href: '/dashboard/settings', label: 'Configuracion', icon: Settings },
    ],
  },
]

// Componente de grupo colapsable
function SidebarGroup({
  group,
  isExpanded,
  onToggle,
  pathname,
  onLinkClick,
}: {
  group: NavGroup
  isExpanded: boolean
  onToggle: () => void
  pathname: string
  onLinkClick?: () => void
}) {
  const hasActiveItem = group.items.some((item) => pathname === item.href)

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
          hasActiveItem ? 'text-primary-300' : 'text-dark-muted hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2">
          <group.icon className="w-3.5 h-3.5" />
          <span>{group.label}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-0.5 space-y-0.5 pl-2">
          {group.items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-500/15 text-primary-300 border border-primary-500/25'
                    : 'text-dark-muted hover:text-white hover:bg-dark-hover'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Inicializar grupos expandidos basado en la ruta activa
  const getInitialExpanded = () => {
    const expanded: Record<string, boolean> = {}
    navGroups.forEach((group) => {
      const hasActive = group.items.some((item) => pathname === item.href)
      expanded[group.label] = hasActive
    })
    // Siempre mostrar al menos el primer grupo
    if (!Object.values(expanded).some((v) => v)) {
      expanded['Crear'] = true
    }
    return expanded
  }

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(getInitialExpanded)

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    // Navegación de Next + refresh para que el servidor vea la sesión cerrada
    router.replace('/')
    router.refresh()
  }

  // Contenido del sidebar compartido entre desktop y mobile. Es una función que
  // devuelve JSX (no un componente definido dentro del layout), para que React no
  // lo desmonte y vuelva a montar en cada render.
  const renderSidebarContent = (onLinkClick?: () => void) => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
            <Play className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">AutoReel AI</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Plan badge */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-yellow-300">Plan Business</span>
          <Badge variant="success" className="ml-auto text-[10px]">PRO</Badge>
        </div>
      </div>

      {/* Dashboard link principal */}
      <div className="px-3 pt-2 pb-1">
        <Link
          href="/dashboard"
          onClick={onLinkClick}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/dashboard'
              ? 'bg-primary-500/15 text-primary-300 border border-primary-500/25'
              : 'text-dark-muted hover:text-white hover:bg-dark-hover'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
      </div>

      {/* Navegacion agrupada */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {navGroups.map((group) => (
          <SidebarGroup
            key={group.label}
            group={group}
            isExpanded={!!expandedGroups[group.label]}
            onToggle={() => toggleGroup(group.label)}
            pathname={pathname}
            onLinkClick={onLinkClick}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-dark-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesion
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 glass border-r border-dark-border">
          {renderSidebarContent()}
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 glass border-r border-dark-border z-50 flex flex-col animate-slide-in-left">
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">AutoReel AI</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-dark-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Plan badge mobile */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
                  <Crown className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-primary-300">Plan Starter</span>
                  <Badge variant="info" className="ml-auto text-[10px]">FREE</Badge>
                </div>
              </div>
              {/* Dashboard link */}
              <div className="px-3 pt-1 pb-1">
                <Link
                  href="/dashboard"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/dashboard'
                      ? 'bg-primary-500/15 text-primary-300 border border-primary-500/25'
                      : 'text-dark-muted hover:text-white hover:bg-dark-hover'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </div>
              {/* Nav groups */}
              <nav className="flex-1 px-3 py-2 overflow-y-auto">
                {navGroups.map((group) => (
                  <SidebarGroup
                    key={group.label}
                    group={group}
                    isExpanded={!!expandedGroups[group.label]}
                    onToggle={() => toggleGroup(group.label)}
                    pathname={pathname}
                    onLinkClick={() => setSidebarOpen(false)}
                  />
                ))}
              </nav>
              {/* Logout */}
              <div className="px-3 py-3 border-t border-dark-border">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:pl-60">
        {/* Top bar mobile */}
        <div className="sticky top-0 z-40 lg:hidden glass border-b border-dark-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="text-dark-muted hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-purple flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold gradient-text">AutoReel AI</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationBell />
            </div>
          </div>
        </div>

        {/* Page content con fade in */}
        <main className="p-4 sm:p-6 lg:p-8 animate-fade-in">{children}</main>
      </div>

      {/* Chatbot de IA flotante */}
      <AIChatbot />

      {/* Onboarding modal */}
      <Onboarding />
    </div>
  )
}
