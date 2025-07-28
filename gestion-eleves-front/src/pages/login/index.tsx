import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form, Input, Button, Card } from "antd";
import {API_URL} from "../../dataProvider";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { nomPrenom: string; mdp: string }) => {
        setLoading(true);
        try {
            const res = await fetch(API_URL + "/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (e) {
            alert("Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
            <Card title="Connexion" style={{ width: 300 }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="nomPrenom" label="Nom Prénom" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="mdp" label="Mot de passe" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Se connecter
                    </Button>
                </Form>
            </Card>
        </div>
    );
};
