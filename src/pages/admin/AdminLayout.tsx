import { Navigate, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    UtensilsCrossed,
    ClipboardList,
    LogOut,
    Flame,
    Menu,
    X,
    Bell,
    ShoppingBag,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useOrderNotifications } from "../../hooks/useOrderNotifications";
import NotificationToasts from "../../components/NotificationToasts";

const sidebarLinks = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/menu", label: "Meni", icon: UtensilsCrossed, end: false },
    { to: "/admin/orders", label: "Porudžbine", icon: ClipboardList, end: false },
];

export default function AdminLayout() {
    const { user, isLoading, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRefMobile = useRef<HTMLDivElement>(null);
    const notifRefDesktop = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, dismiss, clearAll, markAllRead } =
        useOrderNotifications();

    // Close notification panel on click outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const target = e.target as Node;
            const insideMobile = notifRefMobile.current?.contains(target);
            const insideDesktop = notifRefDesktop.current?.contains(target);
            if (!insideMobile && !insideDesktop) {
                setNotifOpen(false);
            }
        }
        if (notifOpen) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [notifOpen]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark)]">
                <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return <Navigate to="/admin/login" replace />;

    const isActive = (path: string, end: boolean) => {
        if (end) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const sidebar = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
                <Link to="/" className="flex items-center gap-2">
                    <Flame className="w-6 h-6 text-[var(--color-primary)]" />
                    <span className="text-lg font-extrabold tracking-tight">
                        S<span className="text-[var(--color-primary)]">M</span>ASH
                    </span>
                    <span className="text-xs bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-0.5 rounded-full font-medium ml-1">
                        Admin
                    </span>
                </Link>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-4 space-y-1">
                {sidebarLinks.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.to, link.end)
                            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                        {link.to === "/admin/orders" && unreadCount > 0 && (
                            <span className="ml-auto bg-[var(--color-primary)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* User / Logout */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{user.username}</div>
                        <div className="text-xs text-white/30">{user.role}</div>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/5 transition-all w-full cursor-pointer"
                >
                    <LogOut className="w-5 h-5" />
                    Odjavi se
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--color-dark)] flex">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-64 bg-[var(--color-dark-light)] border-r border-white/5 fixed top-0 left-0 h-full">
                {sidebar}
            </aside>

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <aside
                className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-[var(--color-dark-light)] border-r border-white/5 z-50 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {sidebar}
            </aside>

            {/* Main content */}
            <div className="flex-1 lg:ml-64">
                {/* Mobile header */}
                <header className="lg:hidden sticky top-0 z-30 bg-[var(--color-dark)]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <span className="text-sm font-semibold flex-1">Admin Panel</span>

                    {/* Mobile notification bell */}
                    <div ref={notifRefMobile} className="relative">
                        <button
                            onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}
                            className="relative p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-[var(--color-primary)] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification dropdown */}
                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-[var(--color-dark-light)] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                                >
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                                        <span className="text-sm font-semibold">Obaveštenja</span>
                                        {notifications.length > 0 && (
                                            <button onClick={clearAll} className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                                                Obriši sve
                                            </button>
                                        )}
                                    </div>
                                    <div className="overflow-y-auto max-h-72">
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-8 text-center text-white/30 text-sm">
                                                Nema obaveštenja
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                                    onClick={() => { navigate("/admin/orders"); setNotifOpen(false); }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-white/90">Nova porudžbina</p>
                                                            <p className="text-xs text-white/50 mt-0.5">
                                                                {n.customer_name} &middot; #{n.tracking_code}
                                                            </p>
                                                            <p className="text-xs text-[var(--color-primary)] font-semibold mt-0.5">
                                                                {n.total.toLocaleString("sr-RS")} RSD
                                                            </p>
                                                        </div>
                                                        <span className="text-[10px] text-white/30 flex-shrink-0">
                                                            {new Date(n.receivedAt).toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                {/* Desktop top bar with notifications */}
                <header className="hidden lg:flex sticky top-0 z-30 bg-[var(--color-dark)]/95 backdrop-blur-xl border-b border-white/5 px-8 py-3 items-center justify-end">
                    <div ref={notifRefDesktop} className="relative">
                        <button
                            onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}
                            className="relative p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-[var(--color-primary)] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification dropdown */}
                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-[var(--color-dark-light)] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                                >
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                                        <span className="text-sm font-semibold">Obaveštenja</span>
                                        {notifications.length > 0 && (
                                            <button onClick={clearAll} className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                                                Obriši sve
                                            </button>
                                        )}
                                    </div>
                                    <div className="overflow-y-auto max-h-72">
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-8 text-center text-white/30 text-sm">
                                                Nema obaveštenja
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                                    onClick={() => { navigate("/admin/orders"); setNotifOpen(false); }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-white/90">Nova porudžbina</p>
                                                            <p className="text-xs text-white/50 mt-0.5">
                                                                {n.customer_name} &middot; #{n.tracking_code}
                                                            </p>
                                                            <p className="text-xs text-[var(--color-primary)] font-semibold mt-0.5">
                                                                {n.total.toLocaleString("sr-RS")} RSD
                                                            </p>
                                                        </div>
                                                        <span className="text-[10px] text-white/30 flex-shrink-0">
                                                            {new Date(n.receivedAt).toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                <main className="p-4 md:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Notification toasts */}
            <NotificationToasts notifications={notifications} onDismiss={dismiss} />
        </div>
    );
}
