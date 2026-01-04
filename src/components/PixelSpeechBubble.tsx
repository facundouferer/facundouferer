"use client"

import React, { useEffect, useState } from 'react'

type Props = {
  text: string
  onComplete?: () => void
}

export default function PixelSpeechBubble({ text, onComplete }: Props) {
  const [visibleText, setVisibleText] = useState('')

  useEffect(() => {
    setVisibleText('')
    let i = 0
    const speed = 25
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
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      border: '4px solid #000',
      padding: '10px',
      width: '100%',
      maxWidth: '100%',

      fontSize: '18px', color: '#000',
      lineHeight: '1.2',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.6)'
    }}>
      <div className="font-pixel" style={{ whiteSpace: 'pre-wrap' }}>{visibleText}</div>
    </div>
  )
}
