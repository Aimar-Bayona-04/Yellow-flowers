"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAmbientAudio(volume: number, reducedMotion: boolean) {
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const [enabled, setEnabled] = useState(false);

  const stop = useCallback(() => {
    void contextRef.current?.close();
    contextRef.current = null;
    masterRef.current = null;
    setEnabled(false);
  }, []);

  const start = useCallback(async () => {
    if (contextRef.current) return;
    const AudioContextClass = window.AudioContext;
    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = volume * 0.22;
    master.connect(context.destination);

    const breeze = context.createOscillator();
    const breezeGain = context.createGain();
    const filter = context.createBiquadFilter();
    breeze.type = "sine";
    breeze.frequency.value = reducedMotion ? 92 : 84;
    filter.type = "lowpass";
    filter.frequency.value = 310;
    breezeGain.gain.value = 0.09;
    breeze.connect(filter).connect(breezeGain).connect(master);
    breeze.start();

    [196, 246.94, 293.66].forEach((frequency, index) => {
      const tone = context.createOscillator();
      const gain = context.createGain();
      const pan = context.createStereoPanner();
      tone.type = "sine";
      tone.frequency.value = frequency;
      gain.gain.value = 0.016;
      pan.pan.value = index - 1;
      tone.connect(gain).connect(pan).connect(master);
      tone.start(context.currentTime + index * 0.7);
    });
    contextRef.current = context;
    masterRef.current = master;
    await context.resume();
    setEnabled(true);
  }, [reducedMotion, volume]);

  useEffect(() => {
    if (masterRef.current) masterRef.current.gain.setTargetAtTime(volume * 0.22, contextRef.current?.currentTime ?? 0, 0.08);
  }, [volume]);

  useEffect(() => stop, [stop]);
  return { enabled, start, stop };
}
