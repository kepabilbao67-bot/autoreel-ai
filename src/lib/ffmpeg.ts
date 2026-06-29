// Utilidades para generar comandos FFmpeg

// Interfaz para subtitulos
interface Subtitle {
  start: number
  end: number
  text: string
}

// Generar comando FFmpeg para crear video con subtitulos
export function generateFFmpegCommand(params: {
  inputFile: string
  outputFile: string
  subtitles?: Subtitle[]
  resolution?: { width: number; height: number }
  fps?: number
}) {
  const { inputFile, outputFile, resolution = { width: 1080, height: 1920 }, fps = 30 } = params

  const filters: string[] = []
  filters.push(`scale=${resolution.width}:${resolution.height}`)

  if (params.subtitles && params.subtitles.length > 0) {
    filters.push("subtitles=subs.srt:force_style='FontSize=24,PrimaryColour=&H00FFFFFF'")
  }

  return `ffmpeg -i ${inputFile} -vf "${filters.join(',')}" -r ${fps} -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k ${outputFile}`
}

// Generar comando para thumbnail
export function generateThumbnailCommand(params: {
  inputFile: string
  outputFile: string
  timestamp?: number
}) {
  const { inputFile, outputFile, timestamp = 1 } = params
  return `ffmpeg -i ${inputFile} -ss ${timestamp} -vframes 1 -vf "scale=1080:1920" ${outputFile}`
}

// Concatenar clips de video
export function concatenateClips(params: {
  clips: string[]
  outputFile: string
  transition?: 'fade' | 'dissolve' | 'none'
}) {
  const { clips, outputFile, transition = 'none' } = params

  if (transition === 'none') {
    const listContent = clips.map((c) => `file '${c}'`).join('\n')
    return {
      listFile: listContent,
      command: `ffmpeg -f concat -safe 0 -i list.txt -c copy ${outputFile}`,
    }
  }

  // Con transiciones
  const inputs = clips.map((c) => `-i ${c}`).join(' ')
  const filterComplex = clips
    .map((_, i) => (i < clips.length - 1 ? `[${i}:v][${i + 1}:v]xfade=transition=${transition}:duration=0.5:offset=${i * 5}[v${i}]` : ''))
    .filter(Boolean)
    .join(';')

  return {
    listFile: '',
    command: `ffmpeg ${inputs} -filter_complex "${filterComplex}" ${outputFile}`,
  }
}

// Agregar musica de fondo
export function addBackgroundMusic(params: {
  videoFile: string
  musicFile: string
  outputFile: string
  musicVolume?: number
  videoVolume?: number
}) {
  const { videoFile, musicFile, outputFile, musicVolume = 0.3, videoVolume = 1.0 } = params

  return `ffmpeg -i ${videoFile} -i ${musicFile} -filter_complex "[0:a]volume=${videoVolume}[a1];[1:a]volume=${musicVolume}[a2];[a1][a2]amix=inputs=2:duration=first[out]" -map 0:v -map "[out]" -c:v copy -c:a aac ${outputFile}`
}
