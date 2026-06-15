import * as THREE from "three";
import { materials } from "../materials.js";
import { makeCheckerTexture } from "../textures.js";
import { shadow, addBox, addCylinder, addSphere } from "../geometry.js";

export function createCargoCrate(parent, position, material = materials.crate) {
  const cargo = new THREE.Group();
  cargo.position.set(...position);
  parent.add(cargo);

  addBox(cargo, [0.5, 0.26, 0.36], [0, 0, 0], material);
  addBox(cargo, [0.56, 0.045, 0.4], [0, 0.15, 0], materials.darkSteel);
  addBox(cargo, [0.08, 0.28, 0.42], [0, 0, 0], materials.darkSteel);
  addSphere(cargo, 0.045, [-0.18, 0.15, 0.18], materials.glowGreen, 10);
  addSphere(cargo, 0.04, [0.18, 0.15, 0.18], materials.glowBlue, 10);

  return cargo;
}

export function createProductionItem(parent, kind, index) {
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

  parent.add(item);
  return item;
}

export function createHandledPart(parent, position, accent = materials.battery) {
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

export function createTriangulatedPrototype(parent, position, rotationY = 0) {
  const prototype = new THREE.Group();
  prototype.position.set(...position);
  prototype.rotation.y = rotationY;
  parent.add(prototype);

  addBox(prototype, [1.55, 0.12, 1.0], [0, 0.62, 0], materials.darkSteel);
  addBox(prototype, [1.35, 0.055, 0.82], [0, 0.72, 0], materials.brushed);
  [-0.6, 0.6].forEach((x) => {
    [-0.36, 0.36].forEach((z) => {
      addBox(prototype, [0.08, 0.72, 0.08], [x, 0.3, z], materials.brushed);
    });
  });

  const positions = [
    -0.56, 0.82, -0.36, 0, 0.94, -0.38, 0.56, 0.8, -0.36, -0.6, 0.92, 0, 0, 1.12, 0.02, 0.6, 0.9, 0, -0.56, 0.8, 0.36,
    0, 0.96, 0.38, 0.56, 0.82, 0.36,
  ];
  const uvs = [0, 0, 0.5, 0, 1, 0, 0, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 0.5, 1, 1, 1];
  const indices = [0, 3, 1, 1, 3, 4, 1, 4, 2, 2, 4, 5, 3, 6, 4, 4, 6, 7, 4, 7, 5, 5, 7, 8];
  const meshTexture = makeCheckerTexture("#d8eef6", "#5a93a7", 128, 4);
  meshTexture.repeat.set(1, 1);
  const meshMaterial = new THREE.MeshStandardMaterial({
    map: meshTexture,
    color: 0xffffff,
    metalness: 0.12,
    roughness: 0.48,
    side: THREE.DoubleSide,
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const mesh = shadow(new THREE.Mesh(geometry, meshMaterial));
  prototype.add(mesh);

  const wire = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0x10242c, wireframe: true, transparent: true, opacity: 0.62 }),
  );
  prototype.add(wire);

  const normalPositions = [];
  const normalAttribute = geometry.getAttribute("normal");
  for (let i = 0; i < positions.length; i += 3) {
    const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    const normal = new THREE.Vector3(
      normalAttribute.getX(i / 3),
      normalAttribute.getY(i / 3),
      normalAttribute.getZ(i / 3),
    );
    normalPositions.push(vertex.x, vertex.y, vertex.z);
    normalPositions.push(vertex.x + normal.x * 0.22, vertex.y + normal.y * 0.22, vertex.z + normal.z * 0.22);
    addSphere(prototype, 0.035, [vertex.x, vertex.y, vertex.z], materials.glowBlue, 8);
  }
  const normalGeometry = new THREE.BufferGeometry();
  normalGeometry.setAttribute("position", new THREE.Float32BufferAttribute(normalPositions, 3));
  prototype.add(new THREE.LineSegments(normalGeometry, new THREE.LineBasicMaterial({ color: 0x68f5a0 })));

  addBox(prototype, [0.88, 0.045, 0.08], [0, 0.77, -0.48], materials.glowGreen);
  addBox(prototype, [0.12, 0.045, 0.38], [-0.58, 0.77, 0], materials.glowBlue);
  addBox(prototype, [0.12, 0.045, 0.38], [0.58, 0.77, 0], materials.glowRed);

  return prototype;
}

