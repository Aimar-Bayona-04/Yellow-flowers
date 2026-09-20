"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { QualityLevel } from "@/lib/client/contracts";
import { Buttercup, Calendula, Daisy, Jasmine, Primrose, YellowRose } from "./flowers";
import { barkTexture, dirtPathTexture, grassTexture, leafTexture, mossTexture, stoneTexture } from "./textures";

const seeded = (index: number, salt = 1) => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const STATION_CLEARINGS: ReadonlyArray<readonly [number, number, number]> = [
  [0, 5, 3.6],
  [-9, -16, 4.4],
  [10, -36, 4.4],
  [-8, -58, 4.8],
  [11, -80, 4.4],
  [-10, -104, 4.4],
  [8, -128, 5.4],
  [0, -152, 4.8],
];

function isReservedGround(x: number, z: number) {
  if (Math.abs(x) < 2.35 && z < 14 && z > -158) return true;
  return STATION_CLEARINGS.some(([sx, sz, radius]) => {
    const dx = x - sx;
    const dz = z - sz;
    return dx * dx + dz * dz < radius * radius;
  });
}

function createMeadowBloomGeometry() {
  const parts: THREE.BufferGeometry[] = [];
  for (let petal = 0; petal < 5; petal += 1) {
    const geometry = new THREE.CircleGeometry(0.07, 5);
    geometry.rotateX(-1.08);
    const angle = (petal / 5) * Math.PI * 2;
    geometry.translate(Math.cos(angle) * 0.058, 0.016, Math.sin(angle) * 0.058);
    parts.push(geometry);
  }
  const center = new THREE.SphereGeometry(0.028, 5, 3);
  center.translate(0, 0.022, 0);
  const stem = new THREE.CylinderGeometry(0.008, 0.011, 0.2, 4);
  stem.translate(0, -0.09, 0);
  const merged = mergeGeometries([...parts, center, stem], false);
  parts.forEach((part) => part.dispose());
  center.dispose();
  stem.dispose();
  if (!merged) {
    return new THREE.CircleGeometry(0.08, 6);
  }
  return merged;
}

