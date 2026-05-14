import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.querySelector("#factory-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.28;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202b32);
scene.fog = new THREE.Fog(0x202b32, 22, 46);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(8.8, 5.1, 9.2);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0.1, 1.35, 0.05);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.48;
controls.minDistance = 4;
controls.maxDistance = 22;

const clock = new THREE.Clock();

const state = {
  running: true,
  night: false,
  lampOn: true,
  speed: 1,
  cameraIndex: 0,
};

const cameraViews = [
  { position: new THREE.Vector3(8.8, 5.1, 9.2), target: new THREE.Vector3(0.1, 1.35, 0.05) },
  { position: new THREE.Vector3(-6.6, 3.3, 4.2), target: new THREE.Vector3(-1.5, 1.4, -0.2) },
  { position: new THREE.Vector3(1.5, 7.2, 6.3), target: new THREE.Vector3(0, 0.75, 0) },
  { position: new THREE.Vector3(4.3, 2.2, -4.7), target: new THREE.Vector3(1.2, 1.4, 0.2) },
  { position: new THREE.Vector3(11.5, 7.2, 11.4), target: new THREE.Vector3(0, 1.1, -0.15) },
];

function makeCheckerTexture(colorA, colorB, size = 192, cells = 12) {
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

function makeStripeTexture(colorA, colorB, size = 160, stripes = 10) {
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

function makePanelTexture() {
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

function makeHazardTexture() {
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

function makeLabelTexture(text, background = "#f6c453", foreground = "#151515") {
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

const floorTexture = makeCheckerTexture("#505d5d", "#465252", 192, 12);
floorTexture.repeat.set(8, 8);
const beltTexture = makeStripeTexture("#202326", "#3d464b");
const wallTexture = makePanelTexture();
const hazardTexture = makeHazardTexture();

const materials = {
  floor: new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.78, metalness: 0.05 }),
  wall: new THREE.MeshStandardMaterial({ map: wallTexture, roughness: 0.58, metalness: 0.15 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x8a969c, metalness: 0.78, roughness: 0.24 }),
  brushed: new THREE.MeshStandardMaterial({ color: 0xb7c1c4, metalness: 0.9, roughness: 0.18 }),
  darkSteel: new THREE.MeshStandardMaterial({ color: 0x22292e, metalness: 0.7, roughness: 0.32 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x101315, metalness: 0.12, roughness: 0.68 }),
  yellow: new THREE.MeshStandardMaterial({ color: 0xf6c453, metalness: 0.22, roughness: 0.36 }),
  orange: new THREE.MeshStandardMaterial({ color: 0xe9853f, metalness: 0.18, roughness: 0.42 }),
  mutedOrange: new THREE.MeshStandardMaterial({ color: 0xb86538, metalness: 0.12, roughness: 0.56 }),
  palletWood: new THREE.MeshStandardMaterial({ color: 0x9a6b42, metalness: 0.03, roughness: 0.82 }),
  rubberMat: new THREE.MeshStandardMaterial({ color: 0x15191a, metalness: 0.02, roughness: 0.9 }),
  oil: new THREE.MeshStandardMaterial({
    color: 0x0b0f10,
    metalness: 0.15,
    roughness: 0.18,
    transparent: true,
    opacity: 0.42,
  }),
  teal: new THREE.MeshStandardMaterial({ color: 0x42c6a3, metalness: 0.25, roughness: 0.34 }),
  red: new THREE.MeshStandardMaterial({ color: 0xff5a4f, metalness: 0.18, roughness: 0.38 }),
  pipeRed: new THREE.MeshStandardMaterial({ color: 0xb33e36, metalness: 0.45, roughness: 0.36 }),
  pipeBlue: new THREE.MeshStandardMaterial({ color: 0x3d77a6, metalness: 0.45, roughness: 0.34 }),
  pipeGreen: new THREE.MeshStandardMaterial({ color: 0x3d8f68, metalness: 0.42, roughness: 0.38 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x4287f5, metalness: 0.18, roughness: 0.35 }),
  safetyWhite: new THREE.MeshStandardMaterial({ color: 0xdbe2df, metalness: 0.12, roughness: 0.48 }),
  warningBlack: new THREE.MeshStandardMaterial({ color: 0x111417, metalness: 0.18, roughness: 0.44 }),
  zoneBlue: new THREE.MeshStandardMaterial({ color: 0x2f6984, metalness: 0.05, roughness: 0.72 }),
  zoneGreen: new THREE.MeshStandardMaterial({ color: 0x3a725f, metalness: 0.05, roughness: 0.72 }),
  belt: new THREE.MeshStandardMaterial({ map: beltTexture, roughness: 0.74, metalness: 0.05 }),
  glass: new THREE.MeshPhysicalMaterial({
    color: 0x9ad9ff,
    roughness: 0.03,
    metalness: 0,
    transmission: 0.28,
    transparent: true,
    opacity: 0.5,
  }),
  crate: new THREE.MeshStandardMaterial({ color: 0xb56b43, roughness: 0.68 }),
  hazard: new THREE.MeshStandardMaterial({ map: hazardTexture, roughness: 0.52 }),
  glowGreen: new THREE.MeshStandardMaterial({ color: 0x68f5a0, emissive: 0x2dff85, emissiveIntensity: 1.6 }),
  glowRed: new THREE.MeshStandardMaterial({ color: 0xff665c, emissive: 0xff362b, emissiveIntensity: 1.4 }),
  glowBlue: new THREE.MeshStandardMaterial({ color: 0x9ad9ff, emissive: 0x4cb9ff, emissiveIntensity: 1.1 }),
  lampGlow: new THREE.MeshBasicMaterial({ color: 0xffe0a2 }),
};

function shadow(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addBox(parent, size, position, material) {
  const mesh = shadow(new THREE.Mesh(new THREE.BoxGeometry(...size), material));
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function addCylinder(parent, radiusTop, radiusBottom, height, position, material, radialSegments = 32) {
  const mesh = shadow(
    new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments), material),
  );
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function addSphere(parent, radius, position, material, segments = 24) {
  const mesh = shadow(new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), material));
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function addCable(points, radius = 0.025) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const mesh = shadow(new THREE.Mesh(new THREE.TubeGeometry(curve, 32, radius, 8), materials.rubber));
  scene.add(mesh);
  return mesh;
}

function addPipe(parent, start, end, radius, material) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const direction = new THREE.Vector3().subVectors(endVector, startVector);
  const length = direction.length();
  const mesh = shadow(new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 20), material));
  mesh.position.copy(startVector).add(endVector).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  parent.add(mesh);
  return mesh;
}

