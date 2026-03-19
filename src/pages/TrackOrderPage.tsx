import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, MapPin, Clock, CheckCircle, Truck, XCircle, Search, ArrowLeft, Timer } from "lucide-react";
import { ordersApi, type TrackingOrderAPI } from "../services/api";
import { useT } from "../context/LanguageContext";
import type { TranslationKey } from "../i18n/translations";

const statusStepKeys: { key: string; labelKey: TranslationKey; icon: typeof Clock; descKey: TranslationKey }[] = [
    { key: "pending", labelKey: "track_step_pending", icon: Clock, descKey: "track_step_pending_desc" },
    { key: "preparing", labelKey: "track_step_preparing", icon: Package, descKey: "track_step_preparing_desc" },
    { key: "ready", labelKey: "track_step_ready", icon: CheckCircle, descKey: "track_step_ready_desc" },
    { key: "delivered", labelKey: "track_step_delivered", icon: Truck, descKey: "track_step_delivered_desc" },
];

function getStepIndex(status: string): number {
    if (status === "cancelled") return -1;
    return statusStepKeys.findIndex((s) => s.key === status);
}

export default function TrackOrderPage() {
    const { code } = useParams<{ code: string }>();
    const { t } = useT();
    const [order, setOrder] = useState<TrackingOrderAPI | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchCode, setSearchCode] = useState(code || "");

    const formatPrice = (price: number) => `${price.toLocaleString("sr-RS")} RSD`;

    const fetchOrder = async (trackingCode: string) => {
        if (!trackingCode.trim()) return;
        setLoading(true);
        setError("");
        setOrder(null);
        try {
            const data = await ordersApi.track(trackingCode.trim());
            setOrder(data);
        } catch {
            setError(t("track_not_found"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (code) fetchOrder(code);
    }, [code]);

    const currentStep = order ? getStepIndex(order.status) : -1;
    const isCancelled = order?.status === "cancelled";

    return (
        <div className="min-h-screen bg-[var(--color-dark)] pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* Back link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> {t("track_back")}
                </Link>

                {/* Search bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("track_title")}</h1>
                    <p className="text-white/40 text-sm mb-6">
                        {t("track_subtitle")}
                    </p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            fetchOrder(searchCode);
                        }}
                        className="flex gap-3"
                    >
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                placeholder="SM-XXXXXXXX"
                                className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-dark-light)] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--color-primary)] transition-colors tracking-wider uppercase"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                t("track_search")
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-center"
                    >
                        <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                        <p className="text-red-400 font-medium">{error}</p>
                    </motion.div>
                )}

                {/* Order details */}
                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Header card */}
                        <div className="p-6 rounded-2xl bg-[var(--color-dark-light)] border border-white/5">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-white/40 text-xs uppercase tracking-wider">{t("track_order")}</p>
                                    <p className="text-xl font-bold text-[var(--color-primary)] tracking-wider mt-0.5">
                                        {order.tracking_code}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/40 text-xs">{t("track_created")}</p>
                                    <p className="text-sm text-white/70 mt-0.5">
                                        {new Date(order.created_at).toLocaleString("sr-RS")}
                                    </p>
                                </div>
                            </div>

                            {order.delivery_address && (
                                <div className="flex items-start gap-2 mt-4 pt-4 border-t border-white/5">
                                    <MapPin className="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-white/40 text-xs">{t("track_address")}</p>
                                        <p className="text-sm text-white/80 mt-0.5">{order.delivery_address}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Estimated delivery time */}
                        {order.estimated_delivery_at && !isCancelled && order.status !== "delivered" && (
                            <div className="p-5 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                                        <Timer className="w-6 h-6 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <p className="text-white/50 text-xs">{t("track_eta")}</p>
                                        <p className="text-xl font-bold text-[var(--color-primary)]">
                                            {new Date(order.estimated_delivery_at).toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                        <p className="text-white/40 text-xs mt-0.5">
                                            {new Date(order.estimated_delivery_at).toLocaleDateString("sr-RS", { day: "numeric", month: "long" })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {order.estimated_delivery_at && order.status === "delivered" && (
                            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <p className="text-green-400 text-sm font-medium">{t("track_delivered")}</p>
                            </div>
                        )}

                        {/* Status timeline */}
                        {isCancelled ? (
                            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-red-400 mb-1">{t("track_cancelled")}</h3>
                                <p className="text-white/40 text-sm">
                                    {t("track_cancelled_desc")}
                                </p>
                            </div>
                        ) : (
                            <div className="p-6 rounded-2xl bg-[var(--color-dark-light)] border border-white/5">
                                <h3 className="font-bold mb-6">{t("track_status")}</h3>
                                <div className="space-y-0">
                                    {statusStepKeys.map((step, i) => {
                                        const isCompleted = i <= currentStep;
                                        const isCurrent = i === currentStep;
                                        const Icon = step.icon;
                                        return (
                                            <div key={step.key} className="flex gap-4">
                                                {/* Line + dot */}
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isCurrent
                                                            ? "bg-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/20"
                                                            : isCompleted
                                                                ? "bg-green-500/20"
                                                                : "bg-white/5"
                                                            }`}
                                                    >
                                                        <Icon
                                                            className={`w-5 h-5 ${isCurrent
                                                                ? "text-white"
                                                                : isCompleted
                                                                    ? "text-green-400"
                                                                    : "text-white/20"
                                                                }`}
                                                        />
                                                    </div>
                                                    {i < statusStepKeys.length - 1 && (
                                                        <div
                                                            className={`w-0.5 h-10 ${i < currentStep ? "bg-green-500/30" : "bg-white/5"
                                                                }`}
                                                        />
                                                    )}
                                                </div>

                                                {/* Text */}
                                                <div className="pb-8">
                                                    <p
                                                        className={`font-semibold text-sm ${isCurrent
                                                            ? "text-[var(--color-primary)]"
                                                            : isCompleted
                                                                ? "text-white"
                                                                : "text-white/30"
                                                            }`}
                                                    >
                                                        {t(step.labelKey)}
                                                    </p>
                                                    <p
                                                        className={`text-xs mt-0.5 ${isCompleted ? "text-white/50" : "text-white/20"
                                                            }`}
                                                    >
                                                        {t(step.descKey)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Order items */}
                        <div className="p-6 rounded-2xl bg-[var(--color-dark-light)] border border-white/5">
                            <h3 className="font-bold mb-4">{t("track_items")}</h3>
                            <div className="space-y-2">
                                {order.items.map((item, j) => (
                                    <div
                                        key={j}
                                        className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                                    >
                                        <span className="text-sm text-white/70">
                                            {item.quantity}× {item.name}
                                        </span>
                                        <span className="text-sm text-white/50">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between">
                                <span className="font-bold">{t("cart_total")}</span>
                                <span className="font-bold text-[var(--color-primary)]">
                                    {formatPrice(order.total)}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
