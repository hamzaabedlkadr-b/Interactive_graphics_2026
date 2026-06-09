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
  roomKey: "assembly",
  cameraTransition: null,
  activeDoorKey: null,
  doorTimer: 0,
  walkMode: false,
  walkYaw: -0.78,
  machinesOn: true,
  scannerOn: true,
  droneOn: true,
  robotSpeedIndex: 1,
};

const pressedKeys = new Set();
const walkBounds = {
  minX: -14.0,
  maxX: 14.0,
  minZ: -8.4,
  maxZ: 8.6,
};
const robotSpeedOptions = [
  { label: "Robot 0.5x", value: 0.5 },
  { label: "Robot 1x", value: 1 },
  { label: "Robot 1.5x", value: 1.5 },
];
const ROBOT_CYCLE_DURATION = 8.4;

const cameraViews = [
  { position: new THREE.Vector3(10.8, 5.8, 11.6), target: new THREE.Vector3(0.1, 1.35, 0.05) },
  { position: new THREE.Vector3(-8.4, 3.8, 5.4), target: new THREE.Vector3(-2.2, 1.4, -0.2) },
  { position: new THREE.Vector3(1.8, 8.4, 8.0), target: new THREE.Vector3(0, 0.75, 0) },
  { position: new THREE.Vector3(5.3, 2.7, -6.0), target: new THREE.Vector3(1.2, 1.4, -0.4) },
  { position: new THREE.Vector3(13.8, 8.3, 13.2), target: new THREE.Vector3(0, 1.1, -0.15) },
];

const roomViews = {
  assembly: {
    label: "Assembly room",
    position: new THREE.Vector3(10.8, 5.8, 11.6),
    target: new THREE.Vector3(0.1, 1.35, 0.05),
  },
  storage: {
    label: "Storage room",
    position: new THREE.Vector3(-10.4, 3.7, 8.35),
    target: new THREE.Vector3(-8.8, 1.18, 5.25),
  },
  control: {
    label: "Control room",
    position: new THREE.Vector3(11.6, 3.8, 7.35),
    target: new THREE.Vector3(7.25, 1.25, 3.3),
  },
  inspection: {
    label: "Inspection room",
    position: new THREE.Vector3(-7.9, 3.6, -6.45),
    target: new THREE.Vector3(-4.25, 1.35, -3.05),
  },
};

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

function makeScuffTexture(base = "#777777", mark = "#3a3a3a", size = 256, scratches = 120) {
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
floorTexture.repeat.set(12, 10);
const beltTexture = makeStripeTexture("#202326", "#3d464b");
const wallTexture = makePanelTexture();
const hazardTexture = makeHazardTexture();
const floorScuffTexture = makeScuffTexture("#7a8482", "#2d3635", 256, 170);
floorScuffTexture.repeat.set(10, 8);
const wallScuffTexture = makeScuffTexture("#6b7478", "#273139", 256, 90);
wallScuffTexture.repeat.set(6, 3);

const materials = {
  floor: new THREE.MeshStandardMaterial({
    map: floorTexture,
    bumpMap: floorScuffTexture,
    bumpScale: 0.025,
    roughness: 0.84,
    metalness: 0.04,
  }),
  wall: new THREE.MeshStandardMaterial({
    map: wallTexture,
    bumpMap: wallScuffTexture,
    bumpScale: 0.018,
    roughness: 0.66,
    metalness: 0.12,
  }),
  steel: new THREE.MeshStandardMaterial({ color: 0x8a969c, metalness: 0.78, roughness: 0.24 }),
  brushed: new THREE.MeshStandardMaterial({ color: 0xb7c1c4, metalness: 0.9, roughness: 0.18 }),
  darkSteel: new THREE.MeshStandardMaterial({ color: 0x22292e, metalness: 0.7, roughness: 0.32 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x101315, metalness: 0.12, roughness: 0.68 }),
  yellow: new THREE.MeshStandardMaterial({ color: 0xf6c453, metalness: 0.22, roughness: 0.36 }),
  orange: new THREE.MeshStandardMaterial({ color: 0xe9853f, metalness: 0.18, roughness: 0.42 }),
  mutedOrange: new THREE.MeshStandardMaterial({ color: 0xb86538, metalness: 0.12, roughness: 0.56 }),
  productShell: new THREE.MeshStandardMaterial({ color: 0xd5dce0, metalness: 0.38, roughness: 0.32 }),
  productDark: new THREE.MeshStandardMaterial({ color: 0x20272c, metalness: 0.5, roughness: 0.3 }),
  battery: new THREE.MeshStandardMaterial({ color: 0x6ce0a6, metalness: 0.18, roughness: 0.36 }),
  reject: new THREE.MeshStandardMaterial({ color: 0xd94b42, metalness: 0.12, roughness: 0.5 }),
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
  glassWall: new THREE.MeshPhysicalMaterial({
    color: 0xb8e7ff,
    roughness: 0.08,
    metalness: 0,
    transmission: 0.18,
    transparent: true,
    opacity: 0.28,
  }),
  crate: new THREE.MeshStandardMaterial({ color: 0xb56b43, roughness: 0.68 }),
  hazard: new THREE.MeshStandardMaterial({ map: hazardTexture, roughness: 0.52 }),
  concretePatch: new THREE.MeshStandardMaterial({ color: 0x394444, roughness: 0.9, metalness: 0.02 }),
  cautionPaint: new THREE.MeshStandardMaterial({ color: 0xe2b83f, roughness: 0.64, metalness: 0.04 }),
  cableTray: new THREE.MeshStandardMaterial({ color: 0x151b1f, metalness: 0.62, roughness: 0.38 }),
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

function addTorus(parent, radius, tube, position, material, radialSegments = 24, tubularSegments = 36) {
  const mesh = shadow(new THREE.Mesh(new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments), material));
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

function addLocalCable(parent, points, radius = 0.025, material = materials.rubber) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const mesh = shadow(new THREE.Mesh(new THREE.TubeGeometry(curve, 28, radius, 8), material));
  parent.add(mesh);
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

function createFloorDrain(parent, position, rotationZ = 0) {
  const drain = new THREE.Group();
  drain.position.set(...position);
  drain.rotation.y = 0;
  parent.add(drain);

  const plate = addBox(drain, [0.82, 0.035, 0.46], [0, 0.035, 0], materials.darkSteel);
  plate.rotation.y = rotationZ;
  for (let x = -0.28; x <= 0.28; x += 0.14) {
    const slot = addBox(drain, [0.035, 0.04, 0.38], [x, 0.065, 0], materials.brushed);
    slot.rotation.y = rotationZ;
  }

  return drain;
}

function createSafetyBollard(parent, position, height = 1.0) {
  const bollard = new THREE.Group();
  bollard.position.set(...position);
  parent.add(bollard);

  addCylinder(bollard, 0.11, 0.13, height, [0, height / 2, 0], materials.cautionPaint, 20);
  addCylinder(bollard, 0.14, 0.14, 0.06, [0, 0.03, 0], materials.darkSteel, 20);
  [0.28, 0.56, 0.82].forEach((y) => {
    addBox(bollard, [0.24, 0.045, 0.24], [0, y, 0], materials.warningBlack);
  });

  return bollard;
}

function createMaintenancePanel(parent, position, rotationY = 0, labelColor = materials.glowBlue) {
  const panel = new THREE.Group();
  panel.position.set(...position);
  panel.rotation.y = rotationY;
  parent.add(panel);

  addBox(panel, [1.12, 0.82, 0.08], [0, 0, 0], materials.darkSteel);
  addBox(panel, [0.86, 0.48, 0.04], [0, 0.05, 0.06], materials.brushed);
  addBox(panel, [0.62, 0.055, 0.045], [0, 0.22, 0.09], materials.warningBlack);
  addBox(panel, [0.62, 0.055, 0.045], [0, 0.05, 0.09], materials.warningBlack);
  addSphere(panel, 0.055, [-0.36, -0.25, 0.1], labelColor, 12);
  addSphere(panel, 0.055, [-0.15, -0.25, 0.1], materials.glowGreen, 12);
  addSphere(panel, 0.055, [0.06, -0.25, 0.1], materials.glowRed, 12);

  return panel;
}

function createCableTray(parent, points, width = 0.22) {
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];
    addPipe(parent, start, end, width * 0.16, materials.cableTray);
    addPipe(parent, [start[0], start[1] - width, start[2]], [end[0], end[1] - width, end[2]], width * 0.12, materials.cableTray);
    addPipe(parent, [start[0], start[1] + width, start[2]], [end[0], end[1] + width, end[2]], width * 0.12, materials.cableTray);
  }
}

