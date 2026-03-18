import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    UtensilsCrossed,
    ClipboardList,
    Clock,
    DollarSign,
} from "lucide-react";
import { statsApi, type StatsAPI } from "../../services/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState<StatsAPI | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        statsApi
            .get()
            .then(setStats)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!stats) return <div className="text-white/40">Greška pri učitavanju.</div>;

    const cards = [
        {
            label: "Stavke u meniju",
            value: stats.totalMenuItems,
            icon: UtensilsCrossed,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            label: "Ukupno porudžbina",
            value: stats.totalOrders,
            icon: ClipboardList,
            color: "text-green-400",
            bg: "bg-green-500/10",
        },
        {
            label: "Na čekanju",
            value: stats.pendingOrders,
            icon: Clock,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
        },
        {
            label: "Ukupan prihod",
            value: `${stats.totalRevenue.toLocaleString("sr-RS")} RSD`,
            icon: DollarSign,
            color: "text-[var(--color-primary)]",
            bg: "bg-[var(--color-primary)]/10",
        },
    ];

    const statusLabels: Record<string, { label: string; color: string }> = {
        pending: { label: "Na čekanju", color: "bg-yellow-500/20 text-yellow-400" },
        preparing: { label: "Priprema", color: "bg-blue-500/20 text-blue-400" },
        ready: { label: "Spremno", color: "bg-green-500/20 text-green-400" },
        delivered: { label: "Dostavljeno", color: "bg-white/10 text-white/60" },
        cancelled: { label: "Otkazano", color: "bg-red-500/20 text-red-400" },
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                <p className="text-white/40 text-sm mt-1">
                    Pregled poslovanja i statistike
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 rounded-2xl bg-[var(--color-dark-light)] border border-white/5"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}
                            >
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{card.value}</div>
                                <div className="text-white/40 text-sm">{card.label}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Category breakdown */}
                <div className="p-6 rounded-2xl bg-[var(--color-dark-light)] border border-white/5">
                    <h2 className="text-lg font-bold mb-4">Kategorije</h2>
                    <div className="space-y-3">
                        {stats.categoryStats.map((cat) => {
                            const labels: Record<string, string> = {
                                burger: "Burgeri",
                                sandwich: "Sendviči",
                                sides: "Prilozi",
                                drinks: "Piće",
                            };
                            const pct = Math.round(
                                (cat.count / stats.totalMenuItems) * 100
                            );
                            return (
                                <div key={cat.category}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-white/70">
                                            {labels[cat.category] || cat.category}
                                        </span>
                                        <span className="text-white/40">
                                            {cat.count} ({pct}%)
                                        </span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent orders */}
                <div className="p-6 rounded-2xl bg-[var(--color-dark-light)] border border-white/5">
                    <h2 className="text-lg font-bold mb-4">Poslednje porudžbine</h2>
                    {stats.recentOrders.length === 0 ? (
                        <p className="text-white/30 text-sm">Nema porudžbina.</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                                >
                                    <div>
                                        <div className="text-sm font-medium">
                                            Porudžbina #{order.id}
                                        </div>
                                        <div className="text-xs text-white/40">
                                            {order.customer_name || "Anonimno"} ·{" "}
                                            {new Date(order.created_at).toLocaleDateString("sr-RS")}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-2 py-1 rounded-lg text-xs font-medium ${statusLabels[order.status]?.color || ""
                                                }`}
                                        >
                                            {statusLabels[order.status]?.label || order.status}
                                        </span>
                                        <span className="text-sm font-medium text-[var(--color-primary)]">
                                            {order.total.toLocaleString("sr-RS")} RSD
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
