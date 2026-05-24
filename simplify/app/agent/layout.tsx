import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'
import AgentNav from './AgentNav'

export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user?.role !== 'AGENT') redirect('/auth/connexion')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AgentNav user={session.user} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
