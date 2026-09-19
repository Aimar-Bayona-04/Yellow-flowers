"use client";

import type { QualityLevel, RendererSettings } from "@/lib/client/contracts";
import { CloseIcon } from "./icons";

interface SettingsPanelProps {
  open: boolean;
  settings: RendererSettings;
  onClose: () => void;
  onQuality: (quality: QualityLevel) => void;
  onVolume: (volume: number) => void;
  onReducedMotion: () => void;
  onContrast: () => void;
  onCaptions: () => void;
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return (
    <button className="setting-row" role="switch" aria-checked={checked} onClick={onChange}>
      <span>{label}</span>
      <span className={`toggle ${checked ? "is-on" : ""}`}><span /></span>
    </button>
  );
}

export function SettingsPanel(props: SettingsPanelProps) {
  if (!props.open) return null;
  return (
    <aside className="settings-panel is-open" aria-label="Preferencias de experiencia">
      <div className="settings-title">
        <div><span className="kicker">TU EXPERIENCIA</span><h2>Preferencias</h2></div>
        <button className="icon-button" aria-label="Cerrar preferencias" onClick={props.onClose}><CloseIcon /></button>
      </div>
      <label className="field-label" htmlFor="quality">Calidad visual</label>
      <select id="quality" value={props.settings.quality} onChange={(event) => props.onQuality(event.target.value as QualityLevel)}>
        <option value="low">Esencial · mayor fluidez</option>
        <option value="medium">Equilibrada</option>
        <option value="high">Cinematográfica</option>
      </select>
      <label className="field-label" htmlFor="volume">Volumen ambiental <span>{Math.round(props.settings.volume * 100)}%</span></label>
      <input id="volume" type="range" min="0" max="1" step="0.05" value={props.settings.volume} onChange={(event) => props.onVolume(event.target.valueAsNumber)} />
      <div className="setting-list">
        <Toggle checked={props.settings.captions} label="Descripciones ambientales" onChange={props.onCaptions} />
        <Toggle checked={props.settings.reducedMotion} label="Reducir movimiento" onChange={props.onReducedMotion} />
        <Toggle checked={props.settings.highContrast} label="Contraste elevado" onChange={props.onContrast} />
      </div>
      <p className="settings-note">Puedes cambiar estas opciones en cualquier momento. Tus preferencias permanecen en este dispositivo.</p>
    </aside>
  );
}
