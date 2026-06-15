import * as THREE from "three";

export function makeCheckerTexture(colorA, colorB, size = 192, cells = 12) {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = size;
  canvasTexture.height = size;
  const context = canvasTexture.getContext("2d");
  const cell = size / cells;

  for (let y = 0; y < cells; y += 1) {
    for (let x = 0; x < cells; x += 1) {
      context.fillStyle = (x + y) % 2 === 0 ? colorA : colorB;
      context.fillRect(x * cell, y * cell, cell, cell);
    }
  }

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeStripeTexture(colorA, colorB, size = 160, stripes = 10) {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = size;
  canvasTexture.height = size;
  const context = canvasTexture.getContext("2d");
  const stripe = size / stripes;

  for (let y = 0; y < stripes; y += 1) {
    context.fillStyle = y % 2 === 0 ? colorA : colorB;
    context.fillRect(0, y * stripe, size, stripe);
  }

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makePanelTexture() {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = 256;
  canvasTexture.height = 256;
  const context = canvasTexture.getContext("2d");
  context.fillStyle = "#303943";
  context.fillRect(0, 0, 256, 256);
  context.strokeStyle = "#48545f";
  context.lineWidth = 4;

  for (let i = 0; i <= 256; i += 64) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, 256);
    context.moveTo(0, i);
    context.lineTo(256, i);
    context.stroke();
  }

  context.strokeStyle = "#1e242b";
  context.lineWidth = 1;
  for (let i = 16; i < 256; i += 64) {
    context.strokeRect(i, i, 7, 7);
    context.strokeRect(i + 34, i, 7, 7);
  }

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeHazardTexture() {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = 256;
  canvasTexture.height = 64;
  const context = canvasTexture.getContext("2d");
  context.fillStyle = "#f4c34c";
  context.fillRect(0, 0, 256, 64);
  context.fillStyle = "#1c2024";
  for (let x = -64; x < 320; x += 48) {
    context.save();
    context.translate(x, 0);
    context.rotate(-Math.PI / 5);
    context.fillRect(0, -48, 24, 180);
    context.restore();
  }
  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(7, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeScuffTexture(base = "#777777", mark = "#3a3a3a", size = 256, scratches = 120) {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = size;
  canvasTexture.height = size;
  const context = canvasTexture.getContext("2d");
  context.fillStyle = base;
  context.fillRect(0, 0, size, size);
  context.strokeStyle = mark;
  context.lineWidth = 1;
  context.globalAlpha = 0.22;

  for (let i = 0; i < scratches; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const length = 8 + Math.random() * 34;
    const angle = Math.random() * Math.PI;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeLabelTexture(text, background = "#f6c453", foreground = "#151515") {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = 512;
  canvasTexture.height = 160;
  const context = canvasTexture.getContext("2d");
  context.fillStyle = background;
  context.fillRect(0, 0, 512, 160);
  context.strokeStyle = foreground;
  context.lineWidth = 14;
  context.strokeRect(16, 16, 480, 128);
  context.fillStyle = foreground;
  context.font = "700 52px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 256, 82);

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeFabricTexture() {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = 256;
  canvasTexture.height = 256;
  const context = canvasTexture.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0, "#173b4a");
  gradient.addColorStop(0.55, "#245d70");
  gradient.addColorStop(1, "#12313f");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  context.globalAlpha = 0.22;
  context.strokeStyle = "#d9f2ef";
  context.lineWidth = 1;
  for (let x = -256; x < 512; x += 12) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + 256, 256);
    context.stroke();
  }

  context.globalAlpha = 0.9;
  context.fillStyle = "#f0c342";
  context.fillRect(34, 0, 16, 256);
  context.fillRect(204, 0, 16, 256);
  context.fillRect(0, 84, 256, 13);
  context.fillStyle = "#f5efe0";
  context.fillRect(39, 0, 5, 256);
  context.fillRect(209, 0, 5, 256);

  context.globalAlpha = 0.32;
  context.fillStyle = "#0a171d";
  for (let i = 0; i < 180; i += 1) {
    context.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeFabricBumpTexture() {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = 256;
  canvasTexture.height = 256;
  const context = canvasTexture.getContext("2d");
  context.fillStyle = "#7c7c7c";
  context.fillRect(0, 0, 256, 256);
  context.strokeStyle = "#aaaaaa";
  context.lineWidth = 1;
  context.globalAlpha = 0.42;
  for (let x = -256; x < 512; x += 8) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + 256, 256);
    context.stroke();
  }
  context.globalAlpha = 0.26;
  context.strokeStyle = "#424242";
  for (let y = 0; y < 256; y += 14) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(256, y + 22);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function makeSkinTexture() {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = 128;
  canvasTexture.height = 128;
  const context = canvasTexture.getContext("2d");
  const gradient = context.createRadialGradient(52, 44, 8, 64, 64, 92);
  gradient.addColorStop(0, "#f4c09a");
  gradient.addColorStop(0.72, "#d89269");
  gradient.addColorStop(1, "#a65e42");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  context.globalAlpha = 0.16;
  context.fillStyle = "#5f2d22";
  for (let i = 0; i < 42; i += 1) {
    context.beginPath();
    context.arc(Math.random() * 128, Math.random() * 128, 0.8 + Math.random() * 1.2, 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeHelmetTexture() {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = 256;
  canvasTexture.height = 128;
  const context = canvasTexture.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 0, 128);
  gradient.addColorStop(0, "#fff0a2");
  gradient.addColorStop(0.46, "#f7c947");
  gradient.addColorStop(1, "#bb7f1c");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 128);
  context.strokeStyle = "#6f4610";
  context.lineWidth = 4;
  context.globalAlpha = 0.5;
  for (let x = 22; x < 256; x += 48) {
    context.beginPath();
    context.moveTo(x, 8);
    context.lineTo(x + 22, 120);
    context.stroke();
  }
  context.globalAlpha = 0.85;
  context.fillStyle = "#f5efe0";
  context.fillRect(0, 56, 256, 6);

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
