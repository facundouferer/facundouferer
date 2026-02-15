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
    const speed = 30 // ms por carácter
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

  const isUser = align === 'right'

  return (
    <div className="speech-bubble-wrapper">
      <style jsx>{`
        .speech-bubble-wrapper {
          display: inline-block;
          max-width: 80%;
          position: relative;
        }

        .pixel-bubble {
          background: ${isUser ? '#DCF8FF' : 'white'};
          border: 4px solid #000;
          padding: 1rem 1.25rem;
          font-family: 'Pokemon', monospace;
          font-size: 0.95rem;
          color: #000;
          line-height: 1.5;
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
          position: relative;
          border-radius: 8px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          animation: fadeInUp 0.3s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pixel-bubble::before {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          ${isUser ? 'right: -12px;' : 'left: -12px;'}
          top: 20px;
          border-style: solid;
          border-width: ${isUser ? '8px 0 8px 12px' : '8px 12px 8px 0'};
          border-color: ${isUser
            ? 'transparent transparent transparent #000'
            : 'transparent #000 transparent transparent'};
        }

        .pixel-bubble::after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          ${isUser ? 'right: -8px;' : 'left: -8px;'}
          top: 22px;
          border-style: solid;
          border-width: ${isUser ? '6px 0 6px 8px' : '6px 8px 6px 0'};
          border-color: ${isUser
            ? `transparent transparent transparent ${isUser ? '#DCF8FF' : 'white'}`
            : `transparent ${isUser ? '#DCF8FF' : 'white'} transparent transparent`};
        }

        .bubble-text {
          white-space: pre-wrap;
          position: relative;
        }

        .cursor {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: #000;
          margin-left: 2px;
          animation: blink 1s step-start infinite;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }

        /* Tablets */
        @media (max-width: 1024px) {
          .speech-bubble-wrapper {
            max-width: 85%;
          }
          .pixel-bubble {
            font-size: 0.9rem;
            padding: 0.85rem 1.1rem;
          }
        }

        /* Móviles y tablets pequeñas */
        @media (max-width: 768px) {
          .speech-bubble-wrapper {
            max-width: 90%;
          }
          .pixel-bubble {
            font-size: 0.85rem;
            padding: 0.75rem 0.9rem;
            border-width: 3px;
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
            border-radius: 6px;
            line-height: 1.4;
          }
          .pixel-bubble::before {
            ${isUser ? 'right: -10px;' : 'left: -10px;'}
            border-width: ${isUser ? '6px 0 6px 10px' : '6px 10px 6px 0'};
          }
          .pixel-bubble::after {
            ${isUser ? 'right: -7px;' : 'left: -7px;'}
            border-width: ${isUser ? '5px 0 5px 7px' : '5px 7px 5px 0'};
          }
          .cursor {
            width: 6px;
            height: 14px;
          }
        }

        /* Móviles pequeños */
        @media (max-width: 480px) {
          .speech-bubble-wrapper {
            max-width: 95%;
          }
          .pixel-bubble {
            font-size: 0.8rem;
            padding: 0.65rem 0.8rem;
            border-width: 2px;
            box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            line-height: 1.35;
          }
          .pixel-bubble::before {
            ${isUser ? 'right: -8px;' : 'left: -8px;'}
            top: 16px;
            border-width: ${isUser ? '5px 0 5px 8px' : '5px 8px 5px 0'};
          }
          .pixel-bubble::after {
            ${isUser ? 'right: -6px;' : 'left: -6px;'}
            top: 17px;
            border-width: ${isUser ? '4px 0 4px 6px' : '4px 6px 4px 0'};
          }
          .cursor {
            width: 5px;
            height: 12px;
            margin-left: 1px;
          }
        }

        /* Móviles muy pequeños */
        @media (max-width: 360px) {
          .pixel-bubble {
            font-size: 0.75rem;
            padding: 0.55rem 0.7rem;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .pixel-bubble {
            user-select: text;
            -webkit-user-select: text;
          }
        }
      `}</style>

      <div className="pixel-bubble">
        <div className="bubble-text">
          {visibleText}
          {visibleText.length < text.length && <span className="cursor"></span>}
        </div>
      </div>
    </div>
  )
}
