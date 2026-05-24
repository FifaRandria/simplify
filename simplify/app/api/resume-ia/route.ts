import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''

const FALLBACK_TEMPLATES = [
  (d: any) => {
    const ev = d.ecartPatients >= 0 ? `en hausse de ${d.ecartPatients}%` : `en baisse de ${Math.abs(d.ecartPatients)}%`
    return `Période ${d.periode} — ${d.totalPatients} patients reçus (${d.totalConsultations} consultations, ${d.totalVaccinations} vaccinations, ${d.totalCasUrgents} urgences). L'activité est ${ev} vs le mois précédent. ${d.meilleurAgent ? `Le centre ${d.meilleurAgent} est le plus actif.` : ''} ${d.maladiePlusFrequente ? `Pathologie dominante : ${d.maladiePlusFrequente}.` : ''} ${d.agentsAyantSaisi}/${d.totalAgents} agents ont rapporté leurs données.`
  },
  (d: any) => {
    const ev = d.ecartPatients >= 0 ? `une progression de ${d.ecartPatients}%` : `un recul de ${Math.abs(d.ecartPatients)}%`
    return `Bilan sanitaire de ${d.periode}. On note ${d.totalPatients} passages dont ${d.totalConsultations} consultations et ${d.totalVaccinations} vaccinations. Les urgences représentent ${d.totalCasUrgents} cas. Par rapport au mois précédent, on observe ${ev}. ${d.meilleurAgent ? `${d.meilleurAgent} se distingue par une forte affluence.` : ''} ${d.maladiePlusFrequente ? `Attention particulière sur ${d.maladiePlusFrequente}.` : ''} Taux de complétude : ${d.agentsAyantSaisi}/${d.totalAgents}.`
  },
  (d: any) => {
    const ev = d.ecartPatients >= 0 ? 'favorable' : 'préoccupante'
    return `Rapport de ${d.periode}. Activité : ${d.totalPatients} patients (consultations : ${d.totalConsultations}, vaccinations : ${d.totalVaccinations}, urgences : ${d.totalCasUrgents}). La tendance est ${ev} avec un écart de ${d.ecartPatients}%. ${d.meilleurAgent ? `Meilleure performance : ${d.meilleurAgent}. ` : ''}${d.maladiePlusFrequente ? `À surveiller : ${d.maladiePlusFrequente}. ` : ''}Données reçues de ${d.agentsAyantSaisi} agents sur ${d.totalAgents}.`
  },
  (d: any) => {
    const ev = d.ecartPatients >= 0 ? `en augmentation de ${d.ecartPatients}%` : `en diminution de ${Math.abs(d.ecartPatients)}%`
    return `Synthèse ${d.periode}. ${d.totalPatients} patients ont été reçus dans les centres de santé. Parmi eux, ${d.totalConsultations} consultations médicales ont eu lieu, ${d.totalVaccinations} vaccins ont été administrés et ${d.totalCasUrgents} cas urgents traités. L'activité est ${ev} par rapport au mois précédent. ${d.meilleurAgent ? `Le centre ${d.meilleurAgent} a traité le plus de patients. ` : ''}${d.maladiePlusFrequente ? `La ${d.maladiePlusFrequente} est la pathologie la plus courante. ` : ''}Participation : ${d.agentsAyantSaisi}/${d.totalAgents} agents.`
  },
  (d: any) => {
    const ev = d.ecartPatients >= 0 ? 'encourageante' : 'nécessitant une vigilance accrue'
    return `${d.periode} — Bilan d'activité. Total patients : ${d.totalPatients}. Répartition : ${d.totalConsultations} consultations, ${d.totalVaccinations} vaccinations, ${d.totalCasUrgents} urgences. Évolution : ${ev} (${d.ecartPatients}%). ${d.meilleurAgent ? `${d.meilleurAgent} en tête du classement. ` : ''}${d.maladiePlusFrequente ? `Problématique principale : ${d.maladiePlusFrequente}. ` : ''}Couverture : ${d.agentsAyantSaisi} agents sur ${d.totalAgents} ont saisi leurs données.`
  },
]

