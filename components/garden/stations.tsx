"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { GardenStation } from "@/lib/client/contracts";
import { Buttercup, Calendula, Daisy, Jasmine, Primrose, StemmedFlower, SunflowerHead, YellowRose } from "./flowers";
import { barkTexture, carvedStoneTexture, mossTexture, paperTexture, stoneTexture, woodTexture } from "./textures";

function useMaps() {
  return useMemo(
    () => ({
      stone: stoneTexture(),
      wood: woodTexture(),
      bark: barkTexture(),
      paper: paperTexture(),
      moss: mossTexture(),
      carved: carvedStoneTexture(["Prometo no dejar", "para después la ternura", "que puedo ofrecer hoy."]),
    }),
    [],
  );
}

function GroundBed({ color }: { color: string }) {
  const maps = useMaps();
  return (
    <group>
      <mesh receiveShadow position-y={-0.05}>
        <cylinderGeometry args={[2.35, 2.85, 0.22, 24]} />
        <meshStandardMaterial map={maps.moss} color="#556536" roughness={0.98} />
      </mesh>
      <mesh receiveShadow position-y={0.04}>
        <cylinderGeometry args={[1.55, 1.75, 0.1, 22]} />
        <meshStandardMaterial map={maps.stone} color="#94866c" roughness={0.93} />
      </mesh>
      {Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2 + 0.2;
        return (
          <group key={index} position={[Math.cos(angle) * 2.05, 0.02, Math.sin(angle) * 2.05]}>
            <StemmedFlower height={0.3 + (index % 3) * 0.05}>
              <Daisy color={color} scale={0.7} />
            </StemmedFlower>
          </group>
        );
      })}
    </group>
  );
}

