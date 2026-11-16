import { createContext, useContext } from "react";
import type { UseSiteStats } from "./useSiteStatsSource";

export const SiteStatsContext = createContext<UseSiteStats>({
  stats: null,
  toggleLike: () => {},
  pending: false,
});

/** Shared view + like counters (one fetch loop for the whole app). */
export const useSiteStats = () => useContext(SiteStatsContext);
