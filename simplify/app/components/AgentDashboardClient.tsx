'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { DualTrendChart } from './Charts'
import { Activity, Users, Heart, FileText, AlertCircle, TrendingUp, Filter } from './Icons'

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

const METRICS = [
  { key: 'patientsVus' as const, label: 'Patients vus', icon: Users, color: 'text-primary' },
  { key: 'consultations' as const, label: 'Consultations', icon: Heart, color: 'text-cyan-600' },
  { key: 'vaccinations' as const, label: 'Vaccinations', icon: Activity, color: 'text-violet-600' },
  { key: 'casUrgents' as const, label: 'Cas urgents', icon: AlertCircle, color: 'text-amber-600' },
]

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
  const [weekFilter, setWeekFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')

  const years = useMemo(() => {
    const y = new Set(saisies.map((s) => s.annee))
    return [...y].sort((a, b) => b - a)
  }, [saisies])

  const weeks = useMemo(() => {
    const w = new Set(saisies.map((s) => s.semaine))
    return [...w].sort((a, b) => b - a)
  }, [saisies])

  const filtered = useMemo(() => {
    return saisies.filter((s) => {
      if (yearFilter !== 'all' && s.annee !== +yearFilter) return false
      if (weekFilter !== 'all' && s.semaine !== +weekFilter) return false
      return true
    })
  }, [saisies, yearFilter, weekFilter])

  const totals = useMemo(() => {
    return {
      patientsVus: filtered.reduce((s, r) => s + r.patientsVus, 0),
      consultations: filtered.reduce((s, r) => s + r.consultations, 0),
      vaccinations: filtered.reduce((s, r) => s + r.vaccinations, 0),
      casUrgents: filtered.reduce((s, r) => s + r.casUrgents, 0),
    }
  }, [filtered])

  const lastWeekSaisie = saisies.find(
    (s) =>
      (s.semaine === currentWeek - 1 && s.annee === currentYear) ||
      (currentWeek === 1 && s.semaine === 52 && s.annee === currentYear - 1)
  )

  return (
    <div className="space-y-6">
      {/* Alerte */}
      {!hasSubmittedThisWeek ? (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3 min-w-0">
            <AlertCircle className="size-5 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-amber-800">
                Saisie semaine {currentWeek} manquante
              </p>
              <p className="text-xs text-amber-600 mt-0.5 truncate">
                Vous n&apos;avez pas encore transmis vos données
              </p>
            </div>
          </div>
          <Link
            href="/agent/saisie"
            className="text-sm font-medium text-amber-800 bg-amber-200/50 hover:bg-amber-200 px-4 py-1.5 rounded-md transition-colors shrink-0"
          >
            Saisir
          </Link>
        </div>
      ) : currentSaisie && (
        <div className="flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-lg px-4 py-3 sm:px-5 sm:py-4">
          <FileText className="size-5 text-primary shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary-800 truncate">
              Semaine {currentWeek} — {currentSaisie.patientsVus} patients, {currentSaisie.consultations} consultations
            </p>
            <p className="text-xs text-primary mt-0.5">Données déjà transmises cette semaine</p>
          </div>
        </div>
      )}

      {/* En-tête + Filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vue d&apos;ensemble</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} saisie{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Toutes années</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={weekFilter}
            onChange={(e) => setWeekFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Toutes semaines</option>
            {weeks.map((w) => (
              <option key={w} value={w}>S{w}</option>
            ))}
          </select>
          <Link
            href="/agent/saisie"
            className="bg-primary hover:bg-primary-700 text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors"
          >
            Nouvelle saisie
          </Link>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {METRICS.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.key} className="bg-white px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`size-4 ${m.color}`} />
                <span className="text-xs text-gray-500 uppercase tracking-wider">{m.label}</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{totals[m.key]}</p>
            </div>
          )
        })}
      </div>

      {/* Graphique */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Évolution hebdomadaire</h2>
          <p className="text-xs text-gray-500 mt-0.5">Tendance des patients vus</p>
        </div>
        <DualTrendChart
          allData={saisies}
          thisWeekData={currentSaisie}
          lastWeekData={lastWeekSaisie || null}
        />
      </div>

      {/* Tableau */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">Toutes les saisies</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Semaine</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Consult.</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Vacc.</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Urgents</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Maladies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">S{s.semaine}</span>
                    <span className="text-xs text-gray-400 ml-2">{s.annee}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900">{s.patientsVus}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700 hidden sm:table-cell">{s.consultations}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700 hidden sm:table-cell">{s.vaccinations}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700 hidden sm:table-cell">{s.casUrgents}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-40 truncate hidden md:table-cell">
                    {s.maladiesFrequentes.join(', ')}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-gray-400">
                    Aucune saisie pour cette période
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
