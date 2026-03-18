import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "smash-burger-admin-secret-key-2026";

// POST /api/auth/login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Korisničko ime i lozinka su obavezni." });
        return;
    }

    const user = db
        .prepare("SELECT * FROM users WHERE username = ?")
        .get(username) as { id: number; username: string; password: string; role: string } | undefined;

    if (!user) {
        res.status(401).json({ error: "Pogrešno korisničko ime ili lozinka." });
        return;
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        res.status(401).json({ error: "Pogrešno korisničko ime ili lozinka." });
        return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "24h",
    });

    res.json({
        token,
        user: { id: user.id, username: user.username, role: user.role },
    });
});

// GET /api/auth/me — verify token & get user info
router.get("/me", authMiddleware, (req: AuthRequest, res) => {
    const user = db
        .prepare("SELECT id, username, role FROM users WHERE id = ?")
        .get(req.userId) as { id: number; username: string; role: string } | undefined;

    if (!user) {
        res.status(404).json({ error: "Korisnik nije pronađen." });
        return;
    }

    res.json({ user });
});

// PUT /api/auth/password — change password
router.put("/password", authMiddleware, (req: AuthRequest, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400).json({ error: "Oba polja su obavezna." });
        return;
    }

    if (newPassword.length < 6) {
        res.status(400).json({ error: "Nova lozinka mora imati najmanje 6 karaktera." });
        return;
    }

    const user = db
        .prepare("SELECT * FROM users WHERE id = ?")
        .get(req.userId) as { password: string } | undefined;

    if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
        res.status(401).json({ error: "Trenutna lozinka nije ispravna." });
        return;
    }

    const hashed = bcrypt.hashSync(newPassword, 10);
    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashed, req.userId);

    res.json({ message: "Lozinka je uspešno promenjena." });
});

export default router;
