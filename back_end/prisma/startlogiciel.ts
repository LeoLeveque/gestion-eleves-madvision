import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

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

    const seedValue = Math.random().toString(36).substring(2, 10);

    const admin = await prisma.utilisateur.create({
        data: {
            nomPrenom: 'admin',
            mdp: await bcrypt.hash('admin' + seedValue, 10),
            seed: seedValue,
            isAdmin: true,
        },
    });
    console.log("nouveau admin : admin");
}

main()
    .catch((e) => {
        console.error('❌ Erreur dans le seed :', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });