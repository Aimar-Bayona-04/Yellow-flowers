"use client";

/* R3F requires imperative camera mutation inside the render loop. */
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, Sparkles } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { GardenStation, QualityLevel } from "@/lib/client/contracts";

interface GardenSceneProps {
  stations: GardenStation[];
  completedIds: string[];
  quality: QualityLevel;
  reducedMotion: boolean;
  activeStationId?: string;
  onApproach: (station: GardenStation | null) => void;
}

const seeded = (index: number, salt = 1) => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

function Terrain() {
  const pathStones = useMemo(
    () =>
      Array.from({ length: 48 }, (_, index) => ({
        x: Math.sin(index * 0.63) * 0.55,
        z: 8 - index * 2.05,
        rotation: (seeded(index, 4) - 0.5) * 0.25,
        scale: 0.78 + seeded(index, 9) * 0.42,
      })),
    [],
  );
  return (
    <group>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.14, -39]}>
        <planeGeometry args={[52, 110, 32, 64]} />
        <meshStandardMaterial color="#435832" roughness={0.98} />
      </mesh>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.12, -39.5]}>
        <planeGeometry args={[4.8, 103]} />
        <meshStandardMaterial color="#7b7555" roughness={0.96} />
      </mesh>
      {pathStones.map((stone, index) => (
        <mesh
          key={index}
          castShadow
          receiveShadow
          position={[stone.x, 0.01, stone.z]}
          rotation={[-Math.PI / 2, 0, stone.rotation]}
          scale={[stone.scale, stone.scale * 0.64, 1]}
        >
          <circleGeometry args={[1.22, 8]} />
          <meshStandardMaterial color={index % 3 === 0 ? "#c7b987" : "#aaa27d"} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function FlowerField({ quality, reducedMotion }: { quality: QualityLevel; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const stems = useRef<THREE.InstancedMesh>(null);
  const leaves = useRef<THREE.InstancedMesh>(null);
  const petals = useRef<THREE.InstancedMesh>(null);
  const innerPetals = useRef<THREE.InstancedMesh>(null);
  const centers = useRef<THREE.InstancedMesh>(null);
  const count = quality === "high" ? 700 : quality === "medium" ? 420 : 220;
  const petalsPerFlower = 5;

  useEffect(() => {
    if (!stems.current || !leaves.current || !petals.current || !innerPetals.current || !centers.current) return;
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const position = new THREE.Vector3();
    for (let index = 0; index < count; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const z = 10 - seeded(index, 2) * 105;
      const x = side * (3.2 + seeded(index, 3) * 20);
      const height = 0.55 + seeded(index, 5) * 1.15;
      const size = 0.16 + seeded(index, 7) * 0.25;
      quaternion.setFromEuler(new THREE.Euler(0, seeded(index, 8) * Math.PI, 0));
      position.set(x, height * 0.5, z);
      scale.set(0.055, height, 0.055);
      matrix.compose(position, quaternion, scale);
      stems.current.setMatrixAt(index, matrix);
      for (let leaf = 0; leaf < 2; leaf += 1) {
        const leafSide = leaf === 0 ? -1 : 1;
        position.set(x + leafSide * .12, height * (.42 + leaf * .13), z);
        quaternion.setFromEuler(new THREE.Euler(0, leafSide * .35, leafSide * .78));
        scale.set(size * .55, size * 1.25, size * .2);
        matrix.compose(position, quaternion, scale);
        leaves.current.setMatrixAt(index * 2 + leaf, matrix);
      }
      for (let petal = 0; petal < petalsPerFlower; petal += 1) {
        const angle = (petal / petalsPerFlower) * Math.PI * 2;
        position.set(
          x + Math.cos(angle) * size * 0.58,
          height + 0.08 + Math.sin(angle) * size * 0.58,
          z,
        );
        quaternion.setFromEuler(new THREE.Euler(0, (seeded(index, 12) - .5) * .5, angle - Math.PI / 2));
        scale.set(size * 0.48, size * 0.92, size * 0.32);
        matrix.compose(position, quaternion, scale);
        petals.current.setMatrixAt(index * petalsPerFlower + petal, matrix);
        position.set(
          x + Math.cos(angle + .18) * size * .38,
          height + .08 + Math.sin(angle + .18) * size * .38,
          z - .04,
        );
        scale.set(size * .3, size * .62, size * .28);
        matrix.compose(position, quaternion, scale);
        innerPetals.current.setMatrixAt(index * petalsPerFlower + petal, matrix);
      }
      quaternion.identity();
      position.set(x, height + 0.08, z - 0.035);
      scale.set(size * 0.47, size * 0.47, size * 0.22);
      matrix.compose(position, quaternion, scale);
      centers.current.setMatrixAt(index, matrix);
    }
    stems.current.instanceMatrix.needsUpdate = true;
    leaves.current.instanceMatrix.needsUpdate = true;
    petals.current.instanceMatrix.needsUpdate = true;
    innerPetals.current.instanceMatrix.needsUpdate = true;
    centers.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  useFrame(({ clock }) => {
    if (group.current && !reducedMotion) {
      group.current.rotation.z = Math.sin(clock.elapsedTime * 0.7) * 0.006;
      group.current.position.x = Math.sin(clock.elapsedTime * 0.45) * 0.025;
    }
  });

  return (
    <group ref={group}>
      <instancedMesh ref={stems} args={[undefined, undefined, count]} castShadow={quality === "high"}>
        <cylinderGeometry args={[1, 1, 1, 5]} />
        <meshStandardMaterial color="#4f6d2d" roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={leaves} args={[undefined, undefined, count * 2]}>
        <sphereGeometry args={[1, 7, 4]} />
        <meshStandardMaterial color="#668239" roughness={.88} />
      </instancedMesh>
      <instancedMesh ref={petals} args={[undefined, undefined, count * petalsPerFlower]} castShadow={quality === "high"}>
        <sphereGeometry args={[1, 8, 5]} />
        <meshStandardMaterial color="#ffd83d" emissive="#8f5700" emissiveIntensity={0.1} roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={innerPetals} args={[undefined, undefined, count * petalsPerFlower]}>
        <sphereGeometry args={[1, 7, 4]} />
        <meshStandardMaterial color="#ffe879" emissive="#a46708" emissiveIntensity={.08} roughness={.68} />
      </instancedMesh>
      <instancedMesh ref={centers} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 5]} />
        <meshStandardMaterial color="#51351b" roughness={1} />
      </instancedMesh>
    </group>
  );
}

function Trees({ quality, reducedMotion }: { quality: QualityLevel; reducedMotion: boolean }) {
  const count = quality === "high" ? 16 : quality === "medium" ? 13 : 10;
  const trees = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        x: (index % 2 ? -1 : 1) * (9 + seeded(index, 2) * 13),
        z: 9 - seeded(index, 8) * 105,
        scale: 0.8 + seeded(index, 3) * 1.25,
        rotation: seeded(index, 14) * Math.PI,
      })),
    [count],
  );
  return (
    <group>
      {trees.map((tree, index) => (
        <Float key={index} speed={reducedMotion ? 0 : 0.35} rotationIntensity={0.025} floatIntensity={0.03}>
          <group position={[tree.x, 0, tree.z]} rotation-y={tree.rotation} scale={tree.scale}>
            <mesh castShadow position-y={2.1}>
              <cylinderGeometry args={[0.24, 0.5, 4.3, 9]} />
              <meshStandardMaterial color={index % 2 ? "#60452c" : "#684b30"} roughness={1} />
            </mesh>
            {[-1, 0, 1].map((root) => (
              <mesh key={root} castShadow position={[root * .3, .18, .08]} rotation={[0, root * 1.7, root * -.22]} scale={[.16, .16, 1.15]}>
                <cylinderGeometry args={[.5, 1, 1, 6]} />
                <meshStandardMaterial color="#563d28" roughness={1} />
              </mesh>
            ))}
            {[-.72, 0, .72].map((branch, branchIndex) => (
              <mesh
                key={branch}
                castShadow
                position={[branch, 3.15 + branchIndex * .35, 0]}
                rotation={[0, branchIndex * 1.7, branch * -.72]}
              >
                <cylinderGeometry args={[.08, .16, 1.75, 7]} />
                <meshStandardMaterial color="#5c412a" roughness={1} />
              </mesh>
            ))}
            {[
              [0, 4.85, 0, 1.45],
              [-1.05, 4.25, .18, 1.05],
              [.95, 4.42, -.25, 1.12],
              [-.5, 5.45, -.25, .95],
              [.55, 5.65, .12, .88],
            ].map(([x, y, z, size], leaf) => (
              <mesh key={leaf} castShadow position={[x ?? 0, y ?? 0, z ?? 0]} scale={[size ?? 1, (size ?? 1) * .78, size ?? 1]}>
                <dodecahedronGeometry args={[1.18, 1]} />
                <meshStandardMaterial
                  color={leaf % 3 === 0 ? "#6f833f" : leaf % 2 ? "#4d6734" : "#5d7739"}
                  roughness={0.95}
                />
              </mesh>
            ))}
            {quality === "high" && [-.62, .58].map((side) => (
              <group key={side} position={[side, 4.05, -.85]} scale={.42}>
                <GoldenBloom color={index % 2 ? "#f2c54f" : "#ffe174"} />
              </group>
            ))}
          </group>
        </Float>
      ))}
    </group>
  );
}

