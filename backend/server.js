require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// GET /api/profiles - list all stored profiles
app.get("/api/profiles", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM profiles");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/profiles/:id
app.get("/api/profiles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM profiles WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/profiles/:id
app.put("/api/profiles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio, experience } = req.body;

    const [result] = await pool.query(
      "UPDATE profiles SET name = ?, bio = ?, experience = ? WHERE id = ?",
      [name, bio, experience, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
