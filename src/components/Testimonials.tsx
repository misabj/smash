import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useT } from "../context/LanguageContext";
import type { TranslationKey } from "../i18n/translations";

const testimonialKeys: { nameKey: TranslationKey; textKey: TranslationKey; rating: number }[] = [
    { nameKey: "testimonial1_name", textKey: "testimonial1_text", rating: 5 },
    { nameKey: "testimonial2_name", textKey: "testimonial2_text", rating: 5 },
    { nameKey: "testimonial3_name", textKey: "testimonial3_text", rating: 5 },
];

export default function Testimonials() {
    const { t } = useT();

    return (
        <section className="py-20 md:py-28 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-[var(--color-primary)] text-sm font-semibold uppercase tracking-[0.2em]"
                    >
                        {t("testimonials_label")}
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black mt-3"
                    >
                        {t("testimonials_title")}
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonialKeys.map((item, i) => (
                        <motion.div
                            key={item.nameKey}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="p-6 rounded-2xl bg-[var(--color-dark-light)] border border-white/5 hover:border-[var(--color-primary)]/20 transition-all duration-300"
                        >
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: item.rating }).map((_, j) => (
                                    <Star
                                        key={j}
                                        className="w-4 h-4 fill-[var(--color-gold)] text-[var(--color-gold)]"
                                    />
                                ))}
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed mb-4 italic">
                                "{t(item.textKey)}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
                                    {t(item.nameKey).charAt(0)}
                                </div>
                                <span className="font-semibold text-sm">{t(item.nameKey)}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