function BackgroundGrove({ quality }: { quality: QualityLevel }) {
  const trunks = useRef<THREE.InstancedMesh>(null);
  const crowns = useRef<THREE.InstancedMesh>(null);
  const count = quality === "high" ? 42 : quality === "medium" ? 30 : 20;

  useEffect(() => {
    if (!trunks.current || !crowns.current) return;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    for (let index = 0; index < count; index += 1) {
      const side = index % 2 ? -1 : 1;
      const x = side * (7.5 + seeded(index, 22) * 17);
      const z = 12 - seeded(index, 23) * 112;
      const height = 2.8 + seeded(index, 24) * 2.5;
      position.set(x, height * .5, z);
      scale.set(.32 + height * .03, height, .32 + height * .03);
      matrix.compose(position, quaternion, scale);
      trunks.current.setMatrixAt(index, matrix);
      position.set(x, height + 1.1, z);
      scale.set(1.3 + seeded(index, 25) * 1.2, 1.15 + seeded(index, 26) * .8, 1.3 + seeded(index, 27) * 1.2);
      matrix.compose(position, quaternion, scale);
      crowns.current.setMatrixAt(index, matrix);
    }
    trunks.current.instanceMatrix.needsUpdate = true;
    crowns.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[.62, 1, 1, 7]} />
        <meshStandardMaterial color="#584029" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, count]} castShadow={quality === "high"}>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#4b6532" roughness={.98} />
      </instancedMesh>
    </group>
  );
}