function createVent(parent, position, rotationY = 0) {
  const vent = new THREE.Group();
  vent.position.set(...position);
  vent.rotation.y = rotationY;
  parent.add(vent);

  addBox(vent, [1.35, 0.72, 0.08], [0, 0, 0], materials.darkSteel);
  for (let y = -0.24; y <= 0.24; y += 0.16) {
    addBox(vent, [1.12, 0.035, 0.06], [0, y, 0.055], materials.brushed);
  }

  return vent;
}

function createWarningPanel(parent, position, rotationY = 0) {
  const sign = new THREE.Group();
  sign.position.set(...position);
  sign.rotation.y = rotationY;
  parent.add(sign);

  addBox(sign, [1.05, 0.72, 0.06], [0, 0, 0], materials.yellow);
  addBox(sign, [0.82, 0.08, 0.065], [0, 0.18, 0.04], materials.warningBlack);
  addBox(sign, [0.82, 0.08, 0.065], [0, -0.18, 0.04], materials.warningBlack);
  addBox(sign, [0.08, 0.46, 0.065], [-0.38, 0, 0.04], materials.warningBlack);
  addBox(sign, [0.08, 0.46, 0.065], [0.38, 0, 0.04], materials.warningBlack);

  return sign;
}

function createBarrel(parent, position, material = materials.pipeBlue) {
  const barrel = new THREE.Group();
  barrel.position.set(...position);
  parent.add(barrel);

  const body = addCylinder(barrel, 0.28, 0.28, 0.72, [0, 0.36, 0], material, 28);
  addCylinder(barrel, 0.3, 0.3, 0.06, [0, 0.72, 0], materials.darkSteel, 28);
  addCylinder(barrel, 0.3, 0.3, 0.06, [0, 0.04, 0], materials.darkSteel, 28);
  addCylinder(barrel, 0.292, 0.292, 0.045, [0, 0.5, 0], materials.brushed, 28);
  body.rotation.y = Math.random() * Math.PI;

  return barrel;
}

function createStorageRack(parent, position, rotationY = 0) {
  const rack = new THREE.Group();
  rack.position.set(...position);
  rack.rotation.y = rotationY;
  parent.add(rack);

  [-0.88, 0.88].forEach((x) => {
    [-0.36, 0.36].forEach((z) => {
      addBox(rack, [0.08, 1.8, 0.08], [x, 0.9, z], materials.darkSteel);
    });
  });
  [0.35, 0.95, 1.55].forEach((y) => {
    addBox(rack, [1.95, 0.08, 0.85], [0, y, 0], materials.brushed);
  });
  addBox(rack, [0.58, 0.42, 0.46], [-0.48, 0.62, 0], materials.crate);
  addBox(rack, [0.52, 0.36, 0.42], [0.48, 1.22, 0], materials.mutedOrange);
  createBarrel(rack, [-0.52, 1.55, 0.02], materials.pipeGreen);

  return rack;
}

