# Robot Factory Assembly Line

Interactive Graphics course project starter.

## Theme

The project is an interactive multi-room robot factory where hierarchical robot arms work around an animated conveyor belt. The scene includes an assembly floor, storage room, control room, and inspection/service room connected through doors and partitions.

## Current Features

- Two hierarchical robot arms with base, rotating waist, shoulder, elbow, wrist, and claw.
- Longer animated conveyor belt, moving production objects with wider spacing, staged robot pick/place cycles, inspection drone, scanner gate, reject/accept flow, and press machine.
- Larger multi-room factory layout with assembly floor, storage room, glass control room, and inspection/service room.
- Enclosed factory floor with walls, partitions, doors, wall panels, ceiling beams, pipes, vents, storage racks, pallets, barrels, tool carts, electrical cabinets, floor labels, floor drains, maintenance panels, loading zones, oil stains, guard rails, bollards, hazard stripes, ceiling lamps, cable trays, and control desk.
- Animated sliding doors, facility minimap navigation, and an autonomous transport cart moving on a marked AGV road around the factory.
- Directional light, hemisphere light, ceiling lights, emissive indicators, and toggleable factory lamps.
- Procedural floor, wall, conveyor, hazard, label, scuff, and bump-style textures generated in JavaScript.
- User controls for pause/resume, day/night mode, lamp toggle, machine line toggle, scanner toggle, drone toggle, robot speed toggle, camera views, room navigation, minimap navigation, walk mode, orbit controls, and animation speed.

## Course Requirements Checklist

Every teammate should check their work against this list before pushing changes.

- Hierarchical models: the project must include at least one complex hierarchical model. Our main examples are the robot arms, built from parent-child parts: base, waist, shoulder, elbow, wrist, and claw.
- Lights and textures: the scene must include lights and different texture/material types. We currently use hemisphere, directional, point, and spot lights, plus procedural floor, wall, belt, hazard, label, metal, glass, emissive, and rough/metal materials.
- User interaction: the user must be able to interact with the scene. Current interactions include pause/resume, day/night mode, lamp toggle, machine line toggle, scanner visibility, drone visibility, robot speed control, camera presets, room navigation, minimap navigation, walk mode with keyboard controls, orbit controls, and animation speed.
- Animations: most objects should be animated, especially hierarchical models. Current animations include staged robot pick/place motion, conveyor movement, varied production objects, scanner quality feedback, press machine, scanner beam, drone tracking, propellers, sliding doors, autonomous transport cart, and light pulsing.
- Important rule: animations must be implemented by us in JavaScript. Do not import premade animations from online models.

## Team Contribution Rules

- When adding a model, add a short comment or README note explaining which requirement it supports.
- When adding animation, implement it in JavaScript and make sure it is visible during normal playback.
- When adding textures/materials, prefer meaningful differences such as metal, glass, rubber, emissive, floor, wall, hazard, label, or procedural canvas texture.
- Before pushing, run `node --check src/main.js` and open the scene locally.
- If tween.js is added later for smoother motion, document where it is used. It is suggested by the professor, but not required.

See `PROJECT_ROADMAP.md` for the full owner-by-owner roadmap and final delivery checklist.

## Suggested Team Split

- Hamza: factory environment, floor/walls, extra machines, textures.
- Marco: robot arm hierarchy and additional robot animations.
- Leo: conveyor belt, crates, drone, production objects.
- Edo: interactions, camera controls, UI, lighting controls, day/night mode, animation speed controls, scene polish, GitHub Pages setup, README, and final report.

## Task Roadmap

### Hamza - Factory Environment

- Milestone 1: improve the factory layout with clearer zones for conveyor, robot arms, scanner, press machine, and control desk.
- Milestone 2: add more environmental details such as wall pipes, ceiling beams, warning signs, storage shelves, barrels, vents, and safety barriers.
- Milestone 3: improve procedural textures for the floor, walls, metal panels, hazard stripes, and machine surfaces.
- Milestone 4: polish lighting placement and shadows so the scene feels like an enclosed industrial factory.
- Final check: make sure the environment supports the other teammates' models without blocking camera views or interactions.