function GoldenBloom({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      {Array.from({ length: 8 }, (_, petal) => {
        const angle = (petal / 8) * Math.PI * 2;
        return (
          <mesh
            key={petal}
            castShadow
            position={[Math.cos(angle) * 0.3, Math.sin(angle) * 0.3, 0]}
            rotation-z={angle}
            scale={[0.16, 0.34, 0.18]}
          >
            <sphereGeometry args={[1, 8, 5]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={.08}
              roughness={0.66}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
      <mesh position-z={-0.02} scale={[0.21, 0.21, 0.2]}>
        <sphereGeometry args={[1, 10, 6]} />
        <meshStandardMaterial color="#5b3718" roughness={1} />
      </mesh>
      <mesh position-z={.15} scale={[.1, .1, .1]}>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#e5a91f" roughness={.82} />
      </mesh>
    </group>
  );
}

function OrnamentalBase({ color }: { color: string }) {
  return (
    <group>
      <mesh receiveShadow position-y={.08}>
        <cylinderGeometry args={[2.15, 2.35, .18, 24]} />
        <meshStandardMaterial color="#766c56" roughness={.94} />
      </mesh>
      <mesh position-y={.2} rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.82, .055, 6, 36]} />
        <meshStandardMaterial color="#c4a867" roughness={.72} />
      </mesh>
      {Array.from({ length: 10 }, (_, ornament) => {
        const angle = (ornament / 10) * Math.PI * 2;
        return (
          <group key={ornament} position={[Math.cos(angle) * 1.92, .31, Math.sin(angle) * 1.92]}>
            <mesh scale={[.16, .23, .16]}>
              <dodecahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={ornament % 2 ? color : "#e4b94f"} roughness={.75} />
            </mesh>
            <mesh position-y={-.2} scale={[.045, .2, .045]}>
              <cylinderGeometry args={[1, 1, 1, 5]} />
              <meshStandardMaterial color="#50672d" roughness={.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Lantern({ color, position }: { color: string; position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[.13, .18, .4, 8]} />
        <meshStandardMaterial color="#5b482c" roughness={.8} />
      </mesh>
      <mesh scale={[.1, .16, .1]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} roughness={.5} />
      </mesh>
    </group>
  );
}

function StationBeacon({
  color,
  active,
  completed,
}: {
  color: string;
  active: boolean;
  completed: boolean;
}) {
  const opacity = active ? .7 : completed ? .34 : .2;
  const size = active ? 1.15 : completed ? .72 : .5;
  return (
    <Float speed={active ? 1.1 : .4} floatIntensity={active ? .2 : .08} rotationIntensity={0}>
      <group position-y={4.45}>
        <mesh scale={size * .16}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial
            color={color}
            opacity={opacity}
            transparent
            depthTest={false}
            depthWrite={false}
            fog={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[.38, .022, 5, 24]} />
          <meshBasicMaterial color={color} opacity={opacity} transparent depthTest={false} fog={false} />
        </mesh>
        <mesh rotation-y={Math.PI / 2}>
          <torusGeometry args={[.38, .022, 5, 24]} />
          <meshBasicMaterial color={color} opacity={opacity * .75} transparent depthTest={false} fog={false} />
        </mesh>
      </group>
    </Float>
  );
}

function LandmarkShape({ index, color }: { index: number; color: string }) {
  const stone = <meshStandardMaterial color="#897d62" roughness={0.92} />;
  const wood = <meshStandardMaterial color="#65482b" roughness={0.95} />;
  const glow = (
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} roughness={0.48} />
  );

  if (index === 0) {
    return (
      <group>
        <mesh castShadow position={[-1.25, 1.3, 0]}><cylinderGeometry args={[0.22, 0.34, 2.6, 8]} />{stone}</mesh>
        <mesh castShadow position={[1.25, 1.3, 0]}><cylinderGeometry args={[0.22, 0.34, 2.6, 8]} />{stone}</mesh>
        <mesh castShadow position={[0, 2.6, 0]}><torusGeometry args={[1.25, 0.22, 8, 32, Math.PI]} />{stone}</mesh>
        {[-1.25, 1.25].map((side) => (
          <group key={side} position={[side, 2.48, 0]}>
            <mesh><cylinderGeometry args={[.38, .3, .18, 10]} /><meshStandardMaterial color="#ae9a70" roughness={.86} /></mesh>
            <mesh position-y={-.22}><cylinderGeometry args={[.29, .25, .26, 10]} />{stone}</mesh>
          </group>
        ))}
        <mesh position={[0, 2.61, -.03]}><torusGeometry args={[.98, .045, 6, 28, Math.PI]} /><meshStandardMaterial color="#d1b66f" roughness={.7} /></mesh>
        <group position={[0, 2.82, -0.2]}><GoldenBloom color={color} scale={1.2} /></group>
        <group position={[-1.36, 1.5, -.25]}><GoldenBloom color={color} scale={.52} /></group>
        <group position={[1.36, 1.02, -.25]}><GoldenBloom color={color} scale={.46} /></group>
      </group>
    );
  }
  if (index === 1) {
    return (
      <group>
        <mesh castShadow position-y={1.6}><cylinderGeometry args={[0.35, 0.58, 3.2, 8]} />{wood}</mesh>
        {[[0, 3.5, 0], [-.9, 3.1, .1], [.9, 3.2, 0]].map((position, leaf) => (
          <mesh key={leaf} castShadow position={position as [number, number, number]} scale={[1.25, .9, 1.1]}>
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={leaf === 0 ? "#61763b" : "#758946"} roughness={.9} />
          </mesh>
        ))}
        {[-.85, -.42, .42, .85].map((branch) => (
          <mesh key={branch} castShadow position={[branch, 2.42 + Math.abs(branch) * .28, 0]} rotation-z={branch * -.68}>
            <cylinderGeometry args={[.08, .14, 1.45, 6]} />{wood}
          </mesh>
        ))}
        {[-.7, 0, .72].map((light, lightIndex) => <Lantern key={light} color={color} position={[light, 2.65 + lightIndex * .16, -.72]} />)}
        <group position={[0, 2.1, -1]}><GoldenBloom color={color} scale={.9} /></group>
      </group>
    );
  }
  if (index === 2 || index === 7) {
    const radius = index === 7 ? 1.55 : 1.3;
    return (
      <group>
        {Array.from({ length: index === 7 ? 6 : 4 }, (_, column) => {
          const angle = (column / (index === 7 ? 6 : 4)) * Math.PI * 2;
          return (
            <group key={column} position={[Math.cos(angle) * radius, 1.25, Math.sin(angle) * radius]}>
              <mesh castShadow><cylinderGeometry args={[.1, .14, 2.5, 10]} />{stone}</mesh>
              <mesh position-y={1.18}><cylinderGeometry args={[.24, .15, .16, 10]} /><meshStandardMaterial color="#b29a67" roughness={.8} /></mesh>
              <mesh position-y={-1.18}><cylinderGeometry args={[.22, .25, .16, 10]} />{stone}</mesh>
            </group>
          );
        })}
        <mesh position-y={2.27} rotation-x={Math.PI / 2}>
          <torusGeometry args={[radius, .075, 7, 36]} />
          <meshStandardMaterial color="#c2a65f" roughness={.75} />
        </mesh>
        <mesh castShadow position-y={2.55} rotation-y={Math.PI / 4}>
          <coneGeometry args={[radius + .45, .65, index === 7 ? 12 : 8]} />
          <meshStandardMaterial color={index === 7 ? "#e9c56d" : "#907b52"} roughness={.72} />
        </mesh>
        <mesh position-y={2.91}>
          <octahedronGeometry args={[.18, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={.8} roughness={.5} />
        </mesh>
        {[-.75, .75].map((side) => <Lantern key={side} color={color} position={[side, 2.05, -.65]} />)}
        <group position={[0, 2.8, -.4]}><GoldenBloom color={color} scale={index === 7 ? 1.2 : .85} /></group>
      </group>
    );
  }
  if (index === 3) {
    return (
      <group>
        {Array.from({ length: 9 }, (_, plank) => (
          <mesh key={plank} castShadow position={[(plank - 4) * .4, .5 + Math.cos((plank - 4) * .35) * .12, 0]}>
            <boxGeometry args={[.36, .18, 2]} />
            <meshStandardMaterial color={plank % 2 ? "#6d4f30" : "#795939"} roughness={.94} />
          </mesh>
        ))}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 1.55, 1, 0]}>
            {[-.85, 0, .85].map((depth) => <mesh key={depth} castShadow position-z={depth}><boxGeometry args={[.12, 1.1, .12]} />{wood}</mesh>)}
            <mesh position-y={.45}><boxGeometry args={[.11, .1, 2]} />{wood}</mesh>
            <mesh position-y={.1}><boxGeometry args={[.08, .08, 2]} />{wood}</mesh>
            <group position={[side * .14, .55, -.9]}><GoldenBloom color={color} scale={.65} /></group>
          </group>
        ))}
        <Lantern color={color} position={[-1.65, 1.62, -.92]} />
        <Lantern color={color} position={[1.65, 1.62, -.92]} />
      </group>
    );
  }
  if (index === 4) {
    return (
      <group>
        <mesh castShadow position={[0, 1.55, 0]}><torusGeometry args={[1.55, .13, 8, 36]} />{wood}</mesh>
        <mesh position={[0, 1.55, 0]}><torusGeometry args={[1.35, .045, 6, 36]} /><meshStandardMaterial color="#d1ab4e" roughness={.76} /></mesh>
        {Array.from({ length: 7 }, (_, vine) => {
          const angle = Math.PI * (.12 + vine * .125);
          return (
            <group key={vine} position={[Math.cos(angle) * 1.52, 1.55 + Math.sin(angle) * 1.52, -.2]} rotation-z={angle}>
              <GoldenBloom color={color} scale={vine % 2 ? .5 : .66} />
            </group>
          );
        })}
        {[-1.55, 1.55].map((side) => <mesh key={side} castShadow position={[side, .8, 0]}><cylinderGeometry args={[.12, .18, 1.6, 8]} />{wood}</mesh>)}
      </group>
    );
  }
  if (index === 5) {
    return (
      <group>
        {Array.from({ length: 7 }, (_, stoneIndex) => {
          const angle = (stoneIndex / 7) * Math.PI * 2;
          return (
            <group key={stoneIndex} position={[Math.cos(angle) * 1.55, .25, Math.sin(angle) * 1.55]}>
              <mesh castShadow><dodecahedronGeometry args={[.38, 0]} />{stone}</mesh>
              <group position={[0, .42, 0]} rotation-y={-angle}><GoldenBloom color={color} scale={.42} /></group>
            </group>
          );
        })}
        <mesh castShadow position-y={.72}><cylinderGeometry args={[.55, .76, .85, 10]} />{stone}</mesh>
        <mesh position-y={1.45}><octahedronGeometry args={[.62, 0]} />{glow}</mesh>
        <mesh position-y={1.45} rotation-x={Math.PI / 2}><torusGeometry args={[.88, .035, 5, 28]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.7} /></mesh>
      </group>
    );
  }
  return (
    <group>
      <mesh castShadow position-y={1.4}><cylinderGeometry args={[.13, .2, 2.8, 8]} /><meshStandardMaterial color="#4c6b2c" roughness={.9} /></mesh>
      <group position={[0, 2.95, 0]}><GoldenBloom color={color} scale={2.25} /></group>
      <mesh position={[0, 2.95, .08]}><torusGeometry args={[.72, .035, 5, 32]} /><meshStandardMaterial color="#f3cf64" emissive="#9d6711" emissiveIntensity={.25} /></mesh>
      {[-1.3, 1.3].map((side) => (
        <group key={side}>
          <mesh position={[side * .55, 1.2, 0]} rotation-z={side * -.72} scale={[.5, .18, .08]}><sphereGeometry args={[1, 8, 5]} /><meshStandardMaterial color="#65823a" roughness={.9} /></mesh>
          <group position={[side, 1.2, .15]}><GoldenBloom color={color} scale={.72} /></group>
        </group>
      ))}
      {[-1.25, 1.25].map((side) => <Lantern key={side} color={color} position={[side, .72, -.45]} />)}
    </group>
  );
}

function MomentDetails({ index, color }: { index: number; color: string }) {
  if (index === 0) {
    return (
      <group>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 2.55, .25, 0]}>
            {[-.45, 0, .45].map((depth, stoneIndex) => (
              <mesh key={depth} castShadow position={[0, stoneIndex * .13, depth]} rotation-y={depth}>
                <dodecahedronGeometry args={[.38 - stoneIndex * .04, 0]} />
                <meshStandardMaterial color={stoneIndex % 2 ? "#9d8f70" : "#796f5b"} roughness={1} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    );
  }
  if (index === 1) {
    return (
      <group>
        <mesh position={[0, .04, .9]} rotation-x={-Math.PI / 2} scale={[1.8, 1.2, 1]}>
          <circleGeometry args={[1, 32]} />
          <meshStandardMaterial color="#77928a" roughness={.28} metalness={.08} transparent opacity={.72} />
        </mesh>
        <group position={[-1.75, .48, -.4]} rotation-y={.35}>
          <mesh castShadow><boxGeometry args={[1.35, .12, .42]} /><meshStandardMaterial color="#745536" roughness={.94} /></mesh>
          {[-.5, .5].map((side) => <mesh key={side} position={[side, -.28, 0]}><boxGeometry args={[.1, .55, .32]} /><meshStandardMaterial color="#5c432e" roughness={1} /></mesh>)}
        </group>
      </group>
    );
  }
  if (index === 2) {
    return (
      <group>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 2.05, 1.05, 0]}>
            {[-.7, 0, .7].map((height) => <mesh key={height} position-y={height}><boxGeometry args={[.06, .06, 2.5]} /><meshStandardMaterial color="#806544" roughness={.86} /></mesh>)}
            {[-.9, 0, .9].map((depth) => <mesh key={depth} position-z={depth}><boxGeometry args={[.06, 1.55, .06]} /><meshStandardMaterial color="#806544" roughness={.86} /></mesh>)}
          </group>
        ))}
      </group>
    );
  }
  if (index === 3) {
    return (
      <group>
        <mesh position={[0, .02, 0]} rotation-x={-Math.PI / 2} scale={[2.4, 1.55, 1]}>
          <circleGeometry args={[1, 32]} />
          <meshStandardMaterial color="#647f78" roughness={.24} metalness={.12} transparent opacity={.78} />
        </mesh>
        {[-1.25, 1.25].map((side) => <mesh key={side} position={[side, .18, 0]} rotation-y={Math.PI / 2}><torusGeometry args={[.62, .09, 6, 18, Math.PI]} /><meshStandardMaterial color="#756248" roughness={.9} /></mesh>)}
      </group>
    );
  }
  if (index === 4) {
    return (
      <group>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 2.25, .9, 0]}>
            <mesh><cylinderGeometry args={[.09, .14, 1.8, 7]} /><meshStandardMaterial color="#57452d" roughness={.96} /></mesh>
            {[-.45, .1, .58].map((height, flowerIndex) => <group key={height} position={[side * .12, height, -.18]}><GoldenBloom color={color} scale={.32 + flowerIndex * .05} /></group>)}
          </group>
        ))}
      </group>
    );
  }
  if (index === 5) {
    return (
      <group>
        {Array.from({ length: 8 }, (_, light) => {
          const angle = (light / 8) * Math.PI * 2;
          return <Lantern key={light} color={color} position={[Math.cos(angle) * 2.5, .55, Math.sin(angle) * 2.5]} />;
        })}
      </group>
    );
  }
  if (index === 6) {
    return (
      <group>
        {Array.from({ length: 7 }, (_, flower) => {
          const angle = (flower / 7) * Math.PI * 2;
          return (
            <group key={flower} position={[Math.cos(angle) * 2.35, .9 + (flower % 2) * .22, Math.sin(angle) * 2.35]} rotation-y={-angle}>
              <mesh position-y={-.48}><cylinderGeometry args={[.035, .055, .95, 5]} /><meshStandardMaterial color="#49692b" roughness={.9} /></mesh>
              <GoldenBloom color={color} scale={.58} />
            </group>
          );
        })}
      </group>
    );
  }
  return (
    <group>
      {Array.from({ length: 8 }, (_, light) => {
        const angle = (light / 8) * Math.PI * 2;
        return (
          <mesh key={light} position={[Math.cos(angle) * 2.2, 1.05 + (light % 2) * .35, Math.sin(angle) * 2.2]}>
            <octahedronGeometry args={[.18, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={.8} roughness={.5} />
          </mesh>
        );
      })}
    </group>
  );
}

function StationLandmark({ station, index, completed, active }: {
  station: GardenStation;
  index: number;
  completed: boolean;
  active: boolean;
}) {
  return (
    <group position={station.position}>
      <OrnamentalBase color={station.color} />
      <StationBeacon color={station.color} active={active} completed={completed} />
      <Float speed={active ? .8 : .25} floatIntensity={active ? .08 : .025} rotationIntensity={.012}>
        <LandmarkShape index={index} color={station.color} />
      </Float>
      <MomentDetails index={index} color={station.color} />
      {(active || completed) && <pointLight color={station.color} intensity={active ? 12 : 4} distance={7} position={[0, 2, 0]} />}
    </group>
  );
}

function Player({ stations, onApproach }: Pick<GardenSceneProps, "stations" | "onApproach">) {
  const { camera, gl } = useThree();
  const keys = useRef(new Set<string>());
  const yaw = useRef(0);
  const pitch = useRef(-0.08);
  const activeId = useRef<string | null>(null);
  const touchVector = useRef({ x: 0, z: 0 });
  const direction = useRef(new THREE.Vector3());
  const stationPoint = useRef(new THREE.Vector3());
  const upAxis = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    camera.position.set(0, 1.65, 11);
    const down = (event: KeyboardEvent) => keys.current.add(event.key.toLowerCase());
    const up = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    const move = (event: Event) => {
      const detail = (event as CustomEvent<{ x: number; z: number }>).detail;
      touchVector.current = detail;
    };
    const pointer = (event: PointerEvent) => {
      if (event.buttons !== 1 || event.pointerType === "touch") return;
      yaw.current -= event.movementX * 0.0024;
      pitch.current = THREE.MathUtils.clamp(pitch.current - event.movementY * 0.0018, -0.42, 0.3);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("garden-move", move);
    gl.domElement.addEventListener("pointermove", pointer);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("garden-move", move);
      gl.domElement.removeEventListener("pointermove", pointer);
    };
  }, [camera, gl]);

  useFrame((_, delta) => {
    const pressed = keys.current;
    const forward = Number(pressed.has("w") || pressed.has("arrowup")) - Number(pressed.has("s") || pressed.has("arrowdown")) + touchVector.current.z;
    const strafe = Number(pressed.has("d") || pressed.has("arrowright")) - Number(pressed.has("a") || pressed.has("arrowleft")) + touchVector.current.x;
    const heading = direction.current
      .set(strafe, 0, -forward)
      .normalize()
      .applyAxisAngle(upAxis.current, yaw.current);
    camera.position.addScaledVector(heading, Math.min(delta, 0.05) * 4.6);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -3.7, 3.7);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -91, 12);
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

