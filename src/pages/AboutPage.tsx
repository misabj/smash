import { motion } from "framer-motion";
import { Flame, Users, Heart, Award } from "lucide-react";

const stats = [
    { icon: Users, value: "50,000+", label: "Zadovoljnih gostiju" },
    { icon: Flame, value: "15+", label: "Autorskih recepata" },
    { icon: Heart, value: "4.9/5", label: "Prosečna ocena" },
    { icon: Award, value: "3", label: "Godine iskustva" },
];

export default function AboutPage() {
    return (
        <main className="pt-24 pb-20">
            {/* Hero */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1920&h=800&fit=crop"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a0a]" />
                <div className="relative z-10 text-center px-4">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[var(--color-primary)] text-sm font-semibold uppercase tracking-[0.2em]"
                    >
                        Naša priča
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black mt-3"
                    >
                        O nama
                    </motion.h1>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4">
                {/* Story */}
                <section className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[var(--color-primary)] text-sm font-semibold uppercase tracking-[0.2em]">
                            Kako je sve počelo
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black mt-3 mb-6">
                            Od strasti do{" "}
                            <span className="text-[var(--color-primary)]">savršenog</span>{" "}
                            burgera
                        </h2>
                        <div className="space-y-4 text-white/60 leading-relaxed">
                            <p>
                                SMASH je nastao iz jednostavne ideje — napraviti burger koji bi
                                svako poželeo da pojede ponovo. Krenuli smo od malog štanda na
                                lokalnoj pijaci, sa samo tri recepta i ogromnom željom da
                                napravimo nešto posebno.
                            </p>
                            <p>
                                Danas, posle tri godine, SMASH je prepoznatljiv brend u
                                Beogradu. Naši gosti znaju da kod nas dobijaju samo najsvežije
                                namirnice, ručno oblikovane patty-je i autorske soseve koji se
                                ne mogu naći nigde drugde.
                            </p>
                            <p>
                                Svaki burger je priča za sebe. Od klasičnog smash-a do premium
                                truffle varijante — svaki recept je rezultat meseci testiranja i
                                usavršavanja.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=500&fit=crop"
                            alt="Priprema burgera"
                            className="rounded-2xl w-full h-[400px] object-cover"
                        />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[var(--color-primary)] rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-3xl font-black">3+</span>
                            <span className="text-xs font-medium opacity-80">Godina</span>
                        </div>
                    </motion.div>
                </section>

                {/* Stats */}
                <section className="py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 rounded-2xl bg-[var(--color-dark-light)] border border-white/5"
                            >
                                <stat.icon className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-3" />
                                <div className="text-2xl md:text-3xl font-black">
                                    {stat.value}
                                </div>
                                <div className="text-white/40 text-sm mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Philosophy */}
                <section className="py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Kvalitet bez kompromisa",
                                description:
                                    "Biramo samo najbolje lokalne dobavljače. Svaki sastojak prolazi strogu kontrolu kvaliteta pre nego što završi u vašem burgeru.",
                                image:
                                    "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
                            },
                            {
                                title: "Tradicija & inovacija",
                                description:
                                    "Poštujemo klasične tehnike pripreme, ali uvek tražimo način da unesemo nešto novo i uzbudljivo u svaki zalogaj.",
                                image:
                                    "https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=400&h=300&fit=crop",
                            },
                            {
                                title: "Zajednica na prvom mestu",
                                description:
                                    "SMASH nije samo restoran — to je mesto gde se ljudi okupljaju, dele ukuse i stvaraju uspomene.",
                                image:
                                    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="rounded-2xl overflow-hidden bg-[var(--color-dark-light)] border border-white/5 group"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
