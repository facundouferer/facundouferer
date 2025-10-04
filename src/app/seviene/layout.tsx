import './seviene.css'

export default function SeVieneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="sevieneContainer mt-12">
      {children}
    </div>
  )
}