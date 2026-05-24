'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

type SaisieData = {
  semaine: number
  annee: number
  patientsVus: number
  consultations: number
  vaccinations: number
  casUrgents: number
}

export function WeeklyTrendChart({
  data,
  metric = 'patientsVus',
  label = 'Patients vus',
  color = '#059669',
}: {
  data: SaisieData[]
  metric?: keyof SaisieData
  label?: string
  color?: string
}) {
  const chartData = [...data]
    .sort((a, b) => a.annee - b.annee || a.semaine - b.semaine)
    .map((d) => ({
      semaine: `S${d.semaine}`,
      [metric]: d[metric],
    }))

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Aucune donnée disponible
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="semaine" tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        />
        <Line
          type="monotone"
          dataKey={metric}
          stroke={color}
          strokeWidth={3}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function ComparisonChart({
  currentWeek,
  lastWeek,
}: {
  currentWeek: SaisieData | null
  lastWeek: SaisieData | null
}) {
  const metrics = [
    { key: 'patientsVus' as const, label: 'Patients vus', color: '#059669' },
    { key: 'consultations' as const, label: 'Consultations', color: '#0284c7' },
    { key: 'vaccinations' as const, label: 'Vaccinations', color: '#8b5cf6' },
    { key: 'casUrgents' as const, label: 'Cas urgents', color: '#f59e0b' },
  ]

  const chartData = metrics.map((m) => ({
    name: m.label,
    'Semaine précédente': lastWeek?.[m.key] ?? 0,
    'Cette semaine': currentWeek?.[m.key] ?? 0,
  }))

  const noData = !currentWeek && !lastWeek
  if (noData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Aucune donnée de comparaison disponible
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="Semaine précédente" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Cette semaine" fill="#059669" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AgentComparisonChart({
  data,
}: {
  data: { name: string; patients: number; consultations: number }[]
}) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Aucune donnée disponible
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="patients" name="Patients vus" fill="#059669" radius={[4, 4, 0, 0]} />
        <Bar dataKey="consultations" name="Consultations" fill="#0284c7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
