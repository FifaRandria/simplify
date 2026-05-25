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
        {/* Hero with sary1 background */}
        <section
          className="parallax relative flex items-center justify-center border-b border-gray-100"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url(/images/sary5.jpg)',
            minHeight: '100vh',
          }}
        >
          <div className="max-w-3xl mx-auto px-6 py-28 md:py-36 text-center">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white/90 mb-8">
              <Activity className="size-3.5" />
              Suivi sanitaire Madagascar
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white">
              Collectez vos données santé.{' '}
              <span className="text-primary-300">Sans effort.</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 mt-6 max-w-xl mx-auto leading-relaxed">
              Simplify remplace vos fichiers Excel par une plateforme automatisée&nbsp;: saisie en
              3&nbsp;min, bilan en 1&nbsp;clic, résumé IA et PDF prêt à envoyer.
            </p>
            <div className="flex gap-4 justify-center mt-10">
              <Link
                href="/auth/connexion"
                className="bg-primary hover:bg-primary-400 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-all shadow-lg shadow-primary-800/30"
              >
                Tester l&apos;app
              </Link>
              <a
                href="#demo"
                className="border border-white/30 hover:border-white/60 text-white/90 px-6 py-2.5 rounded-md text-sm font-medium transition-colors backdrop-blur-sm"
              >
                Identifiants
              </a>
            </div>
          </div>
        </section>

        {/* Avant / Après */}
        <section
          id="benefits"
          className="relative bg-gray-50 scroll-mt-16 overflow-hidden"
        >
          <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
            <div className="grid md:grid-cols-5 gap-12 md:gap-16 items-center">
              {/* Left: text */}
              <div className="md:col-span-2 space-y-6">
                <span className="inline-flex items-center gap-1.5 bg-gray-900/5 rounded-full px-3 py-1 text-xs text-gray-500 font-medium tracking-wide">
                  Avant · Après
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                  Le changement
                  <br />
                  <span className="text-primary">en un clic</span>
                </h2>
                <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                  Finies les heures passées sur Excel, les calculs à la main et
                  les rapports qui prennent deux jours. Simplify automatise
                  toute la chaîne&nbsp;: saisie, bilan, résumé IA et PDF.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/20">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">3 min / semaine</p>
                    <p className="text-xs text-gray-400">vs 2 jours avant</p>
                  </div>
                </div>
              </div>

              {/* Right: image with floating popups */}
              <div className="md:col-span-3 relative">
                <div
                  className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(/images/sary6.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Floating cards */}
                  <div className="absolute top-[8%] left-[5%] max-w-[180px] md:max-w-[200px] bg-white/90 backdrop-blur-md rounded-xl px-3 py-2.5 md:px-4 md:py-3 shadow-xl rotate-[-3deg] hover:rotate-0 transition-transform">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <span className="text-primary text-xs font-bold">✓</span>
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-gray-900">3 min de saisie</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-400 mt-1 ml-8">Formulaire en ligne ultra-rapide</p>
                  </div>

                  <div className="absolute top-[8%] right-[8%] max-w-[180px] md:max-w-[200px] bg-white/90 backdrop-blur-md rounded-xl px-3 py-2.5 md:px-4 md:py-3 shadow-xl rotate-[4deg] hover:rotate-0 transition-transform">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <span className="text-primary text-xs font-bold">IA</span>
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-gray-900">Résumé IA</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-400 mt-1 ml-8">Synthèse intelligente</p>
                  </div>

                  <div className="absolute bottom-[12%] left-[12%] max-w-[180px] md:max-w-[200px] bg-white/90 backdrop-blur-md rounded-xl px-3 py-2.5 md:px-4 md:py-3 shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <span className="text-primary text-xs font-bold">1</span>
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-gray-900">Bilan en 1 clic</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-400 mt-1 ml-8">Calculs automatiques</p>
                  </div>

                  <div className="absolute bottom-[12%] right-[10%] max-w-[180px] md:max-w-[200px] bg-white/90 backdrop-blur-md rounded-xl px-3 py-2.5 md:px-4 md:py-3 shadow-xl rotate-[2deg] hover:rotate-0 transition-transform">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <span className="text-primary text-xs font-bold">⟳</span>
                      </div>
                      <span className="text-xs md:text-sm font-semibold text-gray-900">Temps réel</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-400 mt-1 ml-8">Dashboard live</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Parallax divider with sary3 */}
        <section
          className="parallax relative flex items-center justify-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/images/sary3.jpg)',
            minHeight: '100vh',
          }}
        >
          <div className="text-center px-6">
            <p className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Madagascar, un engagement <span className="text-primary-300">pour la santé</span>
            </p>
            <p className="text-white/60 mt-4 text-sm md:text-base max-w-lg mx-auto">
              Suivez les indicateurs clés de vos centres de santé en temps réel
            </p>
          </div>
        </section>

        {/* Chiffres with sary4 subtle background */}
        <section
          id="stats"
          className="relative border-b border-gray-100 scroll-mt-16"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.50), rgba(255,255,255,0.95)), url(/images/sary4.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-3xl mx-auto px-6 py-24 text-center">
            <h2 className="text-2xl font-bold mb-14">Des chiffres concrets</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { value: '-95%', label: 'Temps de calcul' },
                { value: '3 min', label: 'Saisie / semaine' },
                { value: '1 clic', label: 'Rapport PDF' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-4xl font-bold text-primary">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parallax divider with sary8 */}
        {/* <section
          className="parallax relative flex items-center justify-center"
          style={{
            // backgroundImage: 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(/images/sary8.jpg)',
            minHeight: '40vh',
          }}
        >
          <div className="text-center px-6">
            <p className="text-2xl md:text-3xl font-bold text-white">
              Des données fiables pour des <span className="text-primary-300">décisions éclairées</span>
            </p>
          </div>
        </section> */}

        {/* Identifiants */}
        <section id="demo" className="border-b border-gray-100 bg-white scroll-mt-16">
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
                      user.role === 'Médecin Chef' ? 'bg-primary' : 'bg-gray-400'
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
                    className="text-xs font-medium text-primary hover:text-primary-700"
                  >
                    Connecter →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer with sary7 */}
      <footer
        className="py-12 text-center text-xs"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.9)), url(/images/sary8.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="size-7 bg-primary rounded flex items-center justify-center text-white text-xs font-bold">S</div>
          <span className="text-sm font-semibold text-white">Simplify</span>
        </div>
        <p className="text-gray-400">Démonstration pour le suivi sanitaire à Madagascar</p>
      </footer>
    </div>
  )
}