function createDoorFrame(parent, position, rotationY = 0, width = 1.55, height = 2.25) {
  const frame = new THREE.Group();
  frame.position.set(...position);
  frame.rotation.y = rotationY;
  parent.add(frame);

  addBox(frame, [0.1, height, 0.16], [-width / 2, height / 2, 0], materials.yellow);
  addBox(frame, [0.1, height, 0.16], [width / 2, height / 2, 0], materials.yellow);
  addBox(frame, [width + 0.18, 0.12, 0.18], [0, height, 0], materials.yellow);
  addBox(frame, [width + 0.34, 0.08, 0.22], [0, 0.04, 0], materials.hazard);

  return frame;
}

function createSlidingDoor(parent, position, rotationY = 0, width = 1.45, roomKey = "assembly") {
  const door = new THREE.Group();
  door.position.set(...position);
  door.rotation.y = rotationY;
  parent.add(door);

  const panelWidth = width / 2;
  const left = addBox(door, [panelWidth, 1.6, 0.065], [-panelWidth / 2, 1.05, 0.055], materials.glassWall);
  const right = addBox(door, [panelWidth, 1.6, 0.065], [panelWidth / 2, 1.05, 0.055], materials.glassWall);
  addBox(door, [width + 0.22, 0.08, 0.1], [0, 1.92, 0.08], materials.darkSteel);
  addSphere(door, 0.055, [-width / 2 - 0.16, 1.82, 0.1], materials.glowGreen, 10);
  addSphere(door, 0.055, [width / 2 + 0.16, 1.82, 0.1], materials.glowRed, 10);

  return {
    roomKey,
    width,
    left,
    right,
    closedLeftX: -panelWidth / 2,
    closedRightX: panelWidth / 2,
    openOffset: 0.62,
  };
}

function createPartitionWall(parent, size, position, hasGlass = false) {
  const lower = addBox(parent, [size[0], 1.1, size[2]], [position[0], 0.55, position[2]], materials.wall);
  const upperMaterial = hasGlass ? materials.glassWall : materials.wall;
  const upper = addBox(parent, [size[0], size[1] - 1.1, size[2]], [position[0], 1.1 + (size[1] - 1.1) / 2, position[2]], upperMaterial);
  return [lower, upper];
}

function createAgv(parent) {
  const agv = new THREE.Group();
  parent.add(agv);

  addBox(agv, [0.92, 0.22, 0.62], [0, 0.28, 0], materials.darkSteel);
  addBox(agv, [0.72, 0.18, 0.48], [0, 0.48, 0], materials.yellow);
  addBox(agv, [0.5, 0.22, 0.36], [0.06, 0.7, 0], materials.crate);
  addSphere(agv, 0.075, [-0.34, 0.64, 0.22], materials.glowBlue, 12);
  addSphere(agv, 0.055, [0.34, 0.62, -0.22], materials.glowGreen, 12);

  [-0.32, 0.32].forEach((x) => {
    [-0.24, 0.24].forEach((z) => {
      const wheel = addCylinder(agv, 0.105, 0.105, 0.09, [x, 0.13, z], materials.rubber, 18);
      wheel.rotation.z = Math.PI / 2;
    });
  });

  return agv;
}

function createProductionItem(kind, index) {
  const item = new THREE.Group();
  item.userData.kind = kind;
  item.userData.index = index;

  if (kind === "crate") {
    addBox(item, [0.7, 0.54, 0.58], [0, -0.02, 0], materials.crate);
    addBox(item, [0.74, 0.07, 0.62], [0, 0.24, 0], materials.darkSteel);
    addBox(item, [0.74, 0.07, 0.62], [0, -0.28, 0], materials.darkSteel);
    addBox(item, [0.07, 0.56, 0.64], [-0.26, -0.02, 0], materials.darkSteel);
    addBox(item, [0.07, 0.56, 0.64], [0.26, -0.02, 0], materials.darkSteel);
    addBox(item, [0.62, 0.035, 0.08], [0, 0.05, -0.33], materials.palletWood);
    addBox(item, [0.62, 0.035, 0.08], [0, -0.11, -0.33], materials.palletWood);
    addSphere(item, 0.045, [-0.24, 0.18, 0.31], materials.brushed, 10);
    addSphere(item, 0.045, [0.24, 0.18, 0.31], materials.brushed, 10);
  } else if (kind === "battery") {
    addBox(item, [0.76, 0.36, 0.48], [0, 0, 0], materials.battery);
    addBox(item, [0.82, 0.05, 0.52], [0, 0.21, 0], materials.darkSteel);
    addBox(item, [0.16, 0.13, 0.18], [-0.3, 0.3, 0], materials.brushed);
    addBox(item, [0.16, 0.13, 0.18], [0.3, 0.3, 0], materials.brushed);
    addBox(item, [0.08, 0.42, 0.54], [0, 0, 0], materials.darkSteel);
    addBox(item, [0.46, 0.035, 0.035], [0, 0.02, 0.28], materials.glowGreen);
    addSphere(item, 0.04, [-0.22, 0.23, 0.26], materials.glowBlue, 10);
  } else if (kind === "chassis") {
    addBox(item, [0.92, 0.16, 0.56], [0, -0.1, 0], materials.productShell);
    addBox(item, [0.74, 0.18, 0.4], [0, 0.08, 0], materials.glass);
    addBox(item, [0.22, 0.08, 0.5], [-0.24, 0.24, 0], materials.brushed);
    addBox(item, [0.22, 0.08, 0.5], [0.24, 0.24, 0], materials.brushed);
    addCylinder(item, 0.11, 0.11, 0.08, [-0.28, -0.24, -0.22], materials.rubber, 18).rotation.z = Math.PI / 2;
    addCylinder(item, 0.11, 0.11, 0.08, [0.28, -0.24, -0.22], materials.rubber, 18).rotation.z = Math.PI / 2;
    addCylinder(item, 0.11, 0.11, 0.08, [-0.28, -0.24, 0.22], materials.rubber, 18).rotation.z = Math.PI / 2;
    addCylinder(item, 0.11, 0.11, 0.08, [0.28, -0.24, 0.22], materials.rubber, 18).rotation.z = Math.PI / 2;
  } else if (kind === "finished") {
    addBox(item, [0.82, 0.3, 0.5], [0, -0.04, 0], materials.productShell);
    addBox(item, [0.54, 0.22, 0.36], [0, 0.22, 0], materials.glass);
    addSphere(item, 0.075, [-0.28, 0.18, 0.25], materials.glowGreen, 12);
    addSphere(item, 0.075, [0.28, 0.18, 0.25], materials.glowBlue, 12);
    addBox(item, [0.2, 0.08, 0.56], [0, -0.24, 0], materials.productDark);
    addBox(item, [0.62, 0.045, 0.07], [0, 0.02, -0.28], materials.brushed);
    addCylinder(item, 0.06, 0.06, 0.52, [0, 0.34, 0], materials.darkSteel, 14).rotation.x = Math.PI / 2;
  } else {
    addBox(item, [0.72, 0.34, 0.48], [0, 0, 0], materials.reject);
    addBox(item, [0.82, 0.08, 0.08], [0, 0.25, 0], materials.warningBlack);
    addBox(item, [0.08, 0.08, 0.58], [0, 0.25, 0], materials.warningBlack);
    addBox(item, [0.5, 0.045, 0.5], [0.04, -0.23, 0], materials.darkSteel);
    addSphere(item, 0.075, [0.3, 0.2, 0.22], materials.glowRed, 12);
    addSphere(item, 0.04, [-0.22, 0.21, 0.22], materials.brushed, 10);
  }

  scene.add(item);
  return item;
}

