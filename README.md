# Robot Factory Assembly Line

Interactive Graphics course project starter.

## Theme

The project is an interactive robot factory where hierarchical robot arms work around an animated conveyor belt. The scene is designed to satisfy the course requirements with complex hierarchical models, multiple lights, procedural textures, user interaction, and JavaScript-authored animations.

## Current Features

- Two hierarchical robot arms with base, rotating waist, shoulder, elbow, wrist, and claw.
- Animated conveyor belt, moving crates, robot arm cycles, inspection drone, scanner gate, and press machine.
- Enclosed factory floor with walls, wall panels, ceiling beams, pipes, vents, storage racks, barrels, guard rails, hazard stripes, ceiling lamps, cables, and control desk.
- Directional light, hemisphere light, ceiling lights, emissive indicators, and toggleable factory lamps.
- Procedural floor, wall, conveyor, and hazard textures generated in JavaScript.
- User controls for pause/resume, day/night mode, lamp toggle, camera views, and animation speed.

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

Progress: factory zones, wall pipes, ceiling beams, vents, warning panels, storage racks, barrels, service markings, and extra safety details have been added.

### Marco - Robot Arms and Hierarchical Animation

- Milestone 1: refine the existing robot arm hierarchy: base, waist, shoulder, elbow, wrist, claw, and visible joints.
- Milestone 2: create at least one more complex robot movement cycle, such as pick up, rotate, lower, release, and return.
- Milestone 3: add visual details to the robots, such as bolts, cables, hydraulic pistons, warning labels, and status lights.
- Milestone 4: make the two robot arms behave differently so they do not look like duplicated animations.
- Final check: document the hierarchy clearly for the final report, including which parent-child transformations are used.

### Leo - Conveyor, Drone, and Production Objects

- Milestone 1: improve the conveyor belt with rollers, side rails, supports, moving texture, and believable crate spacing.
- Milestone 2: create more production objects, such as crates, metal parts, assembled products, rejected objects, or battery modules.
- Milestone 3: improve the drone model with better propellers, body details, sensor light, and inspection animation.
- Milestone 4: connect the conveyor objects with the machines, for example scanner checks crates, press machine stamps them, robot arms pick them.
- Final check: make sure all production objects animate smoothly and remain synchronized with the belt.

### Edo - Interaction, UI, Deployment, and Report

- Milestone 1: improve the control panel with buttons/sliders for animation speed, camera views, lights, day/night mode, and machine toggles.
- Milestone 2: add more interactions, such as selecting camera presets, starting/stopping individual machines, changing robot speed, and toggling scanner/drone visibility.
- Milestone 3: improve user feedback with status labels, active/inactive states, and clear visual changes when controls are used.
- Milestone 4: set up GitHub Pages, test the project online, and keep the README updated with the live link and usage instructions.
- Milestone 5: lead the final report/user manual with screenshots, project description, libraries used, technical explanation, interactions, and team contributions.
- Final check: test the full project from a fresh browser tab and confirm it works without local-only files.

## Run Locally

Use a local web server from this folder:

```bash
python -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

## Libraries

- Three.js, loaded from the official npm CDN through an import map.
- OrbitControls from the Three.js examples package.

## Next Steps

- Add more complex factory details and 3D models.
- Add a second robot arm or machine station.
- Add sound-free visual feedback for successful assembly steps.
- Expand the documentation into the required technical report and user manual.
