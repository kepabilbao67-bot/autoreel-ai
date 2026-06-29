'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { NotificationBell } from '@/components/shared/NotificationBell'
import { AIChatbot } from '@/components/chat/AIChatbot'

// Layout del dashboard con sidebar
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/create', label: 'Crear Video', icon: PlusCircle },
  { href: '/dashboard/scheduler', label: 'Scheduler', icon: CalendarClock },
  { href: '/dashboard/videos', label: 'Mis Videos', icon: Video },
  { href: '/dashboard/templates', label: 'Plantillas', icon: Layout },
  { href: '/dashboard/analytics', label: 'Analiticas', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Configuracion', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 glass border-r border-dark-border">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-dark-border">
            <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">AutoReel AI</span>
          </div>

          {/* Plan badge */}
          <div className="px-6 py-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
              <Crown className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300">Plan Starter</span>
              <Badge variant="info" className="ml-auto text-[10px]">FREE</Badge>
            </div>
          </div>

          {/* Navegacion */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                      : 'text-dark-muted hover:text-white hover:bg-dark-hover'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-dark-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesion
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 glass border-r border-dark-border z-50">
            <div className="flex items-center justify-between px-6 py-5 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">AutoReel AI</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-dark-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-300'
                        : 'text-dark-muted hover:text-white hover:bg-dark-hover'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="px-3 py-4 border-t border-dark-border">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-muted hover:text-red-400 w-full"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Top bar mobile */}
        <div className="sticky top-0 z-40 lg:hidden glass border-b border-dark-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="text-dark-muted">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-purple flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold gradient-text">AutoReel AI</span>
            </div>
            <NotificationBell />
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Chatbot de IA flotante */}
      <AIChatbot />
    </div>
  )
}
