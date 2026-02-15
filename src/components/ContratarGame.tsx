"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import PixelSpeechBubble from './PixelSpeechBubble'

type Message = { id: string, role: 'user' | 'assistant', text: string }

export default function ContratarGame() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastAssistant, setLastAssistant] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const avatar = '/img/facu_avatar.png'

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const initialized = useRef(false)
  useEffect(() => {
    // Saludo inicial (proteger contra doble ejecución en StrictMode)
    if (!initialized.current) {
      initialized.current = true
      // Agregar saludo directamente como mensaje del assistant (sin llamar a la API)
      const greetingMsg: Message = {
        id: String(Date.now()) + Math.random().toString(36).slice(2),
        role: 'assistant',
        text: '¡Hola! Soy Facundo. ¿Te gustaría que te cuente por qué contratarme?'
      }
      setMessages([greetingMsg])
      setLastAssistant(greetingMsg.text)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function callGemini(action: string, inputText?: string) {
    setLoading(true)
    try {
      // Para preguntas del usuario usamos el endpoint del CV con historial
      if (action === 'ask') {
        const res = await fetch('/api/cv-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: inputText,
            history: messages
          })
        })
        const json = await res.json()
        if (json?.success && json.data?.text) return json.data.text as string
        if (json?.error) return json.error as string
        return 'Lo siento, ahora no puedo responder. Intenta más tarde.'
      }

      // Acciones no-ask usan respuestas locales/mocks
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, input: inputText, history: messages })
      })
      const json = await res.json()
      if (json?.success && json.data?.text) {
        return json.data.text as string
      }
      if (json?.error) return json.error as string
      return 'Lo siento, ahora no puedo responder. Intenta más tarde.'
    } catch (err) {
      console.error(err)
      return 'Error de conexión. Respuesta simulada: soy Facundo y soy bueno programando.'
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(action: string, userInput?: string) {
    const userMsg: Message = {
      id: String(Date.now()) + Math.random().toString(36).slice(2),
      role: 'user',
      text: userInput ?? (action === 'pitch' ? 'Convénceme' : action)
    }

    // añadir mensaje del usuario inmediatamente
    setMessages(prev => [...prev, userMsg])

    let reply = ''
    if (action === 'show-cv') {
      setLoading(true)
      try {
        const res = await fetch('/api/curriculum')
        const json = await res.json()
        reply = json?.data?.text ?? 'No pude cargar el CV.'
      } catch (err) {
        reply = 'Error cargando el CV.'
      } finally {
        setLoading(false)
      }
    } else {
      reply = await callGemini(action, userInput)
    }

    const assistantMsg: Message = {
      id: String(Date.now()) + Math.random().toString(36).slice(2),
      role: 'assistant',
      text: reply
    }

    // añadir mensaje del assistant
    setMessages(prev => [...prev, assistantMsg])
    setLastAssistant(reply)
  }

  return (
    <div className="contratar-game-container">
      <style jsx>{`
        .contratar-game-container {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 500px;
          display: flex;
          flex-direction: column;
        }

        .chat-area {
          flex: 1;
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          overflow: hidden;
        }

        .avatar-column {
          flex-shrink: 0;
          width: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .avatar-wrapper {
          width: 120px;
          height: 120px;
          position: relative;
          border: 4px solid #A09A95;
          border-radius: 8px;
          background: white;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .avatar-label {
          font-family: 'Pokemon', monospace;
          font-size: 0.7rem;
          color: #484927;
          text-align: center;
          background: white;
          border: 2px solid #A09A95;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
        }

        .messages-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .messages-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          scroll-behavior: smooth;
        }

        .messages-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .messages-scroll::-webkit-scrollbar-track {
          background: rgba(160, 154, 149, 0.2);
          border-radius: 4px;
        }

        .messages-scroll::-webkit-scrollbar-thumb {
          background: #A09A95;
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .messages-scroll::-webkit-scrollbar-thumb:hover {
          background: #8B8578;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .message-wrapper {
          display: flex;
          align-items: flex-start;
          animation: slideIn 0.3s ease-out;
        }

        .message-wrapper.user {
          justify-content: flex-end;
        }

        .message-wrapper.assistant {
          justify-content: flex-start;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .typing-indicator {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          padding: 0.75rem 1rem;
          background: white;
          border: 4px solid #000;
          border-radius: 6px;
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
          max-width: fit-content;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          background: #484927;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .input-area {
          border-top: 4px solid #A09A95;
          background: rgba(250, 252, 223, 0.95);
          padding: 1rem 1.5rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }

        .input-form {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
          width: 100%;
        }

        .pokemon-textbox {
          flex: 1;
          min-height: 52px;
          max-height: 120px;
          font-family: 'Pokemon', monospace;
          font-size: 0.9rem;
          color: #000;
          background: white;
          border: 3px solid #A09A95;
          padding: 0.75rem;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .pokemon-textbox:focus {
          outline: none;
          border-color: #24857F;
          box-shadow: 0 0 0 2px rgba(36, 133, 127, 0.2);
        }

        .pokemon-button {
          font-family: 'Pokemon', monospace;
          background: #24857F;
          color: white;
          border: 3px solid #196b67;
          border-radius: 50%;
          width: 52px;
          height: 52px;
          min-width: 52px;
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 0 #196b67;
          transition: all 0.15s;
          padding: 0;
          flex-shrink: 0;
        }

        .pokemon-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 0 #196b67;
          background: #2a9993;
        }

        .pokemon-button:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #196b67;
        }

        .pokemon-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-icon {
          width: 0;
          height: 0;
          border-left: 12px solid white;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          margin-left: 3px;
        }

        .loading-icon {
          width: 16px;
          height: 16px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Tablets */
        @media (max-width: 1024px) {
          .contratar-game-container {
            height: 65vh;
            min-height: 450px;
          }
          .avatar-column {
            width: 120px;
          }
          .avatar-wrapper {
            width: 100px;
            height: 100px;
          }
        }

        /* Móviles y tablets pequeñas */
        @media (max-width: 768px) {
          .contratar-game-container {
            height: calc(100vh - 200px);
            min-height: 400px;
          }
          .chat-area {
            padding: 0.75rem;
            gap: 0.5rem;
          }
          .avatar-column {
            width: 70px;
          }
          .avatar-wrapper {
            width: 60px;
            height: 60px;
          }
          .avatar-label {
            font-size: 0.6rem;
            padding: 0.2rem 0.35rem;
          }
          .messages-scroll {
            padding: 0.5rem;
            gap: 0.75rem;
          }
          .input-area {
            padding: 0.75rem;
            gap: 0.5rem;
          }
          .pokemon-textbox {
            min-height: 44px;
            max-height: 100px;
            font-size: 0.85rem;
            padding: 0.6rem;
          }
          .pokemon-button {
            width: 48px;
            height: 48px;
            min-width: 48px;
            min-height: 48px;
          }
          .send-icon {
            border-left: 10px solid white;
            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;
          }
        }

        /* Móviles pequeños */
        @media (max-width: 480px) {
          .contratar-game-container {
            height: calc(100dvh - 180px);
            min-height: 350px;
          }
          .chat-area {
            padding: 0.5rem;
          }
          .avatar-column {
            display: none; /* Ocultar avatar en móviles pequeños */
          }
          .messages-column {
            width: 100%;
          }
          .messages-scroll {
            padding: 0.5rem 0.25rem;
          }
          .input-area {
            padding: 0.5rem;
            gap: 0.4rem;
          }
          .input-form {
            gap: 0.4rem;
          }
          .pokemon-textbox {
            min-height: 40px;
            max-height: 80px;
            font-size: 0.8rem;
            padding: 0.5rem;
            border-width: 2px;
          }
          .pokemon-button {
            width: 44px;
            height: 44px;
            min-width: 44px;
            min-height: 44px;
            border-width: 2px;
            box-shadow: 0 3px 0 #196b67;
          }
          .pokemon-button:hover:not(:disabled) {
            box-shadow: 0 4px 0 #196b67;
          }
          .pokemon-button:active:not(:disabled) {
            box-shadow: 0 1px 0 #196b67;
          }
          .send-icon {
            border-left: 9px solid white;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            margin-left: 2px;
          }
          .loading-icon {
            width: 14px;
            height: 14px;
            border-width: 2px;
          }
        }

        /* Landscape en móviles */
        @media (max-height: 600px) and (orientation: landscape) {
          .contratar-game-container {
            height: calc(100vh - 120px);
            min-height: 300px;
          }
          .avatar-column {
            width: 60px;
          }
          .avatar-wrapper {
            width: 50px;
            height: 50px;
          }
          .avatar-label {
            font-size: 0.55rem;
          }
          .chat-area {
            padding: 0.5rem;
          }
          .input-area {
            padding: 0.5rem;
          }
          .pokemon-textbox {
            min-height: 36px;
            max-height: 60px;
          }
        }

        /* Móviles muy pequeños (Galaxy Fold, etc) */
        @media (max-width: 360px) {
          .messages-scroll {
            padding: 0.35rem 0.15rem;
          }
          .pokemon-textbox {
            font-size: 0.75rem;
            padding: 0.4rem;
          }
          .pokemon-button {
            width: 40px;
            height: 40px;
            min-width: 40px;
            min-height: 40px;
          }
          .send-icon {
            border-left: 8px solid white;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            margin-left: 2px;
          }
          .loading-icon {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>

      <div className="chat-area">
        <div className="avatar-column">
          <div className="avatar-wrapper">
            <Image
              src={avatar}
              alt="Facundo avatar"
              width={120}
              height={120}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="avatar-label">FACUNDO</div>
        </div>

        <div className="messages-column">
          <div className="messages-scroll" ref={chatContainerRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`message-wrapper ${m.role}`}
              >
                <PixelSpeechBubble
                  text={m.text}
                  align={m.role === 'assistant' ? 'left' : 'right'}
                />
              </div>
            ))}
            {loading && (
              <div className="message-wrapper assistant">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="input-area">
        <form
          className="input-form"
          onSubmit={e => {
            e.preventDefault()
            if (input.trim() && !loading) {
              handleAction('ask', input.trim())
              setInput('')
            }
          }}
        >
          <textarea
            className="pokemon-textbox"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={loading}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (input.trim() && !loading) {
                  handleAction('ask', input.trim())
                  setInput('')
                }
              }
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="pokemon-button"
            aria-label={loading ? 'Pensando...' : 'Enviar mensaje'}
            title={loading ? 'Pensando...' : 'Enviar mensaje'}
          >
            {loading ? (
              <div className="loading-icon"></div>
            ) : (
              <div className="send-icon"></div>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
