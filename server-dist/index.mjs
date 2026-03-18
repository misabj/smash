import { createRequire } from 'module'; const require = createRequire(import.meta.url);

// server/index.ts
import "dotenv/config";
import express from "express";
import compression from "compression";
import cors from "cors";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// server/routes/auth.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt2 from "jsonwebtoken";

// server/db.ts
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var dbPath = path.join(__dirname, "database.sqlite");
var db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('burger', 'sandwich', 'sides', 'drinks')),
    tags TEXT DEFAULT '[]',
    popular INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
var cols = db.prepare("PRAGMA table_info(orders)").all();
if (cols.length > 0 && (!cols.some((c) => c.name === "tracking_code") || !cols.some((c) => c.name === "estimated_delivery_at"))) {
  db.exec("DROP TABLE orders");
}
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_code TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    delivery_address TEXT,
    items TEXT NOT NULL,
    total INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
    estimated_delivery_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
var db_default = db;

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "smash-burger-admin-secret-key-2026";
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Pristup odbijen. Token nije prona\u0111en." });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ error: "Neva\u017Ee\u0107i token." });
  }
}

// server/routes/auth.ts
var router = Router();
var JWT_SECRET2 = process.env.JWT_SECRET || "smash-burger-admin-secret-key-2026";
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Korisni\u010Dko ime i lozinka su obavezni." });
    return;
  }
  const user = db_default.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) {
    res.status(401).json({ error: "Pogre\u0161no korisni\u010Dko ime ili lozinka." });
    return;
  }
  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    res.status(401).json({ error: "Pogre\u0161no korisni\u010Dko ime ili lozinka." });
    return;
  }
  const token = jwt2.sign({ id: user.id, role: user.role }, JWT_SECRET2, {
    expiresIn: "24h"
  });
  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role }
  });
});
router.get("/me", authMiddleware, (req, res) => {
  const user = db_default.prepare("SELECT id, username, role FROM users WHERE id = ?").get(req.userId);
  if (!user) {
    res.status(404).json({ error: "Korisnik nije prona\u0111en." });
    return;
  }
  res.json({ user });
});
router.put("/password", authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Oba polja su obavezna." });
    return;
  }
  if (newPassword.length < 6) {
    res.status(400).json({ error: "Nova lozinka mora imati najmanje 6 karaktera." });
    return;
  }
  const user = db_default.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
  if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
    res.status(401).json({ error: "Trenutna lozinka nije ispravna." });
    return;
  }
  const hashed = bcrypt.hashSync(newPassword, 10);
  db_default.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashed, req.userId);
  res.json({ message: "Lozinka je uspe\u0161no promenjena." });
});
var auth_default = router;

// server/routes/menu.ts
import { Router as Router2 } from "express";
var router2 = Router2();
router2.get("/", (_req, res) => {
  const items = db_default.prepare("SELECT * FROM menu_items WHERE active = 1 ORDER BY category, id").all().map((item) => ({
    ...item,
    tags: JSON.parse(item.tags || "[]"),
    popular: Boolean(item.popular),
    active: Boolean(item.active)
  }));
  res.json(items);
});
router2.get("/all", authMiddleware, (_req, res) => {
  const items = db_default.prepare("SELECT * FROM menu_items ORDER BY category, id").all().map((item) => ({
    ...item,
    tags: JSON.parse(item.tags || "[]"),
    popular: Boolean(item.popular),
    active: Boolean(item.active)
  }));
  res.json(items);
});
router2.get("/:id", (req, res) => {
  const item = db_default.prepare("SELECT * FROM menu_items WHERE id = ?").get(req.params.id);
  if (!item) {
    res.status(404).json({ error: "Stavka nije prona\u0111ena." });
    return;
  }
  res.json({
    ...item,
    tags: JSON.parse(item.tags || "[]"),
    popular: Boolean(item.popular),
    active: Boolean(item.active)
  });
});
router2.post("/", authMiddleware, (req, res) => {
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
  const result = db_default.prepare(
    "INSERT INTO menu_items (name, description, price, image, category, tags, popular) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(
    name,
    description,
    Number(price),
    image,
    category,
    JSON.stringify(tags || []),
    popular ? 1 : 0
  );
  const newItem = db_default.prepare("SELECT * FROM menu_items WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({
    ...newItem,
    tags: JSON.parse(newItem.tags || "[]"),
    popular: Boolean(newItem.popular),
    active: Boolean(newItem.active)
  });
});
router2.put("/:id", authMiddleware, (req, res) => {
  const { name, description, price, image, category, tags, popular, active } = req.body;
  const existing = db_default.prepare("SELECT id FROM menu_items WHERE id = ?").get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: "Stavka nije prona\u0111ena." });
    return;
  }
  db_default.prepare(
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
    popular != null ? popular ? 1 : 0 : null,
    active != null ? active ? 1 : 0 : null,
    req.params.id
  );
  const updated = db_default.prepare("SELECT * FROM menu_items WHERE id = ?").get(req.params.id);
  res.json({
    ...updated,
    tags: JSON.parse(updated.tags || "[]"),
    popular: Boolean(updated.popular),
    active: Boolean(updated.active)
  });
});
router2.delete("/:id", authMiddleware, (req, res) => {
  const existing = db_default.prepare("SELECT id FROM menu_items WHERE id = ?").get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: "Stavka nije prona\u0111ena." });
    return;
  }
  db_default.prepare("DELETE FROM menu_items WHERE id = ?").run(req.params.id);
  res.json({ message: "Stavka je obrisana." });
});
var menu_default = router2;

// server/routes/orders.ts
import { Router as Router3 } from "express";
import crypto from "crypto";

