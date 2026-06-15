import * as THREE from "three";
import { materials } from "../materials.js";
import { makeLabelTexture } from "../textures.js";
import { shadow, addBox, addCylinder, addSphere, addPipe } from "../geometry.js";

export function createTechnician(parent, position, rotationY = 0) {
  const technician = new THREE.Group();
  technician.position.set(...position);
  technician.rotation.y = rotationY;
  parent.add(technician);

  const body = new THREE.Group();
  technician.add(body);

  const torso = addCylinder(body, 0.27, 0.33, 0.7, [0, 0.92, 0], materials.operatorJacket, 28);
  torso.scale.z = 0.72;
  addCylinder(body, 0.24, 0.3, 0.16, [0, 0.55, 0], materials.operatorSuit, 24).scale.z = 0.72;
  addBox(body, [0.58, 0.12, 0.22], [0, 1.26, 0], materials.operatorSuit);
  addBox(body, [0.08, 0.56, 0.035], [-0.13, 0.95, -0.235], materials.cautionPaint);
  addBox(body, [0.08, 0.56, 0.035], [0.13, 0.95, -0.235], materials.cautionPaint);
  addBox(body, [0.38, 0.055, 0.038], [0, 1.12, -0.238], materials.safetyWhite);

  const badgeMaterial = new THREE.MeshStandardMaterial({
    map: makeLabelTexture("QA", "#f5efe0", "#1d2528"),
    roughness: 0.42,
    metalness: 0.04,
  });
  const badge = shadow(new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.085), badgeMaterial));
  badge.position.set(0.19, 1.03, -0.258);
  badge.rotation.y = Math.PI;
  body.add(badge);

  addCylinder(body, 0.075, 0.08, 0.12, [0, 1.32, 0], materials.operatorSkin, 16);

  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.48, 0);
  body.add(headPivot);
  addSphere(headPivot, 0.19, [0, 0, 0], materials.operatorSkin, 28);
  addSphere(headPivot, 0.018, [-0.062, 0.035, -0.178], materials.warningBlack, 10);
  addSphere(headPivot, 0.018, [0.062, 0.035, -0.178], materials.warningBlack, 10);
  addBox(headPivot, [0.2, 0.055, 0.025], [0, -0.035, -0.185], materials.operatorVisor);

  const helmetCap = shadow(
    new THREE.Mesh(
      new THREE.SphereGeometry(0.23, 30, 14, 0, Math.PI * 2, 0, Math.PI * 0.58),
      materials.operatorHelmet,
    ),
  );
  helmetCap.position.set(0, 0.06, 0);
  helmetCap.scale.set(1.08, 0.78, 1.0);
  headPivot.add(helmetCap);
  const brim = addCylinder(headPivot, 0.245, 0.245, 0.035, [0, 0.035, -0.015], materials.operatorHelmet, 28);
  brim.scale.z = 0.76;

  function createArm(side, shoulderZ) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.35, 1.2, shoulderZ);
    shoulder.rotation.z = -side * 0.22;
    shoulder.rotation.x = -0.18;
    body.add(shoulder);

    addCylinder(shoulder, 0.054, 0.064, 0.42, [0, -0.21, 0], materials.operatorSuit, 16);
    addSphere(shoulder, 0.072, [0, -0.43, 0], materials.darkSteel, 16);

    const forearm = new THREE.Group();
    forearm.position.set(0, -0.43, 0);
    forearm.rotation.x = -0.92;
    forearm.rotation.z = side * 0.1;
    shoulder.add(forearm);

    addCylinder(forearm, 0.044, 0.052, 0.36, [0, -0.18, 0], materials.operatorSuit, 16);
    addSphere(forearm, 0.06, [0, -0.39, 0], materials.operatorSkin, 16);

    return { shoulder, forearm };
  }

  const leftArm = createArm(-1, -0.015);
  const rightArm = createArm(1, -0.02);

  function createLeg(side) {
    const hip = new THREE.Group();
    hip.position.set(side * 0.14, 0.56, 0);
    hip.rotation.z = side * 0.05;
    body.add(hip);

    addCylinder(hip, 0.07, 0.08, 0.48, [0, -0.24, 0], materials.operatorSuit, 16);
    addSphere(hip, 0.072, [0, -0.5, 0], materials.darkSteel, 16);
    addBox(hip, [0.17, 0.1, 0.34], [0, -0.62, -0.065], materials.rubber);

    return hip;
  }

  const leftLeg = createLeg(-1);
  const rightLeg = createLeg(1);

  const tablet = new THREE.Group();
  tablet.position.set(0, 0.78, -0.42);
  tablet.rotation.x = -0.72;
  body.add(tablet);
  addBox(tablet, [0.46, 0.035, 0.32], [0, 0, 0], materials.warningBlack);
  addBox(tablet, [0.34, 0.04, 0.21], [0, 0.022, 0], materials.tabletScreen);
  addBox(tablet, [0.22, 0.043, 0.025], [0, 0.047, -0.06], materials.glowGreen);
  addBox(tablet, [0.14, 0.043, 0.025], [0, 0.048, 0.01], materials.glowBlue);

  addPipe(body, [-0.18, 1.18, 0.03], [-0.38, 1.45, 0.03], 0.018, materials.brushed);
  addPipe(body, [0.18, 1.18, 0.03], [0.38, 1.45, 0.03], 0.018, materials.brushed);

  technician.userData = { body, headPivot, leftArm, rightArm, leftLeg, rightLeg, tablet };

  return technician;
}

