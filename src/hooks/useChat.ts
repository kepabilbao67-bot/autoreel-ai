'use client'

import { useState, useCallback, useRef } from 'react'

// Tipos para el chat
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// Sugerencias iniciales para el chat
const SUGGESTED_QUESTIONS = [
  'Dame ideas para un video de cocina',
  '¿Cual es la mejor hora para publicar en TikTok?',
  '¿Que esta trending ahora en fitness?',
  'Hazme un video sobre emprendimiento',
  'Tips para mejorar el engagement',
]

// Maximo de mensajes en historial
const MAX_MESSAGES = 50

// Hook para manejar el estado del chat con la IA
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Generar ID unico para mensajes
  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  // Enviar mensaje y recibir respuesta streaming
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isTyping) return

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => {
      const updated = [...prev, userMessage]
      // Limitar a MAX_MESSAGES
      if (updated.length > MAX_MESSAGES) {
        return updated.slice(updated.length - MAX_MESSAGES)
      }
      return updated
    })

    setIsTyping(true)

    // Preparar mensajes para la API
    const apiMessages = [...messages, userMessage].slice(-20).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    try {
      // Cancelar request anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }

      // Agregar mensaje vacio del asistente
      setMessages((prev) => {
        const updated = [...prev, assistantMessage]
        if (updated.length > MAX_MESSAGES) {
          return updated.slice(updated.length - MAX_MESSAGES)
        }
        return updated
      })

      // Leer streaming de respuesta
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let fullContent = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  fullContent += parsed.content
                  // Actualizar el mensaje del asistente con el contenido acumulado
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: fullContent }
                        : msg
                    )
                  )
                }
              } catch {
                // Ignorar lineas que no son JSON valido
              }
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return

      // Agregar mensaje de error
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: Date.now(),
      }

      setMessages((prev) => {
        const updated = [...prev, errorMessage]
        if (updated.length > MAX_MESSAGES) {
          return updated.slice(updated.length - MAX_MESSAGES)
        }
        return updated
      })
    } finally {
      setIsTyping(false)
      abortControllerRef.current = null
    }
  }, [messages, isTyping])

  // Limpiar historial del chat
  const clearChat = useCallback(() => {
    setMessages([])
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsTyping(false)
  }, [])

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    suggestedQuestions: SUGGESTED_QUESTIONS,
  }
}
