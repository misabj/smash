import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { usePromotions } from "../context/PromotionsContext";
import { useT } from "../context/LanguageContext";
import type { TranslationKey } from "../i18n/translations";

const catKeys: Record<string, TranslationKey> = {
    burger: "promo_cat_burger",
    sandwich: "promo_cat_sandwich",
    sides: "promo_cat_sides",
    drinks: "promo_cat_drinks",
    all: "promo_cat_all",
};

export default function PromoBanner() {
    const { promotions } = usePromotions();
    const { t } = useT();

    if (promotions.length === 0) return null;

    return (
        <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <span className="inline-flex items-center gap-2 text-[var(--color-primary)] text-sm font-semibold uppercase tracking-widest mb-3">
                        <Tag className="w-4 h-4" />
                        {t("promo_banner_title")}
                    </span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promotions.map((promo, i) => (
                        <motion.div
                            key={promo.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 via-[var(--color-dark-light)] to-[var(--color-dark-light)] border border-[var(--color-primary)]/20 p-6 group hover:border-[var(--color-primary)]/40 transition-colors"
                        >
                            {/* Discount badge */}
                            <div className="absolute top-4 right-4 bg-[var(--color-primary)] text-white text-lg font-extrabold px-3 py-1 rounded-xl">
                                -{promo.discount_percent}%
                            </div>

                            <div className="pr-16">
                                <span className="inline-block px-2 py-0.5 bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                                    {t("promo_badge")}
                                </span>
                                <h3 className="text-xl font-bold mb-1">{promo.name}</h3>
                                {promo.description && (
                                    <p className="text-white/50 text-sm mb-3">{promo.description}</p>
                                )}
                                <p className="text-white/40 text-sm">
                                    {promo.discount_percent}% {t("promo_off")} {t("promo_on_category")}{" "}
                                    <span className="text-white/70 font-medium">
                                        {t(catKeys[promo.applicable_category] || "promo_cat_all")}
                                    </span>
                                </p>
                            </div>

                            <Link
                                to="/menu"
                                className="mt-4 inline-flex items-center gap-1 text-[var(--color-primary)] text-sm font-semibold hover:underline"
                            >
                                {t("promo_view_menu")} →
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
