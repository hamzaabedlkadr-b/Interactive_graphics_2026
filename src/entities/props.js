import * as THREE from "three";
import { materials } from "../materials.js";
import { addBox, addCylinder, addSphere } from "../geometry.js";
import { createBarrel as createBarrelImpl } from "./props.js"; // Wait, createBarrel is in props.js

export function createWarningPanel(parent, position, rotationY = 0) {
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

export function createBarrel(parent, position, material = materials.pipeBlue) {
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

export function createStorageRack(parent, position, rotationY = 0) {
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

export function createPallet(parent, position, rotationY = 0) {
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

export function createToolCart(parent, position, rotationY = 0) {
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

export function createElectricalCabinet(parent, position, rotationY = 0) {
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

export function createMaintenancePanel(parent, position, rotationY = 0, labelColor = materials.glowBlue) {
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