function createPallet(parent, position, rotationY = 0) {
  const pallet = new THREE.Group();
  pallet.position.set(...position);
  pallet.rotation.y = rotationY;
  parent.add(pallet);

  [-0.42, 0, 0.42].forEach((z) => {
    addBox(pallet, [1.25, 0.08, 0.12], [0, 0.2, z], materials.palletWood);
    addBox(pallet, [1.25, 0.08, 0.12], [0, 0.48, z], materials.palletWood);
  });
  [-0.45, 0.45].forEach((x) => {
    addBox(pallet, [0.14, 0.28, 1.05], [x, 0.34, 0], materials.palletWood);
  });
  addBox(pallet, [0.64, 0.42, 0.5], [-0.24, 0.85, -0.1], materials.crate);
  addBox(pallet, [0.5, 0.34, 0.42], [0.34, 0.78, 0.18], materials.mutedOrange);

  return pallet;
}

function createToolCart(parent, position, rotationY = 0) {
  const cart = new THREE.Group();
  cart.position.set(...position);
  cart.rotation.y = rotationY;
  parent.add(cart);

  addBox(cart, [1.1, 0.12, 0.62], [0, 0.48, 0], materials.red);
  addBox(cart, [1.1, 0.12, 0.62], [0, 0.88, 0], materials.darkSteel);
  addBox(cart, [0.08, 0.62, 0.62], [-0.52, 0.68, 0], materials.red);
  addBox(cart, [0.08, 0.62, 0.62], [0.52, 0.68, 0], materials.red);
  addBox(cart, [1.0, 0.08, 0.08], [0, 1.12, -0.24], materials.brushed);
  [-0.38, 0.38].forEach((x) => {
    [-0.22, 0.22].forEach((z) => {
      const wheel = addCylinder(cart, 0.09, 0.09, 0.08, [x, 0.12, z], materials.rubber, 16);
      wheel.rotation.z = Math.PI / 2;
    });
  });
  addBox(cart, [0.42, 0.045, 0.08], [-0.22, 1.0, 0.04], materials.brushed);
  addBox(cart, [0.34, 0.045, 0.08], [0.28, 1.0, 0.04], materials.brushed);

  return cart;
}

function createElectricalCabinet(parent, position, rotationY = 0) {
  const cabinet = new THREE.Group();
  cabinet.position.set(...position);
  cabinet.rotation.y = rotationY;
  parent.add(cabinet);

  addBox(cabinet, [0.85, 1.45, 0.22], [0, 0.72, 0], materials.brushed);
  addBox(cabinet, [0.68, 0.42, 0.04], [0, 1.0, 0.13], materials.darkSteel);
  addSphere(cabinet, 0.055, [-0.22, 1.05, 0.17], materials.glowGreen, 12);
  addSphere(cabinet, 0.055, [0, 1.05, 0.17], materials.glowBlue, 12);
  addSphere(cabinet, 0.055, [0.22, 1.05, 0.17], materials.glowRed, 12);
  addBox(cabinet, [0.08, 0.52, 0.045], [0.33, 0.5, 0.15], materials.warningBlack);

  return cabinet;
}

function createFloorLabel(parent, text, position, size, rotationY = 0, background = "#f6c453") {
  const material = new THREE.MeshStandardMaterial({
    map: makeLabelTexture(text, background),
    roughness: 0.55,
    metalness: 0.02,
  });
  const label = shadow(new THREE.Mesh(new THREE.PlaneGeometry(size[0], size[1]), material));
  label.position.set(...position);
  label.rotation.x = -Math.PI / 2;
  label.rotation.z = rotationY;
  parent.add(label);
  return label;
}

function createOilStain(parent, position, scale = [0.8, 0.45], rotationZ = 0) {
  const stain = new THREE.Mesh(new THREE.CircleGeometry(0.5, 36), materials.oil);
  stain.position.set(...position);
  stain.scale.set(scale[0], scale[1], 1);
  stain.rotation.x = -Math.PI / 2;
  stain.rotation.z = rotationZ;
  stain.receiveShadow = true;
  parent.add(stain);
  return stain;
}

const factory = new THREE.Group();
scene.add(factory);

