'use client'

import { useState } from 'react'
import { User, Bell, Shield, CreditCard, Crown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

// Pagina de configuracion
export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Usuario Demo',
    email: 'demo@autoreel.ai',
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuracion</h1>
        <p className="text-dark-muted">Gestiona tu perfil y preferencias</p>
      </div>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary-400" />
            Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nombre"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <Button>Guardar Cambios</Button>
        </CardContent>
      </Card>

      {/* Plan Actual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary-400" />
            Plan Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-dark-bg border border-dark-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Plan Starter</span>
                <Badge variant="info">Gratis</Badge>
              </div>
              <p className="text-sm text-dark-muted mt-1">3 videos/mes - 30s max</p>
            </div>
            <Button variant="outline" icon={<CreditCard className="w-4 h-4" />}>
              Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-400" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm capitalize">
                {key === 'email' ? 'Notificaciones por email' : key === 'push' ? 'Notificaciones push' : 'Marketing'}
              </span>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={`w-10 h-6 rounded-full transition-colors ${value ? 'bg-primary-500' : 'bg-dark-border'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-400" />
            Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Cambiar contrasena</p>
              <p className="text-xs text-dark-muted">Ultima actualizacion hace 30 dias</p>
            </div>
            <Button variant="secondary" size="sm">Cambiar</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Autenticacion de dos factores</p>
              <p className="text-xs text-dark-muted">Proteccion adicional para tu cuenta</p>
            </div>
            <Button variant="secondary" size="sm">Activar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
