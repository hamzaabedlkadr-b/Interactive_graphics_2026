import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.querySelector("#factory-canvas");
const MAX_RENDER_PIXEL_RATIO = 1.5;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_RENDER_PIXEL_RATIO));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.38;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x26333a);
scene.fog = new THREE.Fog(0x26333a, 28, 58);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(9.4, 4.2, 10.4);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-0.65, 1.22, -0.35);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.48;
controls.minDistance = 4;
controls.maxDistance = 22;

const clock = new THREE.Clock();
const MAX_FRAME_DELTA = 1 / 30;

import {
  state,
  pressedKeys,
  walkBounds,
  robotSpeedOptions,
  ROBOT_CYCLE_DURATION,
  WALK_CAMERA_MODES,
  WALK_COLLISION_RADIUS,
  WALK_EYE_HEIGHT,
  cameraViews,
  roomViews,
} from "./state.js";
import { materials } from "./materials.js";
import { shadow, addBox, addCylinder, addSphere, addTorus, addCable, addLocalCable, addPipe } from "./geometry.js";

import { createVent, createFloorLabel, createOilStain, createFloorDrain, createSafetyBollard, createCableTray, createAgvLane, createDoorFrame, createSlidingDoor, createPartitionWall } from "./entities/environment.js";
import { createWarningPanel, createBarrel, createStorageRack, createPallet, createToolCart, createElectricalCabinet, createMaintenancePanel } from "./entities/props.js";
import { createTechnician, animateTechnician, createWalkAvatar, animateWalkAvatar } from "./entities/characters.js";
import { createCargoCrate, createProductionItem, createHandledPart, createTriangulatedPrototype, createMassSpringCable, updateMassSpringCable } from "./entities/production.js";
import { createAgv, createParallelGripper, createRobot } from "./entities/machines.js";

function tuneAnimatedObjectForPerformance(object) {
  object.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = false;
    child.receiveShadow = true;
  });
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

const assemblyZoneMaterial = materials.zoneBlue.clone();
assemblyZoneMaterial.transparent = true;
assemblyZoneMaterial.opacity = 0.32;
const assemblyZone = addBox(factory, [7.4, 0.03, 2.65], [-1.4, 0.018, 0.2], assemblyZoneMaterial);
const serviceZoneMaterial = materials.zoneGreen.clone();
serviceZoneMaterial.transparent = true;
serviceZoneMaterial.opacity = 0.28;
const serviceZone = addBox(factory, [4.2, 0.032, 2.35], [6.1, 0.019, 2.55], serviceZoneMaterial);

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
createStorageRack(factory, [13.0, 0, -5.75], -Math.PI / 2);
createBarrel(factory, [-9.7, 0, 2.65], materials.pipeBlue);
createBarrel(factory, [-9.05, 0, 2.8], materials.pipeRed);
createBarrel(factory, [7.9, 0, -4.8], materials.pipeGreen);
createBarrel(factory, [8.55, 0, -4.6], materials.mutedOrange);
createPallet(factory, [-13.25, 0, -5.35], 0.2);
createPallet(factory, [-12.85, 0, -6.8], -0.12);
createPallet(factory, [5.15, 0, 4.7], Math.PI / 2);
createToolCart(factory, [7.25, 0, 4.05], -0.35);
createToolCart(factory, [-9.4, 0, -0.7], Math.PI / 2);
createElectricalCabinet(factory, [10.55, 0, -7.05], 0);
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
const technician = createTechnician(roomGroup, [6.35, 0, 3.72], -0.08);
createFloorLabel(roomGroup, "OPERATOR", [6.35, 0.069, 3.06], [1.55, 0.38], 0, "#3a725f");

// Inspection/service room: side glass panels plus an open guarded transfer window for the robot.
createPartitionWall(roomGroup, [1.35, 2.65, 0.16], [-5.78, 0, -2.28], true);
createPartitionWall(roomGroup, [1.35, 2.65, 0.16], [-2.42, 0, -2.28], true);
createPartitionWall(roomGroup, [0.16, 2.65, 3.95], [-6.75, 0, -4.2], true);
createDoorFrame(roomGroup, [-4.1, 0, -2.28], 0, 1.85, 2.12);
addPipe(roomGroup, [-4.92, 0.8, -2.17], [-4.92, 2.35, -2.17], 0.018, materials.glowBlue);
addPipe(roomGroup, [-4.52, 0.8, -2.17], [-4.52, 2.35, -2.17], 0.018, materials.glowBlue);
addPipe(roomGroup, [-3.68, 0.8, -2.17], [-3.68, 2.35, -2.17], 0.018, materials.glowBlue);
addPipe(roomGroup, [-3.28, 0.8, -2.17], [-3.28, 2.35, -2.17], 0.018, materials.glowBlue);
createFloorLabel(roomGroup, "INSPECT", [-4.1, 0.068, -5.75], [1.85, 0.56], 0, "#f6c453");
createFloorDrain(roomGroup, [-5.75, 0.077, -5.18], -0.35);
createSafetyBollard(roomGroup, [-6.05, 0, -2.58], 0.82);
createSafetyBollard(roomGroup, [-2.35, 0, -2.58], 0.82);
addBox(roomGroup, [1.85, 0.045, 1.1], [-2.85, 0.045, -5.05], materials.concretePatch);
addBox(roomGroup, [5.6, 0.032, 0.58], [-4.1, 0.048, -1.78], materials.zoneBlue);
createFloorLabel(roomGroup, "ROBOT CLEAR", [-4.1, 0.073, -2.05], [1.55, 0.34], 0, "#2f6984");
createTriangulatedPrototype(roomGroup, [-2.85, 0, -5.05], 0.16);
createFloorLabel(roomGroup, "TRI MESH", [-2.65, 0.074, -5.82], [1.35, 0.32], 0, "#5a93a7");

addPipe(roomGroup, [-6.62, 2.85, -2.55], [-6.62, 2.85, -5.25], 0.035, materials.pipeBlue);
addPipe(roomGroup, [5.28, 2.95, 1.75], [9.25, 2.95, 1.75], 0.035, materials.pipeGreen);
addCable(scene, [
  [5.35, 3.05, 1.85],
  [6.4, 2.75, 1.65],
  [7.5, 2.9, 1.82],
  [9.0, 2.65, 1.7],
]);

