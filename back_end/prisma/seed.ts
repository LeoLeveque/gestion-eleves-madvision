import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log("🧹 Nettoyage de la base de données...");

    await prisma.$transaction([
        prisma.eleveModule.deleteMany(),
        prisma.eleveFourniture.deleteMany(),
        prisma.recu.deleteMany(),
        prisma.eleve.deleteMany(),
        prisma.module.deleteMany(),
        prisma.fourniture.deleteMany(),
        prisma.filiere.deleteMany(),
        prisma.utilisateur.deleteMany(),
    ]);

    console.log("🌱 Insertion des données...");

    // Création de l'administrateur
    const admin = await prisma.utilisateur.create({
        data: {
            nomPrenom: 'admins',
            mdp: await bcrypt.hash('admins' + 'seed', 10),
            seed: 'seed',
            isAdmin: true,
        },
    });
    console.log("nouveau admins : admins");


    // Création de 3 utilisateurs normaux
    const utilisateurs = await Promise.all(
        ['Alice Martin', 'Bob Dupont', 'Charlie Durand'].map(async (nom) =>
            prisma.utilisateur.create({
                data: {
                    nomPrenom: nom,
                    mdp: await bcrypt.hash('password123' + `seed-${nom.toLowerCase().replace(' ', '-')}`, 10),
                    seed: `seed-${nom.toLowerCase().replace(' ', '-')}`,
                    isAdmin: false,
                },
            })
        )
    );

    // Création des filières
    const filiereInfo = await prisma.filiere.create({ data: { nom: 'Informatique' } });
    const filiereMaths = await prisma.filiere.create({ data: { nom: 'Mathématiques' } });

    // Création des modules
    const moduleAlgo = await prisma.module.create({ data: { nom: 'Algorithmique' } });
    const moduleWeb = await prisma.module.create({ data: { nom: 'Développement Web' } });

    // Création d'élèves
    const eleves = await Promise.all([
        prisma.eleve.create({
            data: {
                nomPrenom: 'Jean Dupuis',
                dateNaissance: new Date(2004, 2, 10),
                telephone: '0601010101',
                adresse: '123 rue A, Paris',
                dateEntree: new Date('2023-09-01'),
                typeCours: 'présentiel',
                filiereId: filiereInfo.id,
                recus: {
                    create: [{ montant: 300.0, numero: 5, motif: 'Inscription', date: new Date('2023-09-02') }],
                },
                modules: {
                    create: [
                        { moduleId: moduleAlgo.id },
                        { moduleId: moduleWeb.id },
                    ],
                },
            },
        }),
        prisma.eleve.create({
            data: {
                nomPrenom: 'Claire Petit',
                dateNaissance: new Date(2005, 6, 22),
                telephone: '0602020202',
                adresse: '456 rue B, Lyon',
                dateEntree: new Date('2023-09-01'),
                typeCours: 'en ligne',
                filiereId: filiereMaths.id,
                recus: {
                    create: [{ montant: 250.0, numero: 8, motif: 'Frais de cours', date: new Date('2023-09-10') }],
                },
                modules: {
                    create: [{ moduleId: moduleAlgo.id }],
                },
            },
        }),
        prisma.eleve.create({
            data: {
                nomPrenom: 'Louis Bernard',
                dateNaissance: new Date(2003, 10, 5),
                telephone: '0603030303',
                adresse: '789 rue C, Marseille',
                dateEntree: new Date('2023-09-01'),
                typeCours: 'présentiel',
                filiereId: filiereInfo.id,
                recus: {
                    create: [{ montant: 200.0, numero: 7, motif: 'Frais de dossier', date: new Date('2023-09-05') }],
                },
                modules: {
                    create: [{ moduleId: moduleWeb.id }],
                },
            },
        }),
    ]);

    console.log(`✅ Seed terminé avec ${eleves.length} élèves, ${utilisateurs.length} utilisateurs, et 1 admin.`);
}

main()
    .catch((e) => {
        console.error('❌ Erreur dans le seed :', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });