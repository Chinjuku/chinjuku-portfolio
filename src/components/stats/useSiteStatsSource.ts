import { useCallback, useEffect, useRef, useState } from "react";

export interface SiteStats {
  views: number;
  likes: number;
  liked: boolean;
}

export interface UseSiteStats {
  /** null until the first response (or when the API is unavailable, e.g. plain `vite` dev) */
  stats: SiteStats | null;
  /** optimistic like / unlike; rolls back if the server refuses */
  toggleLike: () => void;
  pending: boolean;
}

const ENDPOINT = "/api/stats";
const VIEW_FLAG = "stats:viewed"; // one view per browser tab session
const REFRESH_MS = 30_000;

const send = async (init?: RequestInit): Promise<SiteStats | null> => {
  try {
    const res = await fetch(ENDPOINT, init);
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<SiteStats>;
    if (typeof data.views !== "number" || typeof data.likes !== "number") return null;
    return { views: data.views, likes: data.likes, liked: Boolean(data.liked) };
  } catch {
    return null;
  }
};

const post = (action: "view" | "like" | "unlike") =>
  send({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });

const viewedThisSession = () => {
  try {
    if (sessionStorage.getItem(VIEW_FLAG)) return true;
    sessionStorage.setItem(VIEW_FLAG, "1");
  } catch {
    /* storage blocked: still count, the server dedupes per day */
  }
  return false;
};

/** Shared view + like counters backed by /api/stats (Upstash Redis). */
export const useSiteStatsSource = (): UseSiteStats => {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [pending, setPending] = useState(false);
  const busy = useRef(false);

  useEffect(() => {
    let alive = true;
    const apply = (s: SiteStats | null) => {
      if (alive && s && !busy.current) setStats(s);
    };

    (viewedThisSession() ? send() : post("view")).then(apply);

    // keep everyone's numbers moving: refresh on an interval and when the tab regains focus
    const refresh = () => {
      if (document.visibilityState === "visible") send().then(apply);
    };
    const id = window.setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      alive = false;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const toggleLike = useCallback(() => {
    if (!stats || busy.current) return;
    busy.current = true;
    setPending(true);
    const prev = stats;
    const next = !prev.liked;
    setStats({ ...prev, liked: next, likes: Math.max(0, prev.likes + (next ? 1 : -1)) });
    post(next ? "like" : "unlike").then((s) => {
      busy.current = false;
      setPending(false);
      setStats(s ?? prev);
    });
  }, [stats]);

  return { stats, toggleLike, pending };
};
