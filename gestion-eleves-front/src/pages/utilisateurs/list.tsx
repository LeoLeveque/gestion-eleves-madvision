import { useState } from "react";
import {
    useCreate,
    useDelete, useGetIdentity, useGo,
} from "@refinedev/core";
import {List, useTable} from "@refinedev/antd"
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Popconfirm,
    message,
    Checkbox,
    Space
} from "antd";

export const UtilisateursPage = () => {
    const go = useGo();

    const { data: identity } = useGetIdentity<{ id: number }>();

    const { tableProps } = useTable({ resource: "admins" });

    console.log(tableProps)
    const { mutate: createUser, isLoading: creating } = useCreate();
    const { mutate: deleteUser } = useDelete();

    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);

    const handleCreate = (values: any) => {
        createUser(
            {
                resource: "admins",
                values: {
                    nomPrenom: values.nomPrenom,
                    mdp: values.mdp,
                    isAdmin: values.isAdmin,
                },
            },
            {
                onSuccess: () => {
                    message.success("Utilisateur ajouté !");
                    setModalVisible(false);
                    form.resetFields();
                },
                onError: () => message.error("Erreur lors de l'ajout"),
            }
        );
    };


    const handleDelete = (id: number) => {
        if (id === 1) return;
        deleteUser(
            {
                resource: "admins",
                id,
            },
            {
                onSuccess: () => {
                    message.success("Utilisateur supprimé");
                },
                onError: () => message.error("Erreur lors de la suppression"),
            }
        );
    };


    return (
        <div style={{ padding: 32 }}>
            <Button onClick={() => go({ to: "/", type: "push" })}>
                Accueil
            </Button>

            <List
                title="Gestion des utilisateurs"
                headerButtons={() => (
                    <Space style={{ marginBottom: 16 }}>
                        <Button
                            type="primary"
                            onClick={() => setModalVisible(true)}
                            style={{ marginBottom: 16 }}
                        >
                            Ajouter un utilisateur
                        </Button>

                    </Space>
                )}
            >
                <Table
                    {...tableProps}
                    rowKey="id"
                    columns={[
                        {
                            title: "ID",
                            dataIndex: "id",
                        },
                        {
                            title: "Nom Prénom",
                            dataIndex: "nomPrenom",
                        },
                        {
                            title: "Admin",
                            dataIndex: "isAdmin",
                            render: (isAdmin: boolean) => isAdmin ? "✔️ Oui" : "❌ Non",
                        },
                        {
                            title: "Actions",
                            render: (_, record: any) => {
                                if (record.id === 1) {
                                    return <span>Premier admin</span>;
                                }

                                if (record.id === identity?.id) {
                                    return <span>Vous</span>;
                                }

                                return (
                                    <Popconfirm
                                        title="Supprimer cet utilisateur ?"
                                        onConfirm={() => handleDelete(record.id)}
                                    >
                                        <Button danger>Supprimer</Button>
                                    </Popconfirm>
                                );
                            },
                        },
                    ]}
                />


                <Modal
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    onOk={() => form.submit()}
                    title="Ajouter un utilisateur"
                    okText="Créer"
                    confirmLoading={creating}
                >
                    <Form layout="vertical" form={form} onFinish={handleCreate} initialValues={{ isAdmin: true }}>
                        <Form.Item
                            label="Nom Prénom"
                            name="nomPrenom"
                            rules={[{ required: true, message: "Champ requis" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Mot de passe"
                            name="mdp"
                            rules={[{ required: true, message: "Champ requis" }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="isAdmin"
                            valuePropName="checked"
                        >
                            <Checkbox>Est administrateur</Checkbox>
                        </Form.Item>
                    </Form>
                </Modal>
            </List>

        </div>
    );
};
