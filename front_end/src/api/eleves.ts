import { fetchWithToken } from "../utils/fetchWithToken";
import { Eleve } from "../utils/types";

export const getEleves = async (): Promise<{ data: Eleve[]; total: number }> => {
    const response = await fetchWithToken("/eleves");
    return response.json();
};
