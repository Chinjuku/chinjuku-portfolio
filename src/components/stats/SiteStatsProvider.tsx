import React from "react";
import { SiteStatsContext } from "./context";
import { useSiteStatsSource } from "./useSiteStatsSource";

export const SiteStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useSiteStatsSource();
  return <SiteStatsContext.Provider value={value}>{children}</SiteStatsContext.Provider>;
};
