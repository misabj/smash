import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from "lucide-react";
import { promotionsApi, type PromotionAPI } from "../../services/api";

const categoryLabels: Record<string, string> = {
    burger: "Burger",
    sandwich: "Sendvič",
    sides: "Prilog",
    drinks: "Piće",
    all: "Ceo meni",
};

const defaultForm = {
    name: "",
    description: "",
    discount_percent: "",
    applicable_category: "all" as PromotionAPI["applicable_category"],
    start_date: "",
    end_date: "",
    active: true,
};

export default function AdminPromotions() {
    const [items, setItems] = useState<PromotionAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(defaultForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchItems = async () => {
        try {
            const data = await promotionsApi.getAllAdmin();
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setForm(defaultForm);
        setError("");
        setModalOpen(true);
    };

    const openEdit = (item: PromotionAPI) => {
        setEditingId(item.id);
        setForm({
            name: item.name,
            description: item.description || "",
            discount_percent: String(item.discount_percent),
            applicable_category: item.applicable_category,
            start_date: item.start_date,
            end_date: item.end_date,
            active: item.active,
        });
        setError("");
        setModalOpen(true);
    };

    const handleSave = async () => {
        setError("");
        if (!form.name || !form.discount_percent || !form.start_date || !form.end_date) {
            setError("Naziv, popust, datumi su obavezni.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: form.name,
                description: form.description,
                discount_percent: Number(form.discount_percent),
                applicable_category: form.applicable_category,
                start_date: form.start_date,
                end_date: form.end_date,
                active: form.active,
            };

            if (editingId) {
                await promotionsApi.update(editingId, payload);
            } else {
                await promotionsApi.create(payload);
            }

            await fetchItems();
            setModalOpen(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Da li ste sigurni da želite da obrišete ovu promociju?")) return;
        try {
            await promotionsApi.delete(id);
            setItems((prev) => prev.filter((i) => i.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const toggleActive = async (item: PromotionAPI) => {
        try {
            await promotionsApi.update(item.id, { active: !item.active });
            setItems((prev) =>
                prev.map((i) =>
                    i.id === item.id ? { ...i, active: !i.active } : i
                )
            );
        } catch (err: any) {
            alert(err.message);
        }
    };

    const isCurrentlyActive = (item: PromotionAPI) => {
        const now = new Date().toISOString().slice(0, 10);
        return item.active && item.start_date <= now && item.end_date >= now;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Upravljanje promocijama</h1>
                    <p className="text-white/40 text-sm mt-1">
                        {items.length} promocija ukupno
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-xl transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Nova promocija
                </button>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-[var(--color-dark-light)] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4">
                                    Promocija
                                </th>
                                <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4 hidden md:table-cell">
                                    Kategorija
                                </th>
                                <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4">
                                    Popust
                                </th>
                                <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4 hidden sm:table-cell">
                                    Period
                                </th>
                                <th className="text-left text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4 hidden sm:table-cell">
                                    Status
                                </th>
                                <th className="text-right text-xs font-semibold text-white/40 uppercase tracking-wider px-5 py-4">
                                    Akcije
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-5 py-4">
                                        <div className="min-w-0">
                                            <div className="font-medium text-sm truncate max-w-[200px]">
                                                {item.name}
                                            </div>
                                            {item.description && (
                                                <div className="text-xs text-white/30 truncate max-w-[200px]">
                                                    {item.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 hidden md:table-cell">
                                        <span className="text-sm text-white/50">
                                            {categoryLabels[item.applicable_category] || item.applicable_category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-medium text-[var(--color-primary)]">
                                            -{item.discount_percent}%
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 hidden sm:table-cell">
                                        <span className="text-sm text-white/50">
                                            {item.start_date} — {item.end_date}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 hidden sm:table-cell">
                                        <span
                                            className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${isCurrentlyActive(item)
                                                    ? "bg-green-500/20 text-green-400"
                                                    : item.active
                                                        ? "bg-yellow-500/20 text-yellow-400"
                                                        : "bg-white/10 text-white/40"
                                                }`}
                                        >
                                            {isCurrentlyActive(item)
                                                ? "Aktivna"
                                                : item.active
                                                    ? "Zakazana"
                                                    : "Neaktivna"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => toggleActive(item)}
                                                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white cursor-pointer"
                                                title={item.active ? "Deaktiviraj" : "Aktiviraj"}
                                            >
                                                {item.active ? (
                                                    <Eye className="w-4 h-4" />
                                                ) : (
                                                    <EyeOff className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => openEdit(item)}
                                                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-blue-400 cursor-pointer"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-red-400 cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {items.length === 0 && (
                    <div className="text-center py-12 text-white/30 text-sm">
                        Nema promocija.
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModalOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-[var(--color-dark-light)] border border-white/10 rounded-2xl z-50 flex flex-col max-h-[90vh]"
                        >
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/5 flex-shrink-0">
                                <h2 className="text-lg font-bold">
                                    {editingId ? "Izmeni promociju" : "Nova promocija"}
                                </h2>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal body */}
                            <div className="p-5 space-y-4 overflow-y-auto flex-1">
                                {error && (
                                    <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                                        Naziv
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Martovska akcija"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1.5">
                                        Opis (opciono)
                                    </label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({ ...form, description: e.target.value })
                                        }
                                        rows={2}
                                        placeholder="Kratak opis promocije..."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                                            Popust (%)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={form.discount_percent}
                                            onChange={(e) =>
                                                setForm({ ...form, discount_percent: e.target.value })
                                            }
                                            placeholder="20"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                                            Kategorija
                                        </label>
                                        <select
                                            value={form.applicable_category}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    applicable_category: e.target.value as PromotionAPI["applicable_category"],
                                                })
                                            }
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                        >
                                            <option value="all">Ceo meni</option>
                                            <option value="burger">Burger</option>
                                            <option value="sandwich">Sendvič</option>
                                            <option value="sides">Prilog</option>
                                            <option value="drinks">Piće</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                                            Datum početka
                                        </label>
                                        <input
                                            type="date"
                                            value={form.start_date}
                                            onChange={(e) =>
                                                setForm({ ...form, start_date: e.target.value })
                                            }
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1.5">
                                            Datum završetka
                                        </label>
                                        <input
                                            type="date"
                                            value={form.end_date}
                                            onChange={(e) =>
                                                setForm({ ...form, end_date: e.target.value })
                                            }
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.active}
                                        onChange={(e) =>
                                            setForm({ ...form, active: e.target.checked })
                                        }
                                        className="w-4 h-4 accent-[var(--color-primary)]"
                                    />
                                    <span className="text-sm text-white/70">Aktivna</span>
                                </label>
                            </div>

                            {/* Modal footer */}
                            <div className="p-5 border-t border-white/5 flex justify-end gap-3 flex-shrink-0">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    Otkaži
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors cursor-pointer"
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {editingId ? "Sačuvaj izmene" : "Dodaj promociju"}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
