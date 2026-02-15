import React from 'react'
import ContratarGame from '@/components/ContratarGame'

export const metadata = {
  title: 'Contratar | Facundo Uferer'
}

export default function Page() {
  return (
    <main style={{ minHeight: '100vh', backgroundImage: "url('/img/fondo_contrato.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ color: '#fff', textShadow: '2px 2px #000' }}>Contratá a Facundo</h1>
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: 12 }}>
          <ContratarGame />
        </div>
      </div>
    </main>
  )
}
