"use client";

/* R3F requires imperative camera mutation inside the render loop. */
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { GardenStation, QualityLevel } from "@/lib/client/contracts";
import { StationLandmark } from "./stations";
import { BackgroundGrove, FlowerField, GardenDetails, Terrain, Trees } from "./vegetation";

interface GardenSceneProps {
  stations: GardenStation[];
  completedIds: string[];
  quality: QualityLevel;
  reducedMotion: boolean;
  activeStationId?: string;
  onApproach: (station: GardenStation | null) => void;
}

function Player({ stations, onApproach }: Pick<GardenSceneProps, "stations" | "onApproach">) {
  const { camera, gl } = useThree();
  const keys = useRef(new Set<string>());
  const yaw = useRef(0);
  const pitch = useRef(-0.08);
  const headingYaw = useRef(0);
  const lookTarget = useRef({ yaw: 0, pitch: -0.08 });
  const pointerLocked = useRef(false);
  const lastTap = useRef(0);
  const activeId = useRef<string | null>(null);
  const touchVector = useRef({ x: 0, z: 0 });
  const direction = useRef(new THREE.Vector3());
  const stationPoint = useRef(new THREE.Vector3());
  const upAxis = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    camera.position.set(0, 1.65, 11);
    const canvas = gl.domElement;
    canvas.style.cursor = "crosshair";

    const down = (event: KeyboardEvent) => keys.current.add(event.key.toLowerCase());
    const up = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    const move = (event: Event) => {
      const detail = (event as CustomEvent<{ x: number; z: number }>).detail;
      touchVector.current = detail;
    };
    const turnAround = () => {
      headingYaw.current += Math.PI;
    };
    const applyLook = (movementX: number, movementY: number) => {
      headingYaw.current -= movementX * 0.0026;
      lookTarget.current.pitch = THREE.MathUtils.clamp(lookTarget.current.pitch - movementY * 0.002, -0.55, 0.38);
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (pointerLocked.current) {
        applyLook(event.movementX, event.movementY);
        return;
      }
      if (event.target !== canvas) return;
      const rect = canvas.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      lookTarget.current.yaw = -nx * 0.7;
      lookTarget.current.pitch = THREE.MathUtils.clamp(-ny * 0.32, -0.5, 0.32);
    };
    const lockChange = () => {
      pointerLocked.current = document.pointerLockElement === canvas;
      canvas.style.cursor = pointerLocked.current ? "none" : "crosshair";
    };
    const doubleClick = () => turnAround();
    const tap = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      const now = performance.now();
      if (now - lastTap.current < 340) turnAround();
      lastTap.current = now;
    };
    const lookBack = () => turnAround();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("garden-move", move);
    window.addEventListener("garden-look-back", lookBack);
    window.addEventListener("pointermove", pointer);
    document.addEventListener("pointerlockchange", lockChange);
    canvas.addEventListener("dblclick", doubleClick);
    canvas.addEventListener("pointerdown", tap);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("garden-move", move);
      window.removeEventListener("garden-look-back", lookBack);
      window.removeEventListener("pointermove", pointer);
      document.removeEventListener("pointerlockchange", lockChange);
      canvas.removeEventListener("dblclick", doubleClick);
      canvas.removeEventListener("pointerdown", tap);
    };
  }, [camera, gl]);

  useFrame((_, delta) => {
    yaw.current = THREE.MathUtils.damp(yaw.current, headingYaw.current + lookTarget.current.yaw, 8, delta);
    pitch.current = THREE.MathUtils.damp(pitch.current, lookTarget.current.pitch, 8, delta);
    const pressed = keys.current;
    const forward = Number(pressed.has("w") || pressed.has("arrowup")) - Number(pressed.has("s") || pressed.has("arrowdown")) + touchVector.current.z;
    const strafe = Number(pressed.has("d") || pressed.has("arrowright")) - Number(pressed.has("a") || pressed.has("arrowleft")) + touchVector.current.x;
    const heading = direction.current
      .set(strafe, 0, -forward)
      .normalize()
      .applyAxisAngle(upAxis.current, yaw.current);
    camera.position.addScaledVector(heading, Math.min(delta, 0.05) * 4.8);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -16.5, 16.5);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -158, 16);
    camera.position.y = 1.65;
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
    let nearestIndex = -1;
    let nearestDistance = Number.POSITIVE_INFINITY;
    stations.forEach((station, index) => {
      const distance = camera.position.distanceTo(stationPoint.current.set(...station.position));
      if (distance < station.triggerDistanceMeters && distance < nearestDistance) {
        nearestIndex = index;
        nearestDistance = distance;
      }
    });
    const nearest = nearestIndex >= 0 ? stations[nearestIndex] ?? null : null;
    const nextId = nearest?.id ?? null;
    if (nextId !== activeId.current) {
      activeId.current = nextId;
      onApproach(nearest);
    }
  });
  return null;
}

