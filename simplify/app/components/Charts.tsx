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

export function DualTrendChart({
  allData,
  thisWeekData,
  lastWeekData,
}: {
  allData: SaisieData[]
  thisWeekData: SaisieData | null
  lastWeekData: SaisieData | null
}) {
  const sorted = [...allData].sort(
    (a, b) => a.annee - b.annee || a.semaine - b.semaine
  )

  const chartData = sorted.map((d) => {
    const isThis =
      thisWeekData &&
      d.semaine === thisWeekData.semaine &&
      d.annee === thisWeekData.annee
    const isLast =
      lastWeekData &&
      d.semaine === lastWeekData.semaine &&
      d.annee === lastWeekData.annee
    return {
      semaine: `S${d.semaine}`,
      patients: d.patientsVus,
      consultations: d.consultations,
      vaccinations: d.vaccinations,
      urgents: d.casUrgents,
      ...(isThis ? { cetteSemaine: d.patientsVus } : {}),
      ...(isLast ? { semaineDernière: d.patientsVus } : {}),
    }
  })

  const hasComparison = thisWeekData || lastWeekData

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Aucune donnée
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d0d0dc" />
        <XAxis dataKey="semaine" tick={{ fontSize: 12, fill: '#a8a8b8' }} />
        <YAxis tick={{ fontSize: 12, fill: '#a8a8b8' }} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #d0d0dc',
            fontSize: 13,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
        {hasComparison && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />}
        <Line
          type="monotone"
          dataKey="patients"
          stroke="#c8a96e"
          strokeWidth={2}
          dot={{ fill: '#c8a96e', r: 3 }}
          name="Patients vus"
        />
        {thisWeekData && (
          <Line
            type="monotone"
            dataKey="cetteSemaine"
            stroke="#d4b67a"
            strokeWidth={3}
            strokeDasharray="6 3"
            dot={{ fill: '#d4b67a', r: 5 }}
            name="Cette semaine"
            connectNulls
          />
        )}
        {lastWeekData && (
          <Line
            type="monotone"
            dataKey="semaineDernière"
            stroke="#a8a8b8"
            strokeWidth={3}
            strokeDasharray="6 3"
            dot={{ fill: '#a8a8b8', r: 5 }}
            name="Semaine dernière"
            connectNulls
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function MultiMetricChart({
  data,
}: {
  data: SaisieData[]
}) {
  const sorted = [...data].sort(
    (a, b) => a.annee - b.annee || a.semaine - b.semaine
  )

  const chartData = sorted.map((d) => ({
    semaine: `S${d.semaine}`,
    Patients: d.patientsVus,
    Consultations: d.consultations,
    Vaccinations: d.vaccinations,
    Urgents: d.casUrgents,
  }))

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Aucune donnée
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d0d0dc" />
        <XAxis dataKey="semaine" tick={{ fontSize: 12, fill: '#a8a8b8' }} />
        <YAxis tick={{ fontSize: 12, fill: '#a8a8b8' }} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #d0d0dc',
            fontSize: 13,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Line type="monotone" dataKey="Patients" stroke="#c8a96e" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="Consultations" stroke="#d4b67a" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="Vaccinations" stroke="#8b6e3a" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="Urgents" stroke="#e8321a" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function AgentBarChart({
  data,
}: {
  data: { name: string; patients: number; consultations: number }[]
}) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Aucune donnée
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d0d0dc" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#a8a8b8' }} />
        <YAxis tick={{ fontSize: 12, fill: '#a8a8b8' }} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #d0d0dc',
            fontSize: 13,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="patients" name="Patients" fill="#c8a96e" radius={[2, 2, 0, 0]} />
        <Bar dataKey="consultations" name="Consultations" fill="#a8a8b8" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