function createHandledPart(parent, position, accent = materials.battery) {
  const part = new THREE.Group();
  part.position.set(...position);
  parent.add(part);

  addBox(part, [0.48, 0.24, 0.34], [0, 0, 0], accent);
  addBox(part, [0.54, 0.045, 0.38], [0, 0.145, 0], materials.darkSteel);
  addBox(part, [0.08, 0.28, 0.4], [0, 0, 0], materials.darkSteel);
  addBox(part, [0.28, 0.035, 0.035], [0, 0.025, 0.22], materials.glowGreen);
  addSphere(part, 0.045, [-0.17, 0.17, 0.18], materials.glowBlue, 10);
  addSphere(part, 0.04, [0.17, 0.17, 0.18], materials.brushed, 10);

  return part;
}

const factory = new THREE.Group();
scene.add(factory);

const floor = shadow(new THREE.Mesh(new THREE.PlaneGeometry(30, 22), materials.floor));
floor.rotation.x = -Math.PI / 2;
factory.add(floor);

const backWall = addBox(factory, [30, 6.2, 0.28], [0, 3.1, -9.1], materials.wall);
const leftWall = addBox(factory, [0.28, 6.2, 22], [-14.9, 3.1, 0], materials.wall);
const rightServiceWall = addBox(factory, [0.28, 4.4, 12], [14.9, 2.2, -2.2], materials.wall);
leftWall.material = materials.wall;
backWall.receiveShadow = true;
rightServiceWall.receiveShadow = true;

addBox(factory, [30, 0.18, 0.4], [0, 5.95, -8.7], materials.darkSteel);
addBox(factory, [0.4, 0.18, 22], [-14.5, 5.95, 0], materials.darkSteel);
addBox(factory, [0.4, 0.18, 12], [14.5, 4.28, -2.2], materials.darkSteel);
for (let x = -13; x <= 13; x += 3.25) {
  addBox(factory, [0.12, 5.4, 0.18], [x, 2.75, -8.82], materials.darkSteel);
}
for (let z = -8; z <= 8; z += 2.65) {
  addBox(factory, [0.18, 5.4, 0.12], [-14.72, 2.75, z], materials.darkSteel);
}

