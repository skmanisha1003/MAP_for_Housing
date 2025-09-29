import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
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
    const { data, error } = await supabase
      .from("House")
      .select(
        'id, lat, lng, "Funding Agreement Status", "Project applicant", "Total dwellings proposed", "State", "Suburb", "Project Status"'
      );
    if (error) throw error;

    const result = (data ?? []).map((r: any) => ({
      id: r.id,
      lat: r.lat,
      lng: r.lng,
      properties: {
        fundingAgreementStatus: r["Funding Agreement Status"] ?? null,
        projectApplicant: r["Project applicant"] ?? null,
        totalDwellingsProposed: r["Total dwellings proposed"] ?? null,
        state: r["State"] ?? null,
        suburb: r["Suburb"] ?? null,
        projectStatus: r["Project Status"] ?? null,
      },
      // Keep shape compatible with frontend type, though not used
      createdAt: "",
      updatedAt: "",
    }));

    res.json(result);
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

    const id = randomUUID();
    const row: any = {
      id,
      lat,
      lng,
      ["Funding Agreement Status"]: properties?.fundingAgreementStatus ?? null,
      ["Project applicant"]: properties?.projectApplicant ?? null,
      ["Total dwellings proposed"]: properties?.totalDwellingsProposed
        ? Number(properties.totalDwellingsProposed)
        : null,
      ["State"]: properties?.state ?? null,
      ["Suburb"]: properties?.suburb ?? null,
      ["Project Status"]: properties?.projectStatus ?? null,
    };

    const { error } = await supabase.from("House").insert([row]);
    if (error) throw error;

    const created = {
      id,
      lat,
      lng,
      properties: {
        fundingAgreementStatus: row["Funding Agreement Status"],
        projectApplicant: row["Project applicant"],
        totalDwellingsProposed: row["Total dwellings proposed"],
        state: row["State"],
        suburb: row["Suburb"],
        projectStatus: row["Project Status"],
      },
      createdAt: "",
      updatedAt: "",
    };

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
    const { error } = await supabase.from("House").delete().eq("id", id);
    if (error) throw error;
    return res.status(204).send();
  } catch (error: any) {
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


