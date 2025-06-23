import {getToken} from "./auth";

const API_URL = "http://localhost:3000";

export const fetchWithToken = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    if (!token) throw new Error("Aucun token trouvé.");

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Erreur API: ${response.statusText}`);
    }

    return response;
};
