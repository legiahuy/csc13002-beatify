export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-neutral-900">
      {children}
    </div>
  )
}
