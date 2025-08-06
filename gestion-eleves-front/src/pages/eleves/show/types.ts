import { Dayjs } from "dayjs";

export type Module = { id: number; nom: string; prix: number };
export type Fourniture = { id: number; nom: string; prix: number };

export type RecuType = {
    id: number;
    numero?: number;
    montant: number;
    motif: string;
    date: string;
};

export type ModuleSuiviType = {
    id: number;
    module: Module;
    paye: number;
    moduleId: number;
};

export type FournitureEleveType = {
    id: number;
    fourniture: Fourniture;
    paye: number;
    fournitureId: number;
};

export type EleveType = {
    id: number;
    nomPrenom: string;
    telephone: string;
    adresse: string;
    dateNaissance: Dayjs;
    dateEntree: Dayjs;
    typeCours: string;
    filiere?: { nom: string };
    sommeDue: number;
    recus: RecuType[];
    modules: ModuleSuiviType[];
    fournitures: FournitureEleveType[];

    photoUrl: string
};