/**
 * Un contexto WebGL perdido deja el lienzo congelado: three vuelve a inicializarse
 * solo si se cancela el evento por defecto.
 */
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

function QualityScaler({ quality }: { quality: QualityLevel }) {
  const setDpr = useThree((state) => state.setDpr);

  useEffect(() => {
    const ceiling = quality === "high" ? 1.75 : quality === "medium" ? 1.35 : 1;
    setDpr(Math.min(window.devicePixelRatio, ceiling));
  }, [quality, setDpr]);

  return null;
}

const RENDERER_OPTIONS = { antialias: true, powerPreference: "high-performance" } as const;
const CAMERA_OPTIONS = { fov: 58, near: 0.1, far: 150 } as const;

export function GardenScene(props: GardenSceneProps) {
  const [contextLost, setContextLost] = useState(false);
  const handleStatusChange = useCallback((lost: boolean) => setContextLost(lost), []);
  const shadowMapSize = useMemo<[number, number]>(
    () => (props.quality === "high" ? [2048, 2048] : [1024, 1024]),
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
    >
      <color attach="background" args={["#d89258"]} />
      <fog attach="fog" args={["#d6a36f", 30, 108]} />
      <ambientLight intensity={0.92} color="#fff0ce" />
      <hemisphereLight args={["#ffd9a0", "#26361e", 1.35]} />
      <directionalLight
        castShadow={props.quality !== "low"}
        color="#ffd08a"
        intensity={3.8}
        position={[-18, 21, 8]}
        shadow-mapSize={shadowMapSize}
        shadow-camera-far={80}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
      />
      <directionalLight color="#ffe9c4" intensity={0.6} position={[14, 9, -30]} />
      <QualityScaler quality={props.quality} />
      <ContextRecovery onStatusChange={handleStatusChange} />
      <Terrain />
      <FlowerField quality={props.quality} reducedMotion={props.reducedMotion} />
      <BackgroundGrove quality={props.quality} />
      <Trees quality={props.quality} reducedMotion={props.reducedMotion} />
      {props.stations.map((station, index) => (
        <StationLandmark
          key={station.id}
          station={station}
          index={index}
          completed={props.completedIds.includes(station.id)}
          active={props.activeStationId === station.id}
        />
      ))}
      <Sparkles
        count={props.quality === "high" ? 180 : 80}
        scale={[28, 7, 105]}
        position={[0, 3, -40]}
        size={props.reducedMotion ? 0.4 : 0.8}
        speed={props.reducedMotion ? 0 : 0.16}
        color="#ffe49a"
        opacity={0.5}
      />
      {props.quality === "high" && (
        <ContactShadows position={[0, 0.015, -40]} scale={60} resolution={512} opacity={0.26} blur={2.4} far={18} />
      )}
      <Player stations={props.stations} onApproach={props.onApproach} />
    </Canvas>
    </>
  );
}
