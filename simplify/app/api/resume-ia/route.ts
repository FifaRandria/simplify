import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''

function generateFallbackResume(donnees: any): string {
  const {
    periode,
    totalPatients = 0,
    totalConsultations = 0,
    totalVaccinations = 0,
    totalCasUrgents = 0,
    ecartPatients = 0,
    meilleurAgent,
    moinsBonAgent,
    maladiePlusFrequente,
    agentsAyantSaisi,
    totalAgents,
  } = donnees

  const evolution = ecartPatients >= 0
    ? `en hausse de ${ecartPatients}% par rapport au mois précédent`
    : `en baisse de ${Math.abs(ecartPatients)}% par rapport au mois précédent`

  const agentSection = meilleurAgent
    ? `Le centre ${meilleurAgent} a enregistré le plus grand nombre de patients, tandis que ${moinsBonAgent || 'un autre centre'} nécessite une attention particulière. `
    : ''

  const maladieSection = maladiePlusFrequente
    ? `La pathologie la plus fréquemment rapportée est ${maladiePlusFrequente}. `
    : ''

  return `Au cours de la période ${periode}, le bilan sanitaire fait état de ${totalPatients} patients reçus, dont ${totalConsultations} consultations médicales et ${totalVaccinations} vaccinations administrées. ${totalCasUrgents} cas urgents ont été pris en charge. L'activité globale est ${evolution}. ${agentSection}${maladieSection}Sur les ${totalAgents} agents de santé, ${agentsAyantSaisi} ont transmis leurs données. La vigilance reste de mise pour assurer une couverture sanitaire optimale sur l'ensemble des zones.`
}

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

Le résumé doit :
- Commencer par un paragraphe de synthèse générale
- Mentionner les indicateurs clés
- Comparer avec le mois précédent
- Identifier les points d'attention
- Se terminer par une conclusion professionnelle
- Être rédigé dans un français formel et fluide (3-5 phrases maximum)`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

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
          max_tokens: 500,
          temperature: 0.7,
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
