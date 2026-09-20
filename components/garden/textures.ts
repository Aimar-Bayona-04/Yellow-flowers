import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

function canvasTexture(
  key: string,
  size: number,
  paint: (ctx: CanvasRenderingContext2D, size: number) => void,
): THREE.CanvasTexture {
  const existing = cache.get(key);
  if (existing) return existing;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear la textura del jardín.");
  paint(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  cache.set(key, texture);
  return texture;
}

export function grassTexture() {
  return canvasTexture("grass", 512, (ctx, size) => {
    ctx.fillStyle = "#3a4f2a";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 4200; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const h = 6 + Math.random() * 18;
      ctx.strokeStyle = i % 5 === 0 ? "#6d8a3c" : i % 3 === 0 ? "#2f4420" : "#4f6a31";
      ctx.lineWidth = 0.8 + Math.random();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + (Math.random() - 0.5) * 8, y - h * 0.5, x + (Math.random() - 0.5) * 6, y - h);
      ctx.stroke();
    }
    for (let i = 0; i < 80; i += 1) {
      ctx.fillStyle = `rgba(255, 214, 90, ${0.12 + Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(Math.random() * size, Math.random() * size, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

export function dirtPathTexture() {
  return canvasTexture("path", 256, (ctx, size) => {
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, "#8a7a52");
    gradient.addColorStop(0.5, "#6f6242");
    gradient.addColorStop(1, "#9a8860");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 900; i += 1) {
      ctx.fillStyle = `rgba(${110 + Math.random() * 50}, ${90 + Math.random() * 40}, ${50 + Math.random() * 30}, ${0.18 + Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.ellipse(Math.random() * size, Math.random() * size, 2 + Math.random() * 8, 1 + Math.random() * 3, Math.random(), 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

export function barkTexture() {
  return canvasTexture("bark", 256, (ctx, size) => {
    ctx.fillStyle = "#4a3422";
    ctx.fillRect(0, 0, size, size);
    for (let x = 0; x < size; x += 7) {
      ctx.strokeStyle = x % 14 === 0 ? "#2d1f14" : "#6a4a2e";
      ctx.lineWidth = 2 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(x + Math.sin(x) * 3, 0);
      for (let y = 0; y < size; y += 10) {
        ctx.lineTo(x + Math.sin(y * 0.08 + x) * 5, y);
      }
      ctx.stroke();
    }
    for (let i = 0; i < 40; i += 1) {
      ctx.fillStyle = "rgba(20, 12, 6, 0.35)";
      ctx.beginPath();
      ctx.ellipse(Math.random() * size, Math.random() * size, 4, 10, Math.random(), 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

export function stoneTexture() {
  return canvasTexture("stone", 256, (ctx, size) => {
    ctx.fillStyle = "#6f6554";
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 28) {
      const offset = (y / 28) % 2 === 0 ? 0 : 22;
      for (let x = -22; x < size; x += 44) {
        ctx.fillStyle = `rgb(${150 + ((x + y) % 40)}, ${135 + ((x * 3) % 25)}, ${110 + ((y * 2) % 20)})`;
        ctx.fillRect(x + offset + 2, y + 2, 40, 24);
        ctx.strokeStyle = "rgba(40, 32, 22, 0.55)";
        ctx.strokeRect(x + offset + 2, y + 2, 40, 24);
      }
    }
    for (let i = 0; i < 400; i += 1) {
      ctx.fillStyle = `rgba(30, 24, 16, ${Math.random() * 0.18})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }
  });
}

export function woodTexture() {
  return canvasTexture("wood", 256, (ctx, size) => {
    for (let y = 0; y < size; y += 1) {
      const wave = Math.sin(y * 0.08) * 8;
      ctx.fillStyle = y % 17 < 2 ? "#4a321c" : y % 9 < 3 ? "#7a5530" : "#6a4526";
      ctx.fillRect(0, y, size, 1);
      ctx.fillStyle = "rgba(30, 18, 8, 0.08)";
      ctx.fillRect(wave, y, size, 1);
    }
  });
}

export function petalTexture(hex: string) {
  return canvasTexture(`petal-${hex}`, 128, (ctx, size) => {
    const gradient = ctx.createRadialGradient(size * 0.45, size * 0.4, 8, size * 0.5, size * 0.5, size * 0.62);
    gradient.addColorStop(0, "#fff6c8");
    gradient.addColorStop(0.35, hex);
    gradient.addColorStop(1, "#b97812");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "rgba(255, 255, 220, 0.18)";
    for (let i = 0; i < 12; i += 1) {
      ctx.fillRect(size * 0.2 + i * 7, 0, 1.2, size);
    }
  });
}

export function paperTexture() {
  return canvasTexture("paper", 256, (ctx, size) => {
    ctx.fillStyle = "#f4e6c2";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 1200; i += 1) {
      ctx.fillStyle = `rgba(160, 130, 80, ${Math.random() * 0.08})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }
    ctx.fillStyle = "#5c3d1c";
    ctx.font = "18px Georgia";
    ctx.fillText("Querido corazón,", 18, 48);
    ctx.font = "13px Georgia";
    ctx.fillStyle = "#7a5a32";
    [
      "Hay palabras que esperan",
      "bajo esta luz tibia.",
      "Ábreme cuando quieras",
      "quedarte un rato.",
    ].forEach((line, index) => ctx.fillText(line, 22, 86 + index * 22));
  });
}

export function leafTexture() {
  return canvasTexture("leaf", 256, (ctx, size) => {
    ctx.fillStyle = "#3f5a28";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 180; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.fillStyle = i % 3 === 0 ? "#6d8a3c" : i % 2 === 0 ? "#2f4a1c" : "#547034";
      ctx.beginPath();
      ctx.ellipse(x, y, 6 + Math.random() * 10, 3 + Math.random() * 5, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

export function mossTexture() {
  return canvasTexture("moss", 256, (ctx, size) => {
    ctx.fillStyle = "#4a3d28";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 900; i += 1) {
      ctx.fillStyle = `rgba(${40 + Math.random() * 50}, ${70 + Math.random() * 60}, ${20 + Math.random() * 25}, ${0.35 + Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(Math.random() * size, Math.random() * size, 2 + Math.random() * 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

export function carvedStoneTexture(lines: string[]) {
  return canvasTexture(`carved-${lines.join("|")}`, 512, (ctx, size) => {
    ctx.fillStyle = "#9a8b72";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 900; i += 1) {
      ctx.fillStyle = `rgba(70, 60, 45, ${Math.random() * 0.18})`;
      ctx.beginPath();
      ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.textAlign = "center";
    ctx.font = "italic 28px Georgia";
    lines.forEach((line, index) => {
      ctx.fillStyle = "rgba(40, 28, 14, 0.72)";
      ctx.fillText(line, size / 2 + 1, 170 + index * 42 + 1);
      ctx.fillStyle = "rgba(255, 230, 170, 0.55)";
      ctx.fillText(line, size / 2, 170 + index * 42);
    });
  });
}