function LetterSheaf({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const paper = useMemo(() => paperTexture(), []);
  return (
    <group position={position} rotation={rotation}>
      {[0, 0.012, 0.024].map((lift, index) => (
        <mesh key={lift} castShadow position={[index * 0.02, lift, index * 0.01]} rotation-z={index * 0.08}>
          <boxGeometry args={[0.28, 0.01, 0.38]} />
          <meshStandardMaterial map={paper} color="#f3e4bc" roughness={0.72} />
        </mesh>
      ))}
      <mesh position={[0.02, 0.04, 0]} rotation={[0.15, 0.2, 0.4]}>
        <boxGeometry args={[0.26, 0.008, 0.18]} />
        <meshStandardMaterial map={paper} color="#efe0b0" />
      </mesh>
    </group>
  );
}

function WaterMirror({
  position,
  scale,
  reducedMotion,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  reducedMotion: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const maps = useMaps();
  useFrame(({ clock }) => {
    if (!mesh.current || reducedMotion) return;
    mesh.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8) * 0.012;
    const material = mesh.current.material as THREE.MeshStandardMaterial;
    material.opacity = 0.72 + Math.sin(clock.elapsedTime * 1.4) * 0.06;
  });
  return (
    <group>
      <mesh receiveShadow position={[position[0], position[1] - 0.18, position[2]]}>
        <cylinderGeometry args={[2.2, 2.45, 0.38, 32]} />
        <meshStandardMaterial map={maps.stone} color="#7d7158" roughness={0.94} />
      </mesh>
      {Array.from({ length: 14 }, (_, index) => {
        const angle = (index / 14) * Math.PI * 2;
        return (
          <mesh key={index} castShadow position={[position[0] + Math.cos(angle) * 2.15, position[1] - 0.02, position[2] + Math.sin(angle) * 2.15]} scale={[0.22, 0.12, 0.16]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial map={maps.stone} color="#8f8268" roughness={0.92} />
          </mesh>
        );
      })}
      <mesh ref={mesh} position={position} rotation-x={-Math.PI / 2} scale={scale} receiveShadow>
        <circleGeometry args={[1, 48]} />
        <meshStandardMaterial color="#6a9a96" roughness={0.12} metalness={0.22} transparent opacity={0.72} />
      </mesh>
      {Array.from({ length: 6 }, (_, ripple) => (
        <mesh key={ripple} position={[position[0] + Math.sin(ripple) * 0.35, position[1] + 0.015, position[2] + Math.cos(ripple * 1.3) * 0.28]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.08 + ripple * 0.05, 0.1 + ripple * 0.05, 16]} />
          <meshBasicMaterial color="#d7efe8" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function WelcomeArch({ color, active, reducedMotion }: { color: string; active: boolean; reducedMotion: boolean }) {
  const maps = useMaps();
  const daisies = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!daisies.current || reducedMotion) return;
    const bow = active ? Math.sin(clock.elapsedTime * 1.6) * 0.28 + 0.35 : Math.sin(clock.elapsedTime * 0.6) * 0.06;
    daisies.current.rotation.x = bow;
  });
  return (
    <group>
      {[-1.35, 1.35].map((side) =>
        [0.22, 0.74, 1.26, 1.78].map((height) => (
          <mesh key={`${side}-${height}`} castShadow position={[side, height, 0]}>
            <boxGeometry args={[0.66, 0.5, 0.62]} />
            <meshStandardMaterial map={maps.stone} color="#c4b48a" roughness={0.86} />
          </mesh>
        )),
      )}
      {[-1.35, 1.35].map((side) => (
        <mesh key={`step-${side}`} position={[side, 0.04, 0.42]}>
          <boxGeometry args={[0.7, 0.1, 0.38]} />
          <meshStandardMaterial map={maps.stone} color="#b7a57a" />
        </mesh>
      ))}
      {Array.from({ length: 11 }, (_, index) => {
        const t = index / 10;
        const angle = Math.PI * t;
        const x = Math.cos(angle) * 1.38;
        const y = 2.02 + Math.sin(angle) * 1.18;
        const isKey = index === 5;
        return (
          <mesh key={`voussoir-${index}`} castShadow position={[x, y, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
            <boxGeometry args={[isKey ? 0.5 : 0.4, 0.36, isKey ? 0.68 : 0.58]} />
            <meshStandardMaterial map={maps.stone} color={isKey ? "#d2c08c" : "#c4b48a"} roughness={0.86} />
          </mesh>
        );
      })}
      {Array.from({ length: 9 }, (_, index) => {
        const t = index / 8;
        const angle = Math.PI * t;
        return (
          <mesh key={`inner-${index}`} position={[Math.cos(angle) * 1.18, 2.02 + Math.sin(angle) * 1.02, -0.06]} rotation={[0, 0, angle - Math.PI / 2]}>
            <boxGeometry args={[0.28, 0.12, 0.18]} />
            <meshStandardMaterial color="#d1b66f" roughness={0.55} metalness={0.08} />
          </mesh>
        );
      })}
      <group ref={daisies} position={[0, 2.18, -0.18]}>
        {[-0.7, -0.35, 0, 0.35, 0.7].map((x, index) => (
          <group key={x} position={[x, 0.05 + (index % 2) * 0.08, 0]} scale={0.85}>
            <Daisy color={color} open={active ? 1.15 : 0.9} />
          </group>
        ))}
      </group>
      {[-1.45, 1.45].map((side) => (
        <group key={side} position={[side, 0.15, 0.35]}>
          <StemmedFlower height={0.55} lean={side * 0.1}>
            <Daisy color={color} />
          </StemmedFlower>
        </group>
      ))}
    </group>
  );
}

function MemoryOak({ color, active }: { color: string; active: boolean }) {
  const maps = useMaps();
  return (
    <group>
      <mesh castShadow position-y={2.05}>
        <cylinderGeometry args={[0.42, 0.78, 4.1, 16]} />
        <meshStandardMaterial map={maps.bark} color="#5a3d24" roughness={0.96} />
      </mesh>
      {Array.from({ length: 5 }, (_, index) => {
        const angle = (index / 5) * Math.PI * 2;
        return (
          <group key={angle} position={[Math.cos(angle) * 0.62, 0.12, Math.sin(angle) * 0.62]} rotation={[1.82, angle, 0]}>
            <mesh castShadow position={[0, 0.42, 0]}>
              <cylinderGeometry args={[0.08, 0.22, 0.84, 8]} />
              <meshStandardMaterial map={maps.bark} color="#4a321c" />
            </mesh>
          </group>
        );
      })}
      {([
        [0.15, 3.15, 1.15, 1.55],
        [2.05, 3.35, -0.2, 1.6],
        [3.4, 4.05, 0.2, 1.35],
        [4.6, 4.25, -0.55, 1.4],
      ] as const).map(([angle, rise, _unused, length], index) => (
        <group key={index} position={[Math.cos(angle) * 0.38, rise, Math.sin(angle) * 0.38]} rotation={[0.48, angle, 0]}>
          <mesh castShadow position={[0, length / 2, 0]}>
            <cylinderGeometry args={[0.07, 0.18, length, 8]} />
            <meshStandardMaterial map={maps.bark} color="#4c331f" />
          </mesh>
        </group>
      ))}
      {([
        [0, 5.2, 0, 1.8],
        [-1.5, 4.5, 0.4, 1.25],
        [1.4, 4.65, -0.3, 1.3],
        [0.2, 5.85, -0.4, 1.1],
        [-0.6, 4.2, -1.3, 1.05],
      ] as const).map(([x, y, z, size], leaf) => (
        <mesh key={leaf} castShadow position={[x, y, z]} scale={[size, size * 0.78, size]}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial color={leaf % 2 ? "#61763b" : "#4e6a32"} roughness={0.9} />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 1.15, 4.4 + (index % 4) * 0.22, Math.sin(angle) * 1.15]}
            rotation={[0.5, angle, 0.2]}
            scale={[0.22, 0.09, 0.16]}
          >
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color={index % 2 ? color : "#e4c45a"} roughness={0.72} />
          </mesh>
        );
      })}
      <group position={[-1.85, 0.32, 0.55]} rotation-y={0.4}>
        <mesh castShadow>
          <boxGeometry args={[1.55, 0.14, 0.48]} />
          <meshStandardMaterial map={maps.stone} color="#8a7d66" />
        </mesh>
        {[-0.55, 0.55].map((side) => (
          <mesh key={side} position={[side, -0.16, 0]}>
            <boxGeometry args={[0.14, 0.32, 0.4]} />
            <meshStandardMaterial map={maps.stone} color="#746857" />
          </mesh>
        ))}
        <LetterSheaf position={[0.12, 0.1, 0]} rotation={[0, 0.2, 0]} />
      </group>
      {active && (
        <pointLight color="#ffd27a" intensity={8} distance={6} position={[0, 3.2, 0]} />
      )}
    </group>
  );
}

function RosePavilion({ color, active }: { color: string; active: boolean }) {
  const maps = useMaps();
  return (
    <group>
      {[-1.2, 1.2].map((x) =>
        [-1.05, 1.05].map((z) => (
          <group key={`${x}-${z}`}>
            <mesh position={[x, 0.08, z]}>
              <cylinderGeometry args={[0.2, 0.24, 0.16, 10]} />
              <meshStandardMaterial map={maps.stone} color="#8a7d66" />
            </mesh>
            <mesh castShadow position={[x, 1.35, z]}>
              <cylinderGeometry args={[0.09, 0.13, 2.4, 10]} />
              <meshStandardMaterial map={maps.wood} color="#7a5530" />
            </mesh>
          </group>
        )),
      )}
      {[-1.05, 0, 1.05].map((beam) => (
        <mesh key={beam} position={[0, 2.72, beam]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.07, 0.07, 2.7, 8]} />
          <meshStandardMaterial map={maps.wood} color="#8a6240" />
        </mesh>
      ))}
      {Array.from({ length: 16 }, (_, index) => {
        const post = [-1.2, 1.2][index % 2] ?? -1.2;
        const depth = [-1.05, 1.05][Math.floor(index / 2) % 2] ?? -1.05;
        const climb = 0.45 + (index % 8) * 0.26;
        return (
          <group key={index} position={[post + (index % 3) * 0.08, climb, depth + ((index % 5) - 2) * 0.08]}>
            <YellowRose color={color} scale={0.52 + (index % 3) * 0.08} />
          </group>
        );
      })}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.42, 0.5, 0.16, 16]} />
        <meshStandardMaterial map={maps.stone} color="#9a8b70" />
      </mesh>
      <LetterSheaf position={[0, 0.84, 0]} rotation={[-0.15, 0.4, 0]} />
      {active && <pointLight color={color} intensity={10} distance={6} position={[0, 2.1, 0]} />}
    </group>
  );
}