for (let x = -13.0; x <= 13.0; x += 4.0) {
  addBox(factory, [0.18, 0.22, 20.2], [x, 5.72, -0.15], materials.darkSteel);
}
for (let z = -8.1; z <= 8.1; z += 2.7) {
  addBox(factory, [28.4, 0.16, 0.18], [-0.25, 5.78, z], materials.brushed);
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
createFloorDrain(factory, [-7.55, 0.075, -0.9], 0.15);
createFloorDrain(factory, [5.85, 0.075, -3.25], -0.2);
createFloorDrain(factory, [10.55, 0.075, 2.65], 0.45);
createFloorLabel(factory, "MAINT", [10.7, 0.057, -2.65], [1.45, 0.48], Math.PI / 2, "#b86538");
addBox(factory, [1.55, 0.045, 1.18], [10.7, 0.045, -3.7], materials.concretePatch);
addBox(factory, [2.1, 0.045, 1.55], [-9.55, 0.045, 1.35], materials.concretePatch);
addBox(factory, [2.2, 0.045, 1.35], [8.35, 0.045, -5.25], materials.concretePatch);

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

[
  [-7.6, 0, 2.25],
  [-5.95, 0, 2.25],
  [5.95, 0, 2.25],
  [7.6, 0, 2.25],
  [-7.6, 0, -2.05],
  [-5.95, 0, -2.05],
  [5.95, 0, -2.05],
  [7.6, 0, -2.05],
].forEach((position) => createSafetyBollard(factory, position, 0.92));

createMaintenancePanel(factory, [-12.5, 2.2, -8.92], 0, materials.glowBlue);
createMaintenancePanel(factory, [12.4, 2.0, -8.92], 0, materials.glowGreen);
createMaintenancePanel(factory, [-14.82, 2.1, 5.25], Math.PI / 2, materials.glowRed);
createCableTray(factory, [
  [-12.6, 4.92, -7.8],
  [-7.5, 4.78, -7.1],
  [-1.5, 4.86, -7.65],
  [5.2, 4.74, -7.05],
  [12.0, 4.82, -7.5],
]);
createCableTray(factory, [
  [-13.75, 4.45, 6.7],
  [-13.75, 4.25, 2.4],
  [-13.75, 4.35, -2.2],
]);

const roomGroup = new THREE.Group();
factory.add(roomGroup);
const slidingDoors = [];

// Storage room: separated from the assembly floor by partial walls and a door.
createPartitionWall(roomGroup, [0.18, 3.0, 5.4], [-6.35, 0, 4.9], false);
createPartitionWall(roomGroup, [4.1, 3.0, 0.18], [-8.35, 0, 2.18], false);
createDoorFrame(roomGroup, [-7.05, 0, 2.2], 0, 1.65, 2.15);
slidingDoors.push(createSlidingDoor(roomGroup, [-7.05, 0, 2.2], 0, 1.46, "storage"));
createFloorLabel(roomGroup, "STORAGE", [-8.95, 0.065, 6.45], [2.05, 0.62], 0, "#b86538");
createPallet(roomGroup, [-10.4, 0, 6.35], Math.PI / 2);
createPallet(roomGroup, [-8.6, 0, 6.55], Math.PI / 2);
createPallet(roomGroup, [-7.25, 0, 5.35], Math.PI / 2);
createBarrel(roomGroup, [-6.75, 0, 6.25], materials.pipeBlue);
createBarrel(roomGroup, [-7.25, 0, 6.25], materials.pipeGreen);
createFloorLabel(roomGroup, "LOAD", [-10.35, 0.066, 3.1], [1.35, 0.42], 0, "#f6c453");
addBox(roomGroup, [2.6, 0.04, 0.08], [-9.45, 0.052, 3.85], materials.cautionPaint);
addBox(roomGroup, [2.6, 0.04, 0.08], [-9.45, 0.053, 5.6], materials.cautionPaint);
addBox(roomGroup, [0.08, 0.04, 1.75], [-10.75, 0.054, 4.72], materials.cautionPaint);
addBox(roomGroup, [0.08, 0.04, 1.75], [-8.15, 0.055, 4.72], materials.cautionPaint);

// Control room: glass booth overlooking the line.
createPartitionWall(roomGroup, [5.3, 2.8, 0.16], [7.25, 0, 1.45], true);
createPartitionWall(roomGroup, [0.16, 2.8, 4.6], [4.65, 0, 3.7], true);
createPartitionWall(roomGroup, [0.16, 2.8, 4.6], [9.85, 0, 3.7], true);
createDoorFrame(roomGroup, [4.65, 0, 2.35], Math.PI / 2, 1.45, 2.1);
slidingDoors.push(createSlidingDoor(roomGroup, [4.65, 0, 2.35], Math.PI / 2, 1.32, "control"));
createFloorLabel(roomGroup, "CONTROL", [7.25, 0.067, 5.75], [2.0, 0.62], 0, "#3a725f");
addBox(roomGroup, [3.1, 0.08, 0.42], [7.25, 1.52, 1.58], materials.brushed);
addBox(roomGroup, [3.1, 0.08, 0.42], [7.25, 2.28, 1.58], materials.brushed);
createMaintenancePanel(roomGroup, [9.65, 1.75, 3.4], -Math.PI / 2, materials.glowGreen);
addBox(roomGroup, [1.35, 0.05, 0.62], [8.45, 1.22, 4.72], materials.darkSteel);
addSphere(roomGroup, 0.055, [8.02, 1.3, 4.42], materials.glowGreen, 12);
addSphere(roomGroup, 0.055, [8.28, 1.3, 4.42], materials.glowBlue, 12);
addSphere(roomGroup, 0.055, [8.54, 1.3, 4.42], materials.glowRed, 12);

// Inspection/service room: frames the scanner and press as a separate station.
createPartitionWall(roomGroup, [4.55, 2.65, 0.16], [-4.35, 0, -1.35], true);
createPartitionWall(roomGroup, [0.16, 2.65, 3.25], [-6.6, 0, -2.95], true);
createDoorFrame(roomGroup, [-4.35, 0, -1.35], 0, 1.55, 2.05);
slidingDoors.push(createSlidingDoor(roomGroup, [-4.35, 0, -1.35], 0, 1.38, "inspection"));
createFloorLabel(roomGroup, "INSPECT", [-4.35, 0.068, -5.15], [1.85, 0.56], 0, "#f6c453");
createFloorDrain(roomGroup, [-5.75, 0.077, -4.65], -0.35);
createSafetyBollard(roomGroup, [-6.05, 0, -1.65], 0.82);
createSafetyBollard(roomGroup, [-2.65, 0, -1.65], 0.82);
addBox(roomGroup, [1.65, 0.045, 1.1], [-3.05, 0.045, -4.38], materials.concretePatch);

addPipe(roomGroup, [-5.92, 2.85, -1.65], [-5.92, 2.85, -3.85], 0.035, materials.pipeBlue);
addPipe(roomGroup, [5.28, 2.95, 1.75], [9.25, 2.95, 1.75], 0.035, materials.pipeGreen);
addCable([
  [5.35, 3.05, 1.85],
  [6.4, 2.75, 1.65],
  [7.5, 2.9, 1.82],
  [9.0, 2.65, 1.7],
]);

const agv = createAgv(scene);
const agvPath = [
  new THREE.Vector3(-8.6, 0, 5.55),
  new THREE.Vector3(-6.8, 0, 3.0),
  new THREE.Vector3(-3.8, 0, 2.25),
  new THREE.Vector3(2.8, 0, 2.15),
  new THREE.Vector3(6.9, 0, 3.25),
  new THREE.Vector3(4.2, 0, 0.85),
  new THREE.Vector3(-2.8, 0, -0.45),
  new THREE.Vector3(-4.7, 0, -3.4),
];
const agvSegments = agvPath.map((point, index) => {
  const next = agvPath[(index + 1) % agvPath.length];
  return point.distanceTo(next);
});
const agvRouteLength = agvSegments.reduce((total, length) => total + length, 0);

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
sun.shadow.camera.left = -17;
sun.shadow.camera.right = 17;
sun.shadow.camera.top = 15;
sun.shadow.camera.bottom = -15;
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
addBox(belt, [15.6, 0.34, 1.48], [0, 0.6, 0], materials.belt);
addBox(belt, [16.2, 0.22, 0.12], [0, 0.84, -0.92], materials.brushed);
addBox(belt, [16.2, 0.22, 0.12], [0, 0.84, 0.92], materials.brushed);
addBox(belt, [16.5, 0.12, 0.42], [0, 0.34, -1.16], materials.darkSteel);
addBox(belt, [16.5, 0.12, 0.42], [0, 0.34, 1.16], materials.darkSteel);

for (let x = -7.6; x <= 7.6; x += 0.8) {
  const roller = addCylinder(belt, 0.17, 0.17, 1.82, [x, 0.82, 0], materials.darkSteel, 24);
  roller.rotation.z = Math.PI / 2;
}

for (let x = -7.8; x <= 7.8; x += 2.6) {
  addBox(belt, [0.16, 1.0, 0.16], [x, 0.05, -1.04], materials.darkSteel);
  addBox(belt, [0.16, 1.0, 0.16], [x, 0.05, 1.04], materials.darkSteel);
}

const hazardFront = addBox(factory, [16.4, 0.04, 0.42], [0, 0.025, 1.82], materials.hazard);
const hazardBack = addBox(factory, [16.4, 0.04, 0.42], [0, 0.026, -1.42], materials.hazard);

const lamp = new THREE.Group();
scene.add(lamp);
addCylinder(lamp, 0.07, 0.1, 4.2, [-4.7, 2.1, 1.7], materials.darkSteel, 18);
const lampHead = addCylinder(lamp, 0.48, 0.23, 0.42, [-4.7, 4.35, 1.7], materials.yellow, 32);
lampHead.rotation.x = Math.PI;
addSphere(lamp, 0.16, [-4.7, 4.06, 1.7], materials.lampGlow, 16);

function createParallelGripper(parent) {
  const gripper = new THREE.Group();
  parent.add(gripper);

  addBox(gripper, [0.18, 0.52, 0.34], [0.18, 0, -0.02], materials.brushed);
  addBox(gripper, [0.16, 0.62, 0.12], [0.3, 0, 0.16], materials.darkSteel);
  addBox(gripper, [0.16, 0.62, 0.12], [0.3, 0, -0.2], materials.darkSteel);
  addCylinder(gripper, 0.09, 0.09, 0.46, [0.08, 0, -0.02], materials.darkSteel, 18).rotation.x = Math.PI / 2;
  addSphere(gripper, 0.055, [0.36, 0.24, 0.16], materials.glowGreen, 10);
  addSphere(gripper, 0.045, [0.36, -0.24, 0.16], materials.glowRed, 10);

  const leftJaw = new THREE.Group();
  const rightJaw = new THREE.Group();
  gripper.add(leftJaw, rightJaw);

  addBox(leftJaw, [0.42, 0.09, 0.15], [0.58, 0, 0.13], materials.red);
  addBox(leftJaw, [0.12, 0.09, 0.38], [0.76, 0, -0.01], materials.red);
  addBox(leftJaw, [0.18, 0.11, 0.1], [0.82, 0, -0.22], materials.rubber);
  addBox(leftJaw, [0.18, 0.11, 0.1], [0.55, 0, -0.22], materials.rubber);
  addCylinder(leftJaw, 0.045, 0.045, 0.16, [0.46, 0, 0.12], materials.brushed, 12).rotation.x = Math.PI / 2;

  addBox(rightJaw, [0.42, 0.09, 0.15], [0.58, 0, -0.17], materials.red);
  addBox(rightJaw, [0.12, 0.09, 0.38], [0.76, 0, -0.03], materials.red);
  addBox(rightJaw, [0.18, 0.11, 0.1], [0.82, 0, 0.18], materials.rubber);
  addBox(rightJaw, [0.18, 0.11, 0.1], [0.55, 0, 0.18], materials.rubber);
  addCylinder(rightJaw, 0.045, 0.045, 0.16, [0.46, 0, -0.16], materials.brushed, 12).rotation.x = Math.PI / 2;

  return { gripper, leftJaw, rightJaw };
}

function createRobot(position, rotationY = 0, accent = materials.teal, options = {}) {
  const robotId = options.id || "R-01";
  const robot = new THREE.Group();
  robot.position.set(...position);
  robot.rotation.y = rotationY;
  scene.add(robot);

  addCylinder(robot, 0.72, 0.88, 0.32, [0, 0.16, 0], materials.darkSteel);
  addCylinder(robot, 0.54, 0.62, 0.3, [0, 0.47, 0], materials.brushed);
  const baseRing = addTorus(robot, 0.73, 0.025, [0, 0.35, 0], materials.brushed, 12, 44);
  baseRing.rotation.x = Math.PI / 2;
  for (let i = 0; i < 10; i += 1) {
    const angle = (i / 10) * Math.PI * 2;
    const bolt = addCylinder(robot, 0.035, 0.035, 0.045, [Math.cos(angle) * 0.66, 0.39, Math.sin(angle) * 0.66], materials.darkSteel, 10);
    bolt.rotation.x = Math.PI / 2;
  }

  const waistPivot = new THREE.Group();
  waistPivot.position.y = 0.62;
  robot.add(waistPivot);

  const torso = addCylinder(waistPivot, 0.42, 0.55, 0.75, [0, 0.38, 0], materials.yellow);
  addBox(waistPivot, [0.55, 0.18, 0.65], [0, 0.8, 0], materials.darkSteel);
  const nameplateMaterial = new THREE.MeshStandardMaterial({
    map: makeLabelTexture(robotId, "#f6c453", "#151515"),
    roughness: 0.42,
    metalness: 0.05,
  });
  const nameplate = shadow(new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.18), nameplateMaterial));
  nameplate.position.set(0, 0.74, 0.36);
  waistPivot.add(nameplate);
  addSphere(waistPivot, 0.08, [0.22, 0.93, 0.34], materials.glowGreen, 12);
  addSphere(waistPivot, 0.08, [-0.02, 0.93, 0.34], materials.glowRed, 12);
  const stageLight = addSphere(waistPivot, 0.09, [-0.25, 0.93, 0.34], materials.glowBlue, 12);
  addBox(waistPivot, [0.46, 0.08, 0.08], [0, 0.18, 0.48], materials.warningBlack);
  addBox(waistPivot, [0.46, 0.08, 0.08], [0, 0.34, 0.48], materials.warningBlack);

  const shoulderPivot = new THREE.Group();
  shoulderPivot.position.set(0, 0.85, 0);
  waistPivot.add(shoulderPivot);
  addSphere(shoulderPivot, 0.31, [0.04, 0, 0], materials.brushed, 18);
  const shoulderCap = addCylinder(shoulderPivot, 0.32, 0.32, 0.18, [0.04, 0, 0.33], materials.darkSteel, 24);
  shoulderCap.rotation.x = Math.PI / 2;

  const upperArm = new THREE.Group();
  upperArm.position.set(0.54, 0, 0);
  shoulderPivot.add(upperArm);
  addBox(upperArm, [1.46, 0.32, 0.38], [0.73, 0, 0], accent);
  addCylinder(upperArm, 0.26, 0.26, 0.48, [0, 0, 0], materials.brushed);
  addPipe(upperArm, [0.08, 0.28, -0.24], [1.28, 0.2, -0.24], 0.035, materials.brushed);
  addPipe(upperArm, [0.08, -0.28, 0.24], [1.28, -0.2, 0.24], 0.035, materials.brushed);
  addLocalCable(upperArm, [
    [0.0, 0.28, -0.28],
    [0.42, 0.43, -0.36],
    [0.96, 0.38, -0.32],
    [1.35, 0.18, -0.28],
  ], 0.026);
  addBox(upperArm, [0.9, 0.05, 0.06], [0.72, 0.23, 0.25], materials.warningBlack);

  const elbowPivot = new THREE.Group();
  elbowPivot.position.set(1.5, 0, 0);
  upperArm.add(elbowPivot);
  addCylinder(elbowPivot, 0.24, 0.24, 0.5, [0, 0, 0], materials.brushed);
  addSphere(elbowPivot, 0.27, [0, 0, 0], materials.darkSteel, 18);
  const elbowCap = addCylinder(elbowPivot, 0.28, 0.28, 0.16, [0, 0, -0.32], materials.brushed, 24);
  elbowCap.rotation.x = Math.PI / 2;

  const forearm = new THREE.Group();
  elbowPivot.add(forearm);
  addBox(forearm, [1.24, 0.27, 0.31], [0.62, 0, 0], materials.yellow);
  addBox(forearm, [0.5, 0.32, 0.36], [0.98, 0, 0], materials.darkSteel);
  addPipe(forearm, [0.1, 0.22, -0.2], [1.13, 0.2, -0.2], 0.028, materials.brushed);
  addPipe(forearm, [0.1, -0.22, 0.2], [1.13, -0.2, 0.2], 0.028, materials.brushed);
  addLocalCable(forearm, [
    [0.0, 0.25, 0.24],
    [0.36, 0.36, 0.3],
    [0.86, 0.3, 0.28],
    [1.24, 0.12, 0.22],
  ], 0.023);

  const wristPivot = new THREE.Group();
  wristPivot.position.set(1.28, 0, 0);
  forearm.add(wristPivot);
  addCylinder(wristPivot, 0.18, 0.18, 0.38, [0, 0, 0], materials.brushed);
  addSphere(wristPivot, 0.19, [0.02, 0, 0], materials.darkSteel, 16);
  const wristLight = addSphere(wristPivot, 0.055, [0.34, 0.22, 0.22], materials.glowBlue, 10);
  const gripperRig = createParallelGripper(wristPivot);

  const carriedObject = new THREE.Group();
  carriedObject.visible = false;
  wristPivot.add(carriedObject);
  addBox(carriedObject, [0.42, 0.2, 0.3], [0.66, 0, -0.02], materials.battery);
  addBox(carriedObject, [0.1, 0.24, 0.34], [0.66, 0, -0.02], materials.darkSteel);
  addBox(carriedObject, [0.32, 0.045, 0.04], [0.66, 0.12, 0.15], materials.glowGreen);

  return {
    robot,
    waistPivot,
    torso,
    shoulderPivot,
    upperArm,
    elbowPivot,
    forearm,
    wristPivot,
    clawLeft: gripperRig.leftJaw,
    clawRight: gripperRig.rightJaw,
    stageLight,
    wristLight,
    nameplate,
    carriedObject,
  };
}

