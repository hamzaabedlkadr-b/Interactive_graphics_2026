import * as THREE from "three";
import { materials } from "../materials.js";
import { makeLabelTexture } from "../textures.js";
import { shadow, addBox, addCylinder, addSphere, addTorus, addCable, addLocalCable, addPipe } from "../geometry.js";

export function createVent(parent, position, rotationY = 0) {
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

export function createFloorLabel(parent, text, position, size, rotationY = 0, background = "#f6c453") {
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

export function createOilStain(parent, position, scale = [0.8, 0.45], rotationZ = 0) {
  const stain = new THREE.Mesh(new THREE.CircleGeometry(0.5, 36), materials.oil);
  stain.position.set(...position);
  stain.scale.set(scale[0], scale[1], 1);
  stain.rotation.x = -Math.PI / 2;
  stain.rotation.z = rotationZ;
  stain.receiveShadow = true;
  parent.add(stain);
  return stain;
}

export function createFloorDrain(parent, position, rotationZ = 0) {
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

export function createSafetyBollard(parent, position, height = 1.0) {
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

export function createCableTray(parent, points, width = 0.22) {
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];
    addPipe(parent, start, end, width * 0.16, materials.cableTray);
    addPipe(parent, [start[0], start[1] - width, start[2]], [end[0], end[1] - width, end[2]], width * 0.12, materials.cableTray);
    addPipe(parent, [start[0], start[1] + width, start[2]], [end[0], end[1] + width, end[2]], width * 0.12, materials.cableTray);
  }
}

export function createAgvLane(parent, points, width = 0.95) {
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];
    const startVector = new THREE.Vector3(start.x, 0, start.z);
    const endVector = new THREE.Vector3(end.x, 0, end.z);
    const midpoint = new THREE.Vector3().addVectors(startVector, endVector).multiplyScalar(0.5);
    const direction = new THREE.Vector3().subVectors(endVector, startVector);
    const length = direction.length();
    const angle = Math.atan2(direction.z, direction.x);

    const lane = addBox(parent, [length, 0.028, width], [midpoint.x, 0.034, midpoint.z], materials.concretePatch);
    lane.rotation.y = -angle;

    [-width / 2 + 0.08, width / 2 - 0.08].forEach((offset) => {
      const stripe = addBox(parent, [length * 0.96, 0.032, 0.055], [midpoint.x, 0.055, midpoint.z], materials.cautionPaint);
      stripe.rotation.y = -angle;
      stripe.position.x += Math.sin(angle) * offset;
      stripe.position.z += Math.cos(angle) * offset;
    });

    if (i % 2 === 0 && length > 1.5) {
      const arrow = addBox(parent, [0.42, 0.034, 0.12], [midpoint.x, 0.064, midpoint.z], materials.safetyWhite);
      arrow.rotation.y = -angle;
      const arrowHead = addBox(parent, [0.16, 0.035, 0.34], [midpoint.x, 0.066, midpoint.z], materials.safetyWhite);
      arrowHead.rotation.y = -angle + Math.PI / 4;
      arrow.position.x += Math.cos(angle) * 0.25;
      arrow.position.z += Math.sin(angle) * 0.25;
      arrowHead.position.x += Math.cos(angle) * 0.52;
      arrowHead.position.z += Math.sin(angle) * 0.52;
    }
  }
}

export function createDoorFrame(parent, position, rotationY = 0, width = 1.55, height = 2.25) {
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

export function createSlidingDoor(parent, position, rotationY = 0, width = 1.45, roomKey = "assembly") {
  const door = new THREE.Group();
  door.position.set(...position);
  door.rotation.y = rotationY;
  parent.add(door);

  const panelWidth = width / 2;
  const panelHeight = 2.08;
  const panelCenterY = 1.32;
  const left = addBox(door, [panelWidth, panelHeight, 0.065], [-panelWidth / 2, panelCenterY, 0.055], materials.glassWall);
  const right = addBox(door, [panelWidth, panelHeight, 0.065], [panelWidth / 2, panelCenterY, 0.055], materials.glassWall);
  addBox(left, [0.045, panelHeight - 0.1, 0.035], [panelWidth / 2 - 0.035, 0, 0.055], materials.darkSteel);
  addBox(left, [panelWidth - 0.08, 0.055, 0.035], [0, 0.72, 0.055], materials.brushed);
  addBox(left, [panelWidth - 0.08, 0.055, 0.035], [0, -0.72, 0.055], materials.brushed);
  addBox(right, [0.045, panelHeight - 0.1, 0.035], [-panelWidth / 2 + 0.035, 0, 0.055], materials.darkSteel);
  addBox(right, [panelWidth - 0.08, 0.055, 0.035], [0, 0.72, 0.055], materials.brushed);
  addBox(right, [panelWidth - 0.08, 0.055, 0.035], [0, -0.72, 0.055], materials.brushed);
  addBox(door, [width + 0.22, 0.08, 0.1], [0, 2.38, 0.08], materials.darkSteel);
  addSphere(door, 0.055, [-width / 2 - 0.16, 2.24, 0.1], materials.glowGreen, 10);
  addSphere(door, 0.055, [width / 2 + 0.16, 2.24, 0.1], materials.glowRed, 10);

  return {
    roomKey,
    width,
    rotationY,
    left,
    right,
    triggerPosition: new THREE.Vector3(position[0], 1.65, position[2]),
    closedLeftX: -panelWidth / 2,
    closedRightX: panelWidth / 2,
    openOffset: Math.max(0.62, width * 0.46),
  };
}

export function createPartitionWall(parent, size, position, hasGlass = false) {
  const lower = addBox(parent, [size[0], 1.1, size[2]], [position[0], 0.55, position[2]], materials.wall);
  const upperMaterial = hasGlass ? materials.glassWall : materials.wall;
  const upper = addBox(parent, [size[0], size[1] - 1.1, size[2]], [position[0], 1.1 + (size[1] - 1.1) / 2, position[2]], upperMaterial);
  return [lower, upper];
}
