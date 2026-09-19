"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAmbientAudio } from "@/hooks/use-ambient-audio";
import { useGardenSession } from "@/hooks/use-garden-session";
import { useGardenSettings } from "@/hooks/use-garden-settings";
import { createRendererAdapter, type RendererAdapter } from "@/lib/client/renderer";
import type { GardenStation } from "@/lib/client/contracts";
import { ArrowIcon, LeafIcon, MuteIcon, SettingsIcon, SoundIcon } from "@/components/ui/icons";
import { SettingsPanel } from "@/components/ui/settings-panel";
import { NarrativeCard } from "./narrative-card";

const GardenScene = dynamic(
  () => import("./garden-scene").then((module) => module.GardenScene),
  { ssr: false, loading: () => <div className="scene-skeleton" /> },
);

const dispatchMove = (x: number, z: number) => {
  window.dispatchEvent(new CustomEvent("garden-move", { detail: { x, z } }));
};

export function GardenExperience() {
  const { session, state, begin, completeStation, restart } = useGardenSession();
  const controls = useGardenSettings();
  const audio = useAmbientAudio(controls.settings.volume, controls.settings.reducedMotion);
  const [landed, setLanded] = useState(false);
  const [activeStation, setActiveStation] = useState<GardenStation | null>(null);
  const [memento, setMemento] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const renderer = useRef<RendererAdapter | null>(null);
  const mementoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    renderer.current = createRendererAdapter();
  }, []);

  useEffect(() => {
    renderer.current?.applySettings(controls.settings);
  }, [controls.settings]);

  useEffect(
    () => () => {
      if (mementoTimer.current) clearTimeout(mementoTimer.current);
    },
    [],
  );

  const enterGarden = useCallback(() => {
    setLanded(true);
    void audio.start();
    begin();
  }, [audio, begin]);

  const completedIds = session?.completedStationIds ?? [];
  const progress = session ? completedIds.length / Math.max(1, session.stations.length) : 0;
  const currentIndex =
    activeStation && session ? session.stations.findIndex((item) => item.id === activeStation.id) : -1;
  const showNarrative = activeStation && !completedIds.includes(activeStation.id);

  const approachStation = useCallback((station: GardenStation | null) => {
    setActiveStation(station);
  }, []);

  const markComplete = useCallback(() => {
    if (!activeStation) return;
    completeStation(activeStation.id);
    setMemento(activeStation.completionMessage);
    if (mementoTimer.current) clearTimeout(mementoTimer.current);
    mementoTimer.current = setTimeout(() => setMemento(null), 4200);
    setActiveStation(null);
  }, [activeStation, completeStation]);

  return (
    <main className={`experience ${controls.settings.highContrast ? "high-contrast" : ""} ${controls.settings.reducedMotion ? "reduced-motion" : ""}`}>
      {!landed && (
        <section className="landing">
          <div className="landing-grain" />
          <div className="sun-orb" />
          <div className="landing-copy">
            <div className="brand"><LeafIcon /><span>JARDÍN DE LA LUZ</span></div>
            <p className="kicker">UNA EXPERIENCIA PARA RECORDAR</p>
            <h1>Donde florece<br /><em>lo que sentimos.</em></h1>
            <p className="intro">Un paseo íntimo entre flores doradas, palabras que esperan ser encontradas y recuerdos que aún guardan luz.</p>
            <button className="primary-button" onClick={enterGarden}>
              <span>Entrar al jardín</span><ArrowIcon />
            </button>
            <p className="duration">8 momentos · 5–10 minutos · usa audífonos</p>
          </div>
          <button className="landing-settings" onClick={() => setSettingsOpen(true)}><SettingsIcon /> Preferencias</button>
        </section>
      )}

      {landed && session && (state === "exploring" || state === "completed") && (
        <section className="garden-shell" aria-label="Jardín interactivo tridimensional">
          <GardenScene
            stations={session.stations}
            completedIds={completedIds}
            quality={controls.settings.quality}
            reducedMotion={controls.settings.reducedMotion}
            activeStationId={activeStation?.id}
            onApproach={approachStation}
          />
          <header className="garden-header">
            <div className="garden-brand"><LeafIcon /><span>JARDÍN<br />DE LA LUZ</span></div>
            <div className="header-actions">
              <button className="icon-button glass" aria-label={audio.enabled ? "Silenciar ambiente" : "Activar ambiente"} onClick={audio.enabled ? audio.stop : () => void audio.start()}>
                {audio.enabled ? <SoundIcon /> : <MuteIcon />}
              </button>
              <button className="icon-button glass" aria-label="Abrir preferencias" onClick={() => setSettingsOpen(true)}><SettingsIcon /></button>
            </div>
          </header>
          <div className="journey-progress" aria-label={`Progreso ${Math.round(progress * 100)} por ciento`}>
            <span>EL RECORRIDO</span>
            <div className="progress-track"><i style={{ width: `${progress * 100}%` }} /></div>
            <b>{completedIds.length.toString().padStart(2, "0")} / {session.stations.length.toString().padStart(2, "0")}</b>
          </div>
          <div className="desktop-hint"><span className="key-cluster">W<br /><i>A S D</i></span><span>Camina con las teclas<br />Arrastra para mirar</span></div>
          <div className="touch-controls" aria-label="Controles de movimiento">
            <button aria-label="Avanzar" onPointerDown={() => dispatchMove(0, 1)} onPointerUp={() => dispatchMove(0, 0)}>↑</button>
            <div><button aria-label="Izquierda" onPointerDown={() => dispatchMove(-1, 0)} onPointerUp={() => dispatchMove(0, 0)}>←</button><button aria-label="Retroceder" onPointerDown={() => dispatchMove(0, -1)} onPointerUp={() => dispatchMove(0, 0)}>↓</button><button aria-label="Derecha" onPointerDown={() => dispatchMove(1, 0)} onPointerUp={() => dispatchMove(0, 0)}>→</button></div>
          </div>
          {controls.settings.captions && activeStation && <p className="ambient-caption" aria-live="polite">{activeStation.caption}</p>}
          {showNarrative && (
            <NarrativeCard
              key={activeStation.id}
              station={activeStation}
              stationIndex={currentIndex}
              stationCount={session.stations.length}
              onClose={() => approachStation(null)}
              onComplete={markComplete}
            />
          )}
          {memento && <p className="memento" aria-live="polite"><span>✦</span>{memento}</p>}
          {state === "completed" && (
            <section className="completion">
              <div className="completion-halo" />
              <div>
                <span className="kicker">EL JARDÍN QUEDA CONTIGO</span>
                <h2>Gracias por<br /><em>caminar despacio.</em></h2>
                <p>Ocho luces encontradas. Que alguna de ellas te acompañe al volver.</p>
                <button className="primary-button" onClick={restart}><span>Recorrer de nuevo</span><ArrowIcon /></button>
              </div>
            </section>
          )}
        </section>
      )}

      {landed && state === "preparing" && (
        <section className="loading-screen" aria-live="polite">
          <LeafIcon className="loading-leaf" />
          <p className="kicker">Abriendo el jardín…</p>
          <div className="loading-line"><i /></div>
          <small>Preparando flores, viento y recuerdos</small>
        </section>
      )}

      <SettingsPanel
        open={settingsOpen}
        settings={controls.settings}
        onClose={() => setSettingsOpen(false)}
        onQuality={controls.setQuality}
        onVolume={controls.setVolume}
        onReducedMotion={controls.toggleReducedMotion}
        onContrast={controls.toggleContrast}
        onCaptions={controls.toggleCaptions}
      />
      {settingsOpen && <button className="panel-backdrop" aria-label="Cerrar preferencias" onClick={() => setSettingsOpen(false)} />}
    </main>
  );
}