function FriendshipBridge({ color, reducedMotion }: { color: string; reducedMotion: boolean }) {
  const maps = useMaps();
  return (
    <group>
      <mesh receiveShadow position-y={-0.02} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.7, 3.05, 40]} />
        <meshStandardMaterial map={maps.moss} color="#5a4a30" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      <WaterMirror position={[0, 0.02, 0]} scale={[1.85, 1.4, 1]} reducedMotion={reducedMotion} />
      {Array.from({ length: 11 }, (_, plank) => (
        <mesh key={plank} castShadow position={[(plank - 5) * 0.36, 0.18 + Math.cos((plank - 5) * 0.32) * 0.05, 0]}>
          <boxGeometry args={[0.34, 0.1, 1.7]} />
          <meshStandardMaterial map={maps.wood} color={plank % 2 ? "#6d4f30" : "#815f38"} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.65, 0.55, 0]}>
          {[-0.7, 0.7].map((depth) => (
            <mesh key={depth} castShadow position-z={depth}>
              <boxGeometry args={[0.08, 1.15, 0.08]} />
              <meshStandardMaterial map={maps.wood} color="#5c4328" />
            </mesh>
          ))}
          <mesh position-y={0.48}>
            <boxGeometry args={[0.08, 0.08, 1.55]} />
            <meshStandardMaterial map={maps.wood} color="#6a4c2c" />
          </mesh>
        </group>
      ))}
      {[-1.9, 1.9].map((side) =>
        [-0.55, 0, 0.55].map((depth) => (
          <group key={`${side}-${depth}`} position={[side, 0, depth]}>
            <StemmedFlower height={0.42}>
              <Calendula color={color} />
            </StemmedFlower>
          </group>
        )),
      )}
    </group>
  );
}

