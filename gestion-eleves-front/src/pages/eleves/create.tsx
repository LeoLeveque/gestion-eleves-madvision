import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, DatePicker, Select } from "antd";

export const ElevesCreate = () => {
    const { formProps, saveButtonProps } = useForm();

    // Récupérer les filières depuis l'API
    const { selectProps: filiereSelectProps } = useSelect({
        resource: "filieres",
        optionLabel: "nom", // le champ affiché dans la liste déroulante
        optionValue: "id",   // la valeur envoyée dans filiereId
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item label="Nom Prénom" name="nomPrenom" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Téléphone" name="telephone">
                    <Input />
                </Form.Item>
                <Form.Item label="Adresse" name="adresse">
                    <Input />
                </Form.Item>
                <Form.Item label="Date de naissance" name="dateNaissance">
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Date d'entrée" name="dateEntree">
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Type de cours" name="typeCours">
                    <Input />
                </Form.Item>

                {/* Sélection de la filière */}
                <Form.Item
                    label="Filière"
                    name="filiereId"
                    rules={[{ required: true, message: "Veuillez sélectionner une filière" }]}
                >
                    <Select {...filiereSelectProps} />
                </Form.Item>
            </Form>
        </Create>
    );
};
