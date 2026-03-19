import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Flame } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useT } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import type { TranslationKey } from "../i18n/translations";

const navLinks: { to: string; labelKey: TranslationKey }[] = [
    { to: "/", labelKey: "nav_home" },
    { to: "/menu", labelKey: "nav_menu" },
    { to: "/about", labelKey: "nav_about" },
    { to: "/contact", labelKey: "nav_contact" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { totalItems, setIsOpen } = useCart();
    const { t } = useT();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-[#0a0a0a]/95 backdrop-blur-xl shadow-lg shadow-black/20"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <Flame className="w-7 h-7 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
                        <span className="text-xl md:text-2xl font-extrabold tracking-tight">
                            S<span className="text-[var(--color-primary)]">M</span>ASH
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-[var(--color-primary)] ${location.pathname === link.to
                                    ? "text-[var(--color-primary)]"
                                    : "text-white/70"
                                    }`}
                            >
                                {t(link.labelKey)}
                            </Link>
                        ))}
                    </div>

                    {/* Cart + Mobile toggle */}
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <button
                            onClick={() => setIsOpen(true)}
                            className="relative p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full flex items-center justify-center"
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </button>

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#0a0a0a]/98 backdrop-blur-xl border-t border-white/5 overflow-hidden"
                    >
                        <div className="px-4 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`text-lg font-medium transition-colors ${location.pathname === link.to
                                        ? "text-[var(--color-primary)]"
                                        : "text-white/70"
                                        }`}
                                >
                                    {t(link.labelKey)}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
