import * as THREE from "three";
import { materials } from "../materials.js";
import { makeLabelTexture } from "../textures.js";
import { shadow, addBox, addCylinder, addSphere, addTorus, addPipe, addLocalCable } from "../geometry.js";
import { createCargoCrate } from "./production.js";

export function createAgv(parent) {
  const agv = new THREE.Group();
  parent.add(agv);

  const body = new THREE.Group();
  body.position.y = 0.02;
  agv.add(body);

  addBox(body, [0.82, 0.25, 1.04], [0, 0.76, 0], materials.productShell);
  addBox(body, [0.68, 0.09, 0.84], [0, 0.94, 0], materials.steel);
  addBox(body, [0.48, 0.045, 0.62], [0, 1.02, -0.04], materials.rubber);
  addSphere(body, 0.24, [0, 0.76, 0.54], materials.productShell, 18);
  addSphere(body, 0.22, [0, 0.74, -0.52], materials.steel, 18);
  addBox(body, [0.4, 0.16, 0.28], [0, 0.78, 0.72], materials.darkSteel);
  addBox(body, [0.48, 0.2, 0.26], [0, 0.79, 0.88], materials.brushed);
  addSphere(body, 0.07, [-0.17, 0.84, 1.02], materials.glowBlue, 12);
  addSphere(body, 0.07, [0.17, 0.84, 1.02], materials.glowGreen, 12);
  addBox(body, [0.06, 0.18, 0.72], [-0.46, 0.78, 0], materials.darkSteel);
  addBox(body, [0.06, 0.18, 0.72], [0.46, 0.78, 0], materials.darkSteel);
  addLocalCable(body, [
    [-0.36, 0.95, -0.42],
    [-0.48, 1.0, -0.08],
    [-0.38, 0.96, 0.36],
  ], 0.018);
  addLocalCable(body, [
    [0.36, 0.95, -0.42],
    [0.48, 1.0, -0.08],
    [0.38, 0.96, 0.36],
  ], 0.018);

  addBox(agv, [0.48, 0.055, 0.5], [0, 1.055, -0.06], materials.darkSteel);
  const cargo = createCargoCrate(agv, [0.04, 1.16, -0.06], materials.crate);
  cargo.scale.set(0.72, 0.58, 0.7);
  agv.userData.cargo = cargo;
  agv.userData.body = body;

  const legs = [];
  [
    [-0.48, 0.42, 0],
    [0.48, 0.42, Math.PI],
    [-0.48, -0.42, Math.PI],
    [0.48, -0.42, 0],
  ].forEach(([x, z, phase]) => {
    const hip = new THREE.Group();
    hip.position.set(x, 0.66, z);
    agv.add(hip);

    addSphere(hip, 0.135, [0, 0, 0], materials.darkSteel, 16);
    addCylinder(hip, 0.045, 0.05, 0.22, [0, 0, 0], materials.steel, 14).rotation.z = Math.PI / 2;
    const upper = addCylinder(hip, 0.055, 0.065, 0.39, [0, -0.2, 0.06], materials.brushed, 14);
    upper.rotation.x = 0.28;

    const knee = new THREE.Group();
    knee.position.set(0, -0.39, 0.12);
    hip.add(knee);
    addSphere(knee, 0.095, [0, 0, 0], materials.darkSteel, 14);
    const lower = addCylinder(knee, 0.043, 0.052, 0.46, [0, -0.22, -0.08], materials.brushed, 14);
    lower.rotation.x = -0.34;
    addBox(knee, [0.22, 0.075, 0.18], [0, -0.45, -0.17], materials.rubber);

    legs.push({ hip, knee, phase });
  });
  agv.userData.legs = legs;

  return agv;
}

export function createParallelGripper(parent) {
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

export function createRobot(parent, position, rotationY = 0, accent = materials.teal, options = {}) {
  const robotId = options.id || "R-01";
  const robot = new THREE.Group();
  robot.position.set(...position);
  robot.rotation.y = rotationY;
  parent.add(robot);

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
