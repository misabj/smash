import { motion } from "framer-motion";
import { ShoppingBag, Plus } from "lucide-react";
import type { MenuItem } from "../data/menu";
import { useCart } from "../context/CartContext";

interface Props {
    item: MenuItem;
    index: number;
}

export default function MenuCard({ item, index }: Props) {
    const { addItem } = useCart();

    const formatPrice = (price: number) => {
        return `${price.toLocaleString("sr-RS")} RSD`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-[var(--color-dark-light)] rounded-2xl overflow-hidden border border-white/5 hover:border-[var(--color-primary)]/30 transition-all duration-500"
        >
            {/* Image */}
            <div className="relative h-48 sm:h-52 overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-light)] via-transparent to-transparent" />

                {/* Tags */}
                {item.popular && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full uppercase tracking-wider">
                        Popular
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold group-hover:text-[var(--color-primary)] transition-colors">
                        {item.name}
                    </h3>
                    <span className="text-[var(--color-primary)] font-bold whitespace-nowrap text-sm">
                        {formatPrice(item.price)}
                    </span>
                </div>

                <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                </p>

                {/* Tags row */}
                <div className="flex items-center gap-2 mb-4">
                    {item.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 bg-white/5 text-white/40 text-xs rounded-full border border-white/5"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Add to cart */}
                <button
                    onClick={() => addItem(item)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-[var(--color-primary)] rounded-xl font-medium text-sm transition-all duration-300 group/btn cursor-pointer"
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Dodaj u korpu</span>
                    <Plus className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </button>
            </div>
        </motion.div>
    );
}
