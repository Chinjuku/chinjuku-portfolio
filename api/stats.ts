import { createHash } from "node:crypto";

/**
 * Site stats: page views + likes, shared by every visitor.
 * Stored in Upstash Redis through its REST API (no SDK, no own database).
 *
 *   GET  /api/stats                      -> { views, likes, liked }
 *   POST /api/stats { action: "view" }   -> counts once per visitor per day
 *   POST /api/stats { action: "like" | "unlike" }
 *
 * Visitors are identified by a salted hash of their IP; the raw IP is never stored.
 */

const URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const SALT = process.env.STATS_SALT ?? "chinjuku-portfolio";

const K = {
  views: "stats:views",
  likes: "stats:likes",
  seen: (v: string, day: string) => `stats:seen:${day}:${v}`,
  liked: (v: string) => `stats:liked:${v}`,
  rate: (v: string) => `stats:rl:${v}`,
};

const RATE_LIMIT = 20; // writes per visitor per minute
const DAY = 60 * 60 * 24;

type Cmd = (string | number)[];
type Result = { result?: unknown; error?: string };

const redis = async (cmds: Cmd[]): Promise<unknown[]> => {
  const res = await fetch(`${URL}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  const out = (await res.json()) as Result[];
  return out.map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
};

const num = (v: unknown) => Number(v ?? 0) || 0;

const visitorId = (req: Request) => {
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  return createHash("sha256").update(`${SALT}:${ip}`).digest("hex").slice(0, 32);
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const snapshot = async (v: string) => {
  const [views, likes, liked] = await redis([["GET", K.views], ["GET", K.likes], ["EXISTS", K.liked(v)]]);
  return { views: num(views), likes: num(likes), liked: num(liked) === 1 };
};

export async function GET(req: Request) {
  if (!URL || !TOKEN) return json({ error: "stats not configured" }, 503);
  try {
    return json(await snapshot(visitorId(req)));
  } catch {
    return json({ error: "stats unavailable" }, 502);
  }
}

export async function POST(req: Request) {
  if (!URL || !TOKEN) return json({ error: "stats not configured" }, 503);

  let action: unknown;
  try {
    action = ((await req.json()) as { action?: unknown }).action;
  } catch {
    return json({ error: "bad body" }, 400);
  }
  if (action !== "view" && action !== "like" && action !== "unlike") {
    return json({ error: "unknown action" }, 400);
  }

  const v = visitorId(req);
  try {
    // simple fixed-window rate limit so one visitor can't spin the counters
    const [hits] = await redis([["INCR", K.rate(v)], ["EXPIRE", K.rate(v), 60, "NX"]]);
    if (num(hits) > RATE_LIMIT) return json({ error: "slow down" }, 429);

    if (action === "view") {
      const day = new Date().toISOString().slice(0, 10);
      const [fresh] = await redis([["SET", K.seen(v, day), 1, "NX", "EX", DAY]]);
      if (fresh === "OK") await redis([["INCR", K.views]]);
    } else if (action === "like") {
      const [fresh] = await redis([["SET", K.liked(v), 1, "NX"]]);
      if (fresh === "OK") await redis([["INCR", K.likes]]);
    } else {
      const [removed] = await redis([["DEL", K.liked(v)]]);
      if (num(removed) === 1) await redis([["DECR", K.likes]]);
    }
    return json(await snapshot(v));
  } catch {
    return json({ error: "stats unavailable" }, 502);
  }
}