function ContextRecovery({ onStatusChange }: { onStatusChange: (lost: boolean) => void }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (event: Event) => {
      event.preventDefault();
      onStatusChange(true);
    };
    const handleRestored = () => onStatusChange(false);
    canvas.addEventListener("webglcontextlost", handleLost);
    canvas.addEventListener("webglcontextrestored", handleRestored);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleLost);
      canvas.removeEventListener("webglcontextrestored", handleRestored);
    };
  }, [gl, onStatusChange]);

  return null;
}

function GardenClouds({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return;
    group.current.position.x = Math.sin(clock.elapsedTime * 0.012) * 4;
  });
  const puffs = [
    { x: -18, y: 28, z: -22, s: 6.5 },
    { x: 20, y: 31, z: -62, s: 7.2 },
    { x: -8, y: 30, z: -108, s: 5.8 },
    { x: 14, y: 33, z: -146, s: 6.4 },
  ] as const;
  return (
    <group ref={group}>
      {puffs.map((puff) => (
        <group key={`${puff.x}-${puff.z}`} position={[puff.x, puff.y, puff.z]}>
          <mesh scale={[puff.s, puff.s * 0.38, puff.s * 0.7]}>
            <sphereGeometry args={[1, 10, 7]} />
            <meshStandardMaterial color="#fff6e8" transparent opacity={0.42} roughness={1} depthWrite={false} />
          </mesh>
          <mesh position={[puff.s * 0.35, -0.2, 0.4]} scale={[puff.s * 0.55, puff.s * 0.26, puff.s * 0.45]}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#fff1d8" transparent opacity={0.32} roughness={1} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function QualityScaler({ quality }: { quality: QualityLevel }) {
  const setDpr = useThree((state) => state.setDpr);

  useEffect(() => {
    const ceiling = quality === "high" ? 1.75 : quality === "medium" ? 1.35 : 1;
    setDpr(Math.min(window.devicePixelRatio, ceiling));
  }, [quality, setDpr]);

  return null;
}

const RENDERER_OPTIONS = { antialias: true, powerPreference: "high-performance" } as const;
const CAMERA_OPTIONS = { fov: 58, near: 0.1, far: 220 } as const;

export function GardenScene(props: GardenSceneProps) {
  const [contextLost, setContextLost] = useState(false);
  const handleStatusChange = useCallback((lost: boolean) => setContextLost(lost), []);
  const shadowMapSize = useMemo<[number, number]>(
    () => (props.quality === "high" ? [1024, 1024] : [512, 512]),
    [props.quality],
  );

  return (
    <>
      {contextLost && (
        <div className="context-lost" aria-live="assertive">
          <p>El jardín perdió aceleración gráfica.</p>
          <button className="secondary-button" onClick={() => window.location.reload()}>
            Reiniciar la escena
          </button>
        </div>
      )}
      <Canvas
        shadows="percentage"
        dpr={1}
        camera={CAMERA_OPTIONS}
        gl={RENDERER_OPTIONS}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.88;
        }}
      >
        <color attach="background" args={["#8ec4e6"]} />
        <fog attach="fog" args={["#d9b67a", 42, 155]} />
        <ambientLight intensity={1.05} color="#fff1d4" />
        <hemisphereLight args={["#ffd9a4", "#5d7040", 1.45]} />
        <directionalLight
          castShadow={props.quality !== "low"}
          color="#ffd089"
          intensity={3.8}
          position={[-16, 14, 10]}
          shadow-mapSize={shadowMapSize}
          shadow-camera-far={160}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={70}
          shadow-camera-bottom={-70}
        />
        <directionalLight color="#fff1d2" intensity={1.45} position={[20, 12, -40]} />
        <directionalLight color="#ffd9a0" intensity={0.55} position={[0, 8, -90]} />
        <GardenClouds reducedMotion={props.reducedMotion} />
        <QualityScaler quality={props.quality} />
        <ContextRecovery onStatusChange={handleStatusChange} />
        <Terrain />
        <FlowerField quality={props.quality} reducedMotion={props.reducedMotion} />
        <GardenDetails quality={props.quality} reducedMotion={props.reducedMotion} />
        <BackgroundGrove quality={props.quality} />
        <Trees quality={props.quality} reducedMotion={props.reducedMotion} />
        {props.stations.map((station) => (
          <StationLandmark
            key={station.id}
            station={station}
            completed={props.completedIds.includes(station.id)}
            active={props.activeStationId === station.id}
            reducedMotion={props.reducedMotion}
          />
        ))}
        <Sparkles
          count={props.quality === "high" ? 140 : 70}
          scale={[48, 8, 170]}
          position={[0, 3.2, -70]}
          size={props.reducedMotion ? 0.35 : 0.7}
          speed={props.reducedMotion ? 0 : 0.14}
          color="#ffe49a"
          opacity={0.38}
        />
        <Player stations={props.stations} onApproach={props.onApproach} />
      </Canvas>
    </>
  );
}
