const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));

// PostgreSQL Connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "gas_monitoring",
  password: "Soup@2004",
  port: 5432,
});

// API to get the latest gas level
app.get("/gas-level", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT gaslevel FROM gas_readings ORDER BY readingtime DESC LIMIT 1"
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return the most recent gas level
    } else {
      res.json({ gaslevel: null }); // Handle empty table case
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
