import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "../context/LanguageContext";
import type { Lang } from "../i18n/translations";

const langs: { code: Lang; label: string; flag: string }[] = [
    { code: "sr", label: "Srpski", flag: "🇷🇸" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export default function LanguageSwitcher() {
    const { lang, setLang } = useT();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const current = langs.find((l) => l.code === lang)!;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-sm"
            >
                <Globe className="w-4 h-4 text-white/60" />
                <span className="text-xs">{current.flag}</span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden min-w-[140px] z-50"
                    >
                        {langs.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => {
                                    setLang(l.code);
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors cursor-pointer ${lang === l.code
                                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                        : "text-white/70 hover:bg-white/5"
                                    }`}
                            >
                                <span>{l.flag}</span>
                                <span>{l.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
