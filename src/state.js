import * as THREE from "three";

export const state = {
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

export const pressedKeys = new Set();
export const walkBounds = {
  minX: -14.0,
  maxX: 14.0,
  minZ: -8.4,
  maxZ: 8.6,
};
export const robotSpeedOptions = [
  { label: "Robot 0.5x", value: 0.5 },
  { label: "Robot 1x", value: 1 },
  { label: "Robot 1.5x", value: 1.5 },
];
export const ROBOT_CYCLE_DURATION = 8.4;

export const cameraViews = [
  { position: new THREE.Vector3(9.4, 4.2, 10.4), target: new THREE.Vector3(-0.65, 1.22, -0.35) },
  { position: new THREE.Vector3(-7.25, 2.85, -0.65), target: new THREE.Vector3(-3.75, 1.22, -1.95) },
  { position: new THREE.Vector3(0.4, 4.85, 5.95), target: new THREE.Vector3(0.0, 0.95, 0.15) },
  { position: new THREE.Vector3(7.9, 2.85, -5.8), target: new THREE.Vector3(1.1, 1.18, -0.35) },
  { position: new THREE.Vector3(10.8, 5.0, 10.5), target: new THREE.Vector3(0.0, 1.05, -0.1) },
];

export const roomViews = {
  assembly: {
    label: "Assembly room",
    position: new THREE.Vector3(9.4, 4.2, 10.4),
    target: new THREE.Vector3(-0.65, 1.22, -0.35),
  },
  storage: {
    label: "Storage room",
    position: new THREE.Vector3(-10.0, 3.05, 7.1),
    target: new THREE.Vector3(-8.65, 1.05, 5.3),
  },
  control: {
    label: "Control room",
    position: new THREE.Vector3(11.6, 3.8, 7.35),
    target: new THREE.Vector3(7.25, 1.25, 3.3),
  },
  inspection: {
    label: "Inspection room",
    position: new THREE.Vector3(-0.8, 2.65, -1.05),
    target: new THREE.Vector3(-4.25, 1.15, -3.45),
  },
};
