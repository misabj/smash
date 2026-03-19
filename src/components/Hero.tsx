import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useT } from "../context/LanguageContext";
import type { TranslationKey } from "../i18n/translations";

export default function Hero() {
    const { t } = useT();

    const stats: { value: string; labelKey: TranslationKey }[] = [
        { value: "50K+", labelKey: "hero_stat_happy" },
        { value: "4.9", labelKey: "hero_stat_rating" },
        { value: "15+", labelKey: "hero_stat_recipes" },
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=1920&h=1080&fit=crop"
                    alt=""
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a0a]" />
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-6"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[var(--color-primary)] font-medium backdrop-blur-sm">
                        <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
                        {t("hero_badge")}
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-6"
                >
                    {t("hero_title1")}
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-gold)] to-[var(--color-primary)]">
                        {t("hero_title2")}
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-10 leading-relaxed"
                >
                    {t("hero_subtitle")}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        to="/menu"
                        className="group flex items-center gap-2 px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-[var(--color-primary)]/40"
                    >
                        {t("hero_cta")}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/about"
                        className="flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/5"
                    >
                        {t("hero_story")}
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
                >
                    {stats.map((stat) => (
                        <div key={stat.labelKey} className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">
                                {stat.value}
                            </div>
                            <div className="text-xs text-white/40 mt-1">{t(stat.labelKey)}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <ChevronDown className="w-6 h-6 text-white/30" />
                </motion.div>
            </motion.div>
        </section>
    );
}
