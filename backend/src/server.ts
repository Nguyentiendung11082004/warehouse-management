import express from "express";
import cors from "cors";
import pool from "./config/database";
import router from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Warehouse Management API is running",
  });
});

app.get("/api/test-db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});
app.use("/api", router);
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});