import React, { useEffect, useState } from "react";
import { getEleves } from "../api/eleves";
import { Eleve } from "../utils/types";
import ElevesTable from "../components/ElevesTable";

const ElevesPage: React.FC = () => {
    const [eleves, setEleves] = useState<Eleve[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEleves = async () => {
            try {
                const response = await getEleves();
                setEleves(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des élèves :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEleves();
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Liste des élèves</h1>
            {loading ? <p>Chargement...</p> : <ElevesTable eleves={eleves} />}
        </div>
    );
};

export default ElevesPage;
