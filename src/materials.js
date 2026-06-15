import * as THREE from "three";
import {
  makeCheckerTexture,
  makeStripeTexture,
  makePanelTexture,
  makeHazardTexture,
  makeScuffTexture,
  makeLabelTexture,
  makeFabricTexture,
  makeFabricBumpTexture,
  makeSkinTexture,
  makeHelmetTexture,
} from "./textures.js";

const floorTexture = makeCheckerTexture("#505d5d", "#465252", 192, 12);
floorTexture.repeat.set(12, 10);
const beltTexture = makeStripeTexture("#202326", "#3d464b");
const wallTexture = makePanelTexture();
const hazardTexture = makeHazardTexture();
const floorScuffTexture = makeScuffTexture("#7a8482", "#2d3635", 256, 170);
floorScuffTexture.repeat.set(10, 8);
const wallScuffTexture = makeScuffTexture("#6b7478", "#273139", 256, 90);
wallScuffTexture.repeat.set(6, 3);
const operatorFabricTexture = makeFabricTexture();
operatorFabricTexture.repeat.set(1.4, 1.1);
const operatorFabricBumpTexture = makeFabricBumpTexture();
operatorFabricBumpTexture.repeat.set(3, 4);
const operatorSkinTexture = makeSkinTexture();
const operatorHelmetTexture = makeHelmetTexture();

export const materials = {
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
    roughness: 0.02,
    metalness: 0,
    transmission: 0.42,
    transparent: true,
    opacity: 0.38,
    depthWrite: false,
  }),
  glassWall: new THREE.MeshPhysicalMaterial({
    color: 0xb8e7ff,
    roughness: 0.04,
    metalness: 0,
    transmission: 0.36,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  }),
  crate: new THREE.MeshStandardMaterial({ color: 0xb56b43, roughness: 0.68 }),
  hazard: new THREE.MeshStandardMaterial({ map: hazardTexture, roughness: 0.52 }),
  concretePatch: new THREE.MeshStandardMaterial({ color: 0x394444, roughness: 0.9, metalness: 0.02 }),
  cautionPaint: new THREE.MeshStandardMaterial({ color: 0xe2b83f, roughness: 0.64, metalness: 0.04 }),
  cableTray: new THREE.MeshStandardMaterial({ color: 0x151b1f, metalness: 0.62, roughness: 0.38 }),
  glowGreen: new THREE.MeshStandardMaterial({ color: 0x68f5a0, emissive: 0x2dff85, emissiveIntensity: 1.6 }),
  glowRed: new THREE.MeshStandardMaterial({ color: 0xff665c, emissive: 0xff362b, emissiveIntensity: 1.4 }),
  glowBlue: new THREE.MeshStandardMaterial({ color: 0x9ad9ff, emissive: 0x4cb9ff, emissiveIntensity: 1.1 }),
  operatorJacket: new THREE.ShaderMaterial({
    uniforms: {
      baseMap: { value: operatorFabricTexture },
      lightDirection: { value: new THREE.Vector3(-0.35, 0.85, 0.42).normalize() },
      ambientColor: { value: new THREE.Color(0x3a4d55) },
      lightColor: { value: new THREE.Color(0xdaf7ff) },
      rimColor: { value: new THREE.Color(0x8ee8ff) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;

      void main() {
        vUv = uv;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D baseMap;
      uniform vec3 lightDirection;
      uniform vec3 ambientColor;
      uniform vec3 lightColor;
      uniform vec3 rimColor;
      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;

      void main() {
        vec3 normalDirection = normalize(vWorldNormal);
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        float diffuse = max(dot(normalDirection, normalize(lightDirection)), 0.0);
        float rim = pow(1.0 - max(dot(normalDirection, viewDirection), 0.0), 2.6);
        vec3 baseColor = texture2D(baseMap, vUv).rgb;
        vec3 shadedColor = baseColor * (ambientColor + diffuse * lightColor) + rim * rimColor * 0.18;
        gl_FragColor = vec4(shadedColor, 1.0);
      }
    `,
  }),
  operatorSuit: new THREE.MeshStandardMaterial({
    map: operatorFabricTexture,
    bumpMap: operatorFabricBumpTexture,
    roughnessMap: operatorFabricBumpTexture,
    bumpScale: 0.018,
    metalness: 0.04,
    roughness: 0.76,
  }),
  operatorSkin: new THREE.MeshStandardMaterial({
    map: operatorSkinTexture,
    color: 0xf0b184,
    metalness: 0.02,
    roughness: 0.58,
  }),
  operatorHelmet: new THREE.MeshPhysicalMaterial({
    map: operatorHelmetTexture,
    color: 0xffffff,
    metalness: 0.08,
    roughness: 0.24,
    clearcoat: 0.42,
    clearcoatRoughness: 0.18,
  }),
  operatorVisor: new THREE.MeshPhysicalMaterial({
    color: 0x99d8ef,
    metalness: 0.02,
    roughness: 0.08,
    transmission: 0.22,
    transparent: true,
    opacity: 0.62,
  }),
  tabletScreen: new THREE.MeshStandardMaterial({ color: 0x7be6ff, emissive: 0x1ab8ff, emissiveIntensity: 1.3 }),
  lampGlow: new THREE.MeshBasicMaterial({ color: 0xffe0a2 }),
};
