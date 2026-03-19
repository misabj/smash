import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMenuItems } from "../hooks/useMenuItems";
import { useT } from "../context/LanguageContext";
import MenuCard from "./MenuCard";

export default function FeaturedMenu() {
    const { items } = useMenuItems();
    const { t } = useT();
    const featured = items.filter((item) => item.popular).slice(0, 4);

    return (
        <section className="py-20 md:py-28 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-[var(--color-primary)] text-sm font-semibold uppercase tracking-[0.2em]"
                    >
                        {t("featured_label")}
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black mt-3 mb-4"
                    >
                        {t("featured_title")}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-md mx-auto"
                    >
                        {t("featured_subtitle")}
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featured.map((item, i) => (
                        <MenuCard key={item.id} item={item} index={i} />
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link
                        to="/menu"
                        className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-light)] font-semibold transition-colors group"
                    >
                        {t("featured_cta")}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