function VineArch({ color, active }: { color: string; active: boolean }) {
  const maps = useMaps();
  const vines = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!vines.current) return;
    vines.current.children.forEach((child, index) => {
      child.scale.setScalar(0.85 + (active ? 0.22 : 0.08) * (0.6 + Math.sin(clock.elapsedTime * 1.2 + index) * 0.4));
    });
  });
  return (
    <group>
      {[-1.55, 1.55].map((side) => (
        <group key={side}>
          <mesh position={[side, 0.08, 0]}>
            <cylinderGeometry args={[0.26, 0.3, 0.18, 10]} />
            <meshStandardMaterial map={maps.stone} color="#8a7d66" />
          </mesh>
          <mesh castShadow position={[side, 1.05, 0]}>
            <boxGeometry args={[0.22, 1.95, 0.28]} />
            <meshStandardMaterial map={maps.wood} color="#57452d" roughness={0.9} />
          </mesh>
        </group>
      ))}
      {Array.from({ length: 9 }, (_, index) => {
        const t = index / 8;
        const angle = Math.PI * t;
        return (
          <mesh key={index} castShadow position={[Math.cos(angle) * 1.55, 2.02 + Math.sin(angle) * 1.15, 0]} rotation={[0, 0, angle - Math.PI / 2]}>
            <boxGeometry args={[0.32, 0.18, 0.26]} />
            <meshStandardMaterial map={maps.wood} color="#65482b" roughness={0.88} />
          </mesh>
        );
      })}
      <group ref={vines}>
        {Array.from({ length: 18 }, (_, vine) => {
          const angle = Math.PI * (0.08 + vine * 0.1);
          return (
            <group key={vine} position={[Math.cos(angle) * 1.52, 1.55 + Math.sin(angle) * 1.52, -0.12 + (vine % 3) * 0.08]} rotation-z={angle}>
              <Jasmine color={color} open={active ? 1.2 : 0.85} />
            </group>
          );
        })}
      </group>
    </group>
  );
}