const floor = shadow(new THREE.Mesh(new THREE.PlaneGeometry(22, 16), materials.floor));
floor.rotation.x = -Math.PI / 2;
factory.add(floor);

const backWall = addBox(factory, [22, 6.2, 0.28], [0, 3.1, -6.1], materials.wall);
const leftWall = addBox(factory, [0.28, 6.2, 16], [-10.9, 3.1, 0], materials.wall);
leftWall.material = materials.wall;
backWall.receiveShadow = true;

addBox(factory, [22, 0.18, 0.4], [0, 5.95, -5.7], materials.darkSteel);
addBox(factory, [0.4, 0.18, 16], [-10.5, 5.95, 0], materials.darkSteel);
for (let x = -9; x <= 9; x += 3) {
  addBox(factory, [0.12, 5.4, 0.18], [x, 2.75, -5.82], materials.darkSteel);
}
for (let z = -5; z <= 5; z += 2.5) {
  addBox(factory, [0.18, 5.4, 0.12], [-10.72, 2.75, z], materials.darkSteel);
}

for (let x = -9.5; x <= 9.5; x += 3.8) {
  addBox(factory, [0.18, 0.22, 15.2], [x, 5.72, -0.15], materials.darkSteel);
}
for (let z = -5.1; z <= 5.1; z += 2.55) {
  addBox(factory, [20.4, 0.16, 0.18], [-0.25, 5.78, z], materials.brushed);
}

const assemblyZone = addBox(factory, [7.4, 0.03, 2.65], [-1.4, 0.018, 0.2], materials.zoneBlue);
assemblyZone.material.transparent = true;
assemblyZone.material.opacity = 0.32;
const serviceZone = addBox(factory, [4.2, 0.032, 2.35], [6.1, 0.019, 2.55], materials.zoneGreen);
serviceZone.material.transparent = true;
serviceZone.material.opacity = 0.28;

for (let x = -6.4; x <= 6.4; x += 1.6) {
  addBox(factory, [0.75, 0.035, 0.08], [x, 0.04, 2.03], materials.safetyWhite);
  addBox(factory, [0.75, 0.035, 0.08], [x, 0.04, -1.63], materials.safetyWhite);
}
for (let z = -5.4; z <= 4.4; z += 1.3) {
  addBox(factory, [0.08, 0.035, 0.62], [-7.75, 0.041, z], materials.safetyWhite);
}

addPipe(factory, [-9.9, 4.6, -5.78], [9.2, 4.6, -5.78], 0.055, materials.pipeRed);
addPipe(factory, [-9.9, 4.32, -5.72], [8.1, 4.32, -5.72], 0.045, materials.pipeBlue);
addPipe(factory, [-10.72, 4.1, -4.8], [-10.72, 4.1, 5.1], 0.05, materials.pipeGreen);
addPipe(factory, [-10.72, 3.76, -4.8], [-10.72, 3.76, 5.1], 0.04, materials.pipeRed);
for (let x = -7.4; x <= 6.4; x += 3.45) {
  addPipe(factory, [x, 4.6, -5.78], [x, 3.7, -5.78], 0.04, materials.pipeRed);
}
for (let z = -3.4; z <= 3.8; z += 2.4) {
  addPipe(factory, [-10.72, 4.1, z], [-9.85, 4.1, z], 0.038, materials.pipeGreen);
}

createVent(factory, [-6.8, 3.2, -5.91], 0);
createVent(factory, [4.7, 3.45, -5.91], 0);
createVent(factory, [-10.82, 3.1, 3.1], Math.PI / 2);
createWarningPanel(factory, [-2.1, 2.3, -5.92], 0);
createWarningPanel(factory, [-10.83, 2.35, -2.7], Math.PI / 2);

