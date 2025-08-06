import { SaveButton } from "@refinedev/antd";
import { Form, Input, DatePicker, Button, Descriptions } from "antd";
import { Dayjs } from "dayjs";
import type { EleveType } from "./types";
import { useUpdate } from "@refinedev/core";



type Props = {
    eleveForm: any;
    localRecord: EleveType;
    setLocalRecord: React.Dispatch<React.SetStateAction<EleveType | null>>;
    isEditingEleve: boolean;
    setIsEditingEleve: (b: boolean) => void;
};

export const EleveDetails: React.FC<Props> = ({
                                                  eleveForm,
                                                  localRecord,
                                                  setLocalRecord,
                                                  isEditingEleve,
                                                  setIsEditingEleve,
                                              }) => {
    const { mutate: update } = useUpdate();


    const handleEleveSave = async () => {
        const values = await eleveForm.validateFields();
        update({
            resource: "eleves",
            id: localRecord.id,
            values: {
                ...values,
                dateNaissance: values.dateNaissance.toISOString(),
                dateEntree: values.dateEntree.toISOString(),
            },
            successNotification: () => ({ message: "Élève modifié", type: "success" }),
        });

        setLocalRecord((prev) => (prev ? { ...prev, ...values } : prev));
        setIsEditingEleve(false);
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
                <h4>Élève</h4>
                {isEditingEleve ? (
                    <span>
                        <SaveButton onClick={handleEleveSave} style={{ marginRight: 8 }} hideText />
                        <Button onClick={() => setIsEditingEleve(false)}>Annuler</Button>
                    </span>
                ) : (
                    <Button onClick={() => setIsEditingEleve(true)}>Modifier</Button>
                )}
            </div>

            <Form form={eleveForm} layout="vertical">
                <Descriptions bordered column={1}>
                    {[
                        ["nomPrenom", "Nom Prénom"],
                        ["telephone", "Téléphone"],
                        ["adresse", "Adresse"],
                        ["typeCours", "Type de cours"],
                    ].map(([name, label]) => (
                        <Descriptions.Item key={name} label={label}>
                            {isEditingEleve ? (
                                <Form.Item name={name} noStyle rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            ) : (
                                typeof localRecord[name as keyof EleveType] === "object" &&
                                (localRecord[name as keyof EleveType] as Dayjs).isValid?.()
                                    ? (localRecord[name as keyof EleveType] as Dayjs).format("DD/MM/YYYY")
                                    : String(localRecord[name as keyof EleveType] ?? "")
                            )}
                        </Descriptions.Item>
                    ))}

                    <Descriptions.Item label="Date de naissance">
                        {isEditingEleve ? (
                            <Form.Item name="dateNaissance" noStyle rules={[{ required: true }]}>
                                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                            </Form.Item>
                        ) : (
                            localRecord.dateNaissance.format("DD/MM/YYYY")
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Date d'entrée">
                        {isEditingEleve ? (
                            <Form.Item name="dateEntree" noStyle rules={[{ required: true }]}>
                                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                            </Form.Item>
                        ) : (
                            localRecord.dateEntree.format("DD/MM/YYYY")
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Filière">{localRecord.filiere?.nom}</Descriptions.Item>
                    <Descriptions.Item label="Somme due">{localRecord.sommeDue} Ar</Descriptions.Item>
                </Descriptions>
            </Form>
        </>
    );
};
