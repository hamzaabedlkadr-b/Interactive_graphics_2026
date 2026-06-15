const fs = require('fs');

const lines = fs.readFileSync('main.js', 'utf8').split('\n');

const imports = `import {
  state,
  pressedKeys,
  walkBounds,
  robotSpeedOptions,
  ROBOT_CYCLE_DURATION,
  cameraViews,
  roomViews,
} from "./state.js";
import { materials } from "./materials.js";
import { shadow, addBox, addCylinder, addSphere, addTorus, addCable, addLocalCable, addPipe } from "./geometry.js";

import { createVent, createFloorLabel, createOilStain, createFloorDrain, createSafetyBollard, createCableTray, createAgvLane, createDoorFrame, createSlidingDoor, createPartitionWall } from "./entities/environment.js";
import { createWarningPanel, createBarrel, createStorageRack, createPallet, createToolCart, createElectricalCabinet, createMaintenancePanel } from "./entities/props.js";
import { createTechnician, animateTechnician } from "./entities/characters.js";
import { createCargoCrate, createProductionItem, createHandledPart, createTriangulatedPrototype, createMassSpringCable, updateMassSpringCable } from "./entities/production.js";
import { createAgv, createParallelGripper, createRobot } from "./entities/machines.js";
`;

let newLines = [];
// 0 to 26 are lines 1 to 27
newLines.push(...lines.slice(0, 27));
newLines.push(imports);

let factoryStartIdx = lines.findIndex(l => l.startsWith('const factory = new THREE.Group();'));
let gripperIdx = lines.findIndex(l => l.startsWith('function createParallelGripper'));
let robotCallIdx = lines.findIndex(l => l.startsWith('const primaryRobot = createRobot('));

newLines.push(...lines.slice(factoryStartIdx, gripperIdx));
newLines.push(...lines.slice(robotCallIdx));

let newContent = newLines.join('\n');
newContent = newContent.replace(/createRobot\(\[-4.1/g, 'createRobot(scene, [-4.1');
newContent = newContent.replace(/createRobot\(\[5.05/g, 'createRobot(scene, [5.05');
newContent = newContent.replace(/createProductionItem\("battery"/g, 'createProductionItem(scene, "battery"');
newContent = newContent.replace(/createProductionItem\(productionKinds/g, 'createProductionItem(scene, productionKinds');

fs.writeFileSync('main.js', newContent);
console.log('main.js successfully refactored');
