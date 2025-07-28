import { useEffect, useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import type { EleveType } from "./types";

export function useEleveForm(record: any) {
    const [eleveForm] = Form.useForm();
    const [localRecord, setLocalRecord] = useState<EleveType | null>(null);

    useEffect(() => {
        if (record) {
            const eleve: EleveType = {
                ...record,
                dateNaissance: dayjs(record.dateNaissance),
                dateEntree: dayjs(record.dateEntree),
            };
            setLocalRecord(eleve);
            eleveForm.setFieldsValue(eleve);
        }
    }, [record]);

    return { localRecord, setLocalRecord, eleveForm };
}