const primaryRobot = createRobot([-2.75, 0, -2.35], 0.18, materials.teal, { id: "R-01" });
const secondaryRobot = createRobot([4.35, 0, -3.75], -0.44, materials.blue, { id: "R-02" });
const pickupMarker = new THREE.Group();
pickupMarker.position.set(-0.05, 0, -0.74);
scene.add(pickupMarker);
addBox(pickupMarker, [0.8, 0.045, 0.48], [0, 1.0, 0], materials.zoneBlue);
addBox(pickupMarker, [0.12, 0.08, 0.52], [-0.46, 1.04, 0], materials.brushed);
addBox(pickupMarker, [0.12, 0.08, 0.52], [0.46, 1.04, 0], materials.brushed);
createFloorLabel(scene, "BELT PICK", [-0.05, 0.071, -1.35], [1.25, 0.32], 0, "#2f6984");
const robotPickupPart = createHandledPart(scene, [-0.05, 1.18, -0.74], materials.battery);

const dropMarker = new THREE.Group();
dropMarker.position.set(-0.62, 0, 0.02);
scene.add(dropMarker);
addBox(dropMarker, [0.8, 0.045, 0.48], [0, 1.0, 0], materials.zoneGreen);
addBox(dropMarker, [0.12, 0.08, 0.52], [-0.46, 1.04, 0], materials.brushed);
addBox(dropMarker, [0.12, 0.08, 0.52], [0.46, 1.04, 0], materials.brushed);
createFloorLabel(scene, "RETURN", [-0.62, 0.072, 0.92], [1.15, 0.32], 0, "#3a725f");
const robotPlacedPart = createHandledPart(scene, [-0.62, 1.18, 0.02], materials.productShell);
robotPlacedPart.visible = false;

const productionItems = [];
const productionKinds = ["crate", "battery", "chassis", "finished", "reject", "battery", "finished", "chassis"];
for (let i = 0; i < productionKinds.length; i += 1) {
  const item = createProductionItem(productionKinds[i], i);
  item.position.set(-7.4 + i * 2.05, 1.15, 0.2);
  productionItems.push(item);
}

