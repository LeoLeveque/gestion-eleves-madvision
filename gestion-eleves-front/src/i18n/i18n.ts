import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr/common.json";

i18n.use(initReactI18next).init({
    lng: "fr",
    resources: {
        fr: {
            translation: fr,
        }
    },
    supportedLngs: ["fr"],
    fallbackLng: ["fr"],
});

export default i18n;