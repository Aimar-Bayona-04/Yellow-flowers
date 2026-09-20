"use client";

import { useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { petalTexture } from "./textures";

function PetalMaterial({ color, emissive = "#6a3f00", intensity = 0.12 }: { color: string; emissive?: string; intensity?: number }) {
  const map = useMemo(() => petalTexture(color), [color]);
  return (
    <meshStandardMaterial
      map={map}
      color={color}
      emissive={emissive}
      emissiveIntensity={intensity}
      roughness={0.48}
      side={THREE.DoubleSide}
    />
  );
}

export function Daisy({ color = "#ffe56a", scale = 1, open = 1 }: { color?: string; scale?: number; open?: number }) {
  const petals = 11;
  return (
    <group scale={scale}>
      {Array.from({ length: petals }, (_, petal) => {
        const angle = (petal / petals) * Math.PI * 2;
        return (
          <mesh
            key={petal}
            castShadow
            position={[Math.cos(angle) * 0.26 * open, Math.sin(angle) * 0.26 * open, 0.01]}
            rotation={[1.15, 0, angle]}
          >
            <circleGeometry args={[0.16, 14]} />
            <PetalMaterial color={petal % 2 ? "#fff4b8" : color} />
          </mesh>
        );
      })}
      <mesh position-z={0.04} scale={[0.16, 0.16, 0.1]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#c98916" roughness={0.7} />
      </mesh>
      {Array.from({ length: 10 }, (_, seed) => {
        const angle = (seed / 10) * Math.PI * 2;
        return (
          <mesh key={seed} position={[Math.cos(angle) * 0.06, Math.sin(angle) * 0.06, 0.08]} scale={0.018}>
            <sphereGeometry args={[1, 6, 4]} />
            <meshStandardMaterial color="#5a3714" />
          </mesh>
        );
      })}
    </group>
  );
}

export function Buttercup({ color = "#ffc428", scale = 1 }: { color?: string; scale?: number }) {
  return (
    <group scale={scale}>
      {Array.from({ length: 5 }, (_, petal) => {
        const angle = (petal / 5) * Math.PI * 2;
        return (
          <mesh
            key={petal}
            castShadow
            position={[Math.cos(angle) * 0.12, Math.sin(angle) * 0.12, 0.04]}
            rotation={[0.7, 0, angle]}
            scale={[0.16, 0.18, 0.07]}
          >
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color={color} roughness={0.28} metalness={0.18} emissive="#8a5200" emissiveIntensity={0.14} />
          </mesh>
        );
      })}
      <mesh position-z={0.02} scale={0.07}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#f0d36a" />
      </mesh>
    </group>
  );
}

export function YellowRose({ color = "#ffe37b", scale = 1 }: { color?: string; scale?: number }) {
  return (
    <group scale={scale}>
      {[0.34, 0.24, 0.15].map((radius, layer) =>
        Array.from({ length: 8 - layer }, (_, petal) => {
          const angle = (petal / (8 - layer)) * Math.PI * 2 + layer * 0.28;
          return (
            <mesh
              key={`${layer}-${petal}`}
              castShadow
              position={[Math.cos(angle) * radius, Math.sin(angle) * radius, layer * 0.05]}
              rotation={[0.45 + layer * 0.2, 0, angle]}
              scale={[0.13 - layer * 0.02, 0.2 - layer * 0.03, 0.05]}
            >
              <sphereGeometry args={[1, 10, 8]} />
              <PetalMaterial color={color} intensity={0.1} />
            </mesh>
          );
        }),
      )}
      <mesh position-z={0.12} scale={0.08}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#d7a227" roughness={0.55} />
      </mesh>
    </group>
  );
}

export function Calendula({ color = "#ffc928", scale = 1 }: { color?: string; scale?: number }) {
  const petals = 22;
  return (
    <group scale={scale}>
      {Array.from({ length: petals }, (_, petal) => {
        const angle = (petal / petals) * Math.PI * 2;
        return (
          <mesh
            key={petal}
            castShadow
            position={[Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, 0.01]}
            rotation={[1.2, 0, angle]}
          >
            <circleGeometry args={[0.14, 12]} />
            <PetalMaterial color={petal % 2 ? color : "#ffd86a"} />
          </mesh>
        );
      })}
      <mesh position-z={0.03} scale={[0.12, 0.12, 0.07]}>
        <sphereGeometry args={[1, 10, 6]} />
        <meshStandardMaterial color="#8a4d12" roughness={0.85} />
      </mesh>
    </group>
  );
}

export function Jasmine({ color = "#fff09b", scale = 1, open = 1 }: { color?: string; scale?: number; open?: number }) {
  return (
    <group scale={scale}>
      {Array.from({ length: 6 }, (_, petal) => {
        const angle = (petal / 6) * Math.PI * 2;
        return (
          <mesh
            key={petal}
            position={[Math.cos(angle) * 0.09 * open, Math.sin(angle) * 0.09 * open, 0.02]}
            rotation={[0.35, 0, angle]}
            scale={[0.07, 0.14, 0.03]}
          >
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color={color} roughness={0.4} emissive="#c9a322" emissiveIntensity={0.08} />
          </mesh>
        );
      })}
      <mesh rotation-x={Math.PI / 2} position-z={-0.04} scale={[0.04, 0.08, 0.04]}>
        <cylinderGeometry args={[1, 0.7, 1, 8]} />
        <meshStandardMaterial color="#d8c46a" />
      </mesh>
    </group>
  );
}

export function Primrose({ color = "#ffca4c", scale = 1 }: { color?: string; scale?: number }) {
  return (
    <group scale={scale}>
      {Array.from({ length: 5 }, (_, petal) => {
        const angle = (petal / 5) * Math.PI * 2;
        return (
          <mesh
            key={petal}
            position={[Math.cos(angle) * 0.13, Math.sin(angle) * 0.13, 0.02]}
            rotation={[0.25, 0, angle]}
            scale={[0.12, 0.16, 0.04]}
          >
            <sphereGeometry args={[1, 9, 7]} />
            <PetalMaterial color={color} />
          </mesh>
        );
      })}
      <mesh position-z={0.04} scale={0.055}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#f4ef9a" />
      </mesh>
    </group>
  );
}

export function SunflowerHead({ color = "#ffe271", turn = 0 }: { color?: string; turn?: number }) {
  const petals = 18;
  return (
    <group rotation-x={0.35 + turn * 0.15} rotation-y={turn}>
      {Array.from({ length: petals }, (_, petal) => {
        const angle = (petal / petals) * Math.PI * 2;
        return (
          <mesh
            key={petal}
            castShadow
            position={[Math.cos(angle) * 0.42, Math.sin(angle) * 0.42, 0]}
            rotation={[0.05, 0, angle]}
            scale={[0.1, 0.38, 0.045]}
          >
            <sphereGeometry args={[1, 10, 7]} />
            <PetalMaterial color={color} intensity={0.16} />
          </mesh>
        );
      })}
      <mesh scale={[0.38, 0.38, 0.14]}>
        <sphereGeometry args={[1, 16, 10]} />
        <meshStandardMaterial color="#4a2a10" roughness={1} />
      </mesh>
      {Array.from({ length: 16 }, (_, seed) => {
        const ring = 0.08 + (seed % 6) * 0.04;
        const angle = seed * 2.399;
        return (
          <mesh key={seed} position={[Math.cos(angle) * ring, Math.sin(angle) * ring, 0.07]} scale={0.018}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={seed % 2 ? "#2b1608" : "#6b3b12"} />
          </mesh>
        );
      })}
    </group>
  );
}

export function StemmedFlower({
  children,
  height = 0.9,
  lean = 0,
}: {
  children: ReactNode;
  height?: number;
  lean?: number;
}) {
  return (
    <group rotation-z={lean}>
      <mesh castShadow position-y={height * 0.5} scale={[0.035, height, 0.035]}>
        <cylinderGeometry args={[1, 1.3, 1, 8]} />
        <meshStandardMaterial color="#3f5a24" roughness={0.86} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.12, height * 0.42, 0.02]} rotation={[0, 0, side * 0.85]} scale={[0.16, 0.07, 0.03]}>
          <sphereGeometry args={[1, 8, 5]} />
          <meshStandardMaterial color="#56762f" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <group position-y={height} rotation-x={-0.95}>
        {children}
      </group>
    </group>
  );
}

export function FlowerByKind({
  kind,
  color,
  scale = 1,
  open = 1,
  turn = 0,
}: {
  kind: string;
  color: string;
  scale?: number;
  open?: number;
  turn?: number;
}) {
  if (kind.includes("girasol")) return <SunflowerHead color={color} turn={turn} />;
  if (kind.includes("rosa")) return <YellowRose color={color} scale={scale} />;
  if (kind.includes("calendula") || kind.includes("caléndula")) return <Calendula color={color} scale={scale} />;
  if (kind.includes("jazmin") || kind.includes("jazmín")) return <Jasmine color={color} scale={scale} open={open} />;
  if (kind.includes("primula") || kind.includes("prímula")) return <Primrose color={color} scale={scale} />;
  if (kind.includes("boton") || kind.includes("botón")) return <Buttercup color={color} scale={scale} />;
  return <Daisy color={color} scale={scale} open={open} />;
}
