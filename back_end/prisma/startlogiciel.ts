import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

    const seedValue = Math.random().toString(36).substring(2, 10);

    const admin = await prisma.utilisateur.create({
        data: {
            nomPrenom: 'admin',
            mdp: await bcrypt.hash('admin' + 'seed', 10),
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