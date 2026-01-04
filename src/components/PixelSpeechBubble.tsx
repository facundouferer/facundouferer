"use client"

import React, { useEffect, useState } from 'react'

type Props = {
  text: string
  onComplete?: () => void
  align?: 'left' | 'right'
}

export default function PixelSpeechBubble({ text, onComplete, align = 'left' }: Props) {
  const [visibleText, setVisibleText] = useState('')

  useEffect(() => {
    setVisibleText('')
    let i = 0
    const speed = 40 // ms por carácter (más lento para lectura)
    const interval = setInterval(() => {
      i++
      setVisibleText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        onComplete?.()
      }
    }, speed)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <div style={{ display: 'inline-block', maxWidth: '70%' }}>
      <style>{`
        .pixel-bubble { background: rgba(255,255,255,0.95); border: 4px solid #000; padding: 10px; width: 100%; max-width: 100%; font-size: 18px; color: #000; line-height: 1.2; box-shadow: 8px 8px 0 rgba(0,0,0,0.6); position: relative; overflow: visible; border-radius: 6px }
        .pixel-bubble.right { background: rgba(220,248,255,0.98); }
      `}</style>

      <div className={`pixel-bubble ${align === 'right' ? 'right' : ''}`}>
        <div className="font-pixel" style={{ whiteSpace: 'pre-wrap' }}>{visibleText}</div>
      </div>
    </div>
  )
}
