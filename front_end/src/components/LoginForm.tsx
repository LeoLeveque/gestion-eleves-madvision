import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { setToken } from "../utils/auth";

const LoginForm = () => {
    const [nomPrenom, setNomPrenom] = useState("");
    const [mdp, setMdp] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login(nomPrenom, mdp);
            setToken(res.token);
            navigate("/eleves");
        } catch (err: any) {
            setError(err.message || "Erreur lors de la connexion");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Nom Prénom"
                value={nomPrenom}
                onChange={e => setNomPrenom(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={mdp}
                onChange={e => setMdp(e.target.value)}
            />
            <button type="submit">Se connecter</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
};

export default LoginForm;
