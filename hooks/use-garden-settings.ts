"use client";

import { useSyncExternalStore } from "react";
import type { QualityLevel, RendererSettings } from "@/lib/client/contracts";

const STORAGE_KEY = "yellow-garden-settings";

const defaults: RendererSettings = {
  quality: "high",
  volume: 0.35,
  reducedMotion: false,
  highContrast: false,
  captions: true,
};

const listeners = new Set<() => void>();
let snapshot: RendererSettings | null = null;

function readStoredSettings(): RendererSettings {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (typeof saved === "object" && saved !== null) {
      const partial = saved as Partial<RendererSettings>;
      return { ...defaults, ...partial, reducedMotion: prefersReduced || Boolean(partial.reducedMotion) };
    }
  } catch {
    /* Preferencias corruptas: se descartan en favor de los valores base. */
  }
  return { ...defaults, reducedMotion: prefersReduced };
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** El servidor y la hidratación usan los valores base; el store real se lee después. */
function getServerSnapshot(): RendererSettings {
  return defaults;
}

function getSnapshot(): RendererSettings {
  snapshot ??= readStoredSettings();
  return snapshot;
}

function persist(next: RendererSettings): void {
  snapshot = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Almacenamiento no disponible: la sesión sigue en memoria. */
  }
  listeners.forEach((listener) => listener());
}

export function useGardenSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const update = <K extends keyof RendererSettings>(key: K, value: RendererSettings[K]) =>
    persist({ ...getSnapshot(), [key]: value });

  return {
    settings,
    setQuality: (quality: QualityLevel) => update("quality", quality),
    setVolume: (volume: number) => update("volume", volume),
    toggleReducedMotion: () => update("reducedMotion", !settings.reducedMotion),
    toggleContrast: () => update("highContrast", !settings.highContrast),
    toggleCaptions: () => update("captions", !settings.captions),
  };
}