const acceptedBin = new THREE.Group();
acceptedBin.position.set(5.95, 0, -1.45);
scene.add(acceptedBin);
addBox(acceptedBin, [1.05, 0.12, 0.82], [0, 0.36, 0], materials.darkSteel);
addBox(acceptedBin, [0.1, 0.72, 0.82], [-0.52, 0.72, 0], materials.brushed);
addBox(acceptedBin, [0.1, 0.72, 0.82], [0.52, 0.72, 0], materials.brushed);
addBox(acceptedBin, [1.05, 0.72, 0.1], [0, 0.72, -0.4], materials.brushed);
addSphere(acceptedBin, 0.08, [0, 1.18, 0.42], materials.glowGreen, 12);

const rejectBin = new THREE.Group();
rejectBin.position.set(-4.9, 0, 1.72);
scene.add(rejectBin);
addBox(rejectBin, [1.0, 0.12, 0.8], [0, 0.36, 0], materials.reject);
addBox(rejectBin, [0.1, 0.68, 0.8], [-0.5, 0.7, 0], materials.darkSteel);
addBox(rejectBin, [0.1, 0.68, 0.8], [0.5, 0.7, 0], materials.darkSteel);
addBox(rejectBin, [1.0, 0.68, 0.1], [0, 0.7, -0.38], materials.darkSteel);
addSphere(rejectBin, 0.08, [0, 1.12, 0.4], materials.glowRed, 12);

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
const scannerStatus = addSphere(scanner, 0.1, [0.5, 2.98, 0.25], materials.glowGreen, 16);

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
drone.position.set(2.2, 3.85, 2.95);
scene.add(drone);
addBox(drone, [0.82, 0.2, 0.54], [0, 0, 0], materials.productDark);
addBox(drone, [0.48, 0.14, 0.32], [0.05, 0.11, 0], materials.glass);
addSphere(drone, 0.14, [0.46, 0.02, 0], materials.glowBlue, 14);
addSphere(drone, 0.1, [-0.42, 0.01, 0], materials.glowGreen, 12);
addBox(drone, [0.22, 0.08, 0.18], [0.05, -0.18, 0.32], materials.brushed);
const droneBeamMaterial = materials.glowBlue.clone();
droneBeamMaterial.transparent = true;
droneBeamMaterial.opacity = 0.16;
const droneBeam = addCylinder(drone, 0.04, 0.28, 1.2, [0, -0.68, 0], droneBeamMaterial, 24);
const rotorPivots = [];
[
  [-0.56, -0.43],
  [0.56, -0.43],
  [-0.56, 0.43],
  [0.56, 0.43],
].forEach(([x, z]) => {
  addPipe(drone, [0, 0.03, 0], [x, 0.03, z], 0.035, materials.darkSteel);
});
[
  [-0.56, 0, -0.43],
  [0.56, 0, -0.43],
  [-0.56, 0, 0.43],
  [0.56, 0, 0.43],
].forEach((position) => {
  const pivot = new THREE.Group();
  pivot.position.set(...position);
  drone.add(pivot);
  const guard = addTorus(pivot, 0.32, 0.018, [0, 0.08, 0], materials.brushed, 12, 34);
  guard.rotation.x = Math.PI / 2;
  addBox(pivot, [0.58, 0.025, 0.055], [0, 0.1, 0], materials.darkSteel);
  addBox(pivot, [0.055, 0.025, 0.58], [0, 0.1, 0], materials.darkSteel);
  addCylinder(pivot, 0.06, 0.08, 0.12, [0, 0.02, 0], materials.brushed, 14);
  rotorPivots.push(pivot);
});
addBox(drone, [0.08, 0.42, 0.05], [-0.28, -0.26, -0.18], materials.brushed);
addBox(drone, [0.08, 0.42, 0.05], [0.28, -0.26, -0.18], materials.brushed);
addBox(drone, [0.72, 0.045, 0.07], [0, -0.48, -0.18], materials.brushed);
addBox(drone, [0.08, 0.42, 0.05], [-0.28, -0.26, 0.18], materials.brushed);
addBox(drone, [0.08, 0.42, 0.05], [0.28, -0.26, 0.18], materials.brushed);
addBox(drone, [0.72, 0.045, 0.07], [0, -0.48, 0.18], materials.brushed);

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
const toggleMachines = document.querySelector("#toggle-machines");
const toggleScanner = document.querySelector("#toggle-scanner");
const toggleDrone = document.querySelector("#toggle-drone");
const robotSpeed = document.querySelector("#robot-speed");
const cameraView = document.querySelector("#camera-view");
const speedControl = document.querySelector("#speed-control");
const modeLabel = document.querySelector("#mode-label");
const roomLabel = document.querySelector("#room-label");
const speedLabel = document.querySelector("#speed-label");
const roomButtons = document.querySelectorAll(".room-button");
const mapRooms = document.querySelectorAll(".map-room");
const toggleWalk = document.querySelector("#toggle-walk");
const walkHelp = document.querySelector("#walk-help");

function setToggleState(button, isActive, activeText, inactiveText) {
  button.textContent = isActive ? activeText : inactiveText;
  button.classList.toggle("inactive", !isActive);
  button.classList.toggle("active", isActive && button === robotSpeed);
}

function moveCameraTo(view) {
  state.cameraTransition = {
    position: view.position.clone(),
    target: view.target.clone(),
  };
}

function activateRoom(roomKey) {
  const view = roomViews[roomKey];
  if (!view) return;
  if (state.walkMode) {
    setWalkMode(false);
  }

  state.roomKey = roomKey;
  state.activeDoorKey = roomKey;
  state.doorTimer = 2.4;
  roomLabel.textContent = view.label;
  modeLabel.textContent = state.running ? `Moving to ${view.label}` : `Paused in ${view.label}`;
  roomButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.room === roomKey);
  });
  mapRooms.forEach((button) => {
    button.classList.toggle("active", button.dataset.room === roomKey);
  });
  moveCameraTo(view);
}

function setWalkMode(enabled) {
  state.walkMode = enabled;
  state.cameraTransition = null;
  controls.enabled = !enabled;
  toggleWalk.classList.toggle("active", enabled);
  toggleWalk.textContent = enabled ? "Exit Walk" : "Walk Mode";
  walkHelp.classList.toggle("visible", enabled);

  if (enabled) {
    state.walkYaw = Math.atan2(camera.position.x - controls.target.x, camera.position.z - controls.target.z);
    camera.position.y = 1.65;
    controls.target.set(
      camera.position.x - Math.sin(state.walkYaw) * 4,
      1.55,
      camera.position.z - Math.cos(state.walkYaw) * 4,
    );
    modeLabel.textContent = "Walk mode";
  } else {
    modeLabel.textContent = state.running ? "Automatic cycle" : `Paused in ${roomViews[state.roomKey].label}`;
  }
}

toggleAnimation.addEventListener("click", () => {
  state.running = !state.running;
  toggleAnimation.textContent = state.running ? "Pause" : "Resume";
  modeLabel.textContent = state.running ? "Automatic cycle" : `Paused in ${roomViews[state.roomKey].label}`;
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
  setToggleState(toggleLamp, state.lampOn, "Lamp Off", "Lamp On");
  lampLight.visible = state.lampOn;
  ceilingLights.forEach((light, index) => {
    light.intensity = state.lampOn ? 8.2 : index % 2 === 0 ? 1.5 : 0;
  });
});

toggleMachines.addEventListener("click", () => {
  state.machinesOn = !state.machinesOn;
  setToggleState(toggleMachines, state.machinesOn, "Machines Off", "Machines On");
  modeLabel.textContent = state.machinesOn ? "Production line active" : "Production line stopped";
});

