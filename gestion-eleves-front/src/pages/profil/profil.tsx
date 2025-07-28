import React, { useState } from "react";
import { useGetIdentity, useUpdate } from "@refinedev/core";
import { Form, Input, Button, Card, Typography, message, Modal } from "antd";
import { useGo } from "@refinedev/core";

const { Title, Text } = Typography;


export const Profil: React.FC = () => {
    const go = useGo();
    const { data: identity } = useGetIdentity<{ id: number; nomPrenom: string }>();
    const [form] = Form.useForm();
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pendingPassword, setPendingPassword] = useState<string | null>(null);
    const { mutate: updateAdmin, isLoading } = useUpdate();

    const handleSubmit = (values: any) => {
        setPendingPassword(values.newPassword);
        setConfirmVisible(true);
    };

    const handleConfirm = () => {
        if (!pendingPassword || !identity) return;

        updateAdmin(
            {
                resource: "admins",
                id: identity.id,
                values: { mdp: pendingPassword },
                mutationMode: "pessimistic",
            },
            {
                onSuccess: () => {
                    message.success("Mot de passe mis à jour !");
                    form.resetFields();
                },
                onError: () => {
                    message.error("Erreur lors de la mise à jour");
                },
            }
        );

        setConfirmVisible(false);
        setPendingPassword(null);
    };

    return (
        <div>
            <Button onClick={() => go({ to: "/", type: "push" })}>
                Accueil
            </Button>
            <Card title="Mon profil" style={{ maxWidth: 500, margin: "0 auto" }}>
                <Title level={5}>Identité</Title>
                <Text>ID : {identity?.id}</Text>
                <br />
                <Text>Nom : {identity?.nomPrenom}</Text>

                <Form layout="vertical" form={form} onFinish={handleSubmit} style={{ marginTop: 32 }}>
                    <Title level={5}>Changer mon mot de passe</Title>

                    <Form.Item
                        label="Nouveau mot de passe"
                        name="newPassword"
                        rules={[{ required: true, message: "Veuillez saisir un nouveau mot de passe" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            Mettre à jour
                        </Button>
                    </Form.Item>
                </Form>

                <Modal
                    open={confirmVisible}
                    title="Confirmer"
                    onOk={handleConfirm}
                    onCancel={() => setConfirmVisible(false)}
                    okText="Confirmer"
                    cancelText="Annuler"
                >
                    <p>Confirmer la mise à jour du mot de passe ?</p>
                </Modal>
            </Card>
        </div>
    );
};
