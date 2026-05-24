'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { DualTrendChart, MultiMetricChart, AgentBarChart } from './Charts'
import { Activity, Users, Heart, FileText, AlertCircle, TrendingUp, MapPin, Filter } from './Icons'

type AgentData = {
  id: string
  nom: string
  prenom: string
  zone: string | null
  email: string
}

type SaisieData = {
  id: string
  userId: string
  semaine: number
  annee: number
  patientsVus: number
  consultations: number
  vaccinations: number
  casUrgents: number
  maladiesFrequentes: string[]
  problemesTerrain: string | null
}

type AgentWithSaisies = {
  agent: AgentData
  saisies: SaisieData[]
}

const METRICS = [
  { key: 'totalPatients' as const, label: 'Patients vus', icon: Users, color: 'text-teal-600' },
  { key: 'totalConsultations' as const, label: 'Consultations', icon: Heart, color: 'text-cyan-600' },
  { key: 'totalVaccinations' as const, label: 'Vaccinations', icon: Activity, color: 'text-violet-600' },
  { key: 'totalUrgents' as const, label: 'Cas urgents', icon: AlertCircle, color: 'text-amber-600' },
]

export default function MedecinChefDashboardClient({
  agents,
  currentWeek,
  currentYear,
  period,
  globalTotals,
}: {
  agents: AgentWithSaisies[]
  currentWeek: number
  currentYear: number
  period: string
  globalTotals: { totalPatients: number; totalConsultations: number; totalVaccinations: number; totalUrgents: number; totalSaisies: number }
}) {
  const router = useRouter()

  // Filtres
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterZone, setFilterZone] = useState('all')
  const [filterSemaine, setFilterSemaine] = useState('all')

  // Semaines disponibles dans les données
  const allSemaines = useMemo(() => {
    const s = new Set<number>()
    agents.forEach((a) => a.saisies.forEach((sa) => s.add(sa.semaine)))
    return [...s].sort((a, b) => b - a)
  }, [agents])

  const zones = useMemo(() => {
    const z = new Set(agents.map((a) => a.agent.zone).filter(Boolean))
    return [...z] as string[]
  }, [agents])

  // Agents enrichis avec statut + filtre semaine
  const agentsEnriched = useMemo(() => {
    return agents.map(({ agent, saisies }) => {
      const filteredSaisies = filterSemaine === 'all'
        ? saisies
        : saisies.filter((s) => s.semaine === +filterSemaine)
      const lastSaisie = filteredSaisies[0] || null
      const hasSubmittedThisWeek = saisies.some(
        (s) => s.semaine === currentWeek && s.annee === currentYear
      )
      return { ...agent, saisies: filteredSaisies, lastSaisie, hasSubmittedThisWeek }
    })
  }, [agents, currentWeek, currentYear, filterSemaine])

  const filteredAgents = useMemo(() => {
    return agentsEnriched.filter((a) => {
      if (filterStatus === 'submitted' && !a.hasSubmittedThisWeek) return false
      if (filterStatus === 'pending' && a.hasSubmittedThisWeek) return false
      if (filterZone !== 'all' && a.zone !== filterZone) return false
      return true
    })
  }, [agentsEnriched, filterStatus, filterZone])

  const totalSubmitted = agentsEnriched.filter((a) => a.hasSubmittedThisWeek).length
  const totalNotSubmitted = agentsEnriched.filter((a) => !a.hasSubmittedThisWeek).length

  // Toutes les saisies pour les graphiques
  const allSaisies = agents.flatMap((a) => a.saisies)

  // Données pour bar chart (dernière saisie de chaque agent)
  const agentBarData = agentsEnriched.map((a) => ({
    name: a.prenom,
    patients: a.lastSaisie?.patientsVus ?? 0,
    consultations: a.lastSaisie?.consultations ?? 0,
  }))

  // Current/last week saisies pour le dual chart
  const thisWeekSaisies = allSaisies.filter(
    (s) => s.semaine === currentWeek && s.annee === currentYear
  )
  const lastWeekSaisies = allSaisies.filter(
    (s) =>
      (s.semaine === currentWeek - 1 && s.annee === currentYear) ||
      (currentWeek === 1 && s.semaine === 52 && s.annee === currentYear - 1)
  )

  const thisWeekAgg = thisWeekSaisies.length > 0
    ? {
        semaine: currentWeek,
        annee: currentYear,
        patientsVus: thisWeekSaisies.reduce((s, r) => s + r.patientsVus, 0),
        consultations: thisWeekSaisies.reduce((s, r) => s + r.consultations, 0),
        vaccinations: thisWeekSaisies.reduce((s, r) => s + r.vaccinations, 0),
        casUrgents: thisWeekSaisies.reduce((s, r) => s + r.casUrgents, 0),
      }
    : null

  const lastWeekAgg = lastWeekSaisies.length > 0
    ? {
        semaine: currentWeek - 1,
        annee: currentYear,
        patientsVus: lastWeekSaisies.reduce((s, r) => s + r.patientsVus, 0),
        consultations: lastWeekSaisies.reduce((s, r) => s + r.consultations, 0),
        vaccinations: lastWeekSaisies.reduce((s, r) => s + r.vaccinations, 0),
        casUrgents: lastWeekSaisies.reduce((s, r) => s + r.casUrgents, 0),
      }
    : null

  return (
    <div className="space-y-10">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-1">{period}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            S{currentWeek} — {currentYear}
          </span>
          <button
            onClick={() => router.push('/medecin-chef/rapports')}
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Bilan
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {METRICS.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.key} className="bg-white px-5 py-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`size-4 ${m.color}`} />
                <span className="text-xs text-gray-500 uppercase tracking-wider">{m.label}</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{globalTotals[m.key]}</p>
            </div>
          )
        })}
      </div>

      {/* Cartes résumé agents */}
      <div className="grid grid-cols-3 gap-px bg-gray-200 rounded-lg overflow-hidden">
        <div className="bg-white px-5 py-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Agents</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{agents.length}</p>
        </div>
        <div className="bg-white px-5 py-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Ont saisi</p>
          <p className="text-xl font-semibold text-teal-600 mt-1">{totalSubmitted}</p>
        </div>
        <div className="bg-white px-5 py-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">En attente</p>
          <p className="text-xl font-semibold text-amber-600 mt-1">{totalNotSubmitted}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">Tendance patients</h2>
            <p className="text-xs text-gray-500 mt-0.5">Évolution hebdomadaire avec surlignage de la semaine courante</p>
          </div>
          <DualTrendChart
            allData={allSaisies}
            thisWeekData={thisWeekAgg}
            lastWeekData={lastWeekAgg}
          />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">Multi-indicateurs</h2>
            <p className="text-xs text-gray-500 mt-0.5">Toutes les métriques dans le temps</p>
          </div>
          <MultiMetricChart data={allSaisies} />
        </div>
      </div>

      {/* Comparaison agents */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-900">Comparaison agents</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {filterSemaine === 'all' ? 'Dernière saisie' : `Semaine ${filterSemaine}`} — patients et consultations par agent
          </p>
        </div>
        <AgentBarChart data={agentBarData} />
      </div>

      {/* Tableau avec filtres */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Agents — Semaine {currentWeek}</span>
          </div>
          <div className="flex gap-2">
            <select
              value={filterSemaine}
              onChange={(e) => setFilterSemaine(e.target.value)}
              className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">Toutes semaines</option>
              {allSemaines.map((s) => (
                <option key={s} value={s}>S{s}</option>
              ))}
            </select>
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">Toutes zones</option>
              {zones.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-gray-200 rounded px-2.5 py-1.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">Tous statuts</option>
              <option value="submitted">Ont saisi</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Consult.</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Vacc.</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`size-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                        agent.hasSubmittedThisWeek ? 'bg-teal-500' : 'bg-gray-300'
                      }`}>
                        {agent.prenom[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{agent.prenom} {agent.nom}</p>
                        <p className="text-xs text-gray-400">{agent.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{agent.zone}</span>
                  </td>
                  <td className="px-4 py-3">
                    {agent.hasSubmittedThisWeek ? (
                      <span className="text-xs text-teal-700 bg-teal-50 px-2 py-1 rounded font-medium">Saisi</span>
                    ) : (
                      <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded font-medium">En attente</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900 font-medium">
                    {agent.lastSaisie?.patientsVus ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">
                    {agent.lastSaisie?.consultations ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">
                    {agent.lastSaisie?.vaccinations ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-400 whitespace-nowrap">
                    {agent.lastSaisie
                      ? `S${agent.lastSaisie.semaine}`
                      : '—'}
                  </td>
                </tr>
              ))}
              {filteredAgents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-gray-400">
                    Aucun agent trouvé
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
