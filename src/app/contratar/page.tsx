"use client"

import React from 'react'
import Link from 'next/link'
import ContratarGame from '@/components/ContratarGame'

export default function Page() {
  return (
    <main className="pokemon-contratar-page">
      <style jsx>{`
        .pokemon-contratar-page {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100;
          background-image: url('/img/fondo_contrato.png');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .gameboy-container {
          max-width: 1000px;
          width: 100%;
          margin: 0 auto;
          position: relative;
        }

        .close-button {
          position: absolute;
          top: -18px;
          right: -18px;
          z-index: 110;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #2A2D2C;
          border: 3px solid #8B8B8B;
          color: #FAFCDF;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          transition: all 0.2s;
          text-decoration: none;
          line-height: 1;
        }

        .close-button:hover {
          background: #e74c3c;
          border-color: #c0392b;
          transform: scale(1.1);
          box-shadow: 0 4px 16px rgba(231, 76, 60, 0.4);
        }

        .close-button:active {
          transform: scale(0.95);
        }

        .gameboy-screen-wrapper {
          background: #9FA8A3;
          border: 12px solid #2A2D2C;
          border-radius: 20px 20px 6px 6px;
          box-shadow:
            0 0 0 4px #8B8B8B,
            0 20px 40px rgba(0, 0, 0, 0.6),
            inset 0 2px 0 rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          position: relative;
        }

        .gameboy-screen-wrapper::before {
          content: '';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: #1a1a1a;
          border-radius: 2px;
        }

        .screen-header {
          background: linear-gradient(to bottom, #24857F, #196b67);
          border: 4px solid #0D4F4B;
          border-radius: 8px 8px 0 0;
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.3);
        }

        .screen-title {
          font-family: 'Pokemon', monospace;
          color: #FAFCDF;
          text-shadow:
            2px 2px 0 #0D4F4B,
            0 0 10px rgba(250, 252, 223, 0.3);
          font-size: 1.2rem;
          letter-spacing: 1px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          background: #4ade80;
          border-radius: 50%;
          border: 2px solid #0D4F4B;
          box-shadow: 0 0 8px #4ade80;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .status-text {
          font-family: 'Pokemon', monospace;
          color: #FAFCDF;
          font-size: 0.7rem;
          text-shadow: 1px 1px 0 #0D4F4B;
        }

        .screen-inner {
          background: #FAFCDF;
          border: 6px solid #A09A95;
          border-top: none;
          border-radius: 0 0 8px 8px;
          box-shadow:
            inset 0 4px 8px rgba(0, 0, 0, 0.1),
            0 4px 0 rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
        }

        .screen-scanlines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.03) 0px,
            rgba(0, 0, 0, 0.03) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 10;
        }

        /* Tablets */
        @media (max-width: 1024px) {
          .pokemon-contratar-page {
            padding: 0.5rem;
          }
          .gameboy-screen-wrapper {
            padding: 1rem;
          }
        }

        /* Móviles landscape y tablets pequeñas */
        @media (max-width: 768px) {
          .pokemon-contratar-page {
            padding: 0.5rem;
          }
          .gameboy-screen-wrapper {
            border-width: 8px;
            padding: 0.75rem;
            border-radius: 12px 12px 4px 4px;
          }
          .gameboy-screen-wrapper::before {
            width: 40px;
            height: 3px;
            top: -6px;
          }
          .screen-header {
            padding: 0.5rem 1rem;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .screen-title {
            font-size: 0.85rem;
            letter-spacing: 0.5px;
          }
          .status-indicator {
            gap: 0.35rem;
          }
          .status-dot {
            width: 10px;
            height: 10px;
          }
          .status-text {
            font-size: 0.6rem;
          }
          .screen-inner {
            border-width: 4px;
          }
          .close-button {
            top: -14px;
            right: -10px;
            width: 36px;
            height: 36px;
            font-size: 1rem;
          }
        }

        /* Móviles pequeños */
        @media (max-width: 480px) {
          .pokemon-contratar-page {
            padding: 0.25rem;
          }
          .gameboy-screen-wrapper {
            border-width: 6px;
            padding: 0.5rem;
          }
          .screen-header {
            padding: 0.4rem 0.75rem;
          }
          .screen-title {
            font-size: 0.7rem;
          }
          .status-text {
            display: none;
          }
          .close-button {
            top: -12px;
            right: -6px;
            width: 32px;
            height: 32px;
            font-size: 0.9rem;
            border-width: 2px;
          }
        }

        /* Landscape en móviles */
        @media (max-height: 600px) and (orientation: landscape) {
          .pokemon-contratar-page {
            padding: 0.5rem;
          }
          .gameboy-screen-wrapper {
            padding: 0.5rem;
          }
          .screen-header {
            padding: 0.4rem 1rem;
          }
        }
      `}</style>

      <div className="gameboy-container">
        <Link href="/" className="close-button" aria-label="Cerrar chat">
          ✕
        </Link>
        <div className="gameboy-screen-wrapper">
          <div className="screen-header">
            <div className="screen-title">GEMELO DIGITAL</div>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <div className="status-text">ONLINE</div>
            </div>
          </div>
          <div className="screen-inner">
            <div className="screen-scanlines"></div>
            <ContratarGame />
          </div>
        </div>
      </div>
    </main>
  )
}
