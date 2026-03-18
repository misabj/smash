import { Router } from "express";
import db from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET /api/menu — public, returns all active menu items
router.get("/", (_req, res) => {
    const items = db
        .prepare("SELECT * FROM menu_items WHERE active = 1 ORDER BY category, id")
        .all()
        .map((item: any) => ({
            ...item,
            tags: JSON.parse(item.tags || "[]"),
            popular: Boolean(item.popular),
            active: Boolean(item.active),
        }));

    res.json(items);
});

// GET /api/menu/all — admin, returns ALL items including inactive
router.get("/all", authMiddleware, (_req, res) => {
    const items = db
        .prepare("SELECT * FROM menu_items ORDER BY category, id")
        .all()
        .map((item: any) => ({
            ...item,
            tags: JSON.parse(item.tags || "[]"),
            popular: Boolean(item.popular),
            active: Boolean(item.active),
        }));

    res.json(items);
});

// GET /api/menu/:id
router.get("/:id", (req, res) => {
    const item = db.prepare("SELECT * FROM menu_items WHERE id = ?").get(req.params.id) as any;

    if (!item) {
        res.status(404).json({ error: "Stavka nije pronađena." });
        return;
    }

    res.json({
        ...item,
        tags: JSON.parse(item.tags || "[]"),
        popular: Boolean(item.popular),
        active: Boolean(item.active),
    });
});

// POST /api/menu — create menu item (admin only)
router.post("/", authMiddleware, (req, res) => {
    const { name, description, price, image, category, tags, popular } = req.body;

    if (!name || !description || !price || !image || !category) {
        res.status(400).json({ error: "Sva polja su obavezna." });
        return;
    }

    const validCategories = ["burger", "sandwich", "sides", "drinks"];
    if (!validCategories.includes(category)) {
        res.status(400).json({ error: "Nevalidna kategorija." });
        return;
    }

    const result = db
        .prepare(
            "INSERT INTO menu_items (name, description, price, image, category, tags, popular) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .run(
            name,
            description,
            Number(price),
            image,
            category,
            JSON.stringify(tags || []),
            popular ? 1 : 0
        );

    const newItem = db.prepare("SELECT * FROM menu_items WHERE id = ?").get(result.lastInsertRowid) as any;
    res.status(201).json({
        ...newItem,
        tags: JSON.parse(newItem.tags || "[]"),
        popular: Boolean(newItem.popular),
        active: Boolean(newItem.active),
    });
});

// PUT /api/menu/:id — update menu item (admin only)
router.put("/:id", authMiddleware, (req, res) => {
    const { name, description, price, image, category, tags, popular, active } = req.body;

    const existing = db.prepare("SELECT id FROM menu_items WHERE id = ?").get(req.params.id);
    if (!existing) {
        res.status(404).json({ error: "Stavka nije pronađena." });
        return;
    }

    db.prepare(
        `UPDATE menu_items SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      price = COALESCE(?, price),
      image = COALESCE(?, image),
      category = COALESCE(?, category),
      tags = COALESCE(?, tags),
      popular = COALESCE(?, popular),
      active = COALESCE(?, active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`
    ).run(
        name ?? null,
        description ?? null,
        price != null ? Number(price) : null,
        image ?? null,
        category ?? null,
        tags ? JSON.stringify(tags) : null,
        popular != null ? (popular ? 1 : 0) : null,
        active != null ? (active ? 1 : 0) : null,
        req.params.id
    );

    const updated = db.prepare("SELECT * FROM menu_items WHERE id = ?").get(req.params.id) as any;
    res.json({
        ...updated,
        tags: JSON.parse(updated.tags || "[]"),
        popular: Boolean(updated.popular),
        active: Boolean(updated.active),
    });
});

// DELETE /api/menu/:id — delete menu item (admin only)
router.delete("/:id", authMiddleware, (req, res) => {
    const existing = db.prepare("SELECT id FROM menu_items WHERE id = ?").get(req.params.id);
    if (!existing) {
        res.status(404).json({ error: "Stavka nije pronađena." });
        return;
    }

    db.prepare("DELETE FROM menu_items WHERE id = ?").run(req.params.id);
    res.json({ message: "Stavka je obrisana." });
});

export default router;
