"use client";

import { useEffect, useState } from "react";

interface ContactChannel {
  label: string;
  href: string;
  icon: string;
  description: string;
}

const CONTACT_CHANNELS: ContactChannel[] = [
  {
    label: "GITHUB",
    href: "https://github.com/facundouferer",
    icon: "💻",
    description: "Codigo y proyectos",
  },
  {
    label: "LINKEDIN",
    href: "https://linkedin.com/in/facundouferer",
    icon: "🔗",
    description: "Perfil profesional",
  },
  {
    label: "INSTAGRAM",
    href: "https://www.instagram.com/facundouferer",
    icon: "📸",
    description: "Detras de escena",
  },
  {
    label: "X / TWITTER",
    href: "https://x.com/facundouferer",
    icon: "𝕏",
    description: "Ideas y updates",
  },
  {
    label: "PSICODELIA NERD",
    href: "https://open.spotify.com/show/2CiWuSGhYr70Nwlanpoqzx",
    icon: "🎙️",
    description: "Podcast",
  },
];

export default function Contact() {
  const [isBooting, setIsBooting] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const next = prev + Math.floor(Math.random() * 14) + 4;
        return Math.min(next, 100);
      });
    }, 85);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const timeoutId = window.setTimeout(() => setIsBooting(false), 320);
    return () => window.clearTimeout(timeoutId);
  }, [progress]);

  return (
    <div className="contact-screen relative min-h-screen overflow-hidden px-4 py-6 sm:px-8 sm:py-10">
      {isBooting && (
        <div className="boot-overlay fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="boot-window w-full max-w-xl p-4 sm:p-6">
            <p className="boot-title">COMM LINK INITIALIZING...</p>
            <div className="mt-4 space-y-2">
              <p className="boot-line">Loading tilemap: CONTACT_ZONE</p>
              <p className="boot-line">Checking save data...</p>
              <p className="boot-line">Establishing connection...</p>
            </div>
            <div className="boot-progress mt-5">
              <div className="boot-progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <p className="boot-percent mt-3">{progress}%</p>
          </div>
        </div>
      )}

      <main className={`mx-auto w-full max-w-5xl ${isBooting ? "opacity-0" : "opacity-100"}`}>
        <section className="panel rise-in">
          <header className="panel-header">
            <p className="panel-label">FACU DEX v1.6</p>
            <h1 className="panel-title">CONTACT TERMINAL</h1>
          </header>

          <div className="panel-body grid gap-6 lg:grid-cols-[1.3fr_2fr]">
            <aside className="status-box">
              <p className="status-title">TRAINER STATUS</p>
              <ul className="status-list">
                <li>MODE: ONLINE</li>
                <li>REGION: ARG</li>
                <li>CLASS: FULL STACK DEV</li>
                <li>RESPONSE: FAST</li>
              </ul>
              <p className="status-hint">Tip: elegi un canal y apreta A.</p>
            </aside>

            <div className="link-grid">
              {CONTACT_CHANNELS.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <span className="contact-link-icon">{channel.icon}</span>
                  <span>
                    <strong className="contact-link-title">{channel.label}</strong>
                    <small className="contact-link-subtitle">{channel.description}</small>
                  </span>
                  <span className="contact-link-arrow">▶</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .contact-screen {
          --retro-bg: #ead789;
          --retro-panel: #d8df9a;
          --retro-panel-deep: #70985a;
          --retro-cyan: #93bcc3;
          --retro-purple: #571ee7;
          --retro-ink: #1f2a2d;
          --retro-cream: #f1f2df;
          --retro-line: #4a525a;
          background:
            linear-gradient(180deg, transparent 49%, rgba(70, 80, 60, 0.08) 50%) 0 0 / 100% 4px,
            var(--retro-bg);
          font-family: "PressStart2P", monospace;
        }

        .boot-overlay {
          background: rgba(31, 42, 45, 0.85);
          animation: overlayBlink 240ms steps(2, end) 3;
        }

        .boot-window {
          background: var(--retro-cream);
          border: 4px solid var(--retro-line);
          box-shadow: 0 0 0 4px var(--retro-purple), 8px 8px 0 rgba(31, 42, 45, 0.6);
        }

        .boot-title {
          font-size: 0.85rem;
          color: var(--retro-purple);
          text-shadow: 2px 2px 0 rgba(31, 42, 45, 0.3);
        }

        .boot-line {
          color: var(--retro-ink);
          font-size: 0.62rem;
          line-height: 1.8;
          animation: textFlicker 900ms steps(2, end) infinite;
        }

        .boot-progress {
          height: 22px;
          border: 3px solid var(--retro-line);
          background: #ccd596;
          padding: 2px;
        }

        .boot-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--retro-cyan), #77b6d8, var(--retro-purple));
          transition: width 90ms linear;
        }

        .boot-percent {
          color: var(--retro-ink);
          font-size: 0.7rem;
          text-align: right;
        }

        .panel {
          border: 4px solid var(--retro-line);
          box-shadow: 0 0 0 4px #91be98, 12px 12px 0 rgba(31, 42, 45, 0.4);
          background: var(--retro-panel);
        }

        .panel-header {
          background: linear-gradient(90deg, #84b8bc, #96cad4 55%, #ced8a4);
          border-bottom: 4px solid var(--retro-line);
          padding: 1rem;
        }

        .panel-label {
          color: var(--retro-purple);
          font-size: 0.55rem;
          margin-bottom: 0.75rem;
        }

        .panel-title {
          color: var(--retro-ink);
          font-size: clamp(1rem, 3.6vw, 1.9rem);
          line-height: 1.2;
          margin: 0;
          text-shadow: 2px 2px 0 rgba(241, 242, 223, 0.7);
        }

        .panel-body {
          padding: 1rem;
        }

        .status-box {
          border: 4px solid var(--retro-line);
          background: var(--retro-panel-deep);
          color: #f5f8e3;
          padding: 1rem;
        }

        .status-title {
          font-size: 0.58rem;
          margin-bottom: 0.75rem;
          color: #f6f6c9;
        }

        .status-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0.6rem;
          font-size: 0.57rem;
          line-height: 1.55;
        }

        .status-hint {
          margin-top: 1rem;
          font-size: 0.52rem;
          color: #f4efb6;
          opacity: 0.9;
        }

        .link-grid {
          display: grid;
          gap: 0.75rem;
        }

        .contact-link {
          border: 3px solid var(--retro-line);
          background: linear-gradient(90deg, #eff0e4, #dfe6ca 50%, #c9d4ac);
          padding: 0.75rem;
          color: var(--retro-ink);
          text-decoration: none;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 0.7rem;
          align-items: center;
          transition: transform 110ms steps(2, end), box-shadow 110ms steps(2, end);
        }

        .contact-link:hover {
          transform: translate(-2px, -2px);
          box-shadow: 4px 4px 0 var(--retro-purple);
        }

        .contact-link:focus-visible {
          outline: 3px solid var(--retro-purple);
          outline-offset: 2px;
        }

        .contact-link-icon {
          width: 34px;
          height: 34px;
          border: 2px solid var(--retro-line);
          background: var(--retro-cyan);
          display: inline-flex;
          justify-content: center;
          align-items: center;
          font-size: 1rem;
        }

        .contact-link-title {
          display: block;
          font-size: 0.62rem;
          color: var(--retro-purple);
          margin-bottom: 0.4rem;
        }

        .contact-link-subtitle {
          display: block;
          font-size: 0.5rem;
          color: #2c3739;
        }

        .contact-link-arrow {
          color: var(--retro-purple);
          font-size: 0.72rem;
        }

        .rise-in {
          animation: riseIn 650ms steps(12, end);
        }

        @keyframes riseIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes textFlicker {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.78;
          }
        }

        @keyframes overlayBlink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.92;
          }
        }

        @media (max-width: 640px) {
          .panel-body,
          .panel-header {
            padding: 0.75rem;
          }

          .contact-link {
            padding: 0.65rem;
          }

          .contact-link-icon {
            width: 30px;
            height: 30px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
