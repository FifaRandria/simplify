import Link from 'next/link'
import LandingHeader from './components/LandingHeader'
import { Activity } from './components/Icons'

const DEMO_USERS = [
  { role: 'Médecin Chef', name: 'Dr. Miora Rakoto', email: 'miora@centresante.mg', zone: 'National' },
  { role: 'Agent Nord', name: 'Hery Andriamaro', email: 'hery@centresante.mg', zone: 'Zone Nord' },
  { role: 'Agent Sud', name: 'Volatiana Rasoa', email: 'volatiana@centresante.mg', zone: 'Zone Sud' },
  { role: 'Agent Est', name: 'Tianà Rajaonarison', email: 'tiana@centresante.mg', zone: 'Zone Est' },
  { role: 'Agent Ouest', name: 'Nivo Rabemananjara', email: 'nivo@centresante.mg', zone: 'Zone Ouest' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <LandingHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-6 py-28 md:py-36 text-center">
            <div className="inline-flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600 mb-8">
              <Activity className="size-3.5" />
              Suivi sanitaire Madagascar
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Collectez vos données santé.{' '}
              <span className="text-teal-600">Sans effort.</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 mt-6 max-w-xl mx-auto leading-relaxed">
              Simplify remplace vos fichiers Excel par une plateforme automatisée&nbsp;: saisie en
              3&nbsp;min, bilan en 1&nbsp;clic, résumé IA et PDF prêt à envoyer.
            </p>
            <div className="flex gap-4 justify-center mt-10">
              <Link
                href="/auth/connexion"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                Tester l&apos;app
              </Link>
              <a
                href="#demo"
                className="border border-gray-300 hover:border-gray-400 px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                Identifiants
              </a>
            </div>
          </div>
        </section>

        {/* Avant / Après */}
        <section id="benefits" className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-24">
            <h2 className="text-2xl font-bold text-center mb-16">
              Avant vs Après <span className="text-teal-600">Simplify</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-0 md:gap-12">
              <div className="pb-12 md:pb-0 md:pr-12 md:border-r md:border-gray-200">
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-4">Avant</p>
                <ul className="space-y-4">
                  {[
                    'Saisie sur papier ou Excel',
                    'Calculs à la main',
                    'Rapport mensuel : 2 jours',
                    'Aucune vue temps réel',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="text-red-300 mt-0.5">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-12 md:pt-0 md:pl-12">
                <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-4">Après Simplify</p>
                <ul className="space-y-4">
                  {[
                    'Formulaire en ligne : 3 min',
                    'Bilan automatique en 1 clic',
                    'Résumé IA instantané',
                    'Dashboard en temps réel',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="text-teal-400 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Chiffres */}
        <section id="stats" className="border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-6 py-24 text-center">
            <h2 className="text-2xl font-bold mb-14">Des chiffres concrets</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { value: '-95%', label: 'Temps de calcul' },
                { value: '3 min', label: 'Saisie / semaine' },
                { value: '1 clic', label: 'Rapport PDF' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-4xl font-bold text-teal-600">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Identifiants */}
        <section id="demo" className="border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-6 py-24">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-2">Identifiants de test</h2>
              <p className="text-sm text-gray-500">Mot de passe pour tous les comptes&nbsp;: <span className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-xs">password123</span></p>
            </div>
            <div className="space-y-2">
              {DEMO_USERS.map((user) => (
                <div key={user.email} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`size-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                      user.role === 'Médecin Chef' ? 'bg-teal-500' : 'bg-gray-400'
                    }`}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 uppercase">{user.role}</span>
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                      </div>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/auth/connexion"
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    Connecter →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-xs text-gray-400">
        <p>Simplify — Démonstration pour le suivi sanitaire à Madagascar</p>
      </footer>
    </div>
  )
}
