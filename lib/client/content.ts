import stationsCatalog from "@/data/stations.json";
import { stationsFileSchema } from "@/lib/domain/schemas";
import type { GardenSession, GardenStation } from "./contracts";

const PROGRESS_KEY = "yellow-garden-progress";

export function loadStations(): GardenStation[] {
  return stationsFileSchema.parse(stationsCatalog).map((station) => ({
    id: station.id,
    title: station.title,
    eyebrow: station.subtitle,
    description: station.description,
    message: station.poeticMessage,
    letters: station.letters,
    sections: station.sections,
    reflection: station.reflection,
    actionLabel: station.actionLabel,
    completionMessage: station.completionMessage,
    caption: station.landmark,
    flowerName: station.flowerName,
    flowerMeaning: station.flowerMeaning,
    position: station.position,
    color: station.color,
    triggerDistanceMeters: station.triggerDistanceMeters,
  }));
}

export function readLocalProgress(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function writeLocalProgress(stationIds: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(stationIds));
}

export function clearLocalProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROGRESS_KEY);
}

export function createLocalSession(): GardenSession {
  const stations = loadStations();
  const completedStationIds = readLocalProgress().filter((id) =>
    stations.some((station) => station.id === id),
  );
  return { stations, completedStationIds };
}
