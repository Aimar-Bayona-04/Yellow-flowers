import type { RendererSettings } from "./contracts";

export interface RendererAdapter {
  applySettings(settings: RendererSettings): void;
}

class LocalRendererAdapter implements RendererAdapter {
  applySettings(settings: RendererSettings): void {
    void settings;
  }
}

export function createRendererAdapter(): RendererAdapter {
  return new LocalRendererAdapter();
}
