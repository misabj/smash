import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import type { OrderNotification } from "../hooks/useOrderNotifications";

interface Props {
    notifications: OrderNotification[];
    onDismiss: (id: number) => void;
}

export default function NotificationToasts({ notifications, onDismiss }: Props) {
    // Show only the 3 most recent (within last 15 seconds)
    const recent = notifications
        .filter((n) => Date.now() - n.receivedAt < 15_000)
        .slice(0, 3);

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            <AnimatePresence>
                {recent.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 100, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="pointer-events-auto bg-[var(--color-dark-light)] border border-[var(--color-primary)]/30 rounded-2xl p-4 shadow-2xl shadow-[var(--color-primary)]/10"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                                <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-bold text-white">Nova porudžbina!</p>
                                    <button
                                        onClick={() => onDismiss(n.id)}
                                        className="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
                                    >
                                        <X className="w-3.5 h-3.5 text-white/40" />
                                    </button>
                                </div>
                                <p className="text-xs text-white/50 mt-0.5">
                                    {n.customer_name || "Kupac"} · #{n.tracking_code}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                    <p className="text-xs text-white/40">
                                        {n.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                                    </p>
                                    <span className="text-sm font-bold text-[var(--color-primary)] ml-2 flex-shrink-0">
                                        {n.total.toLocaleString("sr-RS")} RSD
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Auto-dismiss progress bar */}
                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: 15, ease: "linear" }}
                            className="h-0.5 bg-[var(--color-primary)]/40 rounded-full mt-3 origin-left"
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
