import { Refine, Authenticated } from "@refinedev/core";
import type { I18nProvider } from "@refinedev/core";
import { useTranslation } from "react-i18next";

import routerProvider, { CatchAllNavigate } from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";

import { ElevesList } from "./pages/eleves/list";
import { ElevesCreate } from "./pages/eleves/create";
import { ElevesShow } from "./pages/eleves/show/show";
import { LoginPage } from "./pages/login";
import { ModulesList } from "./pages/modules/list";
import { FournituresList } from "./pages/fournitures/list";
import { FilieresList } from "./pages/filieres/list";
import {UtilisateursPage} from "./pages/utilisateurs/list";
import { Home } from "./pages/Home";

import { Profil } from "./pages/profil/profil";

export default function App() {
    const { t, i18n } = useTranslation();

    const i18nProvider: I18nProvider = {
        translate: (key: string, params?: Record<string, unknown>) => {
            return t(key, params) as string;
        },
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    return (
        <BrowserRouter>
            <Refine
                routerProvider={routerProvider}
                dataProvider={dataProvider}
                authProvider={authProvider}
                i18nProvider={i18nProvider}
                resources={[
                    {
                        name: "eleves",
                        list: "/eleves",
                        create: "/eleves/create",
                        show: "/eleves/show/:id",
                    },
                    {
                        name: "recus",
                    },
                    {
                        name: "modules",
                        list: "/modules",
                    },
                    {
                        name: "fournitures",
                        list: "/fournitures",
                    },
                    {
                        name: "filieres",
                        list: "/filieres",
                    },
                    {
                        name: "profil",
                    },
                    {
                        name: "admins",
                        list: "/utilisateurs",
                    }
                ]}
                options={{ syncWithLocation: true }}
            >
                <Routes>
                    <Route
                        element={
                            <Authenticated
                                key="authenticated"
                                v3LegacyAuthProviderCompatible={true}
                                fallback={<CatchAllNavigate to="/login" />}
                            >
                                <Outlet />
                            </Authenticated>
                        }
                    >
                        <Route index element={<Home />} />
                        <Route path="/eleves" element={<ElevesList />} />
                        <Route path="/eleves/create" element={<ElevesCreate />} />
                        <Route path="/eleves/show/:id" element={<ElevesShow />} />
                        <Route path="/modules" element={<ModulesList />} />
                        <Route path="/fournitures" element={<FournituresList />} />
                        <Route path="/filieres" element={<FilieresList />} />
                        <Route path="/profil" element={<Profil />} />
                        <Route path="/utilisateurs" element={<UtilisateursPage />} />
                    </Route>

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<CatchAllNavigate to="/" />} />
                </Routes>
            </Refine>
        </BrowserRouter>
    );
}