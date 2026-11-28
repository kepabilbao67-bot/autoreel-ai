'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Music, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

// Biblioteca de musica royalty-free
type Mood = 'Energetico' | 'Chill' | 'Motivacional' | 'Cinematic' | 'Lo-Fi' | 'Pop'

interface Track {
  id: string
  name: string
  artist: string
  duration: string
  bpm: number
  mood: Mood
  src: string
}

const moods: Mood[] = ['Energetico', 'Chill', 'Motivacional', 'Cinematic', 'Lo-Fi', 'Pop']

const moodColors: Record<Mood, string> = {
  Energetico: 'from-red-500 to-orange-500',
  Chill: 'from-cyan-500 to-blue-500',
  Motivacional: 'from-yellow-500 to-orange-500',
  Cinematic: 'from-purple-500 to-indigo-500',
  'Lo-Fi': 'from-green-500 to-teal-500',
  Pop: 'from-pink-500 to-rose-500',
}

const tracks: Track[] = [
  { id: '1', name: 'Ritmo Imparable', artist: 'DJ Neon', duration: '2:34', bpm: 128, mood: 'Energetico', src: '/audio/ritmo-imparable.mp3' },
  { id: '2', name: 'Fuego Interior', artist: 'Beat Masters', duration: '3:01', bpm: 135, mood: 'Energetico', src: '/audio/fuego-interior.mp3' },
  { id: '3', name: 'Accion Total', artist: 'Synth Wave', duration: '2:48', bpm: 140, mood: 'Energetico', src: '/audio/accion-total.mp3' },
  { id: '4', name: 'Brisa de Mar', artist: 'Ambient Flow', duration: '3:22', bpm: 85, mood: 'Chill', src: '/audio/brisa-de-mar.mp3' },
  { id: '5', name: 'Atardecer Suave', artist: 'Lo-Fi Dreams', duration: '2:56', bpm: 78, mood: 'Chill', src: '/audio/atardecer-suave.mp3' },
  { id: '6', name: 'Nubes Pastel', artist: 'Serenity', duration: '3:15', bpm: 72, mood: 'Chill', src: '/audio/nubes-pastel.mp3' },
  { id: '7', name: 'Conquista el Mundo', artist: 'Inspira Beats', duration: '2:45', bpm: 110, mood: 'Motivacional', src: '/audio/conquista-el-mundo.mp3' },
  { id: '8', name: 'Sin Limites', artist: 'Epic Sound', duration: '3:10', bpm: 105, mood: 'Motivacional', src: '/audio/sin-limites.mp3' },
  { id: '9', name: 'Horizonte Nuevo', artist: 'Rise Up Audio', duration: '2:58', bpm: 115, mood: 'Motivacional', src: '/audio/horizonte-nuevo.mp3' },
  { id: '10', name: 'Epica Oscura', artist: 'Orchestral Lab', duration: '3:42', bpm: 90, mood: 'Cinematic', src: '/audio/epica-oscura.mp3' },
  { id: '11', name: 'Tension Dramatica', artist: 'Film Score Co', duration: '3:30', bpm: 95, mood: 'Cinematic', src: '/audio/tension-dramatica.mp3' },
  { id: '12', name: 'Amanecer Heroico', artist: 'Cinematic Pro', duration: '4:05', bpm: 88, mood: 'Cinematic', src: '/audio/amanecer-heroico.mp3' },
  { id: '13', name: 'Cafe y Vinilo', artist: 'Chillhop Studio', duration: '2:40', bpm: 75, mood: 'Lo-Fi', src: '/audio/cafe-y-vinilo.mp3' },
  { id: '14', name: 'Lluvia Nocturna', artist: 'Beats Relajados', duration: '3:08', bpm: 70, mood: 'Lo-Fi', src: '/audio/lluvia-nocturna.mp3' },
  { id: '15', name: 'Estudio Tranquilo', artist: 'Lo-Fi Lab', duration: '2:52', bpm: 80, mood: 'Lo-Fi', src: '/audio/estudio-tranquilo.mp3' },
  { id: '16', name: 'Verano Sin Fin', artist: 'Pop Vibez', duration: '2:38', bpm: 120, mood: 'Pop', src: '/audio/verano-sin-fin.mp3' },
  { id: '17', name: 'Bailar Contigo', artist: 'Melody Fresh', duration: '2:55', bpm: 118, mood: 'Pop', src: '/audio/bailar-contigo.mp3' },
  { id: '18', name: 'Momento Perfecto', artist: 'Hitmakers', duration: '3:02', bpm: 125, mood: 'Pop', src: '/audio/momento-perfecto.mp3' },
]

export default function MusicPage() {
  const [activeMood, setActiveMood] = useState<Mood | 'Todas'>('Todas')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const filteredTracks = tracks.filter((track) => {
    const matchesMood = activeMood === 'Todas' || track.mood === activeMood
    const matchesSearch =
      searchQuery === '' ||
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesMood && matchesSearch
  })

  const handlePlayPause = (track: Track) => {
    if (playingId === track.id) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const audio = new Audio(track.src)
      audioRef.current = audio
      audio.play().catch(() => {
        // Audio file may not exist, silently handle
      })
      audio.onended = () => setPlayingId(null)
      setPlayingId(track.id)
    }
  }

  const handleSelect = (trackId: string) => {
    setSelectedTrack(trackId === selectedTrack ? null : trackId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Biblioteca de Musica</h1>
        <p className="text-dark-muted">Musica royalty-free para tus videos</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
        <input
          type="text"
          placeholder="Buscar por nombre o artista..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-dark pl-10"
        />
      </div>

      {/* Mood filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveMood('Todas')}
          className={`px-4 py-2 text-sm rounded-xl border transition-all ${
            activeMood === 'Todas'
              ? 'bg-primary-500/20 border-primary-500 text-primary-300'
              : 'border-dark-border text-dark-muted hover:border-primary-500/50'
          }`}
        >
          Todas
        </button>
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => setActiveMood(mood)}
            className={`px-4 py-2 text-sm rounded-xl border transition-all ${
              activeMood === mood
                ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                : 'border-dark-border text-dark-muted hover:border-primary-500/50'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Tracks list */}
      <div className="space-y-3">
        {filteredTracks.map((track) => (
          <Card
            key={track.id}
            className={`!p-0 transition-all ${
              selectedTrack === track.id ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Play button */}
                <button
                  onClick={() => handlePlayPause(track)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    playingId === track.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-bg border border-dark-border text-dark-muted hover:border-primary-500 hover:text-primary-400'
                  }`}
                >
                  {playingId === track.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm truncate">{track.name}</h3>
                    <Badge variant="default" className="shrink-0">
                      {track.mood}
                    </Badge>
                  </div>
                  <p className="text-xs text-dark-muted mt-0.5">{track.artist}</p>
                </div>

                {/* Meta */}
                <div className="hidden sm:flex items-center gap-4 text-xs text-dark-muted">
                  <span>{track.duration}</span>
                  <span>{track.bpm} BPM</span>
                </div>

                {/* Gradient indicator */}
                <div className={`hidden sm:block w-16 h-2 rounded-full bg-gradient-to-r ${moodColors[track.mood]}`} />

                {/* Select button */}
                <Button
                  size="sm"
                  variant={selectedTrack === track.id ? 'primary' : 'outline'}
                  onClick={() => handleSelect(track.id)}
                >
                  {selectedTrack === track.id ? 'Seleccionado' : 'Seleccionar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTracks.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-12 h-12 text-dark-muted mx-auto mb-3" />
          <p className="text-dark-muted">No se encontraron pistas</p>
        </div>
      )}
    </div>
  )
}
