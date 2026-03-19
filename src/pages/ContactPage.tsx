import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useT } from "../context/LanguageContext";
import type { TranslationKey } from "../i18n/translations";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const { t } = useT();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const contactInfo: { icon: typeof MapPin; titleKey: TranslationKey; details: string[] }[] = [
        {
            icon: MapPin,
            titleKey: "contact_address",
            details: ["Naselje Braće Jerković", "11223 Beograd, Srbija"],
        },
        {
            icon: Phone,
            titleKey: "contact_phone",
            details: ["+381 11 123 4567", "+381 63 987 6543"],
        },
        {
            icon: Mail,
            titleKey: "contact_email",
            details: ["info@smashburger.rs", "porudzbine@smashburger.rs"],
        },
        {
            icon: Clock,
            titleKey: "contact_hours",
            details: [
                `${t("footer_mon_fri")}: 10:00 — 23:00`,
                `${t("footer_sat")}: 11:00 — 00:00`,
                `${t("footer_sun")}: 12:00 — 22:00`,
            ],
        },
    ];

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
                        {t("contact_label")}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black mt-3 mb-4"
                    >
                        {t("contact_title")}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-md mx-auto"
                    >
                        {t("contact_subtitle")}
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
                        {contactInfo.map((item) => (
                            <div
                                key={item.titleKey}
                                className="flex gap-4 p-5 rounded-2xl bg-[var(--color-dark-light)] border border-white/5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-5 h-5 text-[var(--color-primary)]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">{t(item.titleKey)}</h3>
                                    {item.details.map((detail) => (
                                        <p key={detail} className="text-white/50 text-sm">
                                            {detail}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Google Maps */}
                        <div className="rounded-2xl overflow-hidden h-64 border border-white/5">
                            <iframe
                                title="Lokacija"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11323.177036903042!2d20.4750!3d44.7700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a706fa27f4c4b%3A0xa6e907e46cbb539e!2z0J3QsNGB0LXRmdC1INCR0YDQsNGb0LUg0IjQtdGA0LrQvtCy0LjRmw!5e0!3m2!1ssr!2srs!4v1710700000000!5m2!1ssr!2srs"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
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
                                <h3 className="text-2xl font-bold mb-2">{t("contact_form_sent")}</h3>
                                <p className="text-white/50 mb-6">
                                    {t("contact_form_sent_desc")}
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-[var(--color-primary)] font-medium hover:underline cursor-pointer"
                                >
                                    {t("contact_form_new")}
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
                                            {t("contact_form_name")}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder={t("contact_form_name_ph")}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2">
                                            {t("contact_form_surname")}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder={t("contact_form_surname_ph")}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        {t("contact_form_email")}
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
                                        {t("contact_form_phone")}
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+381 ..."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        {t("contact_form_message")}
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder={t("contact_form_message_ph")}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-xl transition-colors cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                    {t("contact_form_send")}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