export function Terrain() {
  const grass = useMemo(() => {
    const map = grassTexture();
    map.repeat.set(28, 56);
    return map;
  }, []);
  const path = useMemo(() => {
    const map = dirtPathTexture();
    map.repeat.set(2, 42);
    return map;
  }, []);
  const moss = useMemo(() => mossTexture(), []);
  const dirt = useMemo(() => {
    const map = dirtPathTexture();
    map.repeat.set(3, 3);
    return map;
  }, []);
  const pathStones = useMemo(
    () =>
      Array.from({ length: 86 }, (_, index) => ({
        x: Math.sin(index * 0.51) * 0.62,
        z: 12 - index * 1.95,
        rotation: (seeded(index, 4) - 0.5) * 0.4,
        scale: 0.68 + seeded(index, 9) * 0.55,
      })),
    [],
  );
  const mounds = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        x: (index % 2 ? -1 : 1) * (6.5 + seeded(index, 11) * 12),
        z: 8 - seeded(index, 12) * 155,
        scale: 2.4 + seeded(index, 13) * 2.8,
      })),
    [],
  );
  const dirtPatches = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        x: (seeded(index, 17) - 0.5) * 28,
        z: 6 - seeded(index, 18) * 150,
        scale: 1.4 + seeded(index, 19) * 1.8,
        rotation: seeded(index, 20) * Math.PI,
      })),
    [],
  );

  return (
    <group>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.14, -70]}>
        <planeGeometry args={[92, 196, 24, 40]} />
        <meshStandardMaterial map={grass} color="#6d8648" roughness={0.97} />
      </mesh>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.118, -70]}>
        <planeGeometry args={[5.6, 178, 8, 56]} />
        <meshStandardMaterial map={path} color="#9a8658" roughness={0.93} />
      </mesh>
      {mounds.map((mound, index) => (
        <mesh key={`mound-${index}`} receiveShadow position={[mound.x, -0.08, mound.z]} scale={[mound.scale, 0.18, mound.scale * 0.72]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial map={grass} color="#61783d" roughness={0.98} />
        </mesh>
      ))}
      {dirtPatches.map((patch, index) => (
        <mesh
          key={`dirt-${index}`}
          receiveShadow
          position={[patch.x, -0.105, patch.z]}
          rotation={[-Math.PI / 2, 0, patch.rotation]}
          scale={[patch.scale, patch.scale * 0.7, 1]}
        >
          <circleGeometry args={[1, 14]} />
          <meshStandardMaterial map={dirt} color="#7a6844" roughness={0.96} />
        </mesh>
      ))}
      {pathStones.map((stone, index) => (
        <mesh
          key={index}
          castShadow
          receiveShadow
          position={[stone.x, 0.01, stone.z]}
          rotation={[-Math.PI / 2, 0, stone.rotation]}
          scale={[stone.scale, stone.scale * 0.68, 1]}
        >
          <circleGeometry args={[1.05, 10]} />
          <meshStandardMaterial color={index % 3 === 0 ? "#cfc09a" : "#b7a67a"} roughness={0.9} />
        </mesh>
      ))}
      {[-22, 22].map((side) => (
        <mesh key={side} receiveShadow position={[side, -0.02, -70]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[8, 190]} />
          <meshStandardMaterial map={moss} color="#4f6234" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function FlowerField({ quality, reducedMotion }: { quality: QualityLevel; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const blooms = useRef<THREE.InstancedMesh>(null);
  const farMass = useRef<THREE.InstancedMesh>(null);
  const count = quality === "high" ? 2200 : quality === "medium" ? 1400 : 700;
  const massCount = quality === "high" ? 7800 : quality === "medium" ? 4600 : 2400;
  const hero = quality === "high" ? 16 : 8;
  const bloomGeometry = useMemo(() => createMeadowBloomGeometry(), []);

  useEffect(() => {
    if (!blooms.current || !farMass.current) return;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const color = new THREE.Color();
    const palette = ["#ffe56a", "#ffc428", "#ffd55a", "#fff09b", "#ffca4c", "#ffb703", "#f4d36a"];
    const euler = new THREE.Euler();

    const place = (index: number, salt: number) => {
      const cluster = index % 64;
      const density = 2.4 + seeded(cluster, 4 + salt) * 7.5;
      let x = (seeded(cluster, 1 + salt) - 0.5) * 54 + (seeded(index, 3 + salt) - 0.5) * density;
      let z = 13 - seeded(cluster, 2 + salt) * 170 + (seeded(index, 5 + salt) - 0.5) * density;
      if (isReservedGround(x, z)) {
        x += Math.sign(x || 1) * (2.8 + seeded(index, 9) * 3.2);
      }
      return { x, z };
    };

    for (let index = 0; index < count; index += 1) {
      const { x, z } = place(index, 0);
      const height = 0.2 + seeded(index, 6) * 0.28;
      position.set(x, height, z);
      euler.set(-0.18 + seeded(index, 11) * 0.3, seeded(index, 12) * Math.PI * 2, (seeded(index, 13) - 0.5) * 0.3);
      quaternion.setFromEuler(euler);
      scale.setScalar(0.55 + seeded(index, 8) * 0.4);
      matrix.compose(position, quaternion, scale);
      blooms.current.setMatrixAt(index, matrix);
      blooms.current.setColorAt?.(index, color.set(palette[index % palette.length] ?? "#ffe56a"));
    }

    for (let index = 0; index < massCount; index += 1) {
      const { x, z } = place(index, 40);
      position.set(x, 0.06 + seeded(index, 21) * 0.07, z);
      euler.set(-1.2, seeded(index, 22) * Math.PI, 0);
      quaternion.setFromEuler(euler);
      scale.set(0.11 + seeded(index, 23) * 0.14, 0.08 + seeded(index, 24) * 0.06, 0.11 + seeded(index, 23) * 0.14);
      matrix.compose(position, quaternion, scale);
      farMass.current.setMatrixAt(index, matrix);
      farMass.current.setColorAt?.(index, color.set(palette[(index + 3) % palette.length] ?? "#ffd55a"));
    }

    blooms.current.instanceMatrix.needsUpdate = true;
    farMass.current.instanceMatrix.needsUpdate = true;
    if (blooms.current.instanceColor) blooms.current.instanceColor.needsUpdate = true;
    if (farMass.current.instanceColor) farMass.current.instanceColor.needsUpdate = true;
  }, [count, massCount]);

  const showcase = useMemo(
    () =>
      Array.from({ length: hero }, (_, index) => {
        const kinds = [Daisy, Buttercup, Calendula, Primrose, YellowRose, Jasmine] as const;
        return {
          Kind: kinds[index % kinds.length] ?? Daisy,
          x: (index % 2 === 0 ? -1 : 1) * (2.2 + seeded(index, 41) * 2.1),
          z: 7 - seeded(index, 42) * 148,
          height: 0.42 + seeded(index, 43) * 0.32,
          scale: 0.88 + seeded(index, 44) * 0.38,
          color: ["#ffe56a", "#ffc428", "#fff09b", "#ffca4c"][index % 4] ?? "#ffe56a",
        };
      }),
    [hero],
  );

  useFrame(({ clock }) => {
    if (group.current && !reducedMotion) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.004;
    }
  });

  return (
    <group ref={group}>
      <instancedMesh ref={blooms} args={[bloomGeometry, undefined, count]} frustumCulled>
        <meshStandardMaterial color="#ffe56a" roughness={0.52} side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={farMass} args={[undefined, undefined, massCount]} frustumCulled>
        <circleGeometry args={[1, 6]} />
        <meshStandardMaterial color="#ffd55a" roughness={0.62} side={THREE.DoubleSide} />
      </instancedMesh>
      {showcase.map((flower, index) => (
        <group key={index} position={[flower.x, 0, flower.z]}>
          <mesh position-y={flower.height * 0.5} scale={[0.026, flower.height, 0.026]}>
            <cylinderGeometry args={[1, 1.2, 1, 8]} />
            <meshStandardMaterial color="#3f5c26" />
          </mesh>
          <group position-y={flower.height} rotation-x={-0.95} scale={flower.scale}>
            <flower.Kind color={flower.color} />
          </group>
        </group>
      ))}
    </group>
  );
}

function CanopyBlossoms({ count, radius, height }: { count: number; radius: number; height: number }) {
  const clusters = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2 + seeded(index, 70);
        const reach = radius * (0.42 + seeded(index, 71) * 0.62);
        return {
          x: Math.cos(angle) * reach,
          y: height - 0.08 + seeded(index, 72) * 0.55,
          z: Math.sin(angle) * reach,
          sx: 0.2 + seeded(index, 73) * 0.18,
          sy: 0.08 + seeded(index, 74) * 0.06,
          sz: 0.16 + seeded(index, 75) * 0.14,
          tilt: (seeded(index, 76) - 0.5) * 0.7,
          color: index % 3 === 0 ? "#e8c85a" : index % 3 === 1 ? "#d9b44a" : "#c8c45a",
        };
      }),
    [count, height, radius],
  );

  return (
    <group>
      {clusters.map((bloom, index) => (
        <mesh
          key={index}
          position={[bloom.x, bloom.y, bloom.z]}
          rotation={[bloom.tilt, index * 0.4, bloom.tilt * 0.4]}
          scale={[bloom.sx, bloom.sy, bloom.sz]}
        >
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color={bloom.color} roughness={0.74} />
        </mesh>
      ))}
    </group>
  );
}

function ConnectedLimb({
  angle,
  rise,
  length,
  trunkR,
  bark,
  color,
  lift = 0.48,
}: {
  angle: number;
  rise: number;
  length: number;
  trunkR: number;
  bark: THREE.CanvasTexture;
  color: string;
  lift?: number;
}) {
  return (
    <group position={[Math.cos(angle) * trunkR * 0.92, rise, Math.sin(angle) * trunkR * 0.92]} rotation={[lift, angle, 0]}>
      <mesh castShadow position={[0, length / 2, 0]}>
        <cylinderGeometry args={[Math.max(0.03, trunkR * 0.16), trunkR * 0.4, length, 8]} />
        <meshStandardMaterial map={bark} color={color} roughness={1} />
      </mesh>
    </group>
  );
}

function GardenTree({
  bark,
  leaves,
  variant,
}: {
  bark: THREE.CanvasTexture;
  leaves: THREE.CanvasTexture;
  variant: number;
  flowerKind?: number;
}) {
  const tall = variant === 1;
  const wide = variant === 2;
  const slender = variant === 3;
  const trunkH = tall ? 6.2 : wide ? 3.9 : slender ? 5.15 : 4.7;
  const trunkR = tall ? 0.2 : wide ? 0.4 : slender ? 0.15 : 0.25;
  const canopyY = trunkH + (wide ? 0.28 : 0.48);
  const canopyR = tall ? 1.05 : wide ? 1.95 : slender ? 0.88 : 1.38;
  const branchCount = wide ? 6 : tall ? 4 : slender ? 3 : 5;
  const barkColor = slender ? "#d8c4a0" : tall ? "#3d2a18" : "#6a4a2e";

  return (
    <group>
      <mesh castShadow position-y={trunkH * 0.5}>
        <cylinderGeometry args={[trunkR * 0.7, trunkR * 1.5, trunkH, 12]} />
        <meshStandardMaterial map={bark} color={barkColor} roughness={0.95} />
      </mesh>
      {Array.from({ length: 5 }, (_, index) => {
        const angle = (index / 5) * Math.PI * 2 + 0.2;
        return (
          <group
            key={`root-${index}`}
            position={[Math.cos(angle) * trunkR * 0.82, 0.12, Math.sin(angle) * trunkR * 0.82]}
            rotation={[1.82, angle, 0]}
          >
            <mesh castShadow position={[0, 0.4, 0]}>
              <cylinderGeometry args={[trunkR * 0.08, trunkR * 0.3, 0.8, 7]} />
              <meshStandardMaterial map={bark} color={barkColor} roughness={1} />
            </mesh>
          </group>
        );
      })}
      <mesh receiveShadow position-y={0.02} scale={[trunkR * 3.4, 0.06, trunkR * 3.4]}>
        <cylinderGeometry args={[1, 1.15, 1, 10]} />
        <meshStandardMaterial color="#4a3a24" roughness={1} />
      </mesh>
      {Array.from({ length: branchCount }, (_, index) => {
        const angle = (index / branchCount) * Math.PI * 2 + variant * 0.15;
        const rise = trunkH * (0.58 + (index % 3) * 0.09);
        const length = (wide ? 1.65 : tall ? 1.2 : 1.35) * (0.85 + (index % 2) * 0.18);
        return (
          <ConnectedLimb
            key={index}
            angle={angle}
            rise={rise}
            length={length}
            trunkR={trunkR}
            bark={bark}
            color={barkColor}
            lift={0.42 + (index % 3) * 0.08}
          />
        );
      })}
      {(wide
        ? [
            [0, canopyY, 0, canopyR],
            [-1.15, canopyY - 0.32, 0.35, 1.18],
            [1.1, canopyY - 0.22, -0.3, 1.22],
            [0.15, canopyY + 0.5, -0.2, 1.02],
            [-0.4, canopyY - 0.55, -0.9, 0.95],
          ]
        : tall
          ? [
              [0, canopyY, 0, 1.02],
              [0.15, canopyY - 0.8, 0.1, 0.78],
              [-0.12, canopyY - 1.65, -0.08, 0.58],
              [0.35, canopyY - 0.35, -0.25, 0.62],
            ]
          : [
              [0, canopyY, 0, canopyR],
              [-0.7, canopyY - 0.22, 0.25, 0.88],
              [0.65, canopyY - 0.12, -0.2, 0.9],
              [0.1, canopyY + 0.35, 0.15, 0.72],
            ]
      ).map((cluster, leaf) => {
        const x = cluster[0] ?? 0;
        const y = cluster[1] ?? 0;
        const z = cluster[2] ?? 0;
        const size = cluster[3] ?? 1;
        return (
          <mesh key={leaf} castShadow position={[x, y, z]} scale={[size, size * (tall ? 1.12 : 0.8), size]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial map={leaves} color={leaf % 2 ? "#62803c" : "#4f6d31"} roughness={0.9} />
          </mesh>
        );
      })}
      <CanopyBlossoms count={wide ? 14 : tall ? 9 : 11} radius={canopyR} height={canopyY} />
    </group>
  );
}

export function Trees({ quality }: { quality: QualityLevel; reducedMotion?: boolean }) {
  const bark = useMemo(() => barkTexture(), []);
  const leaves = useMemo(() => leafTexture(), []);
  const count = quality === "high" ? 16 : quality === "medium" ? 12 : 8;
  const trees = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        x: (index % 2 ? -1 : 1) * (8.4 + seeded(index, 2) * 9.5),
        z: 10 - seeded(index, 8) * 158,
        scale: 0.72 + seeded(index, 3) * 0.78,
        rotation: seeded(index, 14) * Math.PI * 2,
        variant: index % 4,
        flowerKind: index % 4,
      })),
    [count],
  );

  return (
    <group>
      {trees.map((tree, index) => (
        <group key={index} position={[tree.x, 0, tree.z]} rotation-y={tree.rotation} scale={tree.scale}>
          <GardenTree bark={bark} leaves={leaves} variant={tree.variant} flowerKind={tree.flowerKind} />
        </group>
      ))}
      {[-12, -6, 0, 6, 12].map((x, index) => (
        <group key={`rear-${x}`} position={[x, 0, 15.2]} rotation-y={index * 0.4} scale={0.85 + (index % 2) * 0.2}>
          <GardenTree bark={bark} leaves={leaves} variant={index % 4} />
        </group>
      ))}
    </group>
  );
}

