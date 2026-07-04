'use client'

import { useState, useMemo } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useContentCalendar, CalendarPost } from '@/hooks/useContentCalendar'

const platformConfig: Record<string, { label: string; color: string; badge: string }> = {
  tiktok: { label: 'TikTok', color: 'bg-pink-500', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
  reels: { label: 'Reels', color: 'bg-purple-500', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  shorts: { label: 'Shorts', color: 'bg-red-500', badge: 'bg-red-500/10 text-red-400 border-red-500/30' },
}

const DAYS_ES = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export default function CalendarPage() {
  const { posts, addPost, removePost } = useContentCalendar()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [newPost, setNewPost] = useState({ title: '', platform: 'tiktok', time: '12:00' })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startWeekday = (firstDay.getDay() + 6) % 7 // Monday = 0
    const daysInMonth = lastDay.getDate()

    const days: Array<{ date: string; day: number; isCurrentMonth: boolean }> = []

    // Previous month fill
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      days.push({ date: dateStr, day: d, isCurrentMonth: false })
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      days.push({ date: dateStr, day: d, isCurrentMonth: true })
    }

    // Next month fill
    const remaining = 42 - days.length
    for (let d = 1; d <= remaining; d++) {
      const dateStr = `${year}-${String(month + 2).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      days.push({ date: dateStr, day: d, isCurrentMonth: false })
    }

    return days
  }, [year, month])

  const getPostsForDate = (date: string): CalendarPost[] => {
    return posts.filter((p) => p.date === date)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDayClick = (date: string) => {
    setSelectedDate(date)
    setShowModal(true)
  }

  const handleAddPost = () => {
    if (!newPost.title.trim()) return
    addPost({
      title: newPost.title,
      platform: newPost.platform as 'tiktok' | 'reels' | 'shorts',
      time: newPost.time,
      date: selectedDate,
    })
    setNewPost({ title: '', platform: 'tiktok', time: '12:00' })
    setShowModal(false)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-primary-400" />
          Calendario de Contenido
        </h1>
        <p className="text-dark-muted mt-1">
          Planifica y organiza tus publicaciones por plataforma
        </p>
      </div>

      {/* Calendar */}
      <Card>
        <CardContent>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-bold">
              {MONTHS_ES[month]} {year}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_ES.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-dark-muted py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dayPosts = getPostsForDate(day.date)
              const isToday = day.date === today
              return (
                <button
                  key={idx}
                  onClick={() => day.isCurrentMonth && handleDayClick(day.date)}
                  className={`
                    min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 rounded-lg text-left border transition-all
                    ${day.isCurrentMonth
                      ? 'border-dark-border hover:border-primary-500/50 bg-dark-card/50'
                      : 'border-transparent opacity-30 cursor-default'}
                    ${isToday ? 'ring-1 ring-primary-500 border-primary-500/50' : ''}
                  `}
                  disabled={!day.isCurrentMonth}
                >
                  <span
                    className={`text-xs font-medium ${
                      isToday ? 'text-primary-400' : day.isCurrentMonth ? 'text-dark-text' : 'text-dark-muted'
                    }`}
                  >
                    {day.day}
                  </span>
                  {dayPosts.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {dayPosts.slice(0, 2).map((post) => (
                        <div
                          key={post.id}
                          className={`text-[10px] truncate px-1 py-0.5 rounded ${
                            platformConfig[post.platform]?.badge || ''
                          }`}
                        >
                          {post.title}
                        </div>
                      ))}
                      {dayPosts.length > 2 && (
                        <span className="text-[10px] text-dark-muted">
                          +{dayPosts.length - 2} mas
                        </span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal for adding post */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Agregar Publicacion">
        <div className="space-y-4">
          <p className="text-sm text-dark-muted">
            Fecha: {selectedDate && new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>

          {/* Existing posts for this day */}
          {getPostsForDate(selectedDate).length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-dark-muted">Publicaciones existentes:</p>
              {getPostsForDate(selectedDate).map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-dark-bg border border-dark-border"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${platformConfig[post.platform]?.color}`} />
                    <span className="text-sm">{post.title}</span>
                    <span className="text-xs text-dark-muted">{post.time}</span>
                  </div>
                  <button
                    onClick={() => removePost(post.id)}
                    className="text-dark-muted hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Input
            label="Titulo"
            placeholder="Nombre del contenido..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Plataforma</label>
            <div className="flex gap-2">
              {Object.entries(platformConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setNewPost({ ...newPost, platform: key })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    newPost.platform === key
                      ? config.badge
                      : 'border-dark-border text-dark-muted hover:text-white'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hora
            </label>
            <input
              type="time"
              value={newPost.time}
              onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
              className="input-dark"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleAddPost}
              disabled={!newPost.title.trim()}
              icon={<Plus className="w-4 h-4" />}
              className="flex-1"
            >
              Agregar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
