"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import PixelSpeechBubble from './PixelSpeechBubble'

type Message = { role: 'user' | 'assistant', text: string }

export default function ContratarGame() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastAssistant, setLastAssistant] = useState('')

  const avatar = '/img/facu_avatar.png'

  useEffect(() => {
    // saludo inicial
    handleAction('speak', '¡Hola! Soy Facundo. ¿Te gustaría que te cuente por qué contratarme?')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function callGemini(action: string, inputText?: string) {
    setLoading(true)
    try {
      // Para preguntas del usuario usamos el endpoint del CV
      if (action === 'ask') {
        const res = await fetch('/api/cv-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: inputText })
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
    const userMsg: Message = { role: 'user', text: userInput ?? (action === 'pitch' ? 'Convénceme' : action) }
    setMessages(prev => [...prev, userMsg])

    let reply = ''
    if (action === 'show-cv') {
      // pedir al servidor que devuelva el curriculum
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

    const assistantMsg: Message = { role: 'assistant', text: reply }
    setMessages(prev => [...prev, assistantMsg])
    setLastAssistant(reply)
  }

  const lastText = useMemo(() => {
    if (messages.length === 0) return ''
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return messages[i].text
    }
    return ''
  }, [messages])

  return (
    <div style={{ position: 'relative', width: '100%', height: '70vh', padding: 20 }}>
      <div style={{ position: 'absolute', left: 20, top: 20 }}>
        <div style={{ width: 120 }}>
          <Image src={avatar} alt="Facundo avatar" width={120} height={180} />
        </div>
      </div>

      <div style={{ position: 'absolute', left: 160, right: 160, top: 20, bottom: 80, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end', maxWidth: '100%' }}>
            {m.role === 'assistant'
              ? <PixelSpeechBubble text={m.text} />
              : <div style={{ background: '#eee', padding: '8px 12px', borderRadius: 8 }}>{m.text}</div>
            }
          </div>
        ))}
      </div>

      <div className="pokemon-bottom-bar">
        <form onSubmit={e => { e.preventDefault(); handleAction('ask', input); setInput('') }} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flex: 1 }}>
          <textarea
            className="pokemon-textbox"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="escribe aquí"
            style={{ flex: 1, minHeight: 48, maxHeight: 140 }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (input.trim()) {
                  handleAction('ask', input.trim())
                  setInput('')
                }
              }
            }}
          />
          <button type="submit" disabled={loading || !input.trim()} className="pokemon-button">Enviar</button>
        </form>
      </div>
    </div>
  )
}