toggleScanner.addEventListener("click", () => {
  state.scannerOn = !state.scannerOn;
  setToggleState(toggleScanner, state.scannerOn, "Scanner Off", "Scanner On");
  scanner.visible = state.scannerOn;
});

toggleDrone.addEventListener("click", () => {
  state.droneOn = !state.droneOn;
  setToggleState(toggleDrone, state.droneOn, "Drone Off", "Drone On");
  drone.visible = state.droneOn;
});

robotSpeed.addEventListener("click", () => {
  state.robotSpeedIndex = (state.robotSpeedIndex + 1) % robotSpeedOptions.length;
  const option = robotSpeedOptions[state.robotSpeedIndex];
  robotSpeed.textContent = option.label;
  robotSpeed.classList.toggle("active", option.value !== 1);
});

cameraView.addEventListener("click", () => {
  if (state.walkMode) {
    setWalkMode(false);
  }
  state.cameraIndex = (state.cameraIndex + 1) % cameraViews.length;
  const view = cameraViews[state.cameraIndex];
  moveCameraTo(view);
  cameraView.textContent = `Camera ${String.fromCharCode(65 + ((state.cameraIndex + 1) % cameraViews.length))}`;
});

speedControl.addEventListener("input", () => {
  state.speed = Number(speedControl.value);
  speedLabel.textContent = `${state.speed.toFixed(1)}x`;
});

roomButtons.forEach((button) => {
  button.addEventListener("click", () => activateRoom(button.dataset.room));
});

mapRooms.forEach((button) => {
  button.addEventListener("click", () => activateRoom(button.dataset.room));
});

toggleWalk.addEventListener("click", () => setWalkMode(!state.walkMode));

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (["w", "a", "s", "d", "q", "e", "shift", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
    pressedKeys.add(key);
    if (state.walkMode) {
      event.preventDefault();
    }
  }
});

window.addEventListener("keyup", (event) => {
  pressedKeys.delete(event.key.toLowerCase());
});

function smoothStep(value) {
  return value * value * (3 - 2 * value);
}

function interpolatePose(a, b, amount) {
  const t = smoothStep(amount);
  return {
    waist: THREE.MathUtils.lerp(a.waist, b.waist, t),
    shoulder: THREE.MathUtils.lerp(a.shoulder, b.shoulder, t),
    upperYaw: THREE.MathUtils.lerp(a.upperYaw, b.upperYaw, t),
    elbow: THREE.MathUtils.lerp(a.elbow, b.elbow, t),
    wristX: THREE.MathUtils.lerp(a.wristX, b.wristX, t),
    wristZ: THREE.MathUtils.lerp(a.wristZ, b.wristZ, t),
    claw: THREE.MathUtils.lerp(a.claw, b.claw, t),
  };
}

function animateRobot(robotRig, time, phase = 0, mirrored = false) {
  const cycle = ROBOT_CYCLE_DURATION;
  const t = (time + phase) % cycle;
  const side = mirrored ? -1 : 1;
  const poses = [
    { at: 0, waist: -0.66 * side, shoulder: -0.48, upperYaw: -0.08, elbow: 1.38, wristX: 0.08, wristZ: -0.08, claw: 0.42 },
    { at: 0.9, waist: -0.68 * side, shoulder: -0.68, upperYaw: -0.05, elbow: 1.3, wristX: 0.08, wristZ: -0.08, claw: 0.42 },
    { at: 1.45, waist: -0.7 * side, shoulder: -0.7, upperYaw: -0.04, elbow: 1.28, wristX: 0.1, wristZ: -0.06, claw: 0.42 },
    { at: 1.95, waist: -0.7 * side, shoulder: -0.7, upperYaw: -0.04, elbow: 1.28, wristX: 0.12, wristZ: -0.06, claw: 0.13 },
    { at: 2.85, waist: -0.78 * side, shoulder: -0.42, upperYaw: 0.0, elbow: 1.42, wristX: 0.34, wristZ: 0.0, claw: 0.13 },
    { at: 4.15, waist: -1.0 * side, shoulder: -0.42, upperYaw: -0.02, elbow: 1.42, wristX: 0.28, wristZ: 0.08, claw: 0.13 },
    { at: 5.2, waist: -1.0 * side, shoulder: -0.7, upperYaw: -0.04, elbow: 1.28, wristX: 0.1, wristZ: 0.06, claw: 0.13 },
    { at: 5.8, waist: -1.0 * side, shoulder: -0.7, upperYaw: -0.04, elbow: 1.28, wristX: 0.1, wristZ: 0.06, claw: 0.42 },
    { at: 6.75, waist: -0.82 * side, shoulder: -0.42, upperYaw: 0.02, elbow: 1.44, wristX: 0.15, wristZ: 0.04, claw: 0.42 },
    { at: 8.4, waist: -0.66 * side, shoulder: -0.48, upperYaw: -0.08, elbow: 1.38, wristX: 0.08, wristZ: -0.08, claw: 0.42 },
  ];

  let start = poses[0];
  let end = poses[1];
  for (let i = 0; i < poses.length - 1; i += 1) {
    if (t >= poses[i].at && t <= poses[i + 1].at) {
      start = poses[i];
      end = poses[i + 1];
      break;
    }
  }

  const localT = (t - start.at) / (end.at - start.at);
  const pose = interpolatePose(start, end, localT);

  robotRig.waistPivot.rotation.y = pose.waist;
  robotRig.shoulderPivot.rotation.z = pose.shoulder;
  robotRig.upperArm.rotation.y = pose.upperYaw;
  robotRig.elbowPivot.rotation.z = pose.elbow;
  robotRig.wristPivot.rotation.x = pose.wristX;
  robotRig.wristPivot.rotation.z = pose.wristZ;
  robotRig.torso.rotation.y = Math.sin((time + phase) * 1.7) * 0.018;
  const jawOffset = pose.claw * 0.42;
  robotRig.clawLeft.position.z = jawOffset;
  robotRig.clawRight.position.z = -jawOffset;
  const carrying = t >= 1.85 && t <= 5.75;
  robotRig.carriedObject.visible = carrying;
  robotRig.stageLight.material = carrying ? materials.glowGreen : t > 5.65 && t < 6.2 ? materials.glowRed : materials.glowBlue;
  robotRig.wristLight.material = carrying ? materials.glowGreen : materials.glowBlue;
  robotRig.stageLight.scale.setScalar(1 + Math.sin((time + phase) * 8) * 0.08);
  robotRig.wristLight.scale.setScalar(1 + Math.sin((time + phase) * 10) * 0.05);
}

function updateSlidingDoors(delta) {
  if (state.doorTimer > 0) {
    state.doorTimer = Math.max(0, state.doorTimer - delta);
  }

  slidingDoors.forEach((door) => {
    const shouldOpen = door.roomKey === state.activeDoorKey && state.doorTimer > 0;
    const targetOffset = shouldOpen ? door.openOffset : 0;
    const blend = 1 - Math.pow(0.001, delta);
    door.left.position.x = THREE.MathUtils.lerp(door.left.position.x, door.closedLeftX - targetOffset, blend);
    door.right.position.x = THREE.MathUtils.lerp(door.right.position.x, door.closedRightX + targetOffset, blend);
  });
}

function updateAgv(time) {
  const distance = (time * 1.05) % agvRouteLength;
  let covered = 0;

  for (let i = 0; i < agvSegments.length; i += 1) {
    const segmentLength = agvSegments[i];
    if (covered + segmentLength >= distance) {
      const start = agvPath[i];
      const end = agvPath[(i + 1) % agvPath.length];
      const progress = (distance - covered) / segmentLength;
      agv.position.lerpVectors(start, end, progress);
      agv.position.y = 0;
      agv.rotation.y = Math.atan2(end.x - start.x, end.z - start.z);
      return;
    }
    covered += segmentLength;
  }
}