function PromiseGarden({ color, active }: { color: string; active: boolean }) {
  const maps = useMaps();
  const glow = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!glow.current) return;
    const material = glow.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = (active ? 0.55 : 0.18) + Math.sin(clock.elapsedTime * 1.5) * 0.12;
  });
  return (
    <group>
      {Array.from({ length: 9 }, (_, stoneIndex) => {
        const angle = (stoneIndex / 9) * Math.PI * 2;
        return (
          <group key={stoneIndex} position={[Math.cos(angle) * 1.7, 0.18, Math.sin(angle) * 1.7]}>
            <mesh castShadow>
              <dodecahedronGeometry args={[0.28, 1]} />
              <meshStandardMaterial map={maps.stone} color="#8a7d66" />
            </mesh>
            <group position={[0, 0.28, 0]}>
              <Primrose color={color} />
            </group>
          </group>
        );
      })}
      <mesh castShadow position-y={0.55}>
        <cylinderGeometry args={[0.72, 0.92, 1.05, 14]} />
        <meshStandardMaterial map={maps.stone} color="#94856d" roughness={0.9} />
      </mesh>
      <mesh ref={glow} position={[0, 1.12, 0.42]} rotation-x={-0.45}>
        <planeGeometry args={[1.15, 0.72]} />
        <meshStandardMaterial map={maps.carved} emissive="#f0d48a" emissiveIntensity={0.3} roughness={0.7} />
      </mesh>
      <LetterSheaf position={[0.85, 0.22, 0.55]} rotation={[0, -0.6, 0]} />
      <LetterSheaf position={[-0.9, 0.22, 0.4]} rotation={[0, 0.5, 0.1]} />
    </group>
  );
}

function SunflowerClearing({ color, active, reducedMotion }: { color: string; active: boolean; reducedMotion: boolean }) {
  const field = useRef<THREE.Group>(null);
  const heads = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => {
        const angle = (index / 28) * Math.PI * 2;
        const radius = 1.4 + (index % 5) * 0.38;
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          height: 1.15 + (index % 4) * 0.18,
        };
      }),
    [],
  );
  useFrame(({ clock }) => {
    if (!field.current || reducedMotion) return;
    field.current.rotation.y = active ? clock.elapsedTime * 0.12 : Math.sin(clock.elapsedTime * 0.2) * 0.08;
    field.current.children.forEach((child, index) => {
      child.rotation.z = Math.sin(clock.elapsedTime * 1.3 + index) * (active ? 0.08 : 0.03);
    });
  });
  return (
    <group>
      <group ref={field}>
        {heads.map((head, index) => (
          <group key={index} position={[head.x, 0, head.z]}>
            <mesh castShadow position-y={head.height * 0.5} scale={[0.05, head.height, 0.05]}>
              <cylinderGeometry args={[1, 1.4, 1, 10]} />
              <meshStandardMaterial color="#3d5a22" />
            </mesh>
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 0.18, head.height * 0.45, 0]} rotation={[0.2, 0, side * 0.9]} scale={[0.28, 0.1, 0.04]}>
                <sphereGeometry args={[1, 8, 5]} />
                <meshStandardMaterial color="#4f6e2b" side={THREE.DoubleSide} />
              </mesh>
            ))}
            <group position-y={head.height}>
              <SunflowerHead color={color} turn={active ? 0.45 : 0.1} />
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}

