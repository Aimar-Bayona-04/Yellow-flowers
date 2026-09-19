"use client";

import { useCallback, useState } from "react";
import {
  clearLocalProgress,
  createLocalSession,
  writeLocalProgress,
} from "@/lib/client/content";
import type { ExperienceState, GardenSession } from "@/lib/client/contracts";

export function useGardenSession() {
  const [session, setSession] = useState<GardenSession | null>(null);
  const [state, setState] = useState<ExperienceState>("idle");

  const begin = useCallback(() => {
    setState("preparing");
    const next = createLocalSession();
    setSession(next);
    const finished =
      next.completedStationIds.length >= next.stations.length && next.stations.length > 0;
    window.setTimeout(() => {
      setState(finished ? "completed" : "exploring");
    }, 420);
  }, []);

  const completeStation = useCallback((stationId: string) => {
    setSession((current) => {
      if (!current || current.completedStationIds.includes(stationId)) return current;
      const completedStationIds = [...current.completedStationIds, stationId];
      writeLocalProgress(completedStationIds);
      if (completedStationIds.length >= current.stations.length) {
        queueMicrotask(() => setState("completed"));
      }
      return { ...current, completedStationIds };
    });
  }, []);

  const restart = useCallback(() => {
    clearLocalProgress();
    const next = createLocalSession();
    setSession(next);
    setState("exploring");
  }, []);

  return { session, state, begin, completeStation, restart };
}
