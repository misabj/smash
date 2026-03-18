import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Marko P.",
        text: "Najbolji burgeri u gradu, bez konkurencije! Classic Smash me vratio u detinjstvo.",
        rating: 5,
    },
    {
        name: "Ana S.",
        text: "Truffle Deluxe me oduševio. Kvalitet sastojaka se odmah oseti. Definitivno se vraćam!",
        rating: 5,
    },
    {
        name: "Stefan M.",
        text: "Brza dostava, savršeno spakovan burger. Loaded Fries su obavezni uz svaku porudžbinu.",
        rating: 5,
    },
];

export default function Testimonials() {
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
                        Utisci
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black mt-3"
                    >
                        Šta kažu naši gosti
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="p-6 rounded-2xl bg-[var(--color-dark-light)] border border-white/5 hover:border-[var(--color-primary)]/20 transition-all duration-300"
                        >
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: t.rating }).map((_, j) => (
                                    <Star
                                        key={j}
                                        className="w-4 h-4 fill-[var(--color-gold)] text-[var(--color-gold)]"
                                    />
                                ))}
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed mb-4 italic">
                                "{t.text}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
                                    {t.name.charAt(0)}
                                </div>
                                <span className="font-semibold text-sm">{t.name}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
