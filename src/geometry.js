import * as THREE from "three";
import { materials } from "./materials.js";

export function shadow(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function addBox(parent, size, position, material) {
  const mesh = shadow(new THREE.Mesh(new THREE.BoxGeometry(...size), material));
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

export function addCylinder(parent, radiusTop, radiusBottom, height, position, material, radialSegments = 32) {
  const mesh = shadow(
    new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments), material),
  );
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

export function addSphere(parent, radius, position, material, segments = 24) {
  const mesh = shadow(new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), material));
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

export function addTorus(parent, radius, tube, position, material, radialSegments = 24, tubularSegments = 36) {
  const mesh = shadow(new THREE.Mesh(new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments), material));
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

export function addCable(parent, points, radius = 0.025) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const mesh = shadow(new THREE.Mesh(new THREE.TubeGeometry(curve, 32, radius, 8), materials.rubber));
  parent.add(mesh);
  return mesh;
}

export function addLocalCable(parent, points, radius = 0.025, material = materials.rubber) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const mesh = shadow(new THREE.Mesh(new THREE.TubeGeometry(curve, 28, radius, 8), material));
  parent.add(mesh);
  return mesh;
}

export function addPipe(parent, start, end, radius, material) {
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
