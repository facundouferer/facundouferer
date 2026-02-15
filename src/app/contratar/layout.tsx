import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contratar | Facundo Uferer',
  description: 'Hablá con el Gemelo Digital de Facundo Uferer para discutir tu proyecto'
}

export default function ContratarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
