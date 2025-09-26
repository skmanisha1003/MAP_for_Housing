import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app = express();

const PORT = Number(process.env.PORT) || 7000;
const ALLOWED_ORIGINS = new Set<string>([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:6543",
  "http://127.0.0.1:6543",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.has(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

app.get("/api/places", async (_req, res) => {
  try {
    const houses = await prisma.house.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(houses);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("GET /api/places failed", error);
    res.status(500).json({ error: "Failed to load houses" });
  }
});

app.post("/api/places", async (req, res) => {
  try {
    const { properties } = req.body ?? {};
    let { lat, lng } = req.body ?? {};

    // Accept numbers or numeric strings
    lat = typeof lat === "string" ? parseFloat(lat) : lat;
    lng = typeof lng === "string" ? parseFloat(lng) : lng;

    if (typeof lat !== "number" || Number.isNaN(lat)) {
      return res.status(400).json({ error: "'lat' must be a number" });
    }
    if (typeof lng !== "number" || Number.isNaN(lng)) {
      return res.status(400).json({ error: "'lng' must be a number" });
    }

    const created = await prisma.house.create({
      data: {
        properties: properties ?? null,
        lat,
        lng,
      },
    });
    res.status(201).json(created);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("POST /api/places failed", error);
    res.status(500).json({ error: "Failed to create place" });
  }
});

app.delete("/api/places/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.house.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ error: "House not found" });
    }
    // eslint-disable-next-line no-console
    console.error("DELETE /api/places failed", error);
    res.status(500).json({ error: "Failed to delete house" });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

