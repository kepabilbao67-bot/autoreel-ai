'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, Trash2, MessageSquare } from 'lucide-react'
import { useChat } from '@/hooks/useChat'

// Componente para formatear texto con negritas y listas
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Formatear negritas **texto**
        const formattedLine = line.replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold text-white">$1</strong>'
        )

        // Detectar listas con -
        if (line.trim().startsWith('- ')) {
          return (
            <div key={i} className="flex gap-2 pl-2">
              <span className="text-primary-400 shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^-\s*/, '') }} />
            </div>
          )
        }

        // Linea vacia
        if (line.trim() === '') {
          return <div key={i} className="h-2" />
        }

        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
        )
      })}
    </div>
  )
}

// Chatbot flotante de IA para el dashboard
export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { messages, isTyping, sendMessage, clearChat, suggestedQuestions } = useChat()

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  // Focus en input cuando se abre el chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Enviar mensaje
  const handleSend = () => {
    if (!input.trim() || isTyping) return
    sendMessage(input)
    setInput('')
  }

  // Manejar tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Enviar sugerencia
  const handleSuggestion = (question: string) => {
    sendMessage(question)
  }

  return (
    <>
      {/* Boton flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-purple shadow-lg shadow-primary-500/25 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-primary-500/40 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Abrir asistente IA"
      >
        <Sparkles className="w-6 h-6 text-white animate-pulse" />
      </button>

      {/* Panel de chat */}
      <div
        className={`fixed z-50 transition-all duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        } bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-full sm:w-[400px] sm:h-[600px] sm:max-h-[80vh] sm:rounded-2xl overflow-hidden border border-dark-border shadow-2xl shadow-black/50`}
      >
        <div className="flex flex-col h-full bg-dark-bg/95 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border bg-dark-bg/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">AutoReel Assistant</h3>
                <p className="text-xs text-dark-muted">Experto en contenido viral</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-2 rounded-lg text-dark-muted hover:text-white hover:bg-dark-hover transition-colors"
                aria-label="Limpiar chat"
                title="Limpiar historial"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-dark-muted hover:text-white hover:bg-dark-hover transition-colors"
                aria-label="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
            {/* Mensaje de bienvenida si no hay mensajes */}
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-dark-hover/50 border border-dark-border rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-gray-200">
                      ¡Hola! 👋 Soy tu asistente de IA para crear contenido viral. ¿En que puedo ayudarte hoy?
                    </p>
                  </div>
                </div>

                {/* Sugerencias clickeables */}
                <div className="pl-11 space-y-2">
                  <p className="text-xs text-dark-muted">Prueba preguntarme:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestion(question)}
                        className="text-xs px-3 py-1.5 rounded-full border border-primary-500/30 text-primary-300 hover:bg-primary-500/10 hover:border-primary-500/50 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Lista de mensajes */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm ${
                    message.role === 'user'
                      ? 'bg-primary-500/20 border border-primary-500/30 text-white rounded-tr-sm'
                      : 'bg-dark-hover/50 border border-dark-border text-gray-200 rounded-tl-sm'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <FormattedMessage content={message.content} />
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-dark-hover border border-dark-border flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-dark-muted" />
                  </div>
                )}
              </div>
            ))}

            {/* Indicador de typing */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-dark-hover/50 border border-dark-border rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input de mensaje */}
          <div className="px-4 py-3 border-t border-dark-border bg-dark-bg/80">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-dark-hover/50 border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-colors"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:hover:bg-primary-500 flex items-center justify-center transition-colors"
                aria-label="Enviar mensaje"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
