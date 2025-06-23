const API_URL = "http://localhost:3000";

interface LoginResponse {
    token: string;
}

export async function login(nomPrenom: string, mdp: string): Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nomPrenom, mdp }),
    });

    if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Erreur inconnue lors de la connexion");
    }

    return res.json();
}
