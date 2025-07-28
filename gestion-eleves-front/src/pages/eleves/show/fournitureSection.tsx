import {
    Button,
    Form,
    InputNumber,
    Modal,
    Select,
    Space,
    Table,
} from "antd";
import { EditButton, DeleteButton } from "@refinedev/antd";
import {useList, useCreate, useUpdate, useShow} from "@refinedev/core";
import { useState } from "react";
import type { EleveType, FournitureEleveType, Fourniture } from "./types";

type Props = {
    localRecord: EleveType;
    setLocalRecord: React.Dispatch<React.SetStateAction<EleveType | null>>;
};

export const FournitureSection: React.FC<Props> = ({ localRecord, setLocalRecord }) => {
    const { queryResult } = useShow<EleveType>();
    const refetch = queryResult?.refetch;

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<FournitureEleveType | null>(null);

    const { data: dataList, isLoading } = useList<Fourniture>({
        resource: "fournitures",
    });

    const options = dataList?.data ?? [];

    const { mutate: create } = useCreate<FournitureEleveType>();
    const { mutate: update } = useUpdate();

    const handleAdd = async () => {
        const values = await form.validateFields();
        create(
            {
                resource: "eleve-fournitures",
                values: { ...values, eleveId: localRecord.id },
                successNotification: () => ({ message: "Fourniture ajoutée", type: "success" }),
            },
            {
                onSuccess: () => {
                    form.resetFields();
                    setIsModalVisible(false);
                    setEditingItem(null);
                    refetch?.();
                },
            }
        );
    };

    const handleEdit = async () => {
        const values = await form.validateFields();
        if (!editingItem) return;

        update(
            {
                resource: "eleve-fournitures",
                id: editingItem.id,
                values,
                successNotification: () => ({ message: "Fourniture modifiée", type: "success" }),
            },
            {
                onSuccess: () => {
                    form.resetFields();
                    setIsModalVisible(false);
                    setEditingItem(null);
                    refetch?.();
                },
            }
        );
    };



    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
                <h4>Fournitures</h4>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    Ajouter
                </Button>
            </div>

            <Table
                dataSource={localRecord.fournitures}
                rowKey="id"
                pagination={false}
                columns={[
                    { title: "Fourniture", dataIndex: ["fourniture", "nom"] },
                    { title: "Prix", dataIndex: ["fourniture", "prix"], render: (p) => `${p} Ar` },
                    { title: "Payé", dataIndex: "paye", render: (p) => `${p} Ar` },
                    {
                        title: "Actions",
                        render: (_, f) => (
                            <Space>
                                <EditButton
                                    size="small"
                                    hideText
                                    onClick={() => {
                                        setEditingItem(f);
                                        form.setFieldsValue({
                                            fournitureId: f.fourniture.id,
                                            paye: f.paye,
                                        });
                                        setIsModalVisible(true);
                                    }}
                                />
                                <DeleteButton
                                    resource="eleve-fournitures"
                                    recordItemId={f.id}
                                    size="small"
                                    hideText
                                    onSuccess={() =>
                                        setLocalRecord((prev) =>
                                            prev
                                                ? {
                                                    ...prev,
                                                    fournitures: prev.fournitures.filter((el) => el.id !== f.id),
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

            <Modal
                title={editingItem ? "Modifier une fourniture" : "Ajouter une fourniture"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingItem(null);
                }}
                onOk={editingItem ? handleEdit : handleAdd}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="fournitureId" label="Fourniture" rules={[{ required: true }]}>
                        <Select
                            options={options.map((f) => ({
                                label: f.nom,
                                value: f.id,
                            }))}
                            loading={isLoading}
                        />
                    </Form.Item>
                    <Form.Item name="paye" label="Payé" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} addonAfter="Ar" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
