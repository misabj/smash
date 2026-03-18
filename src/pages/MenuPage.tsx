import { useState } from "react";
import { motion } from "framer-motion";
import type { MenuItem } from "../data/menu";
import { useMenuItems } from "../hooks/useMenuItems";
import MenuCard from "../components/MenuCard";

type Category = "all" | MenuItem["category"];

const categories: { id: Category; label: string }[] = [
    { id: "all", label: "Sve" },
    { id: "burger", label: "Burgeri" },
    { id: "sandwich", label: "Sendviči" },
    { id: "sides", label: "Prilozi" },
    { id: "drinks", label: "Piće" },
];

export default function MenuPage() {
    const { items: menuItems } = useMenuItems();
    const [activeCategory, setActiveCategory] = useState<Category>("all");

    const filtered =
        activeCategory === "all"
            ? menuItems
            : menuItems.filter((item) => item.category === activeCategory);

    return (
        <main className="pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[var(--color-primary)] text-sm font-semibold uppercase tracking-[0.2em]"
                    >
                        Istraži
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black mt-3 mb-4"
                    >
                        Naš meni
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-md mx-auto"
                    >
                        Svaki zalogaj je pažljivo osmišljen da pruži savršen spoj ukusa.
                    </motion.p>
                </div>

                {/* Category filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-2 mb-12"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${activeCategory === cat.id
                                ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25"
                                : "bg-white/5 text-white/60 hover:bg-white/10"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </motion.div>

                {/* Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {filtered.map((item, i) => (
                        <MenuCard key={item.id} item={item} index={i} />
                    ))}
                </motion.div>

                {filtered.length === 0 && (
                    <div className="text-center py-20 text-white/30">
                        Nema stavki u ovoj kategoriji.
                    </div>
                )}
            </div>
        </main>
    );
}