const agv = createAgv(scene);
const agvPath = [
  new THREE.Vector3(-10.85, 0, 7.82),
  new THREE.Vector3(-12.45, 0, 7.82),
  new THREE.Vector3(-12.45, 0, -7.42),
  new THREE.Vector3(-4.9, 0, -7.42),
  new THREE.Vector3(3.1, 0, -7.42),
  new THREE.Vector3(12.35, 0, -7.42),
  new THREE.Vector3(12.35, 0, 7.82),
  new THREE.Vector3(10.85, 0, 7.82),
  new THREE.Vector3(3.5, 0, 7.82),
  new THREE.Vector3(-4.2, 0, 7.82),
  new THREE.Vector3(-10.85, 0, 7.82),
];
createAgvLane(factory, agvPath, 0.95);
createFloorLabel(factory, "AGV ROAD", [-12.35, 0.066, 0.4], [1.55, 0.42], Math.PI / 2, "#3a725f");
addBox(factory, [1.35, 0.12, 0.9], [-10.85, 0.36, 7.82], materials.darkSteel);
addBox(factory, [1.35, 0.06, 0.9], [-10.85, 0.45, 7.82], materials.brushed);
createFloorLabel(factory, "AGV LOAD", [-10.85, 0.073, 8.62], [1.35, 0.36], 0, "#b86538");
addBox(factory, [1.35, 0.12, 0.9], [10.85, 0.36, 7.82], materials.darkSteel);
addBox(factory, [1.35, 0.06, 0.9], [10.85, 0.45, 7.82], materials.brushed);
createFloorLabel(factory, "AGV DROP", [10.85, 0.073, 8.62], [1.35, 0.36], 0, "#3a725f");
const agvLoadCrate = createCargoCrate(scene, [-10.85, 0.62, 7.82], materials.crate);
const agvDropCrate = createCargoCrate(scene, [10.85, 0.62, 7.82], materials.productShell);
agvDropCrate.visible = false;
tuneAnimatedObjectForPerformance(agv);
tuneAnimatedObjectForPerformance(agvLoadCrate);
tuneAnimatedObjectForPerformance(agvDropCrate);
const agvSegments = agvPath.map((point, index) => {
  const next = agvPath[(index + 1) % agvPath.length];
  return point.distanceTo(next);
});
const agvRouteLength = agvSegments.reduce((total, length) => total + length, 0);
const agvDropDistance = agvSegments.slice(0, 7).reduce((total, length) => total + length, 0);

const ambientLight = new THREE.HemisphereLight(0xe4f8ff, 0x303b38, 1.02);
scene.add(ambientLight);

const sun = new THREE.DirectionalLight(0xffffff, 1.58);
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
  const light = new THREE.PointLight(0xfff1cb, 9.0, 12.5, 1.58);
  light.position.set(x, y - 0.15, z);
  light.castShadow = false;
  ceilingLights.push(light);
  scene.add(light);
});

const lampLight = new THREE.SpotLight(0xffc875, 42, 16, Math.PI / 5.5, 0.62, 1.1);
lampLight.position.set(-4.7, 4.6, 1.7);
lampLight.target.position.set(-0.6, 0.8, 0);
lampLight.castShadow = true;
lampLight.shadow.bias = -0.00012;
lampLight.shadow.radius = 3;
scene.add(lampLight, lampLight.target);

const belt = new THREE.Group();
belt.position.z = 0.2;
scene.add(belt);
addBox(belt, [15.6, 0.34, 2.8], [0, 0.6, 0], materials.belt);
addBox(belt, [16.2, 0.22, 0.12], [0, 0.84, -1.55], materials.brushed);
addBox(belt, [16.2, 0.22, 0.12], [0, 0.84, 1.55], materials.brushed);
addBox(belt, [16.5, 0.12, 0.42], [0, 0.34, -1.76], materials.darkSteel);
addBox(belt, [16.5, 0.12, 0.42], [0, 0.34, 1.76], materials.darkSteel);

for (let x = -7.6; x <= 7.6; x += 0.8) {
  const roller = addCylinder(belt, 0.17, 0.17, 3.1, [x, 0.82, 0], materials.darkSteel, 24);
  roller.rotation.z = Math.PI / 2;
}

for (let x = -7.8; x <= 7.8; x += 2.6) {
  addBox(belt, [0.16, 1.0, 0.16], [x, 0.05, -1.58], materials.darkSteel);
  addBox(belt, [0.16, 1.0, 0.16], [x, 0.05, 1.58], materials.darkSteel);
}

const hazardFront = addBox(factory, [16.4, 0.04, 0.42], [0, 0.025, 1.82], materials.hazard);
const hazardBack = addBox(factory, [16.4, 0.04, 0.42], [0, 0.026, -1.42], materials.hazard);

const lamp = new THREE.Group();
scene.add(lamp);
addCylinder(lamp, 0.07, 0.1, 4.2, [-4.7, 2.1, 1.7], materials.darkSteel, 18);
const lampHead = addCylinder(lamp, 0.48, 0.23, 0.42, [-4.7, 4.35, 1.7], materials.yellow, 32);
lampHead.rotation.x = Math.PI;
addSphere(lamp, 0.16, [-4.7, 4.06, 1.7], materials.lampGlow, 16);

const primaryRobot = createRobot(scene, [-4.1, 0, -3.35], 0.18, materials.teal, { id: "R-01" });
const secondaryRobot = createRobot(scene, [5.05, 0, -4.55], -0.34, materials.blue, { id: "R-02" });
const robotPickupPosition = new THREE.Vector3(-1.82, 1.18, -1.1);
const robotDropPosition = new THREE.Vector3(-7.26, 1.24, -3.48);
createFloorLabel(scene, "BELT PICK", [robotPickupPosition.x, 0.071, -1.35], [1.25, 0.32], 0, "#2f6984");
const robotPickupPart = createProductionItem(scene, "battery", -1);
const robotPickupEntryX = -7.2;

