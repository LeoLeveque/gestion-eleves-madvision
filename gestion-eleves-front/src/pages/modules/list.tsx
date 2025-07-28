import {
    List,
    EditButton,
    DeleteButton,
    useTable,
} from "@refinedev/antd";
import {
    Table,
    Modal,
    Button,
    Form,
    Input,
    InputNumber,
    Space,
} from "antd";
import { useState } from "react";
import {useCreate, useGo, useUpdate} from "@refinedev/core";

type ModuleType = {
    id: number;
    nom: string;
    prix: number;
};

export const ModulesList = () => {
    const { tableProps } = useTable<ModuleType>({ resource: "modules" });

    const go = useGo();

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingModule, setEditingModule] = useState<ModuleType | null>(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    const { mutate: create } = useCreate();
    const { mutate: update } = useUpdate();

    const handleAdd = async () => {
        const values = await form.validateFields();
        create({
            resource: "modules",
            values,
            successNotification: () => ({ message: "Module ajouté", type: "success" }),
        });
        setIsAddModalVisible(false);
        form.resetFields();
    };

    const handleEdit = async () => {
        const values = await editForm.validateFields();
        if (!editingModule) return;
        update({
            resource: "modules",
            id: editingModule.id,
            values,
            successNotification: () => ({ message: "Module modifié", type: "success" }),
        });
        setIsEditModalVisible(false);
        editForm.resetFields();
        setEditingModule(null);
    };

    return (
        <div>
            <Button onClick={() => go({ to: "/", type: "push" })}>
                Accueil
            </Button>
            <List
                title="Modules"
                headerButtons={() => (
                    <Space>
                        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
                            Ajouter un module
                        </Button>
                    </Space>
                )}
            >

                <Table
                    rowKey="id"
                    dataSource={tableProps.dataSource ?? []} // fallback vide
                    loading={tableProps.loading}
                    pagination={tableProps.pagination}
                    onChange={tableProps.onChange}

                >
                    <Table.Column dataIndex="nom" title="Nom" />
                    <Table.Column
                        dataIndex="prix"
                        title="Prix"
                        render={(prix: number) => `${prix} Ar`}
                    />
                    <Table.Column
                        title="Actions"
                        render={(_, record: ModuleType) => (
                            <Space>
                                <EditButton
                                    size="small"
                                    hideText
                                    onClick={() => {
                                        setEditingModule(record);
                                        editForm.setFieldsValue(record);
                                        setIsEditModalVisible(true);
                                    }}
                                />
                                <DeleteButton
                                    size="small"
                                    hideText
                                    resource="modules"
                                    recordItemId={record.id}
                                />
                            </Space>
                        )}
                    />
                </Table>


                <Modal
                    title="Ajouter un module"
                    open={isAddModalVisible}
                    onCancel={() => setIsAddModalVisible(false)}
                    onOk={handleAdd}
                >
                    <Form layout="vertical" form={form}>
                        <Form.Item name="nom" label="Nom" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="prix" label="Prix" rules={[{ required: true }]}>
                            <InputNumber style={{ width: "100%" }} addonAfter="Ar" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Modifier le module"
                    open={isEditModalVisible}
                    onCancel={() => setIsEditModalVisible(false)}
                    onOk={handleEdit}
                >
                    <Form layout="vertical" form={editForm}>
                        <Form.Item name="nom" label="Nom" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="prix" label="Prix" rules={[{ required: true }]}>
                            <InputNumber style={{ width: "100%" }} addonAfter="Ar" />
                        </Form.Item>
                    </Form>
                </Modal>
            </List>
        </div>
    );
};
