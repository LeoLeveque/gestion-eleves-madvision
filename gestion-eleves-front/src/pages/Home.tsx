import {Typography, Space, Button, Card} from "antd";
import {useGo, useLogout} from "@refinedev/core";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const Home = () => {

    const { mutate: logout } = useLogout();

    const go = useGo();

    return (
        <div style={{ padding: 32, position: "relative" }}>
            {/* Bouton Profil en haut à droite */}
            <div style={{ position: "absolute", top: 32, right: 32, display: "flex", gap: 12 }}>
                <Button
                    type="default"
                    icon={<UserOutlined />}
                    onClick={() => go({ to: "/profil", type: "push" })}
                >
                    Mon profil
                </Button>
                <Button
                    type="primary"
                    danger
                    onClick={() => logout()}
                >
                    Déconnexion
                </Button>
            </div>

            <Title level={2}>Bienvenue</Title>

            <Space direction="vertical" size="large" style={{ width: "100%", marginTop: 32 }}>
                <Card
                    hoverable
                    title="Liste des élèves"
                    onClick={() => go({ to: "/eleves", type: "push" })}
                >
                    Gérer les élèves, leurs reçus, modules, fournitures...
                </Card>

                <Card
                    hoverable
                    title="Liste des modules"
                    onClick={() => go({ to: "/modules", type: "push" })}
                >
                    Gérer les modules disponibles.
                </Card>

                <Card
                    hoverable
                    title="Liste des fournitures"
                    onClick={() => go({ to: "/fournitures", type: "push" })}
                >
                    Gérer les fournitures proposées.
                </Card>

                <Card
                    hoverable
                    title="Liste des filières"
                    onClick={() => go({ to: "/filieres", type: "push" })}
                >
                    Gérer les filières existantes.
                </Card>

                <Card
                    hoverable
                    title="Liste des utilisateurs"
                    onClick={() => go({ to: "/utilisateurs", type: "push" })}
                >
                    Gérer les utilisateurs.
                </Card>
            </Space>
        </div>
    );
};
