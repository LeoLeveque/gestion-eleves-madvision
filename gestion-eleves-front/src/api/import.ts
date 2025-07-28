import {API_URL} from "../dataProvider";

export const importCsv = async (file: File) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
        `${API_URL}/export-import/import/csv`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erreur lors de l'import : ${error}`);
    }

    return await response.json();
};
