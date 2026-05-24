import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'
import MedecinChefNav from './MedecinChefNav'

export default async function MedecinChefLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user?.role !== 'MEDECIN_CHEF')
    redirect('/auth/connexion')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MedecinChefNav user={session.user} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
