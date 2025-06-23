import React from "react";
import { Eleve } from "../utils/types";

interface Props {
    eleves: Eleve[];
}

const ElevesTable: React.FC<Props> = ({ eleves }) => {
    return (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
            <tr>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Filière</th>
                <th>Somme Due</th>
            </tr>
            </thead>
            <tbody>
            {eleves.map((eleve) => (
                <tr key={eleve.id}>
                    <td>{eleve.nomPrenom}</td>
                    <td>{eleve.telephone}</td>
                    <td>{eleve.adresse}</td>
                    <td>{eleve.filiere?.nom}</td>
                    <td>{eleve.sommeDue} Ar</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default ElevesTable;
