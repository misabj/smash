import "dotenv/config";
import express from "express";
import compression from "compression";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import statsRoutes from "./routes/stats.js";
import promotionRoutes from "./routes/promotions.js";
import { addClient } from "./sse.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:4173"];
app.use(compression());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/promotions", promotionRoutes);

// SSE endpoint for real-time admin notifications
app.get("/api/events", (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });
    res.write(":\n\n");
    addClient(res);
});

// Serve frontend in production
const distPath = path.join(__dirname, "..", "dist");
// Long cache for hashed assets only (JS/CSS/images with content hash in filename)
app.use("/assets", express.static(path.join(distPath, "assets"), { maxAge: "1y", immutable: true }));
// No cache for other files (index.html, favicon, etc.)
app.use(express.static(distPath, { maxAge: 0 }));
app.get("/{*splat}", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(distPath, "index.html"));
});

// Export for Passenger (cPanel)
export default app;

// Only listen when running standalone (not via Passenger)
// @ts-expect-error PhusionPassenger is a global in Passenger environments
if (typeof PhusionPassenger === "undefined") {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`\n🔥 SMASH API server running on port ${PORT}`);
        console.log(`📁 Database: ${path.join(__dirname, "database.sqlite")}`);
        console.log(`📂 Static files: ${distPath}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);
    });
}
