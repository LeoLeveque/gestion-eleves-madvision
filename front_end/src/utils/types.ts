export interface Filiere {
    id: number;
    nom: string;
}

export interface Eleve {
    id: number;
    nomPrenom: string;
    telephone: string;
    adresse: string;
    dateNaissance: string;
    dateEntree: string;
    typeCours: string;
    filiere: Filiere | null;
    sommeDue: number;
}
