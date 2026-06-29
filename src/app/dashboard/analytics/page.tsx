'use client'

import { BarChart3, TrendingUp, Clock, Eye, Heart, Share2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

// Pagina de analiticas con datos mock
const engagementData = [
  { day: 'Lun', value: 65 },
  { day: 'Mar', value: 78 },
  { day: 'Mie', value: 52 },
  { day: 'Jue', value: 91 },
  { day: 'Vie', value: 84 },
  { day: 'Sab', value: 96 },
  { day: 'Dom', value: 72 },
]

const bestHours = [
  { hour: '7:00 AM', engagement: 82 },
  { hour: '12:00 PM', engagement: 68 },
  { hour: '6:00 PM', engagement: 94 },
  { hour: '9:00 PM', engagement: 88 },
]

const topVideos = [
  { title: '5 Tips de Productividad', views: 12400, likes: 890, shares: 234 },
  { title: 'Receta en 60 Segundos', views: 8900, likes: 654, shares: 178 },
  { title: 'Tutorial de Diseno', views: 6700, likes: 432, shares: 98 },
  { title: 'Motivacion Diaria', views: 5400, likes: 321, shares: 87 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analiticas</h1>
        <p className="text-dark-muted">Resumen de rendimiento de tus videos</p>
      </div>

      {/* Stats rapidos */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">33.4K</p>
              <p className="text-xs text-dark-muted">Vistas totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">2.3K</p>
              <p className="text-xs text-dark-muted">Likes totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">597</p>
              <p className="text-xs text-dark-muted">Compartidos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">6.8%</p>
              <p className="text-xs text-dark-muted">Engagement</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafico de engagement semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-400" />
              Engagement Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-40 gap-2">
              {engagementData.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-accent-500 transition-all"
                    style={{ height: `${item.value}%` }}
                  />
                  <span className="text-xs text-dark-muted">{item.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mejores horas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-400" />
              Mejores Horas para Publicar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bestHours.map((item) => (
                <div key={item.hour} className="flex items-center gap-3">
                  <span className="text-sm w-20">{item.hour}</span>
                  <div className="flex-1 h-3 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                      style={{ width: `${item.engagement}%` }}
                    />
                  </div>
                  <span className="text-sm text-primary-400 w-10">{item.engagement}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Videos populares */}
      <Card>
        <CardHeader>
          <CardTitle>Videos Mas Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topVideos.map((video, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-dark-bg/50 border border-dark-border">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary-400 w-6">#{index + 1}</span>
                  <span className="font-medium text-sm">{video.title}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-dark-muted">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{video.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{video.likes}</span>
                  <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" />{video.shares}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