function generateFallbackResume(donnees: any): string {
  const d = {
    periode: donnees.periode || 'N/A',
    totalPatients: donnees.totalPatients ?? 0,
    totalConsultations: donnees.totalConsultations ?? 0,
    totalVaccinations: donnees.totalVaccinations ?? 0,
    totalCasUrgents: donnees.totalCasUrgents ?? 0,
    ecartPatients: donnees.ecartPatients ?? 0,
    meilleurAgent: donnees.meilleurAgent || null,
    moinsBonAgent: donnees.moinsBonAgent || null,
    maladiePlusFrequente: donnees.maladiePlusFrequente || null,
    agentsAyantSaisi: donnees.agentsAyantSaisi ?? 0,
    totalAgents: donnees.totalAgents ?? 0,
  }
  const idx = Math.floor(Math.random() * FALLBACK_TEMPLATES.length)
  return FALLBACK_TEMPLATES[idx](d)
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const STYLES = [
  'Rédige dans un ton formel et académique, avec des phrases structurées et un vocabulaire soutenu.',
  'Rédige dans un ton direct et percutant, avec des phrases courtes et des constats sans fioriture.',
  'Rédige dans un ton narratif et fluide, comme un chroniqueur qui raconte l\'évolution sanitaire.',
  'Rédige dans un ton professionnel mais accessible, avec des explications claires destinées à un public non spécialiste.',
  'Rédige dans un ton synthétique, sous forme de points clés numérotés (type note de service).',
]

const FOCI = [
  'Insiste particulièrement sur la comparaison avec le mois précédent et les tendances.',
  'Mets l\'accent sur les disparités entre les différents centres de santé.',
  'Souligne les pathologies les plus préoccupantes et les recommandations sanitaires.',
  'Valorise les bonnes performances et les centres qui se sont le plus améliorés.',
  'Adopte un regard critique : écarts de données, lacunes de transmission, axes d\'amélioration.',
]

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'MEDECIN_CHEF') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { donnees } = await request.json()

    if (!donnees || !donnees.periode) {
      return NextResponse.json({
        resume: generateFallbackResume(donnees || {}),
      })
    }

    const nbPhrases = Math.floor(Math.random() * 8) + 3
    const style = pick(STYLES)
    const focus = pick(FOCI)

    const prompt = `Tu es un expert en santé publique à Madagascar. Rédige un résumé narratif professionnel en français à partir des données sanitaires suivantes :

Période : ${donnees.periode}
Patients vus : ${donnees.totalPatients}
Consultations : ${donnees.totalConsultations}
Vaccinations : ${donnees.totalVaccinations}
Cas urgents : ${donnees.totalCasUrgents}
Taux de consultations : ${donnees.tauxConsultations}%
Taux de vaccinations : ${donnees.tauxVaccinations}%
Taux d'urgences : ${donnees.tauxUrgents}%
Évolution vs mois précédent : ${donnees.ecartPatients}%
Meilleur agent : ${donnees.meilleurAgent || 'N/A'}
Agent avec moins de patients : ${donnees.moinsBonAgent || 'N/A'}
Maladie la plus fréquente : ${donnees.maladiePlusFrequente || 'N/A'}
Agents ayant saisi : ${donnees.agentsAyantSaisi}/${donnees.totalAgents}

Consignes :
- ${style}
- ${focus}
- Le résumé doit faire entre ${nbPhrases} et ${nbPhrases + 3} phrases — ni plus, ni moins.
- Varie la structure : ne commence pas toujours par "Au cours de la période" ou "Le bilan".
- Ne répète pas les mêmes tournures que les résumés précédents.
- Termine par une conclusion pertinente (recommandation, vigilance, ou perspective).`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1200,
          temperature: 0.95,
        }),
      }
    )

    clearTimeout(timeout)

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.error('OpenRouter error:', response.status, errorText)
      return NextResponse.json({
        resume: generateFallbackResume(donnees),
      })
    }

    const data = await response.json()
    const resume = data.choices?.[0]?.message?.content?.trim()

    if (!resume) {
      return NextResponse.json({
        resume: generateFallbackResume(donnees),
      })
    }

    return NextResponse.json({ resume })
  } catch (err: any) {
    console.error('Resume IA error:', err?.message || err)
    return NextResponse.json({
      resume: generateFallbackResume({}),
    })
  }
}
