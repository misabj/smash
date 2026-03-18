import { motion } from "framer-motion";
import { Clock, Leaf, Award, Truck } from "lucide-react";

const features = [
    {
        icon: Leaf,
        title: "Sveži sastojci",
        description: "Svakog dana nabavljamo najsvežije lokalne namirnice.",
    },
    {
        icon: Award,
        title: "Autorski recepti",
        description: "Jedinstveni ukusi koje nećete naći nigde drugde.",
    },
    {
        icon: Clock,
        title: "Brza priprema",
        description: "Vaš burger je spreman za manje od 10 minuta.",
    },
    {
        icon: Truck,
        title: "Brza dostava",
        description: "Dostavljamo na vašu adresu za manje od 30 minuta.",
    },
];

export default function Features() {
    return (
        <section className="py-20 md:py-28 px-4 bg-[var(--color-dark-light)]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-[var(--color-primary)] text-sm font-semibold uppercase tracking-[0.2em]"
                    >
                        Zašto mi
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black mt-3"
                    >
                        Ne samo burger —<br />
                        <span className="text-[var(--color-primary)]">iskustvo</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="group p-6 rounded-2xl bg-[var(--color-dark)] border border-white/5 hover:border-[var(--color-primary)]/20 transition-all duration-500 text-center"
                        >
                            <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                                <feature.icon className="w-6 h-6 text-[var(--color-primary)]" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                            <p className="text-white/50 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
