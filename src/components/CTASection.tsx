import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useT } from "../context/LanguageContext";

export default function CTASection() {
    const { t } = useT();

    return (
        <section className="py-20 md:py-28 px-4 relative overflow-hidden">
            {/* BG glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-primary)]/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-3xl mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-black mb-6"
                >
                    {t("cta_title1")}{" "}
                    <span className="text-[var(--color-primary)]">{t("cta_title2")}</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-white/50 text-lg mb-10 max-w-lg mx-auto"
                >
                    {t("cta_subtitle")}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        to="/menu"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-[var(--color-primary)]/40 group"
                    >
                        {t("cta_button")}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