export function createMassSpringCable(parent, position) {
  const cable = new THREE.Group();
  cable.position.set(...position);
  parent.add(cable);

  addBox(cable, [0.72, 0.08, 0.18], [0, 0.08, 0], materials.darkSteel);
  addBox(cable, [0.2, 0.28, 0.2], [0, -0.08, 0], materials.brushed);
  addSphere(cable, 0.07, [0.25, -0.02, 0.04], materials.glowGreen, 10);
  addSphere(cable, 0.055, [-0.25, -0.02, 0.04], materials.glowBlue, 10);

  const count = 7;
  const restLength = 0.24;
  const particles = [];
  const spheres = [];
  for (let i = 0; i < count; i += 1) {
    const particle = {
      position: new THREE.Vector3(Math.sin(i * 0.8) * 0.04, -0.18 - i * restLength, Math.cos(i * 0.65) * 0.035),
      velocity: new THREE.Vector3(),
      force: new THREE.Vector3(),
      fixed: i === 0,
    };
    particles.push(particle);
    const material = i === count - 1 ? materials.glowRed : i % 2 === 0 ? materials.glowBlue : materials.brushed;
    const radius = i === count - 1 ? 0.085 : 0.045;
    spheres.push(addSphere(cable, radius, particle.position.toArray(), material, 12));
  }

  const linePositions = new Float32Array((count - 1) * 2 * 3);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const line = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0xffd35a }));
  cable.add(line);

  const sensor = addBox(cable, [0.22, 0.16, 0.12], [0, particles[count - 1].position.y - 0.12, 0], materials.warningBlack);
  sensor.userData.followIndex = count - 1;

  cable.userData.particles = particles;
  cable.userData.spheres = spheres;
  cable.userData.lineGeometry = lineGeometry;
  cable.userData.sensor = sensor;
  cable.userData.restLength = restLength;
  cable.userData.stiffness = 34;
  cable.userData.damping = 1.7;
  cable.userData.mass = 0.18;
  cable.userData.floorY = -1.82;
  cable.userData.temp = {
    deltaVector: new THREE.Vector3(),
    relativeVelocity: new THREE.Vector3(),
    gravity: new THREE.Vector3(0, -3.4, 0),
    wind: new THREE.Vector3(),
  };

  return cable;
}

export function updateMassSpringCable(cable, delta, time) {
  if (delta <= 0) return;

  const particles = cable.userData.particles;
  const substeps = 3;
  const step = Math.min(delta, 1 / 30) / substeps;
  const { deltaVector, relativeVelocity, gravity, wind } = cable.userData.temp;
  wind.set(Math.sin(time * 1.7) * 0.85, 0, Math.cos(time * 1.1) * 0.45);

  for (let substep = 0; substep < substeps; substep += 1) {
    particles[0].position.set(Math.sin(time * 1.2) * 0.08, -0.18 + Math.sin(time * 1.7) * 0.025, 0);
    particles[0].velocity.set(0, 0, 0);

    particles.forEach((particle, index) => {
      particle.force.set(0, 0, 0);
      if (!particle.fixed) {
        particle.force.addScaledVector(gravity, cable.userData.mass);
        particle.force.addScaledVector(wind, 0.04 + index * 0.008);
      }
    });

    for (let i = 0; i < particles.length - 1; i += 1) {
      const a = particles[i];
      const b = particles[i + 1];
      deltaVector.subVectors(b.position, a.position);
      const length = Math.max(deltaVector.length(), 0.0001);
      const direction = deltaVector.multiplyScalar(1 / length);
      const stretch = length - cable.userData.restLength;
      relativeVelocity.subVectors(b.velocity, a.velocity);
      const dampingForce = cable.userData.damping * relativeVelocity.dot(direction);
      const force = direction.multiplyScalar(cable.userData.stiffness * stretch + dampingForce);

      if (!a.fixed) a.force.add(force);
      if (!b.fixed) b.force.sub(force);
    }

    particles.forEach((particle) => {
      if (particle.fixed) return;
      const acceleration = particle.force.multiplyScalar(1 / cable.userData.mass);
      particle.velocity.addScaledVector(acceleration, step);
      particle.velocity.multiplyScalar(0.992);
      particle.position.addScaledVector(particle.velocity, step);
      if (particle.position.y < cable.userData.floorY) {
        particle.position.y = cable.userData.floorY;
        particle.velocity.y *= -0.28;
        particle.velocity.x *= 0.8;
        particle.velocity.z *= 0.8;
      }
    });
  }

  particles.forEach((particle, index) => {
    cable.userData.spheres[index].position.copy(particle.position);
  });
  const lineAttribute = cable.userData.lineGeometry.getAttribute("position");
  let cursor = 0;
  for (let i = 0; i < particles.length - 1; i += 1) {
    const a = particles[i].position;
    const b = particles[i + 1].position;
    lineAttribute.setXYZ(cursor, a.x, a.y, a.z);
    lineAttribute.setXYZ(cursor + 1, b.x, b.y, b.z);
    cursor += 2;
  }
  lineAttribute.needsUpdate = true;
  const finalParticle = particles[cable.userData.sensor.userData.followIndex];
  cable.userData.sensor.position.set(finalParticle.position.x, finalParticle.position.y - 0.13, finalParticle.position.z);
  cable.userData.sensor.rotation.z = Math.sin(time * 2.2) * 0.16;
}
