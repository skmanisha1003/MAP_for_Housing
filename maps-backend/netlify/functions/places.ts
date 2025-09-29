import type { Handler } from "@netlify/functions";
import { getPrismaClient } from "./_client";

const prisma = getPrismaClient();

export const handler: Handler = async (event) => {
  try {
    const method = event.httpMethod?.toUpperCase();

    if (method === "GET") {
      const houses = await prisma.house.findMany({ orderBy: { createdAt: "desc" } });
      return json(200, houses);
    }

    if (method === "POST") {
      const body = safeParseJson(event.body);
      let { lat, lng, properties } = (body ?? {}) as {
        lat?: number | string;
        lng?: number | string;
        properties?: unknown;
      };

      lat = typeof lat === "string" ? parseFloat(lat) : lat;
      lng = typeof lng === "string" ? parseFloat(lng) : lng;

      if (typeof lat !== "number" || Number.isNaN(lat)) return badRequest("'lat' must be a number");
      if (typeof lng !== "number" || Number.isNaN(lng)) return badRequest("'lng' must be a number");

      const created = await prisma.house.create({
        data: {
          lat,
          lng,
          ...(properties !== undefined && properties !== null ? { properties } : {}),
        },
      });
      return json(201, created);
    }

    if (method === "DELETE") {
      const id = event.path?.split("/").pop();
      if (!id) return badRequest("Missing id");

      try {
        await prisma.house.delete({ where: { id } });
        return { statusCode: 204, body: "" };
      } catch (error: any) {
        if (error?.code === "P2025") return json(404, { error: "House not found" });
        throw error;
      }
    }

    return json(405, { error: "Method Not Allowed" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Function error", error);
    return json(500, { error: "Internal Server Error" });
  }
};

function json(statusCode: number, data: unknown) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  };
}

function badRequest(message: string) {
  return json(400, { error: message });
}

function safeParseJson(input?: string | null) {
  if (!input) return undefined;
  try {
    return JSON.parse(input);
  } catch {
    return undefined;
  }
}


