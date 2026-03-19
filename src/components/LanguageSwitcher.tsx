import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "../context/LanguageContext";
import type { Lang } from "../i18n/translations";

function FlagSR({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
            <rect width="640" height="160" fill="#c6363c" />
            <rect y="160" width="640" height="160" fill="#0c4076" />
            <rect y="320" width="640" height="160" fill="#fff" />
        </svg>
    );
}

function FlagGB({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
            <rect width="640" height="480" fill="#012169" />
            <path d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 82 480H0v-60l239-178L0 64V0h75z" fill="#fff" />
            <path d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" fill="#C8102E" />
            <path d="M241 0v480h160V0H241zM0 160v160h640V160H0z" fill="#fff" />
            <path d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" fill="#C8102E" />
        </svg>
    );
}

function FlagRU({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
            <rect width="640" height="160" fill="#fff" />
            <rect y="160" width="640" height="160" fill="#0039A6" />
            <rect y="320" width="640" height="160" fill="#D52B1E" />
        </svg>
    );
}

const flagComponents: Record<Lang, React.FC<{ className?: string }>> = {
    sr: FlagSR,
    en: FlagGB,
    ru: FlagRU,
};

const langs: { code: Lang; label: string }[] = [
    { code: "sr", label: "Srpski" },
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
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
    const CurrentFlag = flagComponents[current.code];

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-sm"
            >
                <CurrentFlag className="w-6 h-4 rounded-sm object-cover" />
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
                        {langs.map((l) => {
                            const Flag = flagComponents[l.code];
                            return (
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
                                    <Flag className="w-6 h-4 rounded-sm" />
                                    <span>{l.label}</span>
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
