import { Show, DeleteButton, ListButton } from "@refinedev/antd";
import { useShow, useGo } from "@refinedev/core";
import { Button } from "antd";
import { useEleveForm } from "./useEleveForm";
import type { EleveType } from "./types";
import { useState } from "react";
import { EleveDetails } from "./details";
import { RecuSection } from "./recuSection";
import { ModuleSection } from "./moduleSection";
import { FournitureSection } from "./fournitureSection";


export const ElevesShow = () => {
    const go = useGo();
    const { queryResult } = useShow<EleveType>();
    const record = queryResult?.data?.data;

    const [isEditingEleve, setIsEditingEleve] = useState(false);
    const { localRecord, setLocalRecord, eleveForm } = useEleveForm(record);

    const handlePrint = () => window.print();

    if (!localRecord) return null;

    return (
        <Show
            title="Détails de l'élève"
            headerButtons={() => (
                <>
                    <DeleteButton hideText onSuccess={() => go({ to: "/eleves", type: "replace" })} />
                    <Button onClick={handlePrint}>Imprimer</Button>
                    <ListButton />
                </>
            )}
        >
            <EleveDetails
                eleveForm={eleveForm}
                localRecord={localRecord}
                setLocalRecord={setLocalRecord}
                isEditingEleve={isEditingEleve}
                setIsEditingEleve={setIsEditingEleve}
            />

            <RecuSection localRecord={localRecord} setLocalRecord={setLocalRecord} />

            <ModuleSection localRecord={localRecord} setLocalRecord={setLocalRecord} />

            <FournitureSection localRecord={localRecord} setLocalRecord={setLocalRecord} />
        </Show>
    );
};
