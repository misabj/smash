import { Router } from "express";
import db from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET /api/promotions — public, returns active promotions within date range
router.get("/", (_req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const promos = db
        .prepare(
            "SELECT * FROM promotions WHERE active = 1 AND start_date <= ? AND end_date >= ? ORDER BY created_at DESC"
        )
        .all(today, today)
        .map((p: any) => ({ ...p, active: Boolean(p.active) }));
    res.json(promos);
});

// GET /api/promotions/all — admin, returns ALL promotions
router.get("/all", authMiddleware, (_req, res) => {
    const promos = db
        .prepare("SELECT * FROM promotions ORDER BY created_at DESC")
        .all()
        .map((p: any) => ({ ...p, active: Boolean(p.active) }));
    res.json(promos);
});

// POST /api/promotions — admin, create a new promotion
router.post("/", authMiddleware, (req, res) => {
    const { name, description, discount_percent, applicable_category, start_date, end_date, active } = req.body;

    if (!name || !discount_percent || !start_date || !end_date) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    const result = db
        .prepare(
            `INSERT INTO promotions (name, description, discount_percent, applicable_category, start_date, end_date, active)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
            name,
            description || "",
            discount_percent,
            applicable_category || "all",
            start_date,
            end_date,
            active !== undefined ? (active ? 1 : 0) : 1
        );

    const promo = db.prepare("SELECT * FROM promotions WHERE id = ?").get(result.lastInsertRowid) as any;
    res.status(201).json({ ...promo, active: Boolean(promo.active) });
});

// PUT /api/promotions/:id — admin, update a promotion
router.put("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const existing = db.prepare("SELECT * FROM promotions WHERE id = ?").get(id) as any;
    if (!existing) {
        res.status(404).json({ error: "Promotion not found" });
        return;
    }

    const { name, description, discount_percent, applicable_category, start_date, end_date, active } = req.body;

    db.prepare(
        `UPDATE promotions SET name = ?, description = ?, discount_percent = ?, applicable_category = ?, start_date = ?, end_date = ?, active = ? WHERE id = ?`
    ).run(
        name ?? existing.name,
        description ?? existing.description,
        discount_percent ?? existing.discount_percent,
        applicable_category ?? existing.applicable_category,
        start_date ?? existing.start_date,
        end_date ?? existing.end_date,
        active !== undefined ? (active ? 1 : 0) : existing.active,
        id
    );

    const updated = db.prepare("SELECT * FROM promotions WHERE id = ?").get(id) as any;
    res.json({ ...updated, active: Boolean(updated.active) });
});

// DELETE /api/promotions/:id — admin
router.delete("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const result = db.prepare("DELETE FROM promotions WHERE id = ?").run(id);
    if (result.changes === 0) {
        res.status(404).json({ error: "Promotion not found" });
        return;
    }
    res.json({ message: "Promotion deleted" });
});

export default router;
