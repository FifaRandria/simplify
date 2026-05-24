'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { WeeklyTrendChart, AgentComparisonChart } from './Charts'
import {
  UsersIcon,
  HeartIcon,
  SyringeIcon,
  AlertIcon,
  TrendingUpIcon,
  ClipboardIcon,
  MapPinIcon,
} from './Icons'

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
  globalTotals: {
    totalPatients: number
    totalConsultations: number
    totalVaccinations: number
    totalUrgents: number
    totalSaisies: number
  }
}) {
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterZone, setFilterZone] = useState<string>('all')

  const zones = useMemo(() => {
    const z = new Set(agents.map((a) => a.agent.zone).filter(Boolean))
    return Array.from(z) as string[]
  }, [agents])

  const agentsStatus = useMemo(() => {
    return agents.map(({ agent, saisies }) => {
      const lastSaisie = saisies[0] || null
      const hasSubmittedThisWeek = saisies.some(
        (s) => s.semaine === currentWeek && s.annee === currentYear
      )
      return { ...agent, saisies, lastSaisie, hasSubmittedThisWeek }
    })
  }, [agents, currentWeek, currentYear])

  const filteredAgents = useMemo(() => {
    return agentsStatus.filter((a) => {
      if (filterStatus === 'submitted' && !a.hasSubmittedThisWeek) return false
      if (filterStatus === 'pending' && a.hasSubmittedThisWeek) return false
      if (filterZone !== 'all' && a.zone !== filterZone) return false
      return true
    })
  }, [agentsStatus, filterStatus, filterZone])

  const totalSubmitted = agentsStatus.filter((a) => a.hasSubmittedThisWeek).length
  const totalNotSubmitted = agentsStatus.filter((a) => !a.hasSubmittedThisWeek).length

  const allSaisies = agents.flatMap((a) => a.saisies)
  const chartData = allSaisies
    .sort((a, b) => a.annee - b.annee || a.semaine - b.semaine)
    .reduce<{ semaine: string; patients: number; consultations: number }[]>((acc, s) => {
      const key = `S${s.semaine}`
      const existing = acc.find((e) => e.semaine === key)
      if (existing) {
        existing.patients += s.patientsVus
        existing.consultations += s.consultations
      } else {
        acc.push({ semaine: key, patients: s.patientsVus, consultations: s.consultations })
      }
      return acc
    }, [])

  const agentComparisonData = agentsStatus.map((a) => ({
    name: a.prenom,
    patients: a.lastSaisie?.patientsVus ?? 0,
    consultations: a.lastSaisie?.consultations ?? 0,
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">{period}</p>
        </div>
        <button
          onClick={() => router.push('/medecin-chef/rapports')}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-md"
        >
          Générer le bilan
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: UsersIcon, label: 'Patients vus', value: globalTotals.totalPatients, sub: `${globalTotals.totalSaisies} saisies`, color: 'from-emerald-500 to-emerald-600' },
          { icon: HeartIcon, label: 'Consultations', value: globalTotals.totalConsultations, sub: `${globalTotals.totalSaisies} saisies`, color: 'from-blue-500 to-blue-600' },
          { icon: SyringeIcon, label: 'Vaccinations', value: globalTotals.totalVaccinations, sub: `${globalTotals.totalSaisies} saisies`, color: 'from-violet-500 to-violet-600' },
          { icon: AlertIcon, label: 'Cas urgents', value: globalTotals.totalUrgents, sub: `${globalTotals.totalSaisies} saisies`, color: 'from-amber-500 to-amber-600' },
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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <TrendingUpIcon className="size-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Tendance globale</h2>
          </div>
          <WeeklyTrendChart
            data={allSaisies}
            metric="patientsVus"
            label="Patients vus"
            color="#059669"
          />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <UsersIcon className="size-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Agents - Dernière semaine</h2>
          </div>
          <AgentComparisonChart data={agentComparisonData} />
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 size-48 bg-white/10 rounded-full blur-3xl" />
        <div className="relative grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold">{agents.length}</p>
            <p className="text-emerald-200 text-sm mt-1">Agents</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{totalSubmitted}</p>
            <p className="text-emerald-200 text-sm mt-1">Ont saisi cette semaine</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{totalNotSubmitted}</p>
            <p className="text-emerald-200 text-sm mt-1">En attente</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg">
                <UsersIcon className="size-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Suivi des agents - Semaine {currentWeek}
              </h2>
            </div>
            <div className="flex gap-3">
              <select
                value={filterZone}
                onChange={(e) => setFilterZone(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">Toutes les zones</option>
                {zones.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="submitted">Ont saisi</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-y border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Agent</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Zone</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Patients</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Consultations</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Vaccinations</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Dernière saisie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-emerald-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-8 rounded-full bg-gradient-to-br ${
                        agent.hasSubmittedThisWeek ? 'from-emerald-400 to-emerald-600' : 'from-gray-300 to-gray-400'
                      } flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                        {agent.prenom[0]}{agent.nom[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{agent.prenom} {agent.nom}</p>
                        <p className="text-xs text-gray-400">{agent.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      <MapPinIcon className="size-3.5" />
                      {agent.zone}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {agent.hasSubmittedThisWeek ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-semibold">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Saisi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full text-xs font-semibold">
                        <span className="size-1.5 rounded-full bg-amber-500" />
                        En attente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-gray-900">
                    {agent.lastSaisie?.patientsVus ?? '-'}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-700">
                    {agent.lastSaisie?.consultations ?? '-'}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-700">
                    {agent.lastSaisie?.vaccinations ?? '-'}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-500 whitespace-nowrap">
                    {agent.lastSaisie
                      ? `S${agent.lastSaisie.semaine} - ${agent.lastSaisie.annee}`
                      : 'Jamais'}
                  </td>
                </tr>
              ))}
              {filteredAgents.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
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
