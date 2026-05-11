import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.querySelector("#factory-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9fc9df);
scene.fog = new THREE.Fog(0x9fc9df, 16, 48);

const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(8, 6, 10);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, 0);
controls.enableDamping = true;

const clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();

const state = {
  running: true,
  night: false,
  lampOn: true,
  speed: 1,
  cameraIndex: 0,
};

const cameraViews = [
  { position: new THREE.Vector3(8, 6, 10), target: new THREE.Vector3(0, 1.5, 0) },
  { position: new THREE.Vector3(-9, 5, 5), target: new THREE.Vector3(-1, 1.4, 0) },
  { position: new THREE.Vector3(0, 9, 8), target: new THREE.Vector3(0, 0.7, 0) },
];

function makeCheckerTexture(colorA, colorB, size = 128, cells = 8) {
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

function makeStripeTexture(colorA, colorB, size = 128, stripes = 8) {
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
  texture.repeat.set(3, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const floorTexture = makeCheckerTexture("#65706d", "#59635f", 192, 12);
floorTexture.repeat.set(10, 10);
const beltTexture = makeStripeTexture("#2c3032", "#444b4e", 160, 10);

const materials = {
  floor: new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.82 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x77838a, metalness: 0.75, roughness: 0.28 }),
  darkSteel: new THREE.MeshStandardMaterial({ color: 0x252b2f, metalness: 0.65, roughness: 0.34 }),
  yellow: new THREE.MeshStandardMaterial({ color: 0xf6c453, metalness: 0.25, roughness: 0.42 }),
  teal: new THREE.MeshStandardMaterial({ color: 0x47bca0, metalness: 0.2, roughness: 0.42 }),
  red: new THREE.MeshStandardMaterial({ color: 0xe65c4f, metalness: 0.1, roughness: 0.5 }),
  belt: new THREE.MeshStandardMaterial({ map: beltTexture, roughness: 0.72 }),
  glass: new THREE.MeshStandardMaterial({
    color: 0x9ad9ff,
    roughness: 0.05,
    metalness: 0,
    transparent: true,
    opacity: 0.42,
  }),
  crate: new THREE.MeshStandardMaterial({ color: 0xb56b43, roughness: 0.72 }),
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

const floor = shadow(new THREE.Mesh(new THREE.PlaneGeometry(42, 42), materials.floor));
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const ambientLight = new THREE.HemisphereLight(0xd9f4ff, 0x3d3428, 1.7);
scene.add(ambientLight);

const sun = new THREE.DirectionalLight(0xffffff, 2.3);
sun.position.set(5, 9, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 30;
sun.shadow.camera.left = -12;
sun.shadow.camera.right = 12;
sun.shadow.camera.top = 12;
sun.shadow.camera.bottom = -12;
scene.add(sun);

const lampLight = new THREE.SpotLight(0xffd27a, 35, 17, Math.PI / 5, 0.55, 1.2);
lampLight.position.set(-4.2, 6.3, 1.8);
lampLight.target.position.set(0, 0, 0);
lampLight.castShadow = true;
scene.add(lampLight, lampLight.target);

const belt = new THREE.Group();
scene.add(belt);
addBox(belt, [10.5, 0.35, 1.5], [0, 0.45, 0], materials.belt);
addBox(belt, [10.8, 0.25, 0.12], [0, 0.7, -0.88], materials.steel);
addBox(belt, [10.8, 0.25, 0.12], [0, 0.7, 0.88], materials.steel);

for (let x = -5; x <= 5; x += 1) {
  const roller = addCylinder(belt, 0.18, 0.18, 1.8, [x, 0.7, 0], materials.darkSteel, 20);
  roller.rotation.z = Math.PI / 2;
}

const lamp = new THREE.Group();
scene.add(lamp);
addCylinder(lamp, 0.07, 0.09, 5.2, [-4.2, 2.8, 1.8], materials.darkSteel, 18);
const lampHead = addCylinder(lamp, 0.48, 0.24, 0.45, [-4.2, 5.42, 1.8], materials.yellow, 32);
lampHead.rotation.x = Math.PI;

const robot = new THREE.Group();
robot.position.set(-2.2, 0, -1.45);
scene.add(robot);

addCylinder(robot, 0.68, 0.82, 0.42, [0, 0.21, 0], materials.darkSteel);

const waistPivot = new THREE.Group();
waistPivot.position.y = 0.42;
robot.add(waistPivot);

const torso = addCylinder(waistPivot, 0.45, 0.55, 0.86, [0, 0.43, 0], materials.yellow);

const shoulderPivot = new THREE.Group();
shoulderPivot.position.set(0, 0.93, 0);
waistPivot.add(shoulderPivot);

const upperArm = new THREE.Group();
upperArm.position.set(0.56, 0, 0);
shoulderPivot.add(upperArm);
addBox(upperArm, [1.45, 0.34, 0.38], [0.72, 0, 0], materials.teal);
addCylinder(upperArm, 0.26, 0.26, 0.42, [0, 0, 0], materials.steel);

const elbowPivot = new THREE.Group();
elbowPivot.position.set(1.48, 0, 0);
upperArm.add(elbowPivot);
addCylinder(elbowPivot, 0.23, 0.23, 0.46, [0, 0, 0], materials.steel);

const forearm = new THREE.Group();
elbowPivot.add(forearm);
addBox(forearm, [1.22, 0.28, 0.32], [0.61, 0, 0], materials.yellow);

const wristPivot = new THREE.Group();
wristPivot.position.set(1.25, 0, 0);
forearm.add(wristPivot);
addCylinder(wristPivot, 0.18, 0.18, 0.36, [0, 0, 0], materials.steel);

const clawLeft = addBox(wristPivot, [0.1, 0.56, 0.12], [0.27, 0.2, -0.14], materials.red);
const clawRight = addBox(wristPivot, [0.1, 0.56, 0.12], [0.27, -0.2, -0.14], materials.red);
clawLeft.rotation.z = 0.35;
clawRight.rotation.z = -0.35;

const crates = [];
for (let i = 0; i < 5; i += 1) {
  const crate = new THREE.Group();
  crate.position.set(-4.6 + i * 2.4, 0.98, 0);
  addBox(crate, [0.62, 0.62, 0.62], [0, 0, 0], materials.crate);
  addBox(crate, [0.68, 0.08, 0.68], [0, 0.21, 0], materials.darkSteel);
  addBox(crate, [0.68, 0.08, 0.68], [0, -0.21, 0], materials.darkSteel);
  crates.push(crate);
  scene.add(crate);
}

const drone = new THREE.Group();
drone.position.set(2.4, 3.2, -1.8);
scene.add(drone);
addBox(drone, [0.7, 0.18, 0.45], [0, 0, 0], materials.glass);
const rotorPivots = [];
[
  [-0.55, 0, -0.42],
  [0.55, 0, -0.42],
  [-0.55, 0, 0.42],
  [0.55, 0, 0.42],
].forEach((position) => {
  const pivot = new THREE.Group();
  pivot.position.set(...position);
  drone.add(pivot);
  addBox(pivot, [0.72, 0.04, 0.08], [0, 0.08, 0], materials.darkSteel);
  rotorPivots.push(pivot);
});

for (let x = -7; x <= 7; x += 2) {
  addBox(scene, [0.1, 2.3, 0.1], [x, 1.15, 3.6], materials.darkSteel);
}
addBox(scene, [15, 0.12, 0.12], [0, 2.3, 3.6], materials.steel);
addBox(scene, [15, 0.12, 0.12], [0, 1.4, 3.6], materials.steel);

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
  scene.background.set(state.night ? 0x121826 : 0x9fc9df);
  scene.fog.color.set(state.night ? 0x121826 : 0x9fc9df);
  ambientLight.intensity = state.night ? 0.35 : 1.7;
  sun.intensity = state.night ? 0.25 : 2.3;
});

toggleLamp.addEventListener("click", () => {
  state.lampOn = !state.lampOn;
  toggleLamp.textContent = state.lampOn ? "Lamp Off" : "Lamp On";
  lampLight.visible = state.lampOn;
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

  beltTexture.offset.x = -elapsed * 0.45;

  waistPivot.rotation.y = Math.sin(elapsed * 0.9) * 0.55;
  shoulderPivot.rotation.z = -0.35 + Math.sin(elapsed * 1.15) * 0.38;
  upperArm.rotation.y = Math.sin(elapsed * 0.8) * 0.14;
  elbowPivot.rotation.z = 0.85 + Math.sin(elapsed * 1.55) * 0.55;
  wristPivot.rotation.x = elapsed * 2.1;
  wristPivot.rotation.z = Math.sin(elapsed * 2.4) * 0.18;
  torso.rotation.y = Math.sin(elapsed * 1.8) * 0.025;

  const clawGrip = 0.22 + Math.sin(elapsed * 2.2) * 0.11;
  clawLeft.position.y = clawGrip;
  clawRight.position.y = -clawGrip;

  crates.forEach((crate, index) => {
    crate.position.x = ((elapsed * 1.35 + index * 2.4 + 5.2) % 10.4) - 5.2;
    crate.rotation.y += delta * state.speed * 0.25;
  });

  drone.position.y = 3.2 + Math.sin(elapsed * 1.4) * 0.28;
  drone.position.x = 2.4 + Math.sin(elapsed * 0.55) * 1.2;
  rotorPivots.forEach((pivot, index) => {
    pivot.rotation.y += delta * state.speed * (index % 2 === 0 ? 18 : -18);
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
