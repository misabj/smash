import { Link } from "react-router-dom";
import { Flame, Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[var(--color-dark-light)] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <Flame className="w-6 h-6 text-[var(--color-primary)]" />
                            <span className="text-xl font-extrabold tracking-tight">
                                S<span className="text-[var(--color-primary)]">M</span>ASH
                            </span>
                        </Link>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Premium smash burgers & sendviči. Svež ukus, iskrena hrana.
                        </p>
                        <div className="flex gap-3 mt-5">
                            <a
                                href="#"
                                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[var(--color-primary)]/20 flex items-center justify-center transition-colors"
                            >
                                <Instagram className="w-4 h-4 text-white/50" />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[var(--color-primary)]/20 flex items-center justify-center transition-colors"
                            >
                                <Facebook className="w-4 h-4 text-white/50" />
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">
                            Navigacija
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { to: "/", label: "Početna" },
                                { to: "/menu", label: "Meni" },
                                { to: "/about", label: "O nama" },
                                { to: "/contact", label: "Kontakt" },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-white/40 hover:text-[var(--color-primary)] text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Working hours */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">
                            Radno vreme
                        </h4>
                        <ul className="space-y-3 text-white/40 text-sm">
                            <li className="flex justify-between">
                                <span>Pon — Pet</span>
                                <span className="text-white/60">10:00 — 23:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Subota</span>
                                <span className="text-white/60">11:00 — 00:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Nedelja</span>
                                <span className="text-white/60">12:00 — 22:00</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">
                            Kontakt
                        </h4>
                        <ul className="space-y-3 text-white/40 text-sm">
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                                Knez Mihailova 15, Beograd
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                                +381 11 123 4567
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[var(--color-primary)]" />
                                info@smashburger.rs
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/30 text-xs">
                        © 2026 SMASH. Sva prava zadržana.
                    </p>
                    <p className="text-white/20 text-xs">
                        Made with 🔥 in Belgrade
                    </p>
                </div>
            </div>
        </footer>
    );
}
