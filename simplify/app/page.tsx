import Link from 'next/link'
import { UsersIcon, HeartIcon, SyringeIcon, ClipboardIcon, TrendingUpIcon, CheckIcon } from './components/Icons'

const DEMO_USERS = [
  { role: 'Médecin Chef', name: 'Dr. Miora Rakoto', email: 'miora@centresante.mg', password: 'password123', zone: 'National', color: 'from-purple-500 to-purple-600' },
  { role: 'Agent Zone Nord', name: 'Hery Andriamaro', email: 'hery@centresante.mg', password: 'password123', zone: 'Nord', color: 'from-blue-500 to-blue-600' },
  { role: 'Agent Zone Sud', name: 'Volatiana Rasoa', email: 'volatiana@centresante.mg', password: 'password123', zone: 'Sud', color: 'from-emerald-500 to-emerald-600' },
  { role: 'Agent Zone Est', name: 'Tianà Rajaonarison', email: 'tiana@centresante.mg', password: 'password123', zone: 'Est', color: 'from-amber-500 to-amber-600' },
  { role: 'Agent Zone Ouest', name: 'Nivo Rabemananjara', email: 'nivo@centresante.mg', password: 'password123', zone: 'Ouest', color: 'from-rose-500 to-rose-600' },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
              S
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900">Simplify</span>
              <span className="text-xs text-gray-400 ml-2 hidden sm:inline">Santé Madagascar</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#benefits" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Avantages</a>
            <a href="#stats" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Chiffres</a>
            <a href="#demo" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Démo</a>
          </nav>
          <Link
            href="/auth/connexion"
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg"
          >
            Connexion
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-0 right-0 -mt-32 -mr-32 size-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-32 -ml-32 size-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative max-w-5xl mx-auto px-4 py-28 md:py-36 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-emerald-200 mb-8 border border-white/10">
              <TrendingUpIcon className="size-4" />
              Plateforme de suivi sanitaire
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-balance">
              Collectez vos données santé<br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
                en un clin d&apos;œil
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Simplify remplace vos fichiers Excel et vos rapports manuscrits par une plateforme
              moderne et automatisée. Saisie hebdomadaire en 3 minutes, bilans automatiques,
              résumés par IA et rapports PDF prêts à envoyer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/connexion"
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-gray-900 px-8 py-3.5 rounded-xl font-semibold hover:from-emerald-400 hover:to-emerald-300 transition-all shadow-xl hover:shadow-emerald-500/25 text-lg"
              >
                Tester l&apos;application
              </Link>
              <a
                href="#demo"
                className="border-2 border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm text-lg"
              >
                Voir les identifiants
              </a>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Avant vs Après <span className="text-emerald-600">Simplify</span>
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Découvrez comment notre plateforme transforme la collecte de données santé
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-3xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="relative bg-white border-2 border-red-100 rounded-3xl p-8 h-full">
                  <div className="size-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6 border border-red-100">
                    <span className="text-2xl text-red-400">✗</span>
                  </div>
                  <h3 className="text-2xl font-bold text-red-800 mb-6">Avant (manuel)</h3>
                  <ul className="space-y-4">
                    {[
                      'Saisie sur papier ou Excel',
                      'Calculs à la main (totaux, moyennes, taux)',
                      'Rapport mensuel : 2 jours de travail',
                      'Aucune vue d\'ensemble en temps réel',
                      'Risque d\'erreurs de calcul',
                      'PDF fait manuellement sous Word',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-red-700">
                        <span className="mt-0.5 shrink-0 size-5 rounded-full bg-red-100 flex items-center justify-center text-xs text-red-500">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-3xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="relative bg-white border-2 border-emerald-100 rounded-3xl p-8 h-full">
                  <div className="size-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100">
                    <CheckIcon className="size-7 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-6">Après Simplify</h3>
                  <ul className="space-y-4">
                    {[
                      'Formulaire en ligne : 3 minutes par semaine',
                      'Bilan automatique en 1 clic',
                      'Résumé IA généré instantanément',
                      'Tableau de bord en temps réel',
                      'Zéro erreur de calcul',
                      'PDF professionnel téléchargeable',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-emerald-700">
                        <span className="mt-0.5 shrink-0 size-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs text-emerald-500">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="stats" className="py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Des <span className="text-emerald-600">chiffres</span> qui parlent
              </h2>
              <p className="text-lg text-gray-500">L&apos;automatisation au service de la santé</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { value: '-95%', label: 'Temps de calcul', desc: 'vs méthode manuelle', icon: TrendingUpIcon, color: 'from-emerald-500 to-emerald-600' },
                { value: '3 min', label: 'Saisie hebdomadaire', desc: 'par agent de santé', icon: ClipboardIcon, color: 'from-blue-500 to-blue-600' },
                { value: '1 clic', label: 'Rapport PDF complet', desc: 'prêt à envoyer', icon: SyringeIcon, color: 'from-violet-500 to-violet-600' },
              ].map((stat) => (
                <div key={stat.label} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-xl transition-all group-hover:shadow-2xl" />
                  <div className="relative bg-white rounded-3xl p-8 text-center border border-gray-100">
                    <div className={`size-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <stat.icon className="size-8 text-white" />
                    </div>
                    <p className="text-5xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <p className="text-lg font-semibold text-gray-700">{stat.label}</p>
                    <p className="text-sm text-gray-400 mt-1">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="py-28 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 text-sm text-emerald-700 mb-4 border border-emerald-200">
                <UsersIcon className="size-4" />
                Accès démo
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Identifiants de test
              </h2>
              <p className="text-lg text-gray-500">
                Utilisez ces comptes pour explorer toutes les fonctionnalités
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {DEMO_USERS.map((user) => (
                <div
                  key={user.email}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xl hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`size-12 rounded-xl bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gradient-to-r ${user.color} text-white`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900 mt-1">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.zone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200">{user.email}</span>
                      <span className="mx-2 text-gray-300">/</span>
                      <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200">{user.password}</span>
                    </div>
                    <Link
                      href="/auth/connexion"
                      className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 group-hover:translate-x-0.5 transition-all"
                    >
                      Connecter →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              S
            </div>
            <span className="font-bold text-lg text-gray-900">Simplify</span>
          </div>
          <p className="text-sm text-gray-400">
            Application de démonstration pour le suivi sanitaire à Madagascar
          </p>
          <p className="text-xs text-gray-300 mt-2">
            Construit avec Next.js, Prisma & Supabase
          </p>
        </div>
      </footer>
    </div>
  )
}