export function BackgroundGrove({ quality }: { quality: QualityLevel }) {
  const trunks = useRef<THREE.InstancedMesh>(null);
  const crowns = useRef<THREE.InstancedMesh>(null);
  const blooms = useRef<THREE.InstancedMesh>(null);
  const count = quality === "high" ? 24 : quality === "medium" ? 16 : 10;
  const bloomCount = count * 5;
  const bark = useMemo(() => barkTexture(), []);
  const leaves = useMemo(() => leafTexture(), []);

  useEffect(() => {
    if (!trunks.current || !crowns.current || !blooms.current) return;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    for (let index = 0; index < count; index += 1) {
      const side = index % 2 ? -1 : 1;
      const x = side * (17 + seeded(index, 22) * 10);
      const z = 14 - seeded(index, 23) * 176;
      const height = 3.2 + seeded(index, 24) * 4.2;
      position.set(x, height * 0.5, z);
      scale.set(0.24 + height * 0.028, height, 0.24 + height * 0.028);
      matrix.compose(position, quaternion, scale);
      trunks.current.setMatrixAt(index, matrix);
      position.set(x, height + 0.9, z);
      const wide = 1.05 + seeded(index, 25) * 1.5;
      scale.set(wide, 0.95 + seeded(index, 26) * 1.15, wide);
      matrix.compose(position, quaternion, scale);
      crowns.current.setMatrixAt(index, matrix);
      for (let bloom = 0; bloom < 5; bloom += 1) {
        const angle = (bloom / 5) * Math.PI * 2 + index;
        position.set(
          x + Math.cos(angle) * wide * 0.55,
          height + 0.45 + seeded(index, 50 + bloom) * 0.85,
          z + Math.sin(angle) * wide * 0.55,
        );
        scale.set(0.22 + seeded(index, 70 + bloom) * 0.12, 0.1, 0.18 + seeded(index, 71 + bloom) * 0.1);
        matrix.compose(position, quaternion, scale);
        blooms.current.setMatrixAt(index * 5 + bloom, matrix);
      }
    }
    trunks.current.instanceMatrix.needsUpdate = true;
    crowns.current.instanceMatrix.needsUpdate = true;
    blooms.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.58, 1, 1, 8]} />
        <meshStandardMaterial map={bark} color="#584029" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, count]} castShadow={quality === "high"}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial map={leaves} color="#547038" roughness={0.96} />
      </instancedMesh>
      <instancedMesh ref={blooms} args={[undefined, undefined, bloomCount]}>
        <sphereGeometry args={[1, 7, 5]} />
        <meshStandardMaterial color="#d8c25a" roughness={0.7} />
      </instancedMesh>
    </group>
  );
}

