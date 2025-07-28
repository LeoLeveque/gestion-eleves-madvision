import React from "react";
import {
    List,
    useTable,
    useModalForm,
    CreateButton,
    DeleteButton,
} from "@refinedev/antd";
import {Table, Modal, Form, Input, Space, Button} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {useGo} from "@refinedev/core";

export const FilieresList: React.FC = () => {
    const { tableProps } = useTable({
        resource: "filieres",
        initialSorter: [{ field: "id", order: "asc" }],
    });

    const go = useGo();
    
    const {
        modalProps,
        formProps,
        show: showCreateModal,
    } = useModalForm({
        action: "create",
        resource: "filieres",
        redirect: false,
    });

    return (
        <div>
            <Button onClick={() => go({ to: "/", type: "push" })}>
                Accueil
            </Button>
            <List
                title="Liste des filières"
                headerButtons={() => (
                    <Space>
                        <CreateButton
                            icon={<PlusOutlined />}
                            onClick={() => showCreateModal()}
                        >
                            Ajouter une filière
                        </CreateButton>
                    </Space>
                )}
            >
                <Table {...tableProps} rowKey="id">
                    <Table.Column dataIndex="id" title="ID" />
                    <Table.Column dataIndex="nom" title="Nom" />
                    <Table.Column
                        title="Actions"
                        render={(_, record: any) => (
                            <Space>
                                <DeleteButton
                                    hideText
                                    size="small"
                                    recordItemId={record.id}
                                    resource="filieres"
                                />
                            </Space>
                        )}
                    />
                </Table>

                <Modal {...modalProps} title="Ajouter une filière">
                    <Form {...formProps} layout="vertical">
                        <Form.Item
                            label="Nom"
                            name="nom"
                            rules={[{ required: true, message: "Champ requis" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </List>
        </div>
    );
};
