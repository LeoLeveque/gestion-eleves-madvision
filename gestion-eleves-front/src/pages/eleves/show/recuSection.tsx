import {
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Space,
    Table,
    DatePicker,
} from "antd";
import { EditButton, DeleteButton } from "@refinedev/antd";
import { useCreate, useUpdate } from "@refinedev/core";
import { useState } from "react";
import dayjs from "dayjs";
import type { EleveType, RecuType } from "./types";

type Props = {
    localRecord: EleveType;
    setLocalRecord: React.Dispatch<React.SetStateAction<EleveType | null>>;
};

export const RecuSection: React.FC<Props> = ({ localRecord, setLocalRecord }) => {
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingRecu, setEditingRecu] = useState<RecuType | null>(null);

    const { mutate: createRecu } = useCreate<RecuType>();
    const { mutate: update } = useUpdate();

    const handleAddRecu = async () => {
        const values = await form.validateFields();
        const newRecu = { ...values, date: values.date.toISOString() };

        createRecu(
            {
                resource: "recus",
                values: { ...newRecu, eleveId: localRecord.id },
                successNotification: () => ({ message: "Reçu ajouté", type: "success" }),
            },
            {
                onSuccess: ({ data }) => {
                    setLocalRecord((prev) =>
                        prev ? { ...prev, recus: [...prev.recus, data] } : prev
                    );
                    form.resetFields();
                    setIsModalVisible(false);
                },
            }
        );
    };

    const handleEditSubmit = async () => {
        const values = await editForm.validateFields();
        if (!editingRecu) return;

        update({
            resource: "recus",
            id: editingRecu.id,
            values: {
                ...values,
                date: values.date.toISOString(),
            },
            successNotification: () => ({ message: "Reçu modifié", type: "success" }),
        });

        setLocalRecord((prev) =>
            prev
                ? {
                    ...prev,
                    recus: prev.recus.map((r) =>
                        r.id === editingRecu.id
                            ? { ...editingRecu, ...values, date: values.date.toISOString() }
                            : r
                    ),
                }
                : prev
        );

        setEditingRecu(null);
        editForm.resetFields();
        setEditModalVisible(false);
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
                <h4>Reçus</h4>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    Ajouter
                </Button>
            </div>

            <Table
                dataSource={localRecord.recus}
                rowKey="id"
                pagination={false}
                columns={[
                    { title: "Numéro", dataIndex: "numero" },
                    { title: "Date", dataIndex: "date", render: (d) => new Date(d).toLocaleDateString() },
                    { title: "Montant", dataIndex: "montant", render: (m) => `${m} Ar` },
                    { title: "Motif", dataIndex: "motif" },
                    {
                        title: "Actions",
                        render: (_, recu) => (
                            <Space>
                                <EditButton
                                    size="small"
                                    hideText
                                    onClick={() => {
                                        setEditingRecu(recu);
                                        editForm.setFieldsValue({ ...recu, date: dayjs(recu.date) });
                                        setEditModalVisible(true);
                                    }}
                                />
                                <DeleteButton
                                    size="small"
                                    hideText
                                    resource="recus"
                                    recordItemId={recu.id}
                                    onSuccess={() =>
                                        setLocalRecord((prev) =>
                                            prev
                                                ? {
                                                    ...prev,
                                                    recus: prev.recus.filter((r) => r.id !== recu.id),
                                                }
                                                : prev
                                        )
                                    }
                                />
                            </Space>
                        ),
                    },
                ]}
            />

            <Modal title="Ajouter un reçu" open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={handleAddRecu}>
                <Form form={form} layout="vertical">
                    <Form.Item name="numero" label="Numéro" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="montant" label="Montant" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} addonAfter="Ar" />
                    </Form.Item>
                    <Form.Item name="motif" label="Motif" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="date" label="Date" rules={[{ required: true }]} initialValue={dayjs()}>
                        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Modifier le reçu" open={editModalVisible} onCancel={() => setEditModalVisible(false)} onOk={handleEditSubmit}>
                <Form form={editForm} layout="vertical">
                    <Form.Item name="numero" label="Numéro" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="montant" label="Montant" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="motif" label="Motif" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