Progress: Hamza's main environment/material pass is mostly complete. Factory zones, larger rooms, wall pipes, ceiling beams, vents, warning panels, storage racks, pallets, barrels, tool carts, electrical cabinets, maintenance panels, cable trays, floor drains, loading markings, service pads, oil stains, safety bollards, procedural scuff/bump textures, and wider shadow coverage have been added. Final visual QA should still check camera views for object intersections.

### Marco - Robot Arms and Hierarchical Animation

- Milestone 1: refine the existing robot arm hierarchy: base, waist, shoulder, elbow, wrist, claw, and visible joints.
- Milestone 2: create at least one more complex robot movement cycle, such as pick up, rotate, lower, release, and return.
- Milestone 3: add visual details to the robots, such as bolts, cables, hydraulic pistons, warning labels, and status lights.
- Milestone 4: make the two robot arms behave differently so they do not look like duplicated animations.
- Final check: document the hierarchy clearly for the final report, including which parent-child transformations are used.

Progress: Marco's robot hierarchy/detail pass is mostly complete. The robot arms now use staged JavaScript keyframe poses for approach, grip, lift, rotate, lower, release, and return. The models include base bolts, rotating rings, shoulder/elbow/wrist caps, hydraulic rods, local cables, nameplates, gripper pads, wrist lights, and stage lights. The main robot now synchronizes with a visible belt workpiece: the part waits on the belt, disappears when the claw closes, appears in the gripper, then reappears on the return area of the belt. The two robots use offset/mirrored cycles with different timing and placement.

### Leo - Conveyor, Drone, and Production Objects

- Milestone 1: improve the conveyor belt with rollers, side rails, supports, moving texture, and believable crate spacing.
- Milestone 2: create more production objects, such as crates, metal parts, assembled products, rejected objects, or battery modules.
- Milestone 3: improve the drone model with better propellers, body details, sensor light, and inspection animation.
- Milestone 4: connect the conveyor objects with the machines, for example scanner checks crates, press machine stamps them, robot arms pick them.
- Final check: make sure all production objects animate smoothly and remain synchronized with the belt.

Progress: Leo's production-flow pass is mostly complete. The line now includes varied production objects, battery modules, chassis parts, finished units, rejected parts, accept/reject bins, scanner status feedback, and a quadcopter-style drone with a real patrol/inspection cycle. The drone moves between scanner, belt, press, accept/reject, and control zones, dips over selected items, pulses a scan beam/ring, and changes status lights during inspection.

### Edo - Interaction, UI, Deployment, and Report

- Milestone 1: improve the control panel with buttons/sliders for animation speed, camera views, lights, day/night mode, and machine toggles.
- Milestone 2: add more interactions, such as selecting camera presets, starting/stopping individual machines, changing robot speed, and toggling scanner/drone visibility.
- Milestone 3: improve user feedback with status labels, active/inactive states, and clear visual changes when controls are used.
- Milestone 4: set up GitHub Pages, test the project online, and keep the README updated with the live link and usage instructions.
- Milestone 5: lead the final report/user manual with screenshots, project description, libraries used, technical explanation, interactions, and team contributions.
- Final check: test the full project from a fresh browser tab and confirm it works without local-only files.

Progress: Edo's interaction polish pass is in progress. Added machine line toggle, scanner visibility toggle, drone visibility toggle, robot speed toggle, and clearer active/inactive button states.

## Run Locally

Use a local web server from this folder:

```bash
python -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

Walk mode controls:

- `W` / `ArrowUp`: move forward
- `S` / `ArrowDown`: move backward
- `A` / `D`: strafe left/right
- `Q` / `E` or left/right arrows: turn
- `Shift`: walk faster

## Libraries

- Three.js, loaded from the official npm CDN through an import map.
- OrbitControls from the Three.js examples package.

## Next Steps

- Add fine details to the robot arms, such as bolts, cables, hydraulic pistons, and labels.
- Do one final collision/clearance pass from all camera views and walk mode.
- Add sound-free visual feedback for successful assembly steps.
- Expand the documentation into the required technical report and user manual.
