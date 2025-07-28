import { API_URL } from "../dataProvider";

export const exportCsv = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/export-import/export/csv`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "text/csv",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Échec de l'export CSV");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eleves.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};