function FinalPavilion({ color, active }: { color: string; active: boolean }) {
  const maps = useMaps();
  const lights = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!lights.current) return;
    lights.current.children.forEach((child, index) => {
      child.position.y = 1.15 + Math.sin(clock.elapsedTime * 1.4 + index) * (active ? 0.28 : 0.1);
    });
  });
  const bouquet = [Daisy, Buttercup, YellowRose, Calendula, Jasmine, Primrose];
  return (
    <group>
      {Array.from({ length: 6 }, (_, column) => {
        const angle = (column / 6) * Math.PI * 2;
        return (
          <group key={column} position={[Math.cos(angle) * 1.7, 0, Math.sin(angle) * 1.7]}>
            <mesh position-y={0.08}>
              <cylinderGeometry args={[0.22, 0.26, 0.16, 10]} />
              <meshStandardMaterial map={maps.stone} color="#8a7d66" />
            </mesh>
            <mesh castShadow position-y={1.3}>
              <cylinderGeometry args={[0.1, 0.15, 2.4, 10]} />
              <meshStandardMaterial map={maps.stone} color="#9a8868" />
            </mesh>
          </group>
        );
      })}
      <mesh position-y={2.55} rotation-y={Math.PI / 6}>
        <coneGeometry args={[2.05, 0.72, 12]} />
        <meshStandardMaterial color="#e9c56d" roughness={0.62} metalness={0.08} />
      </mesh>
      <group ref={lights}>
        {Array.from({ length: 8 }, (_, light) => {
          const angle = (light / 8) * Math.PI * 2;
          return (
            <mesh key={light} position={[Math.cos(angle) * 1.15, 1.2, Math.sin(angle) * 1.15]}>
              <octahedronGeometry args={[0.16, 0]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.3 : 0.7} />
            </mesh>
          );
        })}
      </group>
      {bouquet.map((Kind, index) => {
        const angle = (index / bouquet.length) * Math.PI * 2;
        return (
          <group key={index} position={[Math.cos(angle) * 2.15, 0.15, Math.sin(angle) * 2.15]}>
            <StemmedFlower height={0.5}>
              <Kind color={color} />
            </StemmedFlower>
          </group>
        );
      })}
    </group>
  );
}

function StationBeacon({ color, active, completed }: { color: string; active: boolean; completed: boolean }) {
  const opacity = active ? 0.7 : completed ? 0.34 : 0.2;
  return (
    <group position-y={4.15}>
      <mesh scale={(active ? 1.15 : 0.6) * 0.16}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color={color} opacity={opacity} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export function StationLandmark({
  station,
  completed,
  active,
  reducedMotion,
}: {
  station: GardenStation;
  completed: boolean;
  active: boolean;
  reducedMotion: boolean;
}) {
  return (
    <group position={station.position}>
      <GroundBed color={station.color} />
      <StationBeacon color={station.color} active={active} completed={completed} />
      {station.id === "stone_welcome_arch" && <WelcomeArch color={station.color} active={active} reducedMotion={reducedMotion} />}
      {station.id === "memory_oak" && <MemoryOak color={station.color} active={active} />}
      {station.id === "yellow_rose_pavilion" && <RosePavilion color={station.color} active={active} />}
      {station.id === "friendship_bridge" && <FriendshipBridge color={station.color} reducedMotion={reducedMotion} />}
      {station.id === "golden_vine_arch" && <VineArch color={station.color} active={active} />}
      {station.id === "promise_garden" && <PromiseGarden color={station.color} active={active} />}
      {station.id === "sunflower_clearing" && <SunflowerClearing color={station.color} active={active} reducedMotion={reducedMotion} />}
      {station.id === "final_light_pavilion" && <FinalPavilion color={station.color} active={active} />}
      {(active || completed) && <pointLight color={station.color} intensity={active ? 11 : 4} distance={7} position={[0, 2, 0]} />}
    </group>
  );
}
