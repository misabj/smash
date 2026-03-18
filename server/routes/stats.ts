import { Router } from "express";
import db from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET /api/stats — admin dashboard statistics
router.get("/", authMiddleware, (_req, res) => {
    const totalItems = db.prepare("SELECT COUNT(*) as count FROM menu_items WHERE active = 1").get() as { count: number };
    const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get() as { count: number };
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get() as { count: number };
    const revenue = db.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'cancelled'").get() as { total: number };

    const recentOrders = db
        .prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5")
        .all()
        .map((order: any) => ({ ...order, items: JSON.parse(order.items || "[]") }));

    const categoryStats = db
        .prepare("SELECT category, COUNT(*) as count FROM menu_items WHERE active = 1 GROUP BY category")
        .all();

    res.json({
        totalMenuItems: totalItems.count,
        totalOrders: totalOrders.count,
        pendingOrders: pendingOrders.count,
        totalRevenue: revenue.total,
        recentOrders,
        categoryStats,
    });
});

export default router;
