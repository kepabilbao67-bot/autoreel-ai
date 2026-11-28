'use client'

import { useMemo, useState } from 'react'
import { useLocalStorageValue, writeLocalStorage } from '@/hooks/useLocalStorage'
import { useNow } from '@/hooks/useNow'
import { UsersRound, Plus, Trash2, Shield, Edit3, Eye, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { motion, AnimatePresence } from 'framer-motion'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  avatar: string
  lastActive: string
  joinedAt: string
}

const STORAGE_KEY = 'autoreel_team'

const roleConfig: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  admin: { label: 'Admin', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: Shield },
  editor: { label: 'Editor', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: Edit3 },
  viewer: { label: 'Viewer', color: 'bg-gray-500/10 text-gray-400 border-gray-500/30', icon: Eye },
}

const defaultMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Carlos Rodriguez',
    email: 'carlos@autoreel.ai',
    role: 'admin',
    avatar: 'CR',
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    joinedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Sofia Martinez',
    email: 'sofia@autoreel.ai',
    role: 'editor',
    avatar: 'SM',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    joinedAt: '2024-02-20T00:00:00Z',
  },
  {
    id: '3',
    name: 'Diego Lopez',
    email: 'diego@autoreel.ai',
    role: 'viewer',
    avatar: 'DL',
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    joinedAt: '2024-03-10T00:00:00Z',
  },
]

export default function TeamPage() {
  // Miembros guardados en localStorage; si no hay (o están corruptos), los de ejemplo.
  // En el servidor y durante la hidratación la lista está vacía, como antes.
  const storedMembers = useLocalStorageValue(STORAGE_KEY)
  const members = useMemo<TeamMember[]>(() => {
    if (storedMembers === undefined) return []
    if (storedMembers === null) return defaultMembers
    try {
      return JSON.parse(storedMembers)
    } catch {
      return defaultMembers
    }
  }, [storedMembers])
  const now = useNow()
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor')
  const [inviteName, setInviteName] = useState('')

  const saveMembers = (updated: TeamMember[]) => {
    writeLocalStorage(STORAGE_KEY, JSON.stringify(updated))
  }

  const handleInvite = () => {
    if (!inviteEmail.trim()) return

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: inviteName || inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: (inviteName || inviteEmail).slice(0, 2).toUpperCase(),
      lastActive: new Date().toISOString(),
      joinedAt: new Date().toISOString(),
    }

    saveMembers([...members, newMember])
    setInviteEmail('')
    setInviteName('')
    setInviteRole('editor')
    setShowInviteModal(false)
  }

  const handleRemove = (id: string) => {
    saveMembers(members.filter((m) => m.id !== id))
  }

  const formatLastActive = (date: string) => {
    if (now === null) return ''
    const diff = now - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Ahora'
    if (minutes < 60) return `Hace ${minutes} min`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `Hace ${hours}h`
    const days = Math.floor(hours / 24)
    return `Hace ${days}d`
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
            <UsersRound className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Equipo</h1>
            <p className="text-dark-muted text-sm">Gestiona los miembros de tu equipo</p>
          </div>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Invitar Miembro
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover={false}>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-primary-400">{members.length}</p>
            <p className="text-xs text-dark-muted">Miembros Totales</p>
          </CardContent>
        </Card>
        <Card hover={false}>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {now === null ? 0 : members.filter((m) => {
                const diff = now - new Date(m.lastActive).getTime()
                return diff < 60 * 60 * 1000
              }).length}
            </p>
            <p className="text-xs text-dark-muted">Activos Ahora</p>
          </CardContent>
        </Card>
        <Card hover={false}>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {members.filter((m) => m.role === 'admin').length}
            </p>
            <p className="text-xs text-dark-muted">Administradores</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      <Card hover={false}>
        <CardContent>
          <h3 className="text-sm font-medium mb-4">Miembros del Equipo</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {members.map((member) => {
                const role = roleConfig[member.role]
                return (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card hover:border-dark-border/80 transition-all"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-sm font-bold text-primary-300">
                      {member.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-xs text-dark-muted truncate">{member.email}</p>
                    </div>

                    {/* Role Badge */}
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${role.color}`}>
                      {role.label}
                    </div>

                    {/* Last Active */}
                    <div className="hidden sm:block text-xs text-dark-muted whitespace-nowrap">
                      {formatLastActive(member.lastActive)}
                    </div>

                    {/* Remove */}
                    {member.role !== 'admin' && (
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="text-dark-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invitar Miembro"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-dark-muted mb-1">Nombre (opcional)</label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="Nombre del miembro"
              className="w-full input-dark"
            />
          </div>
          <div>
            <label className="block text-sm text-dark-muted mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full input-dark pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-dark-muted mb-2">Rol</label>
            <div className="grid grid-cols-3 gap-2">
              {(['admin', 'editor', 'viewer'] as const).map((role) => {
                const config = roleConfig[role]
                const RoleIcon = config.icon
                return (
                  <button
                    key={role}
                    onClick={() => setInviteRole(role)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      inviteRole === role
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-border hover:border-dark-border/80'
                    }`}
                  >
                    <RoleIcon className="w-4 h-4 mx-auto mb-1 text-dark-muted" />
                    <p className="text-xs font-medium">{config.label}</p>
                  </button>
                )
              })}
            </div>
          </div>
          <button
            onClick={handleInvite}
            disabled={!inviteEmail.trim()}
            className="w-full btn-primary py-2.5 disabled:opacity-50"
          >
            Enviar Invitacion
          </button>
        </div>
      </Modal>
    </div>
  )
}