createStorageRack(factory, [-8.8, 0, 4.8], Math.PI / 2);
createStorageRack(factory, [-7.2, 0, 4.8], Math.PI / 2);
createStorageRack(factory, [8.7, 0, -4.6], -Math.PI / 2);
createBarrel(factory, [-9.7, 0, 2.65], materials.pipeBlue);
createBarrel(factory, [-9.05, 0, 2.8], materials.pipeRed);
createBarrel(factory, [7.9, 0, -4.8], materials.pipeGreen);
createBarrel(factory, [8.55, 0, -4.6], materials.mutedOrange);
createPallet(factory, [-8.35, 0, -4.25], 0.2);
createPallet(factory, [-6.7, 0, -4.35], -0.12);
createPallet(factory, [5.15, 0, 4.7], Math.PI / 2);
createToolCart(factory, [7.25, 0, 4.05], -0.35);
createToolCart(factory, [-9.4, 0, -0.7], Math.PI / 2);
createElectricalCabinet(factory, [8.95, 0, -5.88], 0);
createElectricalCabinet(factory, [-10.78, 0, 0.7], Math.PI / 2);
createFloorLabel(factory, "ASSEMBLY", [-1.5, 0.055, 2.92], [2.2, 0.7], 0, "#2f6984");
createFloorLabel(factory, "SERVICE", [6.15, 0.056, 1.1], [1.75, 0.62], 0, "#3a725f");
createFloorLabel(factory, "KEEP CLEAR", [-5.1, 0.057, -3.55], [2.0, 0.58], 0, "#f6c453");
createOilStain(factory, [-3.6, 0.06, -3.25], [0.95, 0.42], 0.25);
createOilStain(factory, [3.65, 0.061, 3.55], [0.72, 0.36], -0.45);
createOilStain(factory, [8.25, 0.062, -2.4], [0.55, 0.28], 0.1);

[
  [-4.2, 0.05, 3.5],
  [-3.05, 0.05, 3.5],
  [-1.9, 0.05, 3.5],
  [-0.75, 0.05, 3.5],
  [0.4, 0.05, 3.5],
  [1.55, 0.05, 3.5],
].forEach(([x, y, z]) => {
  addBox(factory, [0.72, 0.035, 0.08], [x, y, z], materials.yellow);
});

[
  [-8.3, 0.5, -5.9],
  [-8.0, 0.5, -5.9],
  [-7.7, 0.5, -5.9],
  [8.0, 0.5, -5.9],
  [8.3, 0.5, -5.9],
  [8.6, 0.5, -5.9],
].forEach(([x, y, z], index) => {
  const material = index % 2 === 0 ? materials.glowGreen : materials.glowBlue;
  addSphere(factory, 0.065, [x, y, z], material, 12);
});

const ambientLight = new THREE.HemisphereLight(0xdaf6ff, 0x2d3230, 0.82);
scene.add(ambientLight);

