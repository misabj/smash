import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, Check, MapPin, Mail, User, Phone, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ordersApi } from "../services/api";

export default function CartDrawer() {
    const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } =
        useCart();
    const [ordering, setOrdering] = useState(false);
    const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
    const [trackingCode, setTrackingCode] = useState("");

    // Form fields
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [formError, setFormError] = useState("");

    const formatPrice = (price: number) => `${price.toLocaleString("sr-RS")} RSD`;

    const handleProceedToCheckout = () => {
        setFormError("");
        setStep("checkout");
    };

    const handleOrder = async () => {
        setFormError("");
        if (!deliveryAddress.trim()) {
            setFormError("Unesite adresu za dostavu.");
            return;
        }
        if (!customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
            setFormError("Unesite ispravnu email adresu.");
            return;
        }

        setOrdering(true);
        try {
            const order = await ordersApi.create({
                customerName: customerName.trim() || undefined,
                customerPhone: customerPhone.trim() || undefined,
                customerEmail: customerEmail.trim(),
                deliveryAddress: deliveryAddress.trim(),
                items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
                total: totalPrice,
            });
            clearCart();
            setTrackingCode(order.tracking_code);
            setStep("success");
        } catch {
            setFormError("Greška pri slanju porudžbine. Pokušajte ponovo.");
        } finally {
            setOrdering(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        // Reset after animation
        setTimeout(() => {
            setStep("cart");
            setTrackingCode("");
            setCustomerName("");
            setCustomerPhone("");
            setCustomerEmail("");
            setDeliveryAddress("");
            setFormError("");
        }, 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-dark)] border-l border-white/5 z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                {step === "checkout" && (
                                    <button onClick={() => setStep("cart")} className="p-1 mr-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                )}
                                <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
                                <h2 className="text-lg font-bold">
                                    {step === "cart" ? "Vaša korpa" : step === "checkout" ? "Dostava" : "Uspešno!"}
                                </h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Success state */}
                        {step === "success" && (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                                    <Check className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Porudžbina poslata!</h3>
                                <p className="text-white/50 text-sm mb-6">
                                    Na vašu email adresu ćete dobiti potvrdu sa linkom za praćenje statusa porudžbine.
                                </p>
                                <div className="w-full p-4 rounded-xl bg-[var(--color-dark-light)] border border-white/5 mb-6">
                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Kod za praćenje</p>
                                    <p className="text-2xl font-bold text-[var(--color-primary)] tracking-wider">{trackingCode}</p>
                                </div>
                                <a
                                    href={`/track/${trackingCode}`}
                                    className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-xl transition-colors text-center block"
                                >
                                    Prati porudžbinu →
                                </a>
                                <button
                                    onClick={handleClose}
                                    className="mt-3 text-white/30 hover:text-white/50 text-sm transition-colors cursor-pointer"
                                >
                                    Zatvori
                                </button>
                            </div>
                        )}

                        {/* Cart items step */}
                        {step === "cart" && (
                            <>
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    {items.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <ShoppingBag className="w-16 h-16 text-white/10 mb-4" />
                                            <p className="text-white/40 text-sm">Vaša korpa je prazna</p>
                                            <button
                                                onClick={handleClose}
                                                className="mt-4 text-[var(--color-primary)] text-sm font-medium hover:underline cursor-pointer"
                                            >
                                                Pogledaj meni →
                                            </button>
                                        </div>
                                    ) : (
                                        items.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="flex gap-4 p-3 rounded-xl bg-[var(--color-dark-light)] border border-white/5"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-semibold text-sm truncate">
                                                            {item.name}
                                                        </h4>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="p-1 text-white/30 hover:text-red-400 transition-colors flex-shrink-0 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <p className="text-[var(--color-primary)] text-sm font-medium mt-1">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(item.id, item.quantity - 1)
                                                            }
                                                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-sm font-medium w-6 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(item.id, item.quantity + 1)
                                                            }
                                                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                {/* Footer - proceed to checkout */}
                                {items.length > 0 && (
                                    <div className="p-5 border-t border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/50">Ukupno</span>
                                            <span className="text-xl font-bold text-[var(--color-primary)]">
                                                {formatPrice(totalPrice)}
                                            </span>
                                        </div>

                                        <button
                                            onClick={handleProceedToCheckout}
                                            className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-xl transition-colors cursor-pointer"
                                        >
                                            Nastavi na dostavu →
                                        </button>

                                        <button
                                            onClick={clearCart}
                                            className="w-full py-2 text-white/30 hover:text-white/50 text-sm transition-colors cursor-pointer"
                                        >
                                            Isprazni korpu
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Checkout step — delivery form */}
                        {step === "checkout" && (
                            <>
                                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                                    <p className="text-white/40 text-sm">Unesite podatke za dostavu. Na email ćete dobiti link za praćenje porudžbine.</p>

                                    {/* Delivery Address */}
                                    <div>
                                        <label className="text-sm font-medium text-white/70 mb-1.5 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                            Adresa za dostavu <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={deliveryAddress}
                                            onChange={(e) => setDeliveryAddress(e.target.value)}
                                            placeholder="Ulica i broj, grad"
                                            className="w-full px-4 py-3 bg-[var(--color-dark-light)] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="text-sm font-medium text-white/70 mb-1.5 flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                            Email adresa <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            placeholder="vas@email.com"
                                            className="w-full px-4 py-3 bg-[var(--color-dark-light)] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                        />
                                        <p className="text-white/30 text-xs mt-1">Dobićete link za praćenje statusa porudžbine</p>
                                    </div>

                                    {/* Name (optional) */}
                                    <div>
                                        <label className="text-sm font-medium text-white/70 mb-1.5 flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                            Ime i prezime
                                        </label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Vaše ime"
                                            className="w-full px-4 py-3 bg-[var(--color-dark-light)] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                        />
                                    </div>

                                    {/* Phone (optional) */}
                                    <div>
                                        <label className="text-sm font-medium text-white/70 mb-1.5 flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                            Telefon
                                        </label>
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="06X XXX XXXX"
                                            className="w-full px-4 py-3 bg-[var(--color-dark-light)] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                        />
                                    </div>

                                    {/* Order summary */}
                                    <div className="p-4 rounded-xl bg-[var(--color-dark-light)] border border-white/5">
                                        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Pregled porudžbine</p>
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between py-1.5 text-sm">
                                                <span className="text-white/70">{item.quantity}× {item.name}</span>
                                                <span className="text-white/50">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                        <div className="mt-2 pt-2 border-t border-white/5 flex justify-between font-bold">
                                            <span>Ukupno</span>
                                            <span className="text-[var(--color-primary)]">{formatPrice(totalPrice)}</span>
                                        </div>
                                    </div>

                                    {formError && (
                                        <p className="text-red-400 text-sm">{formError}</p>
                                    )}
                                </div>

                                {/* Submit button */}
                                <div className="p-5 border-t border-white/5">
                                    <button
                                        onClick={handleOrder}
                                        disabled={ordering}
                                        className="w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        {ordering ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>Potvrdi porudžbinu — {formatPrice(totalPrice)}</>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
