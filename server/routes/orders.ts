import { Router } from "express";
import crypto from "crypto";
import db from "../db.js";
import { authMiddleware } from "../middleware/auth.js";
import { broadcast } from "../sse.js";

const router = Router();

function generateTrackingCode(): string {
    return "SM-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

// GET /api/orders — admin, get all orders
router.get("/", authMiddleware, (_req, res) => {
    const orders = db
        .prepare("SELECT * FROM orders ORDER BY created_at DESC")
        .all()
        .map((order: any) => ({
            ...order,
            items: JSON.parse(order.items || "[]"),
        }));

    res.json(orders);
});

// GET /api/orders/track/:code — public, track order by code
router.get("/track/:code", (req, res) => {
    const order = db
        .prepare("SELECT id, tracking_code, customer_name, delivery_address, items, total, status, estimated_delivery_at, created_at FROM orders WHERE tracking_code = ?")
        .get(req.params.code) as any;

    if (!order) {
        res.status(404).json({ error: "Porudžbina nije pronađena." });
        return;
    }

    res.json({ ...order, items: JSON.parse(order.items) });
});

// POST /api/orders — public, create order
router.post("/", (req, res) => {
    const { customerName, customerPhone, customerEmail, deliveryAddress, items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0 || !total) {
        res.status(400).json({ error: "Porudžbina mora sadržati stavke." });
        return;
    }

    if (!deliveryAddress || !deliveryAddress.trim()) {
        res.status(400).json({ error: "Adresa za dostavu je obavezna." });
        return;
    }

    if (!customerEmail || !customerEmail.trim()) {
        res.status(400).json({ error: "Email adresa je obavezna." });
        return;
    }

    const trackingCode = generateTrackingCode();

    const result = db
        .prepare(
            "INSERT INTO orders (tracking_code, customer_name, customer_phone, customer_email, delivery_address, items, total) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .run(trackingCode, customerName || null, customerPhone || null, customerEmail.trim(), deliveryAddress.trim(), JSON.stringify(items), Number(total));

    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(result.lastInsertRowid) as any;
    const created = { ...order, items: JSON.parse(order.items) };

    // Notify admin clients in real-time
    broadcast("new-order", {
        id: created.id,
        tracking_code: created.tracking_code,
        customer_name: created.customer_name,
        total: created.total,
        items: created.items,
        created_at: created.created_at,
    });

    res.status(201).json(created);
});

// PUT /api/orders/:id/status — admin, update order status
router.put("/:id/status", authMiddleware, (req, res) => {
    const { status, prepMinutes } = req.body;
    const validStatuses = ["pending", "preparing", "ready", "delivered", "cancelled"];

    if (!status || !validStatuses.includes(status)) {
        res.status(400).json({ error: "Nevažeći status porudžbine." });
        return;
    }

    const existing = db.prepare("SELECT id, status FROM orders WHERE id = ?").get(req.params.id) as any;
    if (!existing) {
        res.status(404).json({ error: "Porudžbina nije pronađena." });
        return;
    }

    // When moving to "preparing", admin must provide prep time
    if (status === "preparing" && existing.status === "pending") {
        const mins = Number(prepMinutes);
        if (!mins || mins < 1 || mins > 180) {
            res.status(400).json({ error: "Unesite očekivano vreme pripreme (1-180 min)." });
            return;
        }
        const deliveryAt = new Date(Date.now() + (mins + 15) * 60_000).toISOString();
        db.prepare("UPDATE orders SET status = ?, estimated_delivery_at = ? WHERE id = ?").run(status, deliveryAt, req.params.id);
    } else {
        db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
    }

    const updated = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id) as any;
    res.json({ ...updated, items: JSON.parse(updated.items) });
});

export default router;
