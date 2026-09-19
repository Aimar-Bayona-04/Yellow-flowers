export type QualityLevel = "low" | "medium" | "high";

export type ExperienceState = "idle" | "preparing" | "exploring" | "completed";

export interface GardenLetter {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  signature: string;
}

export interface NarrativeSection {
  title: string;
  body: string;
  prompt: string;
}

export interface GardenStation {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  message: string;
  letters: GardenLetter[];
  sections: NarrativeSection[];
  reflection: string;
  actionLabel: string;
  completionMessage: string;
  caption: string;
  flowerName: string;
  flowerMeaning: string;
  position: readonly [number, number, number];
  color: string;
  triggerDistanceMeters: number;
}

export interface GardenSession {
  stations: GardenStation[];
  completedStationIds: string[];
}

export interface RendererSettings {
  quality: QualityLevel;
  volume: number;
  reducedMotion: boolean;
  highContrast: boolean;
  captions: boolean;
}