const sun = new THREE.DirectionalLight(0xffffff, 1.45);
sun.position.set(5, 8, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.00018;
sun.shadow.radius = 4;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 28;
sun.shadow.camera.left = -12;
sun.shadow.camera.right = 12;
sun.shadow.camera.top = 12;
sun.shadow.camera.bottom = -12;
scene.add(sun);

const ceilingLights = [];
[
  [-4.8, 5.6, -2.5],
  [0, 5.6, -2.5],
  [4.8, 5.6, -2.5],
  [-4.8, 5.6, 2.7],
  [0, 5.6, 2.7],
  [4.8, 5.6, 2.7],
].forEach(([x, y, z]) => {
  addBox(factory, [1.7, 0.08, 0.28], [x, y, z], materials.lampGlow);
  const light = new THREE.PointLight(0xfff1cb, 8.2, 11, 1.65);
  light.position.set(x, y - 0.15, z);
  light.castShadow = true;
  light.shadow.bias = -0.00012;
  light.shadow.radius = 3;
  ceilingLights.push(light);
  scene.add(light);
});

const lampLight = new THREE.SpotLight(0xffc875, 38, 15, Math.PI / 5.5, 0.62, 1.1);
lampLight.position.set(-4.7, 4.6, 1.7);
lampLight.target.position.set(-0.6, 0.8, 0);
lampLight.castShadow = true;
lampLight.shadow.bias = -0.00012;
lampLight.shadow.radius = 3;
scene.add(lampLight, lampLight.target);

const belt = new THREE.Group();
belt.position.z = 0.2;
scene.add(belt);
addBox(belt, [11.6, 0.34, 1.48], [0, 0.6, 0], materials.belt);
addBox(belt, [12.2, 0.22, 0.12], [0, 0.84, -0.92], materials.brushed);
addBox(belt, [12.2, 0.22, 0.12], [0, 0.84, 0.92], materials.brushed);
addBox(belt, [12.5, 0.12, 0.42], [0, 0.34, -1.16], materials.darkSteel);
addBox(belt, [12.5, 0.12, 0.42], [0, 0.34, 1.16], materials.darkSteel);

for (let x = -5.6; x <= 5.6; x += 0.8) {
  const roller = addCylinder(belt, 0.17, 0.17, 1.82, [x, 0.82, 0], materials.darkSteel, 24);
  roller.rotation.z = Math.PI / 2;
}

for (let x = -5.8; x <= 5.8; x += 2.9) {
  addBox(belt, [0.16, 1.0, 0.16], [x, 0.05, -1.04], materials.darkSteel);
  addBox(belt, [0.16, 1.0, 0.16], [x, 0.05, 1.04], materials.darkSteel);
}

const hazardFront = addBox(factory, [12.4, 0.04, 0.42], [0, 0.025, 1.82], materials.hazard);
const hazardBack = addBox(factory, [12.4, 0.04, 0.42], [0, 0.026, -1.42], materials.hazard);

const lamp = new THREE.Group();
scene.add(lamp);
addCylinder(lamp, 0.07, 0.1, 4.2, [-4.7, 2.1, 1.7], materials.darkSteel, 18);
const lampHead = addCylinder(lamp, 0.48, 0.23, 0.42, [-4.7, 4.35, 1.7], materials.yellow, 32);
lampHead.rotation.x = Math.PI;
addSphere(lamp, 0.16, [-4.7, 4.06, 1.7], materials.lampGlow, 16);

function createRobot(position, rotationY = 0, accent = materials.teal) {
  const robot = new THREE.Group();
  robot.position.set(...position);
  robot.rotation.y = rotationY;
  scene.add(robot);

  addCylinder(robot, 0.72, 0.88, 0.32, [0, 0.16, 0], materials.darkSteel);
  addCylinder(robot, 0.54, 0.62, 0.3, [0, 0.47, 0], materials.brushed);

  const waistPivot = new THREE.Group();
  waistPivot.position.y = 0.62;
  robot.add(waistPivot);

  const torso = addCylinder(waistPivot, 0.42, 0.55, 0.75, [0, 0.38, 0], materials.yellow);
  addBox(waistPivot, [0.55, 0.18, 0.65], [0, 0.8, 0], materials.darkSteel);
  addSphere(waistPivot, 0.08, [0.22, 0.93, 0.34], materials.glowGreen, 12);
  addSphere(waistPivot, 0.08, [-0.02, 0.93, 0.34], materials.glowRed, 12);

  const shoulderPivot = new THREE.Group();
  shoulderPivot.position.set(0, 0.85, 0);
  waistPivot.add(shoulderPivot);

  const upperArm = new THREE.Group();
  upperArm.position.set(0.54, 0, 0);
  shoulderPivot.add(upperArm);
  addBox(upperArm, [1.46, 0.32, 0.38], [0.73, 0, 0], accent);
  addCylinder(upperArm, 0.26, 0.26, 0.48, [0, 0, 0], materials.brushed);

  const elbowPivot = new THREE.Group();
  elbowPivot.position.set(1.5, 0, 0);
  upperArm.add(elbowPivot);
  addCylinder(elbowPivot, 0.24, 0.24, 0.5, [0, 0, 0], materials.brushed);

  const forearm = new THREE.Group();
  elbowPivot.add(forearm);
  addBox(forearm, [1.24, 0.27, 0.31], [0.62, 0, 0], materials.yellow);
  addBox(forearm, [0.5, 0.32, 0.36], [0.98, 0, 0], materials.darkSteel);

  const wristPivot = new THREE.Group();
  wristPivot.position.set(1.28, 0, 0);
  forearm.add(wristPivot);
  addCylinder(wristPivot, 0.18, 0.18, 0.38, [0, 0, 0], materials.brushed);

  const clawLeft = addBox(wristPivot, [0.1, 0.56, 0.12], [0.29, 0.2, -0.14], materials.red);
  const clawRight = addBox(wristPivot, [0.1, 0.56, 0.12], [0.29, -0.2, -0.14], materials.red);
  clawLeft.rotation.z = 0.35;
  clawRight.rotation.z = -0.35;

  return { robot, waistPivot, torso, shoulderPivot, upperArm, elbowPivot, forearm, wristPivot, clawLeft, clawRight };
}

const primaryRobot = createRobot([-2.25, 0, -1.45], 0.1, materials.teal);
const secondaryRobot = createRobot([2.95, 0, -1.5], -0.55, materials.blue);

const crates = [];
for (let i = 0; i < 7; i += 1) {
  const crate = new THREE.Group();
  crate.position.set(-5.5 + i * 1.85, 1.15, 0.2);
  addBox(crate, [0.62, 0.62, 0.62], [0, 0, 0], materials.crate);
  addBox(crate, [0.68, 0.08, 0.68], [0, 0.21, 0], materials.darkSteel);
  addBox(crate, [0.68, 0.08, 0.68], [0, -0.21, 0], materials.darkSteel);
  addBox(crate, [0.08, 0.62, 0.68], [0.22, 0, 0], materials.darkSteel);
  crates.push(crate);
  scene.add(crate);
}

const pressMachine = new THREE.Group();
pressMachine.position.set(0.8, 0, -2.7);
scene.add(pressMachine);
addBox(pressMachine, [1.8, 0.22, 1.15], [0, 0.55, 0], materials.darkSteel);
addBox(pressMachine, [0.22, 2.1, 0.22], [-0.72, 1.55, -0.42], materials.brushed);
addBox(pressMachine, [0.22, 2.1, 0.22], [0.72, 1.55, -0.42], materials.brushed);
addBox(pressMachine, [0.22, 2.1, 0.22], [-0.72, 1.55, 0.42], materials.brushed);
addBox(pressMachine, [0.22, 2.1, 0.22], [0.72, 1.55, 0.42], materials.brushed);
addBox(pressMachine, [1.9, 0.35, 1.2], [0, 2.65, 0], materials.orange);
const pressHead = addBox(pressMachine, [1.3, 0.28, 0.82], [0, 1.9, 0], materials.yellow);
addSphere(pressMachine, 0.1, [-0.52, 2.9, 0.62], materials.glowGreen, 16);
addSphere(pressMachine, 0.1, [-0.22, 2.9, 0.62], materials.glowBlue, 16);
addSphere(pressMachine, 0.1, [0.08, 2.9, 0.62], materials.glowRed, 16);

const scanner = new THREE.Group();
scanner.position.set(-4.25, 0, -2.5);
scene.add(scanner);
addBox(scanner, [0.24, 2.5, 0.24], [-0.7, 1.55, 0], materials.darkSteel);
addBox(scanner, [0.24, 2.5, 0.24], [0.7, 1.55, 0], materials.darkSteel);
addBox(scanner, [1.7, 0.24, 0.38], [0, 2.85, 0], materials.brushed);
const scannerBeamMaterial = materials.glowBlue.clone();
const scannerBeam = addBox(scanner, [1.45, 1.35, 0.02], [0, 1.7, 0.35], scannerBeamMaterial);
scannerBeam.material.transparent = true;
scannerBeam.material.opacity = 0.18;

const controlDesk = new THREE.Group();
controlDesk.position.set(6.7, 0, 2.7);
controlDesk.rotation.y = -0.5;
scene.add(controlDesk);
addBox(controlDesk, [1.9, 0.9, 0.78], [0, 0.45, 0], materials.darkSteel);
addBox(controlDesk, [1.8, 0.1, 0.74], [0, 0.96, -0.04], materials.brushed);
for (let i = 0; i < 5; i += 1) {
  const material = i % 3 === 0 ? materials.glowGreen : i % 3 === 1 ? materials.glowBlue : materials.glowRed;
  addSphere(controlDesk, 0.075, [-0.62 + i * 0.31, 1.06, 0.24], material, 12);
}
addBox(controlDesk, [0.58, 0.06, 0.36], [0.48, 1.08, -0.25], materials.glowBlue);

const drone = new THREE.Group();
drone.position.set(2.2, 3.3, 1.75);
scene.add(drone);
addBox(drone, [0.72, 0.18, 0.45], [0, 0, 0], materials.glass);
addSphere(drone, 0.13, [0.42, 0.02, 0], materials.glowBlue, 14);
const rotorPivots = [];
[
  [-0.56, 0, -0.43],
  [0.56, 0, -0.43],
  [-0.56, 0, 0.43],
  [0.56, 0, 0.43],
].forEach((position) => {
  const pivot = new THREE.Group();
  pivot.position.set(...position);
  drone.add(pivot);
  addBox(pivot, [0.72, 0.035, 0.075], [0, 0.08, 0], materials.darkSteel);
  addCylinder(drone, 0.06, 0.08, 0.12, [position[0], 0.02, position[2]], materials.brushed, 14);
  rotorPivots.push(pivot);
});

for (let x = -8.5; x <= 8.5; x += 2.4) {
  addBox(factory, [0.09, 2.2, 0.09], [x, 1.1, 4.1], materials.darkSteel);
}
addBox(factory, [18, 0.11, 0.11], [0, 2.18, 4.1], materials.brushed);
addBox(factory, [18, 0.11, 0.11], [0, 1.38, 4.1], materials.brushed);

addCable([
  [-7.2, 5.55, -4.8],
  [-5.2, 4.85, -4.0],
  [-3.2, 4.95, -4.6],
  [-1.2, 4.75, -4.0],
]);
addCable([
  [1.4, 5.5, -4.8],
  [2.8, 4.8, -4.2],
  [4.6, 5.0, -4.7],
  [6.5, 4.72, -4.1],
]);

const toggleAnimation = document.querySelector("#toggle-animation");
const toggleNight = document.querySelector("#toggle-night");
const toggleLamp = document.querySelector("#toggle-lamp");
const cameraView = document.querySelector("#camera-view");
const speedControl = document.querySelector("#speed-control");
const modeLabel = document.querySelector("#mode-label");
const speedLabel = document.querySelector("#speed-label");

toggleAnimation.addEventListener("click", () => {
  state.running = !state.running;
  toggleAnimation.textContent = state.running ? "Pause" : "Resume";
  modeLabel.textContent = state.running ? "Automatic cycle" : "Paused";
});

toggleNight.addEventListener("click", () => {
  state.night = !state.night;
  toggleNight.textContent = state.night ? "Day" : "Night";
  scene.background.set(state.night ? 0x080d12 : 0x202b32);
  scene.fog.color.set(state.night ? 0x080d12 : 0x202b32);
  ambientLight.intensity = state.night ? 0.32 : 0.82;
  sun.intensity = state.night ? 0.08 : 1.45;
  renderer.toneMappingExposure = state.night ? 1.02 : 1.28;
});

toggleLamp.addEventListener("click", () => {
  state.lampOn = !state.lampOn;
  toggleLamp.textContent = state.lampOn ? "Lamp Off" : "Lamp On";
  lampLight.visible = state.lampOn;
  ceilingLights.forEach((light, index) => {
    light.intensity = state.lampOn ? 8.2 : index % 2 === 0 ? 1.5 : 0;
  });
});

cameraView.addEventListener("click", () => {
  state.cameraIndex = (state.cameraIndex + 1) % cameraViews.length;
  const view = cameraViews[state.cameraIndex];
  camera.position.copy(view.position);
  controls.target.copy(view.target);
  cameraView.textContent = `Camera ${String.fromCharCode(65 + ((state.cameraIndex + 1) % cameraViews.length))}`;
});

speedControl.addEventListener("input", () => {
  state.speed = Number(speedControl.value);
  speedLabel.textContent = `${state.speed.toFixed(1)}x`;
});

function animateRobot(robotRig, time, phase = 0) {
  const t = time + phase;
  robotRig.waistPivot.rotation.y = Math.sin(t * 0.85) * 0.55;
  robotRig.shoulderPivot.rotation.z = -0.42 + Math.sin(t * 1.05) * 0.42;
  robotRig.upperArm.rotation.y = Math.sin(t * 0.8) * 0.14;
  robotRig.elbowPivot.rotation.z = 0.86 + Math.sin(t * 1.45) * 0.5;
  robotRig.wristPivot.rotation.x = t * 2.1;
  robotRig.wristPivot.rotation.z = Math.sin(t * 2.4) * 0.18;
  robotRig.torso.rotation.y = Math.sin(t * 1.8) * 0.025;

  const clawGrip = 0.22 + Math.sin(t * 2.2) * 0.11;
  robotRig.clawLeft.position.y = clawGrip;
  robotRig.clawRight.position.y = -clawGrip;
}

function resizeRenderer() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resizeRenderer);
resizeRenderer();

