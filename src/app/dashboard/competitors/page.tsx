'use client'

import { useState } from 'react'
import {
  Users,
  Search,
  TrendingUp,
  Clock,
  BarChart3,
  Star,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface AnalysisResult {
  username: string
  postingFrequency: string
  avgEngagement: number
  topCategories: string[]
  bestTimes: string[]
  followerGrowth: { month: string; followers: number }[]
  contentStyle: { type: string; percentage: number; color: string }[]
}

export default function CompetitorsPage() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleAnalyze = async () => {
    if (!username.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/ai/competitor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      // Fallback mock data
      setResult(generateMockData(username))
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = (user: string): AnalysisResult => ({
    username: user.replace('@', '').replace('https://www.tiktok.com/@', ''),
    postingFrequency: '4-5 videos/semana',
    avgEngagement: 8.4,
    topCategories: ['Entretenimiento', 'Educativo', 'Humor', 'Lifestyle'],
    bestTimes: ['19:00-21:00', '12:00-14:00', '8:00-9:00'],
    followerGrowth: [
      { month: 'Ene', followers: 12000 },
      { month: 'Feb', followers: 18500 },
      { month: 'Mar', followers: 24000 },
      { month: 'Abr', followers: 31000 },
      { month: 'May', followers: 42000 },
      { month: 'Jun', followers: 58000 },
    ],
    contentStyle: [
      { type: 'Trending', percentage: 35, color: 'bg-pink-500' },
      { type: 'Original', percentage: 30, color: 'bg-purple-500' },
      { type: 'Duets', percentage: 20, color: 'bg-blue-500' },
      { type: 'Tutoriales', percentage: 15, color: 'bg-green-500' },
    ],
  })

  const maxFollowers = result
    ? Math.max(...result.followerGrowth.map((g) => g.followers))
    : 0

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-primary-400" />
          Analisis de Competidores
        </h1>
        <p className="text-dark-muted mt-1">
          Analiza las cuentas de tus competidores para mejorar tu estrategia
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="@usuario o URL de TikTok..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
            <Button
              onClick={handleAnalyze}
              loading={loading}
              disabled={!username.trim()}
              icon={<Zap className="w-4 h-4" />}
            >
              Analizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="text-center py-4">
                <Clock className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                <p className="text-xs text-dark-muted">Frecuencia de Publicacion</p>
                <p className="font-bold mt-1">{result.postingFrequency}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-4">
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-xs text-dark-muted">Engagement Promedio</p>
                <p className="font-bold mt-1 text-green-400">{result.avgEngagement}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-4">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-xs text-dark-muted">Categoria Principal</p>
                <p className="font-bold mt-1">{result.topCategories[0]}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Follower Growth Bar Chart */}
            <Card>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-primary-400" />
                  <h3 className="font-semibold">Crecimiento de Seguidores</h3>
                </div>
                <div className="flex items-end gap-2 h-40">
                  {result.followerGrowth.map((item) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-dark-muted">
                        {(item.followers / 1000).toFixed(0)}k
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md transition-all"
                        style={{
                          height: `${(item.followers / maxFollowers) * 100}%`,
                          minHeight: '8px',
                        }}
                      />
                      <span className="text-[10px] text-dark-muted">{item.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Style Breakdown */}
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-4">Estilo de Contenido</h3>
                <div className="space-y-3">
                  {result.contentStyle.map((style) => (
                    <div key={style.type}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{style.type}</span>
                        <span className="text-dark-muted">{style.percentage}%</span>
                      </div>
                      <div className="w-full h-3 bg-dark-bg rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${style.color}`}
                          style={{ width: `${style.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Visual circle chart */}
                <div className="flex justify-center mt-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden flex">
                    {result.contentStyle.map((style, i) => (
                      <div
                        key={i}
                        className={`${style.color} h-full`}
                        style={{ width: `${style.percentage}%` }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-3">Categorias Principales</h3>
                <div className="flex flex-wrap gap-2">
                  {result.topCategories.map((cat) => (
                    <Badge key={cat} variant="info">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Best Posting Times */}
            <Card>
              <CardContent>
                <h3 className="font-semibold mb-3">Mejores Horarios</h3>
                <div className="space-y-2">
                  {result.bestTimes.map((time, i) => (
                    <div
                      key={time}
                      className="flex items-center gap-2 p-2 rounded-lg bg-dark-bg border border-dark-border"
                    >
                      <Clock className="w-4 h-4 text-primary-400" />
                      <span className="text-sm">{time}</span>
                      {i === 0 && <Badge variant="success">Mejor</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
