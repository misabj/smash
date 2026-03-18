import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <main className="pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[var(--color-primary)] text-sm font-semibold uppercase tracking-[0.2em]"
                    >
                        Kontakt
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black mt-3 mb-4"
                    >
                        Javite nam se
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-md mx-auto"
                    >
                        Imate pitanje, sugestiju ili želite da rezervišete sto? Tu smo za vas.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        {[
                            {
                                icon: MapPin,
                                title: "Adresa",
                                details: ["Knez Mihailova 15", "11000 Beograd, Srbija"],
                            },
                            {
                                icon: Phone,
                                title: "Telefon",
                                details: ["+381 11 123 4567", "+381 63 987 6543"],
                            },
                            {
                                icon: Mail,
                                title: "Email",
                                details: ["info@smashburger.rs", "porudzbine@smashburger.rs"],
                            },
                            {
                                icon: Clock,
                                title: "Radno vreme",
                                details: [
                                    "Pon — Pet: 10:00 — 23:00",
                                    "Sub: 11:00 — 00:00",
                                    "Ned: 12:00 — 22:00",
                                ],
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="flex gap-4 p-5 rounded-2xl bg-[var(--color-dark-light)] border border-white/5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-5 h-5 text-[var(--color-primary)]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">{item.title}</h3>
                                    {item.details.map((detail) => (
                                        <p key={detail} className="text-white/50 text-sm">
                                            {detail}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Map placeholder */}
                        <div className="rounded-2xl overflow-hidden h-64 bg-[var(--color-dark-light)] border border-white/5 flex items-center justify-center">
                            <div className="text-center text-white/30">
                                <MapPin className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Knez Mihailova 15, Beograd</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-[var(--color-dark-light)] border border-[var(--color-primary)]/20"
                            >
                                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
                                    <Send className="w-7 h-7 text-[var(--color-primary)]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Poruka poslata!</h3>
                                <p className="text-white/50 mb-6">
                                    Hvala vam što ste nas kontaktirali. Odgovorićemo u najkraćem
                                    roku.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-[var(--color-primary)] font-medium hover:underline cursor-pointer"
                                >
                                    Pošalji novu poruku
                                </button>
                            </motion.div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5 p-8 rounded-2xl bg-[var(--color-dark-light)] border border-white/5"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2">
                                            Ime
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Vaše ime"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2">
                                            Prezime
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Vaše prezime"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="vas@email.com"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Telefon
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+381 ..."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Poruka
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="Vaša poruka..."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-xl transition-colors cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                    Pošalji poruku
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
