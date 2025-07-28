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
import type { EleveType, ModuleSuiviType, Module } from "./types";

type Props = {
    localRecord: EleveType;
    setLocalRecord: React.Dispatch<React.SetStateAction<EleveType | null>>;
};

export const ModuleSection: React.FC<Props> = ({ localRecord, setLocalRecord }) => {
    const { queryResult } = useShow<EleveType>();
    const refetch = queryResult?.refetch;

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingModule, setEditingModule] = useState<ModuleSuiviType | null>(null);

    const { data: modulesData, isLoading } = useList<Module>({
        resource: "modules",
    });

    const modulesOptions = modulesData?.data ?? [];

    const { mutate: create } = useCreate<ModuleSuiviType>();
    const { mutate: update } = useUpdate();

    const handleAdd = async () => {
        const values = await form.validateFields();
        create(
            {
                resource: "eleve-modules",
                values: { ...values, eleveId: localRecord.id },
                successNotification: () => ({ message: "Module ajouté", type: "success" }),
            },
            {
                onSuccess: () => {
                    form.resetFields();
                    setIsModalVisible(false);
                    setEditingModule(null);
                    refetch?.();
                },
            }
        );
    };

    const handleEdit = async () => {
        const values = await form.validateFields();
        if (!editingModule) return;

        update(
            {
                resource: "eleve-modules",
                id: editingModule.id,
                values,
                successNotification: () => ({ message: "Module modifié", type: "success" }),
            },
            {
                onSuccess: () => {
                    form.resetFields();
                    setIsModalVisible(false);
                    setEditingModule(null);
                    refetch?.();
                },
            }
        );
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
                <h4>Modules suivis</h4>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    Ajouter
                </Button>
            </div>

            <Table
                dataSource={localRecord.modules}
                rowKey="id"
                pagination={false}
                columns={[
                    { title: "Module", dataIndex: ["module", "nom"] },
                    { title: "Prix", dataIndex: ["module", "prix"], render: (p) => `${p} Ar` },
                    { title: "Payé", dataIndex: "paye", render: (p) => `${p} Ar` },
                    {
                        title: "Actions",
                        render: (_, module) => (
                            <Space>
                                <EditButton
                                    size="small"
                                    hideText
                                    onClick={() => {
                                        setEditingModule(module);
                                        form.setFieldsValue({
                                            moduleId: module.module.id,
                                            paye: module.paye,
                                        });
                                        setIsModalVisible(true);
                                    }}
                                />
                                <DeleteButton
                                    resource="eleve-modules"
                                    recordItemId={module.id}
                                    size="small"
                                    hideText
                                    onSuccess={() =>
                                        setLocalRecord((prev) =>
                                            prev
                                                ? {
                                                    ...prev,
                                                    modules: prev.modules.filter((m) => m.id !== module.id),
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
                title={editingModule ? "Modifier un module" : "Ajouter un module"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingModule(null);
                }}
                onOk={editingModule ? handleEdit : handleAdd}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="moduleId" label="Module" rules={[{ required: true }]}>
                        <Select
                            options={modulesOptions.map((m) => ({
                                label: m.nom,
                                value: m.id,
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
