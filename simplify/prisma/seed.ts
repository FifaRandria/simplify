import { PrismaClient, Role } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

async function main() {
  console.log('🌱 Démarrage du seed...')

  // On supprime les données existantes pour repartir proprement
  await prisma.rapport.deleteMany()
  await prisma.saisie.deleteMany()
  await prisma.user.deleteMany()

  // Chiffrement des mots de passe
  // bcrypt transforme "password123" en une chaîne illisible comme "$2b$10$xyz..."
  // Le chiffre 10 = niveau de complexité du chiffrement
  const passwordHash = await bcrypt.hash('password123', 10)

  // Création du médecin chef
  const medecin = await prisma.user.create({
    data: {
      nom: 'Rakoto',
      prenom: 'Miora',
      email: 'miora@centresante.mg',
      password: passwordHash,
      role: Role.MEDECIN_CHEF,
      zone: null,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miora',
    }
  })

  // Création des 4 agents de santé
  const hery = await prisma.user.create({
    data: {
      nom: 'Andriamaro',
      prenom: 'Hery',
      email: 'hery@centresante.mg',
      password: passwordHash,
      role: Role.AGENT,
      zone: 'Zone Nord',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hery',
    }
  })

  const volatiana = await prisma.user.create({
    data: {
      nom: 'Rasoa',
      prenom: 'Volatiana',
      email: 'volatiana@centresante.mg',
      password: passwordHash,
      role: Role.AGENT,
      zone: 'Zone Sud',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Volatiana',
    }
  })

  const tiana = await prisma.user.create({
    data: {
      nom: 'Rajaonarison',
      prenom: 'Tianà',
      email: 'tiana@centresante.mg',
      password: passwordHash,
      role: Role.AGENT,
      zone: 'Zone Est',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tiana',
    }
  })

  const nivo = await prisma.user.create({
    data: {
      nom: 'Rabemananjara',
      prenom: 'Nivo',
      email: 'nivo@centresante.mg',
      password: passwordHash,
      role: Role.AGENT,
      zone: 'Zone Ouest',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nivo',
    }
  })

  // Création des saisies historiques (8 semaines passées)
  // Cela permet au dashboard d'avoir des graphiques d'évolution dès le départ
  const agents = [
    { user: hery, zone: 'Zone Nord' },
    { user: volatiana, zone: 'Zone Sud' },
    { user: tiana, zone: 'Zone Est' },
    { user: nivo, zone: 'Zone Ouest' },
  ]

  const maladiesParZone: Record<string, string[]> = {
    'Zone Nord': ['Paludisme', 'Diarrhée', 'IRA'],
    'Zone Sud':  ['Malnutrition', 'Paludisme', 'Dermatose'],
    'Zone Est':  ['IRA', 'Diarrhée', 'Fièvre typhoïde'],
    'Zone Ouest':['Paludisme', 'Hypertension', 'Diabète'],
  }

  for (const { user, zone } of agents) {
    for (let semaine = 14; semaine <= 21; semaine++) {
      // On génère des chiffres réalistes mais légèrement aléatoires
      const base = Math.floor(Math.random() * 20) + 30
      await prisma.saisie.create({
        data: {
          userId:             user.id,
          semaine,
          annee:              2025,
          zone,
          patientsVus:        base + Math.floor(Math.random() * 10),
          consultations:      base - Math.floor(Math.random() * 5),
          vaccinations:       Math.floor(Math.random() * 15) + 5,
          casUrgents:         Math.floor(Math.random() * 5),
          maladiesFrequentes: maladiesParZone[zone],
          problemesTerrain:   semaine % 3 === 0
            ? 'Manque de médicaments de base cette semaine'
            : null,
          commentaire: null,
        }
      })
    }
  }

  console.log('✅ Seed terminé avec succès !')
  console.log('👤 Utilisateurs créés :')
  console.log('   Dr. Miora Rakoto  → miora@centresante.mg / password123 (Médecin Chef)')
  console.log('   Hery Andriamaro   → hery@centresante.mg  / password123 (Agent Zone Nord)')
  console.log('   Volatiana Rasoa   → volatiana@centresante.mg / password123 (Agent Zone Sud)')
  console.log('   Tianà Rajaonarison → tiana@centresante.mg / password123 (Agent Zone Est)')
  console.log('   Nivo Rabemananjara → nivo@centresante.mg  / password123 (Agent Zone Ouest)')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())