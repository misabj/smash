import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, X } from "lucide-react";
import { useEffect } from "react";
import { useT } from "../context/LanguageContext";

export interface CartToastData {
    id: number;
    name: string;
    image: string;
    price: number;
    timestamp: number;
}

interface Props {
    toasts: CartToastData[];
    onDismiss: (id: number) => void;
}

const TOAST_DURATION = 3000;

export default function CartToast({ toasts, onDismiss }: Props) {
    const visible = toasts.filter((t) => Date.now() - t.timestamp < TOAST_DURATION);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-2 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {visible.slice(-3).map((toast) => (
                    <ToastItem key={toast.timestamp} toast={toast} onDismiss={onDismiss} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function ToastItem({ toast, onDismiss }: { toast: CartToastData; onDismiss: (id: number) => void }) {
    const { t } = useT();

    useEffect(() => {
        const timer = setTimeout(() => onDismiss(toast.id), TOAST_DURATION);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto flex items-center gap-3 bg-[var(--color-dark-light)] border border-white/10 rounded-2xl p-3 pr-4 shadow-2xl shadow-black/40 min-w-[280px] max-w-[340px]"
        >
            {/* Product image */}
            <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-[var(--color-primary)]/30">
                <img src={toast.image} alt={toast.name} className="w-full h-full object-cover" />
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90 truncate">{toast.name}</p>
                <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                    <ShoppingBag className="w-3 h-3" />
                    {t("toast_added")} &middot; {toast.price.toLocaleString("sr-RS")} RSD
                </p>
            </div>

            {/* Close */}
            <button
                onClick={() => onDismiss(toast.id)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white/30 hover:text-white/60 cursor-pointer flex-shrink-0"
            >
                <X className="w-3.5 h-3.5" />
            </button>

            {/* Progress bar */}
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: TOAST_DURATION / 1000, ease: "linear" }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)] origin-left rounded-b-2xl"
            />
        </motion.div>
    );
}