let elapsed = 0;

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (state.running) {
    elapsed += delta * state.speed;
  }

  beltTexture.offset.x = -elapsed * 0.58;
  hazardTexture.offset.x = -elapsed * 0.08;

  animateRobot(primaryRobot, elapsed, 0);
  animateRobot(secondaryRobot, elapsed, 1.9);

  pressHead.position.y = 1.82 + Math.max(0, Math.sin(elapsed * 2.2)) * 0.62;
  scannerBeam.material.opacity = 0.1 + Math.abs(Math.sin(elapsed * 3.4)) * 0.22;

  crates.forEach((crate, index) => {
    crate.position.x = ((elapsed * 1.45 + index * 1.85 + 6.1) % 12.2) - 6.1;
    crate.rotation.y += delta * state.speed * 0.18;
  });

  drone.position.y = 3.35 + Math.sin(elapsed * 1.4) * 0.28;
  drone.position.x = 2.2 + Math.sin(elapsed * 0.55) * 1.35;
  drone.rotation.z = Math.sin(elapsed * 1.1) * 0.08;
  rotorPivots.forEach((pivot, index) => {
    pivot.rotation.y += delta * state.speed * (index % 2 === 0 ? 22 : -22);
  });

  ceilingLights.forEach((light, index) => {
    const pulse = 1 + Math.sin(elapsed * 1.8 + index) * 0.05;
    light.intensity = state.lampOn ? 8.2 * pulse : index % 2 === 0 ? 1.5 : 0;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