function getRoomForPosition(position) {
  if (position.x < -6.35 && position.z > 2.15) return "storage";
  if (position.x > 4.65 && position.z > 1.45) return "control";
  if (position.x < -3.0 && position.z < -1.35) return "inspection";
  return "assembly";
}

function syncRoomUi(roomKey) {
  if (state.roomKey === roomKey) return;

  state.roomKey = roomKey;
  roomLabel.textContent = roomViews[roomKey].label;
  roomButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.room === roomKey);
  });
  mapRooms.forEach((button) => {
    button.classList.toggle("active", button.dataset.room === roomKey);
  });
}

function updateWalkMode(delta) {
  if (!state.walkMode) return;

  const turnSpeed = 1.75;
  const moveSpeed = pressedKeys.has("shift") ? 4.2 : 2.45;

  if (pressedKeys.has("q") || pressedKeys.has("arrowleft")) {
    state.walkYaw += turnSpeed * delta;
  }
  if (pressedKeys.has("e") || pressedKeys.has("arrowright")) {
    state.walkYaw -= turnSpeed * delta;
  }

  const forward = new THREE.Vector3(-Math.sin(state.walkYaw), 0, -Math.cos(state.walkYaw));
  const right = new THREE.Vector3(Math.cos(state.walkYaw), 0, -Math.sin(state.walkYaw));
  const movement = new THREE.Vector3();

  if (pressedKeys.has("w") || pressedKeys.has("arrowup")) movement.add(forward);
  if (pressedKeys.has("s") || pressedKeys.has("arrowdown")) movement.sub(forward);
  if (pressedKeys.has("d")) movement.add(right);
  if (pressedKeys.has("a")) movement.sub(right);

  if (movement.lengthSq() > 0) {
    movement.normalize().multiplyScalar(moveSpeed * delta);
    camera.position.add(movement);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, walkBounds.minX, walkBounds.maxX);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, walkBounds.minZ, walkBounds.maxZ);
  }

  camera.position.y = 1.65;
  controls.target.set(
    camera.position.x + forward.x * 4,
    1.55,
    camera.position.z + forward.z * 4,
  );

  const currentRoom = getRoomForPosition(camera.position);
  syncRoomUi(currentRoom);
  state.activeDoorKey = currentRoom;
  state.doorTimer = Math.max(state.doorTimer, 0.2);
  modeLabel.textContent = "Walk mode";
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
let machineElapsed = 0;
let robotElapsed = 0;

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (state.running) {
    elapsed += delta * state.speed;
    robotElapsed += delta * state.speed * robotSpeedOptions[state.robotSpeedIndex].value;
    if (state.machinesOn) {
      machineElapsed += delta * state.speed;
    }
  }
  updateWalkMode(delta);

  beltTexture.offset.x = -machineElapsed * 0.58;
  hazardTexture.offset.x = -machineElapsed * 0.08;

  animateRobot(primaryRobot, robotElapsed, 0, false);
  animateRobot(secondaryRobot, robotElapsed, 3.6, true);
  const robotCycle = robotElapsed % ROBOT_CYCLE_DURATION;
  pickupMarker.scale.setScalar(robotCycle < 2.2 ? 1.08 + Math.sin(robotElapsed * 8) * 0.025 : 1);
  dropMarker.scale.setScalar(robotCycle > 5.0 && robotCycle < 6.2 ? 1.08 + Math.sin(robotElapsed * 8) * 0.025 : 1);
  const pickupWaiting = robotCycle < 1.85 || robotCycle > 7.45;
  const partReleased = robotCycle >= 5.75 && robotCycle < 7.75;
  robotPickupPart.visible = pickupWaiting;
  robotPickupPart.position.set(-0.05, 1.18 + Math.sin(robotElapsed * 6) * 0.01, -0.74);
  robotPickupPart.rotation.y = Math.sin(robotElapsed * 1.4) * 0.04;
  robotPlacedPart.visible = partReleased;
  if (partReleased) {
    const returnProgress = Math.min(1, (robotCycle - 5.75) / 2.0);
    robotPlacedPart.position.set(-0.62 + returnProgress * 1.7, 1.18, 0.02 + returnProgress * 0.18);
    robotPlacedPart.rotation.y += delta * state.speed * 0.65;
  } else {
    robotPlacedPart.position.set(-0.62, 1.18, 0.02);
  }

  pressHead.position.y = 1.82 + Math.max(0, Math.sin(machineElapsed * 2.2)) * 0.62;
  let inspectedRejectNearby = false;
  let nearestItem = productionItems[0];
  let nearestDistance = Infinity;

  productionItems.forEach((item, index) => {
    const x = ((machineElapsed * 1.12 + index * 2.05 + 8.0) % 16.0) - 8.0;
    item.position.x = x;
    item.position.z = 0.2;
    item.position.y = 1.15 + Math.sin(machineElapsed * 2.2 + index) * 0.015;
    if (state.machinesOn && state.running) {
      item.rotation.y += delta * state.speed * (item.userData.kind === "chassis" ? 0.35 : 0.18);
    }

    if (Math.abs(x + 4.25) < 0.35) {
      item.position.z += item.userData.kind === "reject" ? 0.34 : -0.08;
      item.position.y += 0.05;
      inspectedRejectNearby = item.userData.kind === "reject";
    }

    if (x > 4.45 && x < 6.2 && item.userData.kind === "finished") {
      item.position.z -= 0.34;
    }
    if (x > -5.7 && x < -4.25 && item.userData.kind === "reject") {
      item.position.z += 0.72;
    }

    const distanceToDrone = Math.abs(x - drone.position.x);
    if (distanceToDrone < nearestDistance) {
      nearestDistance = distanceToDrone;
      nearestItem = item;
    }
  });

  scannerStatus.material = inspectedRejectNearby ? materials.glowRed : materials.glowGreen;
  scannerBeam.material.opacity = state.scannerOn
    ? (inspectedRejectNearby ? 0.26 : 0.12) + Math.abs(Math.sin(machineElapsed * 3.4)) * 0.18
    : 0;

  if (state.droneOn) {
    drone.position.y = 3.85 + Math.sin(machineElapsed * 1.4) * 0.22;
    drone.position.x = THREE.MathUtils.lerp(drone.position.x, nearestItem.position.x, 1 - Math.pow(0.01, delta));
    drone.position.z = THREE.MathUtils.lerp(drone.position.z, nearestItem.position.z + 2.35, 1 - Math.pow(0.02, delta));
    drone.rotation.z = Math.sin(machineElapsed * 1.1) * 0.08;
    droneBeam.scale.y = 0.62 + Math.sin(machineElapsed * 5) * 0.06;
  }
  rotorPivots.forEach((pivot, index) => {
    if (state.droneOn && state.running && state.machinesOn) {
      pivot.rotation.y += delta * state.speed * (index % 2 === 0 ? 22 : -22);
    }
  });
  updateAgv(machineElapsed);
  updateSlidingDoors(delta);

  ceilingLights.forEach((light, index) => {
    const pulse = 1 + Math.sin(elapsed * 1.8 + index) * 0.05;
    light.intensity = state.lampOn ? 8.2 * pulse : index % 2 === 0 ? 1.5 : 0;
  });

  if (state.cameraTransition) {
    const blend = 1 - Math.pow(0.002, delta);
    camera.position.lerp(state.cameraTransition.position, blend);
    controls.target.lerp(state.cameraTransition.target, blend);

    if (
      camera.position.distanceTo(state.cameraTransition.position) < 0.035 &&
      controls.target.distanceTo(state.cameraTransition.target) < 0.035
    ) {
      camera.position.copy(state.cameraTransition.position);
      controls.target.copy(state.cameraTransition.target);
      state.cameraTransition = null;
      modeLabel.textContent = state.running ? "Automatic cycle" : `Paused in ${roomViews[state.roomKey].label}`;
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