export function createWalkAvatar(parent) {
  const avatar = new THREE.Group();
  avatar.visible = false;
  parent.add(avatar);

  const body = new THREE.Group();
  avatar.add(body);

  addCylinder(body, 0.26, 0.34, 0.72, [0, 1.0, 0], materials.operatorSuit, 28).scale.z = 0.72;
  addBox(body, [0.5, 0.12, 0.24], [0, 1.38, 0], materials.brushed);
  addBox(body, [0.38, 0.26, 0.045], [0, 1.08, -0.24], materials.tabletScreen);
  addBox(body, [0.26, 0.045, 0.05], [0, 1.18, -0.27], materials.glowGreen);
  addBox(body, [0.16, 0.045, 0.05], [0, 1.02, -0.27], materials.glowBlue);
  addCylinder(body, 0.11, 0.14, 0.22, [0, 1.48, 0], materials.darkSteel, 18);

  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.68, 0);
  body.add(headPivot);
  addBox(headPivot, [0.38, 0.3, 0.32], [0, 0, 0], materials.safetyWhite);
  addBox(headPivot, [0.28, 0.09, 0.035], [0, 0.04, -0.18], materials.operatorVisor);
  addSphere(headPivot, 0.035, [-0.1, 0.04, -0.205], materials.glowBlue, 10);
  addSphere(headPivot, 0.035, [0.1, 0.04, -0.205], materials.glowBlue, 10);
  addCylinder(headPivot, 0.015, 0.018, 0.24, [0, 0.25, 0], materials.brushed, 8);
  const statusLight = addSphere(headPivot, 0.055, [0, 0.4, 0], materials.glowGreen, 12);

  function createArm(side) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.35, 1.3, 0);
    shoulder.rotation.z = -side * 0.14;
    body.add(shoulder);

    addSphere(shoulder, 0.085, [0, 0, 0], materials.brushed, 14);
    addCylinder(shoulder, 0.055, 0.065, 0.42, [0, -0.22, 0], materials.operatorSuit, 16);

    const elbow = new THREE.Group();
    elbow.position.set(0, -0.43, 0);
    shoulder.add(elbow);
    addSphere(elbow, 0.062, [0, 0, 0], materials.darkSteel, 12);
    addCylinder(elbow, 0.045, 0.055, 0.36, [0, -0.2, 0], materials.brushed, 16);
    addSphere(elbow, 0.06, [0, -0.42, -0.02], materials.rubber, 12);

    return { shoulder, elbow };
  }

  function createLeg(side) {
    const hip = new THREE.Group();
    hip.position.set(side * 0.15, 0.66, 0);
    body.add(hip);

    addSphere(hip, 0.075, [0, 0, 0], materials.darkSteel, 12);
    addCylinder(hip, 0.07, 0.08, 0.48, [0, -0.25, 0], materials.operatorSuit, 16);

    const knee = new THREE.Group();
    knee.position.set(0, -0.5, 0);
    hip.add(knee);
    addSphere(knee, 0.07, [0, 0, 0], materials.brushed, 12);
    addCylinder(knee, 0.06, 0.07, 0.42, [0, -0.22, 0], materials.darkSteel, 16);
    const foot = addBox(knee, [0.17, 0.1, 0.42], [0, -0.46, -0.08], materials.rubber);

    return { hip, knee, foot };
  }

  const leftArm = createArm(-1);
  const rightArm = createArm(1);
  const leftLeg = createLeg(-1);
  const rightLeg = createLeg(1);

  addPipe(body, [-0.2, 1.34, 0.08], [-0.34, 1.0, 0.04], 0.018, materials.brushed);
  addPipe(body, [0.2, 1.34, 0.08], [0.34, 1.0, 0.04], 0.018, materials.brushed);

  avatar.userData = { body, headPivot, leftArm, rightArm, leftLeg, rightLeg, statusLight };

  return avatar;
}

