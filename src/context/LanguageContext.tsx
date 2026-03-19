import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type Lang, type TranslationKey } from "../i18n/translations";

interface LanguageContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>(() => {
        const saved = localStorage.getItem("lang");
        return (saved === "en" || saved === "ru") ? saved : "sr";
    });

    const setLang = useCallback((newLang: Lang) => {
        setLangState(newLang);
        localStorage.setItem("lang", newLang);
    }, []);

    const t = useCallback(
        (key: TranslationKey): string => translations[lang][key] ?? key,
        [lang]
    );

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useT() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useT must be used within LanguageProvider");
    return ctx;
}