const dropMarker = new THREE.Group();
dropMarker.position.set(robotDropPosition.x, 0, robotDropPosition.z);
scene.add(dropMarker);
addBox(dropMarker, [1.28, 0.16, 0.86], [0, 0.82, 0], materials.darkSteel);
addBox(dropMarker, [1.08, 0.055, 0.66], [0, 1.0, 0], materials.zoneGreen);
addBox(dropMarker, [0.1, 0.76, 0.1], [-0.5, 0.42, -0.3], materials.brushed);
addBox(dropMarker, [0.1, 0.76, 0.1], [0.5, 0.42, -0.3], materials.brushed);
addBox(dropMarker, [0.1, 0.76, 0.1], [-0.5, 0.42, 0.3], materials.brushed);
addBox(dropMarker, [0.1, 0.76, 0.1], [0.5, 0.42, 0.3], materials.brushed);
addBox(dropMarker, [1.18, 0.07, 0.08], [0, 1.08, -0.38], materials.brushed);
addBox(dropMarker, [1.18, 0.07, 0.08], [0, 1.08, 0.38], materials.brushed);
addBox(dropMarker, [0.12, 0.22, 0.58], [-0.46, 1.18, 0], materials.darkSteel);
addBox(dropMarker, [0.12, 0.22, 0.58], [0.46, 1.18, 0], materials.darkSteel);
addBox(dropMarker, [0.42, 0.045, 0.08], [0, 1.2, -0.31], materials.glowGreen);
addSphere(dropMarker, 0.055, [-0.24, 1.22, 0.32], materials.glowGreen, 12);
addSphere(dropMarker, 0.055, [0.0, 1.22, 0.32], materials.glowBlue, 12);
addSphere(dropMarker, 0.055, [0.24, 1.22, 0.32], materials.glowRed, 12);
createFloorLabel(scene, "SIDE DROP", [robotDropPosition.x, 0.072, -3.58], [1.4, 0.32], 0, "#3a725f");
const robotPlacedPart = createHandledPart(scene, robotDropPosition.toArray(), materials.productShell);
robotPlacedPart.visible = false;

