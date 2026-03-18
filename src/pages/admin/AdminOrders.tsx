import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Copy, Check, Clock, X } from "lucide-react";
import { ordersApi, type OrderAPI } from "../../services/api";

const statusConfig: Record<
    string,
    { label: string; color: string; next?: string; nextLabel?: string }
> = {
    pending: {
        label: "Na čekanju",
        color: "bg-yellow-500/20 text-yellow-400",
        next: "preparing",
        nextLabel: "Pripremi",
    },
    preparing: {
        label: "Priprema",
        color: "bg-blue-500/20 text-blue-400",
        next: "ready",
        nextLabel: "Spremno",
    },
    ready: {
        label: "Spremno",
        color: "bg-green-500/20 text-green-400",
        next: "delivered",
        nextLabel: "Dostavljeno",
    },
    delivered: {
        label: "Dostavljeno",
        color: "bg-white/10 text-white/50",
    },
    cancelled: {
        label: "Otkazano",
        color: "bg-red-500/20 text-red-400",
    },
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<OrderAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [prepModal, setPrepModal] = useState<{ orderId: number } | null>(null);
    const [prepMinutes, setPrepMinutes] = useState("15");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        ordersApi
            .getAll()
            .then(setOrders)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const updateStatus = async (id: number, status: string, prepMins?: number) => {
        try {
            setSubmitting(true);
            const updated = await ordersApi.updateStatus(id, status, prepMins);
            setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleNextStatus = (orderId: number, nextStatus: string, currentStatus: string) => {
        if (nextStatus === "preparing" && currentStatus === "pending") {
            setPrepMinutes("15");
            setPrepModal({ orderId });
        } else {
            updateStatus(orderId, nextStatus);
        }
    };

    const handleConfirmPrep = async () => {
        if (!prepModal) return;
        const mins = Number(prepMinutes);
        if (!mins || mins < 1 || mins > 180) {
            alert("Unesite vreme pripreme između 1 i 180 minuta.");
            return;
        }
        await updateStatus(prepModal.orderId, "preparing", mins);
        setPrepModal(null);
    };

    const filtered =
        filterStatus === "all"
            ? orders
            : orders.filter((o) => o.status === filterStatus);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">Porudžbine</h1>
                <p className="text-white/40 text-sm mt-1">
                    {orders.length} porudžbina ukupno
                </p>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { id: "all", label: "Sve" },
                    { id: "pending", label: "Na čekanju" },
                    { id: "preparing", label: "Priprema" },
                    { id: "ready", label: "Spremno" },
                    { id: "delivered", label: "Dostavljeno" },
                    { id: "cancelled", label: "Otkazano" },
                ].map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setFilterStatus(s.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${filterStatus === s.id
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-white/5 text-white/50 hover:bg-white/10"
                            }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Orders list */}
            <div className="space-y-4">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-white/30 text-sm">
                        Nema porudžbina.
                    </div>
                ) : (
                    filtered.map((order, i) => {
                        const cfg = statusConfig[order.status] || statusConfig.pending;
                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-5 rounded-2xl bg-[var(--color-dark-light)] border border-white/5"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold">#{order.id}</span>
                                            <TrackingBadge code={order.tracking_code} />
                                            <span
                                                className={`px-2 py-1 rounded-lg text-xs font-medium ${cfg.color}`}
                                            >
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <div className="text-sm text-white/40 mt-1">
                                            {order.customer_name || "Anonimno"}
                                            {order.customer_phone && ` · ${order.customer_phone}`}
                                            {" · "}
                                            {new Date(order.created_at).toLocaleString("sr-RS")}
                                        </div>
                                        {(order.delivery_address || order.customer_email) && (
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                                {order.delivery_address && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-white/50">
                                                        <MapPin className="w-3 h-3 text-[var(--color-primary)]" />
                                                        {order.delivery_address}
                                                    </span>
                                                )}
                                                {order.customer_email && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-white/50">
                                                        <Mail className="w-3 h-3 text-[var(--color-primary)]" />
                                                        {order.customer_email}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {order.estimated_delivery_at && order.status !== "delivered" && order.status !== "cancelled" && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <Clock className="w-3 h-3 text-green-400" />
                                                <span className="text-xs text-green-400 font-medium">
                                                    Očekivana dostava: {new Date(order.estimated_delivery_at).toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {cfg.next && (
                                            <button
                                                onClick={() => handleNextStatus(order.id, cfg.next!, order.status)}
                                                className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                                            >
                                                {cfg.nextLabel}
                                            </button>
                                        )}
                                        {order.status !== "cancelled" &&
                                            order.status !== "delivered" && (
                                                <button
                                                    onClick={() => updateStatus(order.id, "cancelled")}
                                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                                                >
                                                    Otkaži
                                                </button>
                                            )}
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-2">
                                    {order.items.map((item, j) => (
                                        <div
                                            key={j}
                                            className="flex items-center justify-between py-2 border-t border-white/5 first:border-0"
                                        >
                                            <span className="text-sm text-white/70">
                                                {item.quantity}× {item.name}
                                            </span>
                                            <span className="text-sm text-white/50">
                                                {(item.price * item.quantity).toLocaleString("sr-RS")}{" "}
                                                RSD
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 pt-3 border-t border-white/5 flex justify-end">
                                    <span className="font-bold text-[var(--color-primary)]">
                                        Ukupno: {order.total.toLocaleString("sr-RS")} RSD
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Prep time modal */}
            <AnimatePresence>
                {prepModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPrepModal(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        >
                            <div className="bg-[var(--color-dark-light)] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-lg font-bold">Vreme pripreme</h3>
                                    <button
                                        onClick={() => setPrepModal(null)}
                                        className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className="text-white/50 text-sm mb-4">
                                    Unesite koliko minuta je potrebno za pripremu. Na to će se automatski dodati ~15 min za dostavu.
                                </p>

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-white/70 mb-1.5 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                        Priprema (minuta)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="180"
                                        value={prepMinutes}
                                        onChange={(e) => setPrepMinutes(e.target.value)}
                                        className="w-full px-4 py-3 bg-[var(--color-dark)] border border-white/10 rounded-xl text-white text-center text-lg font-bold focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                    />
                                </div>

                                <div className="flex gap-2 items-center justify-between p-3 rounded-xl bg-white/5 mb-5">
                                    <div className="text-sm text-white/50">
                                        <span>Priprema: <strong className="text-white">{prepMinutes || 0} min</strong></span>
                                        <span className="mx-2">+</span>
                                        <span>Dostava: <strong className="text-white">~15 min</strong></span>
                                    </div>
                                    <div className="text-sm font-bold text-[var(--color-primary)]">
                                        ≈ {(Number(prepMinutes) || 0) + 15} min
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setPrepModal(null)}
                                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/70 font-medium rounded-xl transition-colors cursor-pointer"
                                    >
                                        Otkaži
                                    </button>
                                    <button
                                        onClick={handleConfirmPrep}
                                        disabled={submitting}
                                        className="flex-1 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            "Potvrdi"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function TrackingBadge({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);
    if (!code) return null;
    return (
        <button
            onClick={() => {
                navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-xs text-white/50 hover:text-white/70 transition-colors cursor-pointer"
            title="Kopiraj kod za praćenje"
        >
            {code}
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
        </button>
    );
}
