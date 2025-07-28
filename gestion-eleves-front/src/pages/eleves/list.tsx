import React, { useState, useRef } from "react";
import {
    List,
    useTable,
    ShowButton,
    DeleteButton,
    CreateButton,
} from "@refinedev/antd";
import {
    Table,
    Space,
    Input,
    Button,
    Dropdown,
    Checkbox,
} from "antd";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGo } from "@refinedev/core";
import { exportCsv } from "../../api/export";
import {importCsv} from "../../api/import";

const ALL_COLUMNS = [
    { key: "id", title: "ID", sorter: true },
    { key: "nomPrenom", title: "Nom Prénom", sorter: true },
    { key: "telephone", title: "Téléphone" },
    { key: "adresse", title: "Adresse" },
    { key: "typeCours", title: "Type de cours", sorter: true },
    { key: "sommeDue", title: "Somme Due", sorter: true },
];

export const ElevesList: React.FC = () => {
    const go = useGo();
    const { tableProps, setFilters } = useTable({
        resource: "eleves",
        initialSorter: [{ field: "id", order: "asc" }],
    });

    const [columns, setColumns] = useState(ALL_COLUMNS);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const confirm = window.confirm(
            "⚠️ Attention : Si un élève présent dans le fichier existe déjà, ses données (modules, fournitures, reçus) seront entièrement remplacées. Continuer l'import ?"
        );

        if (!confirm) {
            e.target.value = "";
            return;
        }

        try {
            await importCsv(file);
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'import.");
        } finally {
            e.target.value = "";
        }
    };


    const menuItems: MenuProps["items"] = ALL_COLUMNS.map((col) => ({
        key: col.key,
        label: (
            <Checkbox
                checked={columns.some((c) => c.key === col.key)}
                onChange={(e) => {
                    if (e.target.checked) {
                        setColumns((prev) => [...prev, col]);
                    } else {
                        setColumns((prev) =>
                            prev.filter((c) => c.key !== col.key)
                        );
                    }
                }}
            >
                {col.title}
            </Checkbox>
        ),
    }));

    const columnsConfig = columns.map((col) => ({
        dataIndex: col.key,
        title: col.title,
        key: col.key,
        sorter: !!col.sorter,
        render:
            col.key === "sommeDue"
                ? (value: number) => `${value} Ar`
                : undefined,
    }));

    (columnsConfig as ColumnsType<any>).push({
        title: "Actions",
        key: "actions",
        render: (_: any, record: any) => (
            <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
        ),
    });

    return (
        <div>
            <Button onClick={() => go({ to: "/", type: "push" })}>
                Accueil
            </Button>

            <List
                title="Liste des élèves"
                headerButtons={() => (
                    <Space style={{ marginBottom: 16 }}>
                        <Input.Search
                            placeholder="Recherche par nom"
                            onSearch={(value) =>
                                setFilters(
                                    [
                                        {
                                            field: "nomPrenom",
                                            operator: "contains",
                                            value,
                                        },
                                    ],
                                    "replace"
                                )
                            }
                            style={{ width: 300 }}
                        />
                        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                            <Button>Colonnes</Button>
                        </Dropdown>
                        <CreateButton resource="eleves">Créer un élève</CreateButton>
                        <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />

                        <Button onClick={handleImportClick}>Importer CSV</Button>
                        <Button onClick={exportCsv}>Exporter CSV</Button>

                    </Space>
                )}
            >
                <Table
                    {...tableProps}
                    dataSource={tableProps.dataSource ?? []}
                    pagination={{ ...tableProps.pagination}}
                    rowKey="id"
                    columns={columnsConfig}
                />
            </List>
        </div>
    );
};