export function GardenDetails({ quality, reducedMotion }: { quality: QualityLevel; reducedMotion: boolean }) {
  const stones = useRef<THREE.InstancedMesh>(null);
  const litter = useRef<THREE.InstancedMesh>(null);
  const stoneCount = quality === "high" ? 56 : 32;
  const litterCount = quality === "high" ? 90 : 48;
  const stone = useMemo(() => stoneTexture(), []);
  const butterflies = useMemo(
    () =>
      Array.from({ length: quality === "low" ? 3 : 6 }, (_, index) => ({
        x: (seeded(index, 80) - 0.5) * 24,
        z: 4 - seeded(index, 81) * 140,
        phase: seeded(index, 82) * Math.PI * 2,
      })),
    [quality],
  );
  const wings = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!stones.current || !litter.current) return;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const euler = new THREE.Euler();
    for (let index = 0; index < stoneCount; index += 1) {
      let x = (seeded(index, 31) - 0.5) * 50;
      let z = 12 - seeded(index, 32) * 168;
      if (isReservedGround(x, z)) x += Math.sign(x || 1) * 3.2;
      position.set(x, 0.04, z);
      euler.set(0.1, seeded(index, 33) * Math.PI, 0.08);
      quaternion.setFromEuler(euler);
      const size = 0.12 + seeded(index, 34) * 0.22;
      scale.set(size, size * 0.45, size * 0.8);
      matrix.compose(position, quaternion, scale);
      stones.current.setMatrixAt(index, matrix);
    }
    for (let index = 0; index < litterCount; index += 1) {
      const x = (seeded(index, 35) - 0.5) * 48;
      const z = 10 - seeded(index, 36) * 165;
      position.set(x, 0.02, z);
      euler.set(-1.4, seeded(index, 37) * Math.PI * 2, 0);
      quaternion.setFromEuler(euler);
      scale.set(0.09 + seeded(index, 38) * 0.08, 0.05, 1);
      matrix.compose(position, quaternion, scale);
      litter.current.setMatrixAt(index, matrix);
    }
    stones.current.instanceMatrix.needsUpdate = true;
    litter.current.instanceMatrix.needsUpdate = true;
  }, [litterCount, stoneCount]);

  useFrame(({ clock }) => {
    if (!wings.current || reducedMotion) return;
    wings.current.children.forEach((child, index) => {
      const item = butterflies[index];
      if (!item) return;
      child.position.y = 1.15 + Math.sin(clock.elapsedTime * 1.4 + item.phase) * 0.35;
      child.position.x = item.x + Math.sin(clock.elapsedTime * 0.35 + item.phase) * 1.2;
      child.rotation.y = clock.elapsedTime * 0.4 + item.phase;
    });
  });

  return (
    <group>
      <instancedMesh ref={stones} args={[undefined, undefined, stoneCount]} castShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial map={stone} color="#9a8b70" roughness={0.94} />
      </instancedMesh>
      <instancedMesh ref={litter} args={[undefined, undefined, litterCount]}>
        <planeGeometry args={[1, 0.55]} />
        <meshStandardMaterial color="#c9a84a" roughness={0.8} side={THREE.DoubleSide} />
      </instancedMesh>
      <group ref={wings}>
        {butterflies.map((fly, index) => (
          <group key={index} position={[fly.x, 1.2, fly.z]}>
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 0.05, 0, 0]} rotation={[0.2, 0, side * 0.55]} scale={[0.12, 0.08, 0.01]}>
                <sphereGeometry args={[1, 6, 4]} />
                <meshStandardMaterial color="#ffe7a0" roughness={0.45} transparent opacity={0.72} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}
