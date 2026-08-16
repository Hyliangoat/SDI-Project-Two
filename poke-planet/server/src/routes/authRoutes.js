import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import { asyncRoute, HttpError } from "../errors.js";
import { createToken } from "../auth.js";
import { parseCredentials } from "../validation.js";

const router = Router();

router.post(
  "/register",
  asyncRoute(async (req, res) => {
    const input = parseCredentials(req.body);
    const hash = await bcrypt.hash(input.password, 12);
    try {
      const result = await pool.query(
        "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
        [input.username, hash],
      );
      const user = result.rows[0];
      res.status(201).json({ token: createToken(user), user });
    } catch (error) {
      if (error.code === "23505")
        throw new HttpError(409, "Username is already taken.");
      throw error;
    }
  }),
);

router.post(
  "/login",
  asyncRoute(async (req, res) => {
    const input = parseCredentials(req.body);
    const result = await pool.query(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      [input.username],
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(input.password, user.password_hash)))
      throw new HttpError(401, "Invalid username or password.");
    res.json({
      token: createToken(user),
      user: { id: user.id, username: user.username },
    });
  }),
);

export default router;
