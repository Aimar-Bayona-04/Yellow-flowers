import { describe, expect, it } from "vitest";
import { loadStations } from "@/lib/client/content";
import { stationSchema, stationsFileSchema } from "@/lib/domain/schemas";
import stations from "@/data/stations.json";

describe("catálogo estático del jardín", () => {
  it("valida las ocho estaciones locales", () => {
    const parsed = stationsFileSchema.parse(stations);
    expect(parsed).toHaveLength(8);
    expect(new Set(parsed.map((station) => station.id)).size).toBe(8);
  });

  it("expone posición y color para el recorrido 3D", () => {
    const gardenStations = loadStations();
    expect(gardenStations[0]?.position).toEqual([0, 0, 5]);
    expect(gardenStations.every((station) => station.color.startsWith("#"))).toBe(true);
  });

  it("incluye una experiencia narrativa única en cada momento", () => {
    const gardenStations = loadStations();
    expect(new Set(gardenStations.map((station) => station.message)).size).toBe(8);
    expect(gardenStations.every((station) => station.letters.length >= 2)).toBe(true);
    expect(gardenStations.every((station) => station.letters.every((letter) => letter.paragraphs.length >= 2))).toBe(true);
    expect(gardenStations.every((station) => station.sections.length >= 2)).toBe(true);
    expect(gardenStations.every((station) => station.flowerName.length > 0)).toBe(true);
  });

  it("rechaza campos ajenos al contenido estático", () => {
    expect(() =>
      stationSchema.parse({
        ...stations[0],
        personalMessage: "dato no permitido",
      }),
    ).toThrow();
  });
});