const productionItems = [];
const productionKinds = ["crate", "battery", "chassis", "finished", "reject", "battery", "finished", "chassis"];
for (let i = 0; i < productionKinds.length; i += 1) {
  const item = createProductionItem(scene, productionKinds[i], i);
  item.position.set(-7.4 + i * 2.05, 1.15, 0.2);
  tuneAnimatedObjectForPerformance(item);
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
pressMachine.position.set(1.35, 0, -4.15);
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
scanner.position.set(-4.55, 0, -3.35);
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
const droneNoseLight = addSphere(drone, 0.14, [0.46, 0.02, 0], materials.glowBlue, 14);
const droneStatusLight = addSphere(drone, 0.1, [-0.42, 0.01, 0], materials.glowGreen, 12);
addBox(drone, [0.22, 0.08, 0.18], [0.05, -0.18, 0.32], materials.brushed);
const droneBeamMaterial = materials.glowBlue.clone();
droneBeamMaterial.transparent = true;
droneBeamMaterial.opacity = 0.16;
const droneBeam = addCylinder(drone, 0.04, 0.28, 1.5, [0, -0.84, 0], droneBeamMaterial, 24);
const droneScanRing = addTorus(drone, 0.38, 0.012, [0, -1.95, 0], droneBeamMaterial, 10, 44);
droneScanRing.rotation.x = Math.PI / 2;
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
const droneCargoRig = new THREE.Group();
drone.add(droneCargoRig);
addBox(droneCargoRig, [0.22, 0.16, 0.2], [0, -0.36, 0], materials.brushed);
addBox(droneCargoRig, [0.62, 0.055, 0.08], [0, -0.56, 0], materials.darkSteel);
addBox(droneCargoRig, [0.08, 0.16, 0.46], [-0.26, -0.68, 0], materials.rubber);
addBox(droneCargoRig, [0.08, 0.16, 0.46], [0.26, -0.68, 0], materials.rubber);
const droneCargoLight = addSphere(droneCargoRig, 0.065, [0, -0.74, 0.3], materials.glowBlue, 10);
const droneCarriedSample = createHandledPart(droneCargoRig, [0, -1.0, 0], materials.battery);
droneCarriedSample.scale.setScalar(0.72);
droneCarriedSample.visible = false;
const dronePatrolPoints = [
  new THREE.Vector3(-5.35, 3.95, 2.7),
  new THREE.Vector3(-1.15, 3.45, 1.55),
  new THREE.Vector3(1.65, 3.85, -1.65),
  new THREE.Vector3(5.65, 3.55, 1.25),
  new THREE.Vector3(2.2, 4.25, 3.45),
];
const droneTarget = new THREE.Vector3();
const dronePreviousPosition = drone.position.clone();
const dronePickupPosition = new THREE.Vector3(-2.65, 1.18, 0.86);
const droneReturnPosition = new THREE.Vector3(3.35, 1.18, 0.86);
const dronePickupPadMaterial = materials.zoneBlue.clone();
dronePickupPadMaterial.transparent = true;
dronePickupPadMaterial.opacity = 0.58;
const droneReturnPadMaterial = materials.zoneGreen.clone();
droneReturnPadMaterial.transparent = true;
droneReturnPadMaterial.opacity = 0.58;
addBox(scene, [0.86, 0.035, 0.56], [dronePickupPosition.x, 1.02, dronePickupPosition.z], dronePickupPadMaterial);
addBox(scene, [0.86, 0.035, 0.56], [droneReturnPosition.x, 1.02, droneReturnPosition.z], droneReturnPadMaterial);
createFloorLabel(scene, "DRONE PICK", [dronePickupPosition.x, 0.073, 1.62], [1.45, 0.34], 0, "#2f6984");
createFloorLabel(scene, "DRONE RETURN", [droneReturnPosition.x, 0.073, 1.62], [1.75, 0.34], 0, "#3a725f");
const dronePickupSample = createHandledPart(scene, dronePickupPosition.toArray(), materials.battery);
dronePickupSample.scale.setScalar(0.72);
const droneReturnSample = createHandledPart(scene, droneReturnPosition.toArray(), materials.productShell);
droneReturnSample.scale.setScalar(0.72);
droneReturnSample.visible = false;
tuneAnimatedObjectForPerformance(drone);
tuneAnimatedObjectForPerformance(dronePickupSample);
tuneAnimatedObjectForPerformance(droneReturnSample);
tuneAnimatedObjectForPerformance(robotPickupPart);
tuneAnimatedObjectForPerformance(robotPlacedPart);

const springCable = createMassSpringCable(scene, [-2.85, 3.1, -5.05]);
createFloorLabel(scene, "SPRING SIM", [-2.85, 0.073, -6.22], [1.55, 0.34], 0, "#f6c453");
const walkAvatar = createWalkAvatar(scene);

for (let x = -8.5; x <= 8.5; x += 2.4) {
  addBox(factory, [0.09, 2.2, 0.09], [x, 1.1, 4.1], materials.darkSteel);
}
addBox(factory, [18, 0.11, 0.11], [0, 2.18, 4.1], materials.brushed);
addBox(factory, [18, 0.11, 0.11], [0, 1.38, 4.1], materials.brushed);

addCable(scene, [
  [-7.2, 5.55, -4.8],
  [-5.2, 4.85, -4.0],
  [-3.2, 4.95, -4.6],
  [-1.2, 4.75, -4.0],
]);
addCable(scene, [
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
const walkCameraMode = document.querySelector("#walk-camera-mode");
const walkHelp = document.querySelector("#walk-help");
const walkForward = new THREE.Vector3();
const walkRight = new THREE.Vector3();
const walkMovement = new THREE.Vector3();
const walkCandidatePosition = new THREE.Vector3();
const walkStartPosition = new THREE.Vector3();
const walkTestPosition = new THREE.Vector3();
const thirdPersonCameraPosition = new THREE.Vector3();
const thirdPersonCameraTarget = new THREE.Vector3();
let walkAvatarHasPosition = false;
let walkAvatarYaw = state.walkYaw;

const walkCollisionBlockers = [
  createWalkBlocker(0, 0.2, 8.5, 2.05),
  createWalkBlocker(-4.1, -3.35, 1.35, 1.25),
  createWalkBlocker(5.05, -4.55, 1.45, 1.15),
  createWalkBlocker(1.35, -4.15, 1.15, 0.85),
  createWalkBlocker(-4.55, -3.35, 1.05, 0.85),
  createWalkBlocker(-7.26, -3.48, 0.82, 0.58),
  createWalkBlocker(5.95, -1.45, 0.68, 0.55),
  createWalkBlocker(-4.9, 1.72, 0.68, 0.55),
  createWalkBlocker(6.7, 2.7, 1.18, 0.82),
  createWalkBlocker(6.35, 3.72, 0.5, 0.5),
  createWalkBlocker(-2.85, -5.05, 1.05, 0.75),
  createWalkBlocker(-6.35, 4.9, 0.12, 2.7),
  createWalkBlocker(-9.45, 2.18, 0.92, 0.12),
  createWalkBlocker(-6.5, 2.18, 0.22, 0.12),
  createWalkBlocker(7.25, 1.45, 2.65, 0.12),
  createWalkBlocker(4.65, 4.82, 0.12, 1.48),
  createWalkBlocker(9.85, 3.7, 0.12, 2.3),
  createWalkBlocker(-5.78, -2.28, 0.68, 0.12),
  createWalkBlocker(-2.42, -2.28, 0.68, 0.12),
  createWalkBlocker(-6.75, -4.2, 0.12, 1.98),
  createWalkBlocker(-8.8, 4.8, 1.05, 0.72),
  createWalkBlocker(-7.2, 4.8, 1.05, 0.72),
  createWalkBlocker(13.0, -5.75, 1.05, 0.72),
  createWalkBlocker(-13.25, -5.35, 0.9, 0.72),
  createWalkBlocker(-12.85, -6.8, 0.9, 0.72),
  createWalkBlocker(5.15, 4.7, 0.9, 0.72),
  createWalkBlocker(-10.4, 6.35, 0.9, 0.72),
  createWalkBlocker(-8.6, 6.55, 0.9, 0.72),
  createWalkBlocker(-7.25, 5.35, 0.9, 0.72),
  createWalkBlocker(7.25, 4.05, 0.85, 0.55),
  createWalkBlocker(-9.4, -0.7, 0.85, 0.55),
  createWalkBlocker(10.55, -7.05, 0.65, 0.45),
  createWalkBlocker(-10.78, 0.7, 0.65, 0.45),
  createWalkBlocker(-10.85, 7.82, 0.8, 0.55),
  createWalkBlocker(10.85, 7.82, 0.8, 0.55),
];

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

function updateWalkDirectionVectors() {
  walkForward.set(-Math.sin(state.walkYaw), 0, -Math.cos(state.walkYaw));
  walkRight.set(Math.cos(state.walkYaw), 0, -Math.sin(state.walkYaw));
}

function placeWalkAvatar(position, yaw = state.walkYaw) {
  walkAvatar.position.set(position.x, 0, position.z);
  findWalkablePosition(walkAvatar.position);
  walkAvatarYaw = yaw;
  walkAvatar.rotation.y = walkAvatarYaw;
  walkAvatar.visible = true;
  walkAvatarHasPosition = true;
}

function showParkedWalkAvatar() {
  walkAvatar.visible = walkAvatarHasPosition;
  if (!walkAvatarHasPosition) return;

  walkAvatar.position.y = 0;
  walkAvatar.rotation.y = walkAvatarYaw;
  animateWalkAvatar(walkAvatar, state.walkAnimTime, false);
}

function setFirstPersonCameraBehindAvatar() {
  walkStartPosition.set(
    walkAvatar.position.x - walkForward.x * 2.4,
    0,
    walkAvatar.position.z - walkForward.z * 2.4,
  );
  findWalkablePosition(walkStartPosition);
  setFirstPersonCameraFromPosition(walkStartPosition);
}

function parkWalkAvatarForExit() {
  const exitedFromFirstPerson = state.walkCameraMode === WALK_CAMERA_MODES.first;

  if (state.walkCameraMode === WALK_CAMERA_MODES.third && walkAvatarHasPosition) {
    walkAvatarYaw = state.walkYaw;
  } else if (!walkAvatarHasPosition) {
    placeWalkAvatar(camera.position, state.walkYaw);
  }

  showParkedWalkAvatar();
  if (exitedFromFirstPerson && walkAvatarHasPosition) {
    state.walkYaw = walkAvatarYaw;
    updateWalkDirectionVectors();
    setThirdPersonCameraFromAvatar(true);
  }
}

function createWalkBlocker(centerX, centerZ, halfX, halfZ) {
  return {
    minX: centerX - halfX,
    maxX: centerX + halfX,
    minZ: centerZ - halfZ,
    maxZ: centerZ + halfZ,
  };
}

function clampWalkPosition(position) {
  position.x = THREE.MathUtils.clamp(
    position.x,
    walkBounds.minX + WALK_COLLISION_RADIUS,
    walkBounds.maxX - WALK_COLLISION_RADIUS,
  );
  position.z = THREE.MathUtils.clamp(
    position.z,
    walkBounds.minZ + WALK_COLLISION_RADIUS,
    walkBounds.maxZ - WALK_COLLISION_RADIUS,
  );
  return position;
}

function isWalkBlocked(position) {
  return walkCollisionBlockers.some((blocker) => (
    position.x >= blocker.minX - WALK_COLLISION_RADIUS &&
    position.x <= blocker.maxX + WALK_COLLISION_RADIUS &&
    position.z >= blocker.minZ - WALK_COLLISION_RADIUS &&
    position.z <= blocker.maxZ + WALK_COLLISION_RADIUS
  ));
}

function findWalkablePosition(position) {
  clampWalkPosition(position);
  if (!isWalkBlocked(position)) return position;

  const originX = position.x;
  const originZ = position.z;
  for (let radius = 0.45; radius <= 6.3; radius += 0.45) {
    const steps = Math.max(10, Math.ceil(radius * 12));
    for (let step = 0; step < steps; step += 1) {
      const angle = (step / steps) * Math.PI * 2;
      walkTestPosition.set(
        originX + Math.cos(angle) * radius,
        position.y,
        originZ + Math.sin(angle) * radius,
      );
      clampWalkPosition(walkTestPosition);
      if (!isWalkBlocked(walkTestPosition)) {
        position.copy(walkTestPosition);
        return position;
      }
    }
  }

  walkTestPosition.set(camera.position.x, position.y, camera.position.z);
  clampWalkPosition(walkTestPosition);
  if (!isWalkBlocked(walkTestPosition)) {
    position.copy(walkTestPosition);
  }

  return position;
}

function moveWalkSubject(position, movement) {
  const startX = position.x;
  const startZ = position.z;

  walkCandidatePosition.copy(position).add(movement);
  clampWalkPosition(walkCandidatePosition);
  if (!isWalkBlocked(walkCandidatePosition)) {
    position.x = walkCandidatePosition.x;
    position.z = walkCandidatePosition.z;
    return Math.abs(position.x - startX) > 0.0001 || Math.abs(position.z - startZ) > 0.0001;
  }

  walkCandidatePosition.set(position.x + movement.x, position.y, position.z);
  clampWalkPosition(walkCandidatePosition);
  if (!isWalkBlocked(walkCandidatePosition)) {
    position.x = walkCandidatePosition.x;
  }

  walkCandidatePosition.set(position.x, position.y, position.z + movement.z);
  clampWalkPosition(walkCandidatePosition);
  if (!isWalkBlocked(walkCandidatePosition)) {
    position.z = walkCandidatePosition.z;
  }

  return Math.abs(position.x - startX) > 0.0001 || Math.abs(position.z - startZ) > 0.0001;
}

function getWalkStartPosition() {
  walkStartPosition.set(controls.target.x, 0, controls.target.z);
  if (!Number.isFinite(walkStartPosition.x) || !Number.isFinite(walkStartPosition.z)) {
    walkStartPosition.set(camera.position.x, 0, camera.position.z);
  }
  return findWalkablePosition(walkStartPosition);
}

function setFirstPersonCameraFromPosition(position) {
  camera.position.set(position.x, WALK_EYE_HEIGHT, position.z);
  controls.target.set(
    position.x + walkForward.x * 4,
    1.55,
    position.z + walkForward.z * 4,
  );
}

function setThirdPersonCameraFromAvatar(snap = false, delta = 1 / 60) {
  thirdPersonCameraPosition.set(
    walkAvatar.position.x - walkForward.x * 4.2,
    2.55,
    walkAvatar.position.z - walkForward.z * 4.2,
  );
  thirdPersonCameraTarget.set(
    walkAvatar.position.x + walkForward.x * 1.2,
    1.28,
    walkAvatar.position.z + walkForward.z * 1.2,
  );

  if (snap) {
    camera.position.copy(thirdPersonCameraPosition);
    controls.target.copy(thirdPersonCameraTarget);
    return;
  }

  const blend = 1 - Math.pow(0.004, delta);
  camera.position.lerp(thirdPersonCameraPosition, blend);
  controls.target.lerp(thirdPersonCameraTarget, blend);
}

function syncWalkCameraModeButton() {
  const isThirdPerson = state.walkCameraMode === WALK_CAMERA_MODES.third;
  walkCameraMode.textContent = isThirdPerson ? "Walk 3rd" : "Walk 1st";
  walkCameraMode.classList.toggle("active", isThirdPerson);
}

function setWalkCameraMode(mode) {
  const wasThirdPerson = state.walkCameraMode === WALK_CAMERA_MODES.third;
  if (wasThirdPerson && walkAvatarHasPosition) {
    walkAvatarYaw = state.walkYaw;
  }

  state.walkCameraMode = mode;
  syncWalkCameraModeButton();
  if (state.walkCameraMode === WALK_CAMERA_MODES.third && walkAvatarHasPosition) {
    state.walkYaw = walkAvatarYaw;
  }
  updateWalkDirectionVectors();

  if (!state.walkMode) {
    showParkedWalkAvatar();
    return;
  }

  if (state.walkCameraMode === WALK_CAMERA_MODES.third) {
    if (!walkAvatarHasPosition) {
      placeWalkAvatar(camera.position, state.walkYaw);
    } else {
      walkAvatar.rotation.y = walkAvatarYaw;
      walkAvatar.visible = true;
    }
    walkAvatar.visible = true;
    setThirdPersonCameraFromAvatar(true);
    modeLabel.textContent = "Third-person walk";
  } else {
    if (walkAvatarHasPosition) {
      state.walkYaw = walkAvatarYaw;
      updateWalkDirectionVectors();
      setFirstPersonCameraBehindAvatar();
    }
    showParkedWalkAvatar();
    modeLabel.textContent = "First-person walk";
  }
}

function setWalkMode(enabled) {
  const orbitWalkYaw = Math.atan2(camera.position.x - controls.target.x, camera.position.z - controls.target.z);
  const leavingWalkMode = state.walkMode && !enabled;
  if (leavingWalkMode) {
    parkWalkAvatarForExit();
  }

  state.walkMode = enabled;
  state.cameraTransition = null;
  controls.enabled = !enabled;
  toggleWalk.classList.toggle("active", enabled);
  toggleWalk.textContent = enabled ? "Exit Walk" : "Walk Mode";
  walkHelp.classList.toggle("visible", enabled);
  syncWalkCameraModeButton();

  if (enabled) {
    if (state.walkCameraMode === WALK_CAMERA_MODES.third) {
      if (walkAvatarHasPosition) {
        state.walkYaw = walkAvatarYaw;
        updateWalkDirectionVectors();
      } else {
        state.walkYaw = orbitWalkYaw;
        updateWalkDirectionVectors();
        placeWalkAvatar(getWalkStartPosition(), state.walkYaw);
      }
      walkAvatar.visible = true;
      setThirdPersonCameraFromAvatar(true);
      modeLabel.textContent = "Third-person walk";
    } else {
      if (walkAvatarHasPosition) {
        state.walkYaw = walkAvatarYaw;
        updateWalkDirectionVectors();
        setFirstPersonCameraBehindAvatar();
      } else {
        state.walkYaw = orbitWalkYaw;
        updateWalkDirectionVectors();
        setFirstPersonCameraFromPosition(getWalkStartPosition());
      }
      showParkedWalkAvatar();
      modeLabel.textContent = "First-person walk";
    }
  } else {
    showParkedWalkAvatar();
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
  scene.background.set(state.night ? 0x080d12 : 0x26333a);
  scene.fog.color.set(state.night ? 0x080d12 : 0x26333a);
  ambientLight.intensity = state.night ? 0.32 : 1.02;
  sun.intensity = state.night ? 0.08 : 1.58;
  renderer.toneMappingExposure = state.night ? 1.04 : 1.38;
});

toggleLamp.addEventListener("click", () => {
  state.lampOn = !state.lampOn;
  setToggleState(toggleLamp, state.lampOn, "Lamp Off", "Lamp On");
  lampLight.visible = state.lampOn;
  ceilingLights.forEach((light, index) => {
    light.intensity = state.lampOn ? 9.0 : index % 2 === 0 ? 1.5 : 0;
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
  dronePickupSample.visible = state.droneOn;
  droneReturnSample.visible = false;
  droneCarriedSample.visible = false;
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
  cameraView.textContent = `Camera ${String.fromCharCode(65 + state.cameraIndex)}`;
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
walkCameraMode.addEventListener("click", () => {
  const nextMode = state.walkCameraMode === WALK_CAMERA_MODES.third
    ? WALK_CAMERA_MODES.first
    : WALK_CAMERA_MODES.third;
  setWalkCameraMode(nextMode);
});
syncWalkCameraModeButton();

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
    { at: 0, waist: -0.58 * side, shoulder: -0.48, upperYaw: -0.08, elbow: 1.38, wristX: 0.08, wristZ: -0.08, claw: 0.42 },
    { at: 0.9, waist: -0.82 * side, shoulder: -0.64, upperYaw: -0.05, elbow: 1.32, wristX: 0.08, wristZ: -0.08, claw: 0.42 },
    { at: 1.45, waist: -0.94 * side, shoulder: -0.7, upperYaw: -0.04, elbow: 1.28, wristX: 0.1, wristZ: -0.06, claw: 0.42 },
    { at: 1.95, waist: -0.94 * side, shoulder: -0.7, upperYaw: -0.04, elbow: 1.28, wristX: 0.12, wristZ: -0.06, claw: 0.13 },
    { at: 2.85, waist: -1.35 * side, shoulder: -0.42, upperYaw: 0.0, elbow: 1.42, wristX: 0.34, wristZ: 0.0, claw: 0.13 },
    { at: 4.15, waist: -2.55 * side, shoulder: -0.42, upperYaw: -0.02, elbow: 1.42, wristX: 0.28, wristZ: 0.08, claw: 0.13 },
    { at: 5.2, waist: -3.34 * side, shoulder: -0.7, upperYaw: -0.04, elbow: 1.28, wristX: 0.1, wristZ: 0.06, claw: 0.13 },
    { at: 5.8, waist: -3.34 * side, shoulder: -0.7, upperYaw: -0.04, elbow: 1.28, wristX: 0.1, wristZ: 0.06, claw: 0.42 },
    { at: 6.75, waist: -2.18 * side, shoulder: -0.42, upperYaw: 0.02, elbow: 1.44, wristX: 0.15, wristZ: 0.04, claw: 0.42 },
    { at: 8.4, waist: -0.58 * side, shoulder: -0.48, upperYaw: -0.08, elbow: 1.38, wristX: 0.08, wristZ: -0.08, claw: 0.42 },
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
  const carrying = t >= 1.95 && t <= 5.65;
  robotRig.carriedObject.visible = carrying;
  robotRig.stageLight.material = carrying ? materials.glowGreen : t > 5.65 && t < 6.2 ? materials.glowRed : materials.glowBlue;
  robotRig.wristLight.material = carrying ? materials.glowGreen : materials.glowBlue;
  robotRig.stageLight.scale.setScalar(1 + Math.sin((time + phase) * 8) * 0.08);
  robotRig.wristLight.scale.setScalar(1 + Math.sin((time + phase) * 10) * 0.05);
}

const pickupTransferPosition = new THREE.Vector3();
const beltStopPosition = new THREE.Vector3();
const dropTransferPosition = new THREE.Vector3();
const neutralPartQuaternion = new THREE.Quaternion();

function getConveyorPickupProgress(cycle) {
  const approachStart = 7.45;
  const approachEnd = 1.45;
  const approachDuration = ROBOT_CYCLE_DURATION - approachStart + approachEnd;
  const elapsedSinceApproach = cycle >= approachStart
    ? cycle - approachStart
    : ROBOT_CYCLE_DURATION - approachStart + cycle;
  return THREE.MathUtils.clamp(elapsedSinceApproach / approachDuration, 0, 1);
}

function updatePrimaryRobotTransfer(time, delta) {
  const cycle = time % ROBOT_CYCLE_DURATION;

  const conveyorProgress = getConveyorPickupProgress(cycle);
  const conveyorX = THREE.MathUtils.lerp(robotPickupEntryX, robotPickupPosition.x, conveyorProgress);
  pickupTransferPosition.set(
    conveyorX,
    robotPickupPosition.y + Math.sin(time * 6) * 0.01,
    robotPickupPosition.z,
  );

  if (cycle < 1.45 || cycle > 7.45) {
    robotPickupPart.visible = true;
    robotPickupPart.position.copy(pickupTransferPosition);
    robotPickupPart.rotation.set(0, time * 0.65, 0);
  } else if (cycle < 1.95) {
    beltStopPosition.set(
      robotPickupPosition.x,
      robotPickupPosition.y + Math.sin(time * 6) * 0.01,
      robotPickupPosition.z,
    );
    robotPickupPart.visible = true;
    robotPickupPart.position.copy(beltStopPosition);
    robotPickupPart.quaternion.copy(neutralPartQuaternion);
  } else {
    robotPickupPart.visible = false;
  }

  const partReleased = cycle >= 5.65 && cycle < 7.75;
  robotPlacedPart.visible = partReleased;
  if (!partReleased) {
    robotPlacedPart.position.copy(robotDropPosition);
    robotPlacedPart.quaternion.copy(neutralPartQuaternion);
    return;
  }

  dropTransferPosition.set(
    robotDropPosition.x,
    robotDropPosition.y + Math.sin(time * 7) * 0.008,
    robotDropPosition.z,
  );

  robotPlacedPart.position.copy(dropTransferPosition);
  robotPlacedPart.quaternion.copy(neutralPartQuaternion);
  if (cycle >= 6.05) {
    robotPlacedPart.rotation.y += delta * state.speed * 0.65;
  }
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
  const loadTransfer = distance < 0.85 || distance > agvRouteLength - 0.85;
  const dropTransfer = Math.abs(distance - agvDropDistance) < 0.9;
  const cargoOnCart = !loadTransfer && !dropTransfer;

  agv.userData.cargo.visible = cargoOnCart;
  agv.userData.cargo.position.y = 0.7 + Math.sin(time * 5) * 0.012;
  agvLoadCrate.visible = loadTransfer;
  agvLoadCrate.scale.setScalar(loadTransfer ? 1 + Math.sin(time * 8) * 0.035 : 1);
  agvDropCrate.visible = dropTransfer;
  agvDropCrate.scale.setScalar(dropTransfer ? 1 + Math.sin(time * 8) * 0.035 : 1);

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

  updateWalkDirectionVectors();
  walkMovement.set(0, 0, 0);

  if (pressedKeys.has("w") || pressedKeys.has("arrowup")) walkMovement.add(walkForward);
  if (pressedKeys.has("s") || pressedKeys.has("arrowdown")) walkMovement.sub(walkForward);
  if (pressedKeys.has("d")) walkMovement.add(walkRight);
  if (pressedKeys.has("a")) walkMovement.sub(walkRight);

  const wantsToMove = walkMovement.lengthSq() > 0;
  let isMoving = false;
  const isThirdPerson = state.walkCameraMode === WALK_CAMERA_MODES.third;
  const subjectPosition = isThirdPerson ? walkAvatar.position : camera.position;

  if (wantsToMove) {
    walkMovement.normalize().multiplyScalar(moveSpeed * delta);
    isMoving = moveWalkSubject(subjectPosition, walkMovement);
  }

  const activeAvatarIsMoving = isThirdPerson && isMoving;
  state.walkAnimTime += delta * (activeAvatarIsMoving ? 1.0 : 0.42);
  if (isThirdPerson) {
    walkAvatarHasPosition = true;
    walkAvatarYaw = state.walkYaw;
    walkAvatar.visible = true;
    walkAvatar.position.y = 0;
    walkAvatar.rotation.y = walkAvatarYaw;
    animateWalkAvatar(walkAvatar, state.walkAnimTime, activeAvatarIsMoving);
    setThirdPersonCameraFromAvatar(false, delta);
  } else {
    showParkedWalkAvatar();
    camera.position.y = WALK_EYE_HEIGHT;
    controls.target.set(
      camera.position.x + walkForward.x * 4,
      1.55,
      camera.position.z + walkForward.z * 4,
    );
  }

  const currentRoom = getRoomForPosition(subjectPosition);
  syncRoomUi(currentRoom);
  state.activeDoorKey = currentRoom;
  state.doorTimer = Math.max(state.doorTimer, 0.2);
  modeLabel.textContent = isThirdPerson ? "Third-person walk" : "First-person walk";
}

function updateParkedWalkAvatar(delta) {
  if (state.walkMode || !walkAvatarHasPosition) return;

  state.walkAnimTime += delta * 0.42;
  showParkedWalkAvatar();
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
  const delta = Math.min(clock.getDelta(), MAX_FRAME_DELTA);
  if (state.running) {
    elapsed += delta * state.speed;
    if (state.machinesOn) {
      robotElapsed += delta * state.speed * robotSpeedOptions[state.robotSpeedIndex].value;
      machineElapsed += delta * state.speed;
    }
  }
  updateWalkMode(delta);
  updateParkedWalkAvatar(delta);

  materials.belt.map.offset.x = -machineElapsed * 0.58;
  materials.hazard.map.offset.x = -machineElapsed * 0.08;

  animateRobot(primaryRobot, robotElapsed, 0, false);
  animateRobot(secondaryRobot, robotElapsed, 3.6, true);
  const robotCycle = robotElapsed % ROBOT_CYCLE_DURATION;
  dropMarker.scale.setScalar(robotCycle > 5.0 && robotCycle < 6.2 ? 1.08 + Math.sin(robotElapsed * 8) * 0.025 : 1);
  updatePrimaryRobotTransfer(robotElapsed, delta);

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
    const routeTime = machineElapsed * 0.34;
    const routePhase = routeTime % dronePatrolPoints.length;
    const routeIndex = Math.floor(routeTime) % dronePatrolPoints.length;
    const nextRouteIndex = (routeIndex + 1) % dronePatrolPoints.length;
    const routeProgress = smoothStep(routeTime % 1);
    droneTarget.lerpVectors(dronePatrolPoints[routeIndex], dronePatrolPoints[nextRouteIndex], routeProgress);

    let scannedItem = productionItems[0];
    let scanDistance = Infinity;
    productionItems.forEach((item) => {
      const distance = Math.abs(item.position.x - droneTarget.x);
      if (distance < scanDistance) {
        scanDistance = distance;
        scannedItem = item;
      }
    });

    const inspectionWindow = routeProgress > 0.28 && routeProgress < 0.72 && (routeIndex === 0 || routeIndex === 1 || routeIndex === 3);
    if (inspectionWindow) {
      droneTarget.x = THREE.MathUtils.lerp(droneTarget.x, scannedItem.position.x, 0.72);
      droneTarget.z = THREE.MathUtils.lerp(droneTarget.z, scannedItem.position.z + 1.35, 0.68);
      droneTarget.y = 3.22 + Math.sin(machineElapsed * 9) * 0.04;
    }

    const pickupApproach = routePhase > 1.08 && routePhase < 1.76;
    const returnApproach = routePhase > 3.1 && routePhase < 3.78;
    const pickupLocked = routePhase > 1.45 && routePhase < 1.68;
    const returnLocked = routePhase > 3.45 && routePhase < 3.7;
    const carryingCargo = routePhase >= 1.55 && routePhase < 3.55;
    const cargoAction = pickupApproach || returnApproach || carryingCargo;
    if (pickupApproach) {
      const pickupDip = smoothStep(Math.min(1, (routePhase - 1.08) / 0.68));
      droneTarget.x = THREE.MathUtils.lerp(droneTarget.x, dronePickupPosition.x, 0.9);
      droneTarget.z = THREE.MathUtils.lerp(droneTarget.z, dronePickupPosition.z, 0.9);
      droneTarget.y = THREE.MathUtils.lerp(3.15, 2.34, Math.sin(pickupDip * Math.PI)) + Math.sin(machineElapsed * 10) * 0.025;
    } else if (returnApproach) {
      const returnDip = smoothStep(Math.min(1, (routePhase - 3.1) / 0.68));
      droneTarget.x = THREE.MathUtils.lerp(droneTarget.x, droneReturnPosition.x, 0.9);
      droneTarget.z = THREE.MathUtils.lerp(droneTarget.z, droneReturnPosition.z, 0.9);
      droneTarget.y = THREE.MathUtils.lerp(3.18, 2.34, Math.sin(returnDip * Math.PI)) + Math.sin(machineElapsed * 10) * 0.025;
    }

    dronePickupSample.visible = routePhase < 1.48 || routePhase > 4.4;
    droneReturnSample.visible = routePhase >= 3.55 && routePhase <= 4.4;
    droneCarriedSample.visible = carryingCargo;
    dronePickupSample.position.y = dronePickupPosition.y + (pickupLocked ? Math.sin(machineElapsed * 14) * 0.015 : 0);
    droneReturnSample.position.y = droneReturnPosition.y + (returnLocked ? Math.sin(machineElapsed * 14) * 0.015 : 0);
    droneCarriedSample.rotation.y += carryingCargo ? delta * state.speed * 0.85 : 0;
    droneCargoRig.scale.setScalar(cargoAction ? 1.04 + Math.sin(machineElapsed * 12) * 0.025 : 1);
    droneCargoLight.material = returnLocked ? materials.glowRed : carryingCargo || pickupLocked ? materials.glowGreen : materials.glowBlue;

    const blend = 1 - Math.pow(0.006, delta);
    drone.position.lerp(droneTarget, blend);
    const velocityX = drone.position.x - dronePreviousPosition.x;
    const velocityZ = drone.position.z - dronePreviousPosition.z;
    drone.rotation.y = Math.atan2(velocityX, velocityZ) + Math.PI / 2;
    drone.rotation.x = THREE.MathUtils.clamp(-velocityZ * 1.8, -0.22, 0.22);
    drone.rotation.z = THREE.MathUtils.clamp(-velocityX * 1.8, -0.24, 0.24);
    dronePreviousPosition.copy(drone.position);

    const rejectInspection = inspectionWindow && scannedItem.userData.kind === "reject";
    droneStatusLight.material = returnLocked
      ? materials.glowRed
      : carryingCargo || pickupLocked
        ? materials.glowGreen
        : rejectInspection
          ? materials.glowRed
          : inspectionWindow
            ? materials.glowGreen
            : materials.glowBlue;
    droneNoseLight.material = cargoAction || inspectionWindow ? materials.glowGreen : materials.glowBlue;
    droneBeam.material.opacity = cargoAction
      ? 0.42 + Math.abs(Math.sin(machineElapsed * 13)) * 0.2
      : inspectionWindow
        ? 0.34 + Math.abs(Math.sin(machineElapsed * 11)) * 0.18
        : 0.08;
    droneScanRing.visible = cargoAction || inspectionWindow;
    droneScanRing.scale.setScalar(cargoAction ? 0.68 + Math.abs(Math.sin(machineElapsed * 8)) * 0.18 : inspectionWindow ? 0.85 + Math.abs(Math.sin(machineElapsed * 6)) * 0.35 : 0.7);
    droneScanRing.rotation.z += delta * state.speed * 3.8;
    droneBeam.scale.y = cargoAction ? 1.42 + Math.sin(machineElapsed * 9) * 0.08 : inspectionWindow ? 1.18 + Math.sin(machineElapsed * 9) * 0.08 : 0.58;
  } else {
    dronePickupSample.visible = false;
    droneReturnSample.visible = false;
    droneCarriedSample.visible = false;
    droneScanRing.visible = false;
  }
  rotorPivots.forEach((pivot, index) => {
    if (state.droneOn && state.running && state.machinesOn) {
      pivot.rotation.y += delta * state.speed * (index % 2 === 0 ? 22 : -22);
    }
  });
  updateAgv(machineElapsed);
  updateSlidingDoors(delta);
  animateTechnician(technician, elapsed);
  updateMassSpringCable(springCable, state.running ? delta * state.speed : 0, elapsed);

  ceilingLights.forEach((light, index) => {
    const pulse = 1 + Math.sin(elapsed * 1.8 + index) * 0.05;
    light.intensity = state.lampOn ? 9.0 * pulse : index % 2 === 0 ? 1.5 : 0;
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
