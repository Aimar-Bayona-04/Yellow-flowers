"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function createNoiseBuffer(context: AudioContext, seconds = 2) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let index = 0; index < data.length; index += 1) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[index] = last * 3.2;
  }
  return buffer;
}

function connectLayer(
  context: AudioContext,
  destination: AudioNode,
  options: { type?: OscillatorType; frequency: number; gain: number; filter?: number; pan?: number },
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const pan = context.createStereoPanner();
  oscillator.type = options.type ?? "sine";
  oscillator.frequency.value = options.frequency;
  filter.type = "lowpass";
  filter.frequency.value = options.filter ?? 1200;
  gain.gain.value = options.gain;
  pan.pan.value = options.pan ?? 0;
  oscillator.connect(filter).connect(gain).connect(pan).connect(destination);
  oscillator.start();
  return { oscillator, gain };
}

export function useAmbientAudio(volume: number, reducedMotion: boolean, stationId?: string) {
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const waterRef = useRef<GainNode | null>(null);
  const birdsRef = useRef<GainNode | null>(null);
  const leavesRef = useRef<GainNode | null>(null);
  const padRef = useRef<GainNode | null>(null);
  const timers = useRef<number[]>([]);
  const [enabled, setEnabled] = useState(false);

  const stop = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    void contextRef.current?.close();
    contextRef.current = null;
    masterRef.current = null;
    waterRef.current = null;
    birdsRef.current = null;
    leavesRef.current = null;
    padRef.current = null;
    setEnabled(false);
  }, []);

  const start = useCallback(async () => {
    if (contextRef.current) return;
    const context = new window.AudioContext();
    const master = context.createGain();
    master.gain.value = volume * 0.24;
    master.connect(context.destination);

    const noise = context.createBufferSource();
    noise.buffer = createNoiseBuffer(context, 3);
    noise.loop = true;
    const windFilter = context.createBiquadFilter();
    const windGain = context.createGain();
    windFilter.type = "lowpass";
    windFilter.frequency.value = reducedMotion ? 240 : 360;
    windGain.gain.value = 0.07;
    noise.connect(windFilter).connect(windGain).connect(master);
    noise.start();

    const rustle = context.createBufferSource();
    rustle.buffer = createNoiseBuffer(context, 1.4);
    rustle.loop = true;
    const rustleFilter = context.createBiquadFilter();
    const rustleGain = context.createGain();
    rustleFilter.type = "bandpass";
    rustleFilter.frequency.value = 1800;
    rustleFilter.Q.value = 0.8;
    rustleGain.gain.value = 0.03;
    rustle.connect(rustleFilter).connect(rustleGain).connect(master);
    rustle.start();
    leavesRef.current = rustleGain;

    const water = context.createBufferSource();
    water.buffer = createNoiseBuffer(context, 2.2);
    water.loop = true;
    const waterFilter = context.createBiquadFilter();
    const waterGain = context.createGain();
    waterFilter.type = "bandpass";
    waterFilter.frequency.value = 720;
    waterFilter.Q.value = 1.1;
    waterGain.gain.value = 0.001;
    water.connect(waterFilter).connect(waterGain).connect(master);
    water.start();
    waterRef.current = waterGain;

    const birds = context.createGain();
    birds.gain.value = 0.001;
    birds.connect(master);
    birdsRef.current = birds;

    const pad = context.createGain();
    pad.gain.value = 0.014;
    pad.connect(master);
    padRef.current = pad;
    [196, 246.94, 329.63, 392].forEach((frequency, index) => {
      connectLayer(context, pad, {
        frequency,
        gain: 0.22,
        filter: 900,
        pan: index / 3 - 0.5,
        type: index % 2 ? "triangle" : "sine",
      });
    });

    const chirp = () => {
      if (!contextRef.current || !birdsRef.current) return;
      const tone = context.createOscillator();
      const gain = context.createGain();
      tone.type = "sine";
      tone.frequency.setValueAtTime(1400 + Math.random() * 900, context.currentTime);
      tone.frequency.exponentialRampToValueAtTime(900 + Math.random() * 400, context.currentTime + 0.18);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
      tone.connect(gain).connect(birdsRef.current);
      tone.start();
      tone.stop(context.currentTime + 0.24);
      timers.current.push(window.setTimeout(chirp, reducedMotion ? 5200 : 1800 + Math.random() * 3200));
    };
    timers.current.push(window.setTimeout(chirp, 900));

    contextRef.current = context;
    masterRef.current = master;
    await context.resume();
    setEnabled(true);
  }, [reducedMotion, volume]);

  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.gain.setTargetAtTime(volume * 0.24, contextRef.current?.currentTime ?? 0, 0.08);
    }
  }, [volume]);

  useEffect(() => {
    const now = contextRef.current?.currentTime ?? 0;
    waterRef.current?.gain.setTargetAtTime(stationId === "friendship_bridge" ? 0.085 : 0.006, now, 0.4);
    birdsRef.current?.gain.setTargetAtTime(stationId === "memory_oak" || stationId === "sunflower_clearing" ? 0.09 : 0.035, now, 0.4);
    leavesRef.current?.gain.setTargetAtTime(stationId === "golden_vine_arch" || stationId === "memory_oak" ? 0.055 : 0.03, now, 0.4);
    padRef.current?.gain.setTargetAtTime(
      stationId === "final_light_pavilion" || stationId === "promise_garden" ? 0.028 : 0.014,
      now,
      0.5,
    );
  }, [stationId]);

  useEffect(() => stop, [stop]);
  return { enabled, start, stop };
}