export function animateWalkAvatar(avatar, time, isMoving) {
  const { body, headPivot, leftArm, rightArm, leftLeg, rightLeg, statusLight } = avatar.userData;
  const stride = Math.sin(time * 8.6);
  const lift = Math.abs(Math.cos(time * 8.6));
  const idle = Math.sin(time * 1.4);
  const legSwing = isMoving ? 0.58 : 0.035;
  const armSwing = isMoving ? 0.42 : 0.025;

  body.position.y = isMoving ? lift * 0.055 : idle * 0.012;
  body.rotation.z = isMoving ? stride * 0.028 : idle * 0.008;
  headPivot.rotation.y = isMoving ? stride * 0.08 : Math.sin(time * 0.9) * 0.12;
  headPivot.rotation.x = isMoving ? -0.02 + lift * 0.025 : Math.sin(time * 1.1) * 0.025;

  leftLeg.hip.rotation.x = stride * legSwing;
  rightLeg.hip.rotation.x = -stride * legSwing;
  leftLeg.knee.rotation.x = Math.max(0, -stride) * 0.34;
  rightLeg.knee.rotation.x = Math.max(0, stride) * 0.34;
  leftLeg.foot.rotation.x = Math.max(0, stride) * 0.18;
  rightLeg.foot.rotation.x = Math.max(0, -stride) * 0.18;

  leftArm.shoulder.rotation.x = -stride * armSwing;
  rightArm.shoulder.rotation.x = stride * armSwing;
  leftArm.elbow.rotation.x = -0.18 + Math.max(0, stride) * 0.18;
  rightArm.elbow.rotation.x = -0.18 + Math.max(0, -stride) * 0.18;

  statusLight.scale.setScalar(1 + Math.sin(time * (isMoving ? 10 : 3)) * 0.08);
}

export function animateTechnician(technician, time) {
  const { body, headPivot, leftArm, rightArm, leftLeg, rightLeg, tablet } = technician.userData;
  const breathing = Math.sin(time * 1.35) * 0.012;
  const handCheck = Math.sin(time * 2.1);

  body.position.y = breathing;
  body.rotation.y = Math.sin(time * 0.42) * 0.035;
  headPivot.rotation.y = Math.sin(time * 0.8) * 0.18;
  headPivot.rotation.x = 0.035 + Math.sin(time * 1.15) * 0.035;

  leftArm.shoulder.rotation.set(-0.22 + handCheck * 0.025, 0, 0.25);
  leftArm.forearm.rotation.set(-0.94 + Math.sin(time * 1.6) * 0.045, 0, -0.1);
  rightArm.shoulder.rotation.set(-0.34 + handCheck * 0.04, 0, -0.28);
  rightArm.forearm.rotation.set(-1.04 + Math.cos(time * 1.75) * 0.055, 0, 0.12);

  leftLeg.rotation.z = -0.035 + Math.sin(time * 0.8) * 0.015;
  rightLeg.rotation.z = 0.04 - Math.sin(time * 0.8) * 0.015;
  tablet.rotation.x = -0.72 + Math.sin(time * 1.7) * 0.035;
}
