import {
    DeleteButton,
    EditButton,
    List, useTable,
} from "@refinedev/antd";
import {
    Modal,
    Button,
    Form,
    Input,
    InputNumber, Table, Space,
} from "antd";
import { useState } from "react";
import {useCreate, useGo, useUpdate} from "@refinedev/core";

type FournitureType = {
    id: number;
    nom: string;
    prix: number;
};

export const FournituresList = () => {
    const { tableProps } = useTable<FournitureType>();

    const go = useGo();

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingFourniture, setEditingFourniture] = useState<FournitureType | null>(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    const { mutate: create } = useCreate();
    const { mutate: update } = useUpdate();

    const handleAdd = async () => {
        const values = await form.validateFields();
        create({
            resource: "fournitures",
            values,
            successNotification: () => ({ message: "Fourniture ajoutée", type: "success" }),
        });
        setIsAddModalVisible(false);
        form.resetFields();
    };

    const handleEdit = async () => {
        const values = await editForm.validateFields();
        if (!editingFourniture) return;
        update({
            resource: "fournitures",
            id: editingFourniture.id,
            values,
            successNotification: () => ({ message: "Fourniture modifiée", type: "success" }),
        });
        setIsEditModalVisible(false);
        editForm.resetFields();
        setEditingFourniture(null);
    };

    return (
        <div>
            <Button onClick={() => go({ to: "/", type: "push" })}>
                Accueil
            </Button>
            <List
                title="Fournitures"
                headerButtons={() => (
                    <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
                        Ajouter une fourniture
                    </Button>
                )}
            >
                <Table rowKey="id" {...tableProps}>
                    <Table.Column dataIndex="nom" title="Nom" />
                    <Table.Column
                        dataIndex="prix"
                        title="Prix"
                        render={(prix: number) => `${prix} Ar`}
                    />
                    <Table.Column
                        title="Actions"
                        render={(_, record: FournitureType) => (
                            <Space>
                                <EditButton
                                    size="small"
                                    hideText
                                    onClick={() => {
                                        setEditingFourniture(record);
                                        editForm.setFieldsValue(record);
                                        setIsEditModalVisible(true);
                                    }}
                                />
                                <DeleteButton
                                    size="small"
                                    hideText
                                    resource="fournitures"
                                    recordItemId={record.id}
                                />
                            </Space>
                        )}
                    />
                </Table>

                <Modal
                    title="Ajouter une fourniture"
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
                    title="Modifier la fourniture"
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
