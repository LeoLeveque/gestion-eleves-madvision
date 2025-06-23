import {db} from "../../db";

export async function ajouterModules(eleveId: number, modules: { moduleId: number, paye?: number }[]) {
    for (const { moduleId, paye } of modules) {
        await db.eleveModule.create({
            data: { eleveId, moduleId, paye: paye || 0 },
        });
    }
}

export async function ajouterFournitures(eleveId: number, fournitures: { fournitureId: number, paye?: number }[]) {
    for (const { fournitureId, paye } of fournitures) {
        await db.eleveFourniture.create({
            data: { eleveId, fournitureId, paye: paye || 0 },
        });
    }
}

export async function ajouterRecus(eleveId: number, recus: { montant: number, motif: string, date?: string }[]) {
    for (const { montant, motif, date } of recus) {
        await db.recu.create({
            data: {
                eleveId,
                montant,
                motif,
                date: date ? new Date(date) : undefined,
            },
        });
    }
}

export async function getEleveComplet(id: number) {
    const eleve = await db.eleve.findUnique({
        where: { id },
        include: {
            filiere: true,
            recus: true,
            modules: { include: { module: true } },
            fournitures: { include: { fourniture: true } },
        },
    });

    if (!eleve) return null;

    const sommeModules = eleve.modules.reduce((s, m) => s + (m.module.prix - (m.paye || 0)), 0);
    const sommeFournitures = eleve.fournitures.reduce((s, f) => s + (f.fourniture.prix - (f.paye || 0)), 0);
    return { ...eleve, sommeDue: sommeModules + sommeFournitures };
}

export async function supprimerRelationsEleve(id: number) {
    await db.recu.deleteMany({ where: { eleveId: id } });
    await db.eleveModule.deleteMany({ where: { eleveId: id } });
    await db.eleveFourniture.deleteMany({ where: { eleveId: id } });
}

export async function mettreAJourRelationsEleve(id: number, modules: any[], fournitures: any[], recuIds: number[]) {
    await db.eleveModule.deleteMany({ where: { eleveId: id } });
    for (const { moduleId, paye } of modules) {
        await db.eleveModule.create({ data: { eleveId: id, moduleId, paye: paye || 0 } });
    }

    await db.eleveFourniture.deleteMany({ where: { eleveId: id } });
    for (const { fournitureId, paye } of fournitures) {
        await db.eleveFourniture.create({ data: { eleveId: id, fournitureId, paye: paye || 0 } });
    }

    for (const recuId of recuIds) {
        await db.recu.update({ where: { id: recuId }, data: { eleveId: id } });
    }
}