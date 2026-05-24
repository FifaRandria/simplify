'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { WeeklyTrendChart, ComparisonChart } from './Charts'
import { UsersIcon, HeartIcon, SyringeIcon, AlertIcon, ClipboardIcon, TrendingUpIcon } from './Icons'

type SaisieData = {
  id: string
  semaine: number
  annee: number
  patientsVus: number
  consultations: number
  vaccinations: number
  casUrgents: number
  maladiesFrequentes: string[]
  problemesTerrain: string | null
  createdAt: string
}

export default function AgentDashboardClient({
  saisies,
  currentWeek,
  currentYear,
  hasSubmittedThisWeek,
  currentSaisie,
}: {
  saisies: SaisieData[]
  currentWeek: number
  currentYear: number
  hasSubmittedThisWeek: boolean
  currentSaisie: SaisieData | null
}) {
  const [weekFilter, setWeekFilter] = useState<string>('all')
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [chartMetric, setChartMetric] = useState<string>('patientsVus')

  const years = useMemo(() => {
    const y = new Set(saisies.map((s) => s.annee))
    return Array.from(y).sort((a, b) => b - a)
  }, [saisies])

  const weeks = useMemo(() => {
    const w = new Set(saisies.map((s) => s.semaine))
    return Array.from(w).sort((a, b) => b - a)
  }, [saisies])

  const filteredSaisies = useMemo(() => {
    return saisies.filter((s) => {
      if (yearFilter !== 'all' && s.annee !== parseInt(yearFilter)) return false
      if (weekFilter !== 'all' && s.semaine !== parseInt(weekFilter)) return false
      return true
    })
  }, [saisies, weekFilter, yearFilter])

  const totalPatients = filteredSaisies.reduce((s, r) => s + r.patientsVus, 0)
  const totalConsultations = filteredSaisies.reduce((s, r) => s + r.consultations, 0)
  const totalVaccinations = filteredSaisies.reduce((s, r) => s + r.vaccinations, 0)
  const totalUrgents = filteredSaisies.reduce((s, r) => s + r.casUrgents, 0)
  const filteredCount = filteredSaisies.length

  const lastWeekSaisie = saisies.find(
    (s) =>
      (s.semaine === currentWeek - 1 && s.annee === currentYear) ||
      (currentWeek === 1 && s.semaine === 52 && s.annee === currentYear - 1)
  )

  const chartLabelMap: Record<string, string> = {
    patientsVus: 'Patients vus',
    consultations: 'Consultations',
    vaccinations: 'Vaccinations',
    casUrgents: 'Cas urgents',
  }

  return (
    <div className="space-y-8">
      {!hasSubmittedThisWeek && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 size-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <AlertIcon className="size-6" />
              </div>
              <div>
                <p className="font-semibold text-lg">
                  Vous n&apos;avez pas encore saisi vos données cette semaine
                </p>
                <p className="text-amber-100 text-sm mt-1">
                  Semaine {currentWeek} - {currentYear}
                </p>
              </div>
            </div>
            <Link
              href="/agent/saisie"
              className="bg-white text-amber-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-all shadow-lg"
            >
              Saisir maintenant
            </Link>
          </div>
        </div>
      )}

      {hasSubmittedThisWeek && currentSaisie && (
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 size-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <ClipboardIcon className="size-6" />
            </div>
            <div>
              <p className="font-semibold text-lg">
                Données de la semaine {currentWeek} déjà saisies ✓
              </p>
              <p className="text-emerald-100 text-sm mt-1">
                {currentSaisie.patientsVus} patients vus, {currentSaisie.consultations} consultations
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <Link
          href="/agent/saisie"
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-md"
        >
          Nouvelle saisie
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: UsersIcon, label: 'Patients vus', value: totalPatients, sub: `${filteredCount} saisies`, color: 'from-emerald-500 to-emerald-600' },
          { icon: HeartIcon, label: 'Consultations', value: totalConsultations, sub: `${filteredCount} saisies`, color: 'from-blue-500 to-blue-600' },
          { icon: SyringeIcon, label: 'Vaccinations', value: totalVaccinations, sub: `${filteredCount} saisies`, color: 'from-violet-500 to-violet-600' },
          { icon: AlertIcon, label: 'Cas urgents', value: totalUrgents, sub: `${filteredCount} saisies`, color: 'from-amber-500 to-amber-600' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="size-5 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <TrendingUpIcon className="size-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Évolution hebdomadaire</h2>
          </div>
          <select
            value={chartMetric}
            onChange={(e) => setChartMetric(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="patientsVus">Patients vus</option>
            <option value="consultations">Consultations</option>
            <option value="vaccinations">Vaccinations</option>
            <option value="casUrgents">Cas urgents</option>
          </select>
        </div>
        <WeeklyTrendChart
          data={filteredSaisies}
          metric={chartMetric as any}
          label={chartLabelMap[chartMetric]}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <HeartIcon className="size-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Comparaison : cette semaine vs semaine précédente
          </h2>
        </div>
        <ComparisonChart
          currentWeek={currentSaisie}
          lastWeek={lastWeekSaisie || null}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg">
                <ClipboardIcon className="size-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Toutes les saisies</h2>
            </div>
            <div className="flex gap-3">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">Toutes les années</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={weekFilter}
                onChange={(e) => setWeekFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">Toutes les semaines</option>
                {weeks.map((w) => (
                  <option key={w} value={w}>Semaine {w}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-y border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Période</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Patients</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Consultations</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Vaccinations</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Urgents</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Maladies</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Problèmes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSaisies.map((s) => (
                <tr key={s.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      S{s.semaine}
                    </span>
                    <span className="text-gray-400 ml-2">{s.annee}</span>
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-gray-900">{s.patientsVus}</td>
                  <td className="px-4 py-4 text-right text-gray-700">{s.consultations}</td>
                  <td className="px-4 py-4 text-right text-gray-700">{s.vaccinations}</td>
                  <td className="px-4 py-4 text-right text-gray-700">{s.casUrgents}</td>
                  <td className="px-4 py-4 text-gray-500 max-w-xs truncate">
                    {s.maladiesFrequentes.join(', ')}
                  </td>
                  <td className="px-4 py-4 text-gray-400 max-w-xs truncate">
                    {s.problemesTerrain || '-'}
                  </td>
                </tr>
              ))}
              {filteredSaisies.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Aucune saisie trouvée pour cette période
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