// server/sse.ts
var clients = [];
function addClient(res) {
  const id = Math.random().toString(36).slice(2);
  clients.push({ id, res });
  res.on("close", () => {
    removeClient(id);
  });
  return id;
}
function removeClient(id) {
  const idx = clients.findIndex((c) => c.id === id);
  if (idx !== -1) clients.splice(idx, 1);
}
function broadcast(event, data) {
  const payload = `event: ${event}
data: ${JSON.stringify(data)}

`;
  for (const client of clients) {
    client.res.write(payload);
  }
}

// server/routes/orders.ts
var router3 = Router3();
function generateTrackingCode() {
  return "SM-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}
router3.get("/", authMiddleware, (_req, res) => {
  const orders = db_default.prepare("SELECT * FROM orders ORDER BY created_at DESC").all().map((order) => ({
    ...order,
    items: JSON.parse(order.items || "[]")
  }));
  res.json(orders);
});
router3.get("/track/:code", (req, res) => {
  const order = db_default.prepare("SELECT id, tracking_code, customer_name, delivery_address, items, total, status, estimated_delivery_at, created_at FROM orders WHERE tracking_code = ?").get(req.params.code);
  if (!order) {
    res.status(404).json({ error: "Porud\u017Ebina nije prona\u0111ena." });
    return;
  }
  res.json({ ...order, items: JSON.parse(order.items) });
});
router3.post("/", (req, res) => {
  const { customerName, customerPhone, customerEmail, deliveryAddress, items, total } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0 || !total) {
    res.status(400).json({ error: "Porud\u017Ebina mora sadr\u017Eati stavke." });
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
  const result = db_default.prepare(
    "INSERT INTO orders (tracking_code, customer_name, customer_phone, customer_email, delivery_address, items, total) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(trackingCode, customerName || null, customerPhone || null, customerEmail.trim(), deliveryAddress.trim(), JSON.stringify(items), Number(total));
  const order = db_default.prepare("SELECT * FROM orders WHERE id = ?").get(result.lastInsertRowid);
  const created = { ...order, items: JSON.parse(order.items) };
  broadcast("new-order", {
    id: created.id,
    tracking_code: created.tracking_code,
    customer_name: created.customer_name,
    total: created.total,
    items: created.items,
    created_at: created.created_at
  });
  res.status(201).json(created);
});
router3.put("/:id/status", authMiddleware, (req, res) => {
  const { status, prepMinutes } = req.body;
  const validStatuses = ["pending", "preparing", "ready", "delivered", "cancelled"];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: "Neva\u017Ee\u0107i status porud\u017Ebine." });
    return;
  }
  const existing = db_default.prepare("SELECT id, status FROM orders WHERE id = ?").get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: "Porud\u017Ebina nije prona\u0111ena." });
    return;
  }
  if (status === "preparing" && existing.status === "pending") {
    const mins = Number(prepMinutes);
    if (!mins || mins < 1 || mins > 180) {
      res.status(400).json({ error: "Unesite o\u010Dekivano vreme pripreme (1-180 min)." });
      return;
    }
    const deliveryAt = new Date(Date.now() + (mins + 15) * 6e4).toISOString();
    db_default.prepare("UPDATE orders SET status = ?, estimated_delivery_at = ? WHERE id = ?").run(status, deliveryAt, req.params.id);
  } else {
    db_default.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
  }
  const updated = db_default.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
  res.json({ ...updated, items: JSON.parse(updated.items) });
});
var orders_default = router3;

// server/routes/stats.ts
import { Router as Router4 } from "express";
var router4 = Router4();
router4.get("/", authMiddleware, (_req, res) => {
  const totalItems = db_default.prepare("SELECT COUNT(*) as count FROM menu_items WHERE active = 1").get();
  const totalOrders = db_default.prepare("SELECT COUNT(*) as count FROM orders").get();
  const pendingOrders = db_default.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get();
  const revenue = db_default.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'cancelled'").get();
  const recentOrders = db_default.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5").all().map((order) => ({ ...order, items: JSON.parse(order.items || "[]") }));
  const categoryStats = db_default.prepare("SELECT category, COUNT(*) as count FROM menu_items WHERE active = 1 GROUP BY category").all();
  res.json({
    totalMenuItems: totalItems.count,
    totalOrders: totalOrders.count,
    pendingOrders: pendingOrders.count,
    totalRevenue: revenue.total,
    recentOrders,
    categoryStats
  });
});
var stats_default = router4;

// server/index.ts
var __dirname2 = path2.dirname(fileURLToPath2(import.meta.url));
var app = express();
var PORT = Number(process.env.PORT) || 3001;
var allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:4173"];
app.use(compression());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/uploads", express.static(path2.join(__dirname2, "uploads")));
app.use("/api/auth", auth_default);
app.use("/api/menu", menu_default);
app.use("/api/orders", orders_default);
app.use("/api/stats", stats_default);
app.get("/api/events", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });
  res.write(":\n\n");
  addClient(res);
});
var distPath = path2.join(__dirname2, "..", "dist");
app.use(express.static(distPath, { maxAge: "1y", immutable: true }));
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path2.join(distPath, "index.html"));
});
var index_default = app;
if (typeof PhusionPassenger === "undefined") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`
\u{1F525} SMASH API server running on port ${PORT}`);
    console.log(`\u{1F4C1} Database: ${path2.join(__dirname2, "database.sqlite")}`);
    console.log(`\u{1F4C2} Static files: ${distPath}`);
    console.log(`\u{1F30D} Environment: ${process.env.NODE_ENV || "development"}
`);
  });
}
export {
  index_default as default
};
