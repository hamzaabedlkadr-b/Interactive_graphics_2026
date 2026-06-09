# Team Notes

Please read this before adding project work.

## Must-Follow Course Requirements

- Hierarchical models: we need at least one complex model made from parent-child parts. The robot arms are our main hierarchical models.
- Lights and textures: we need lights and different texture/material types. Keep adding meaningful materials, not only plain colors.
- User interaction: the user must be able to control parts of the scene, such as lights, room navigation, camera, animation, speed, or machine states.
- Animations: most objects should move. Robot arms must animate using their hierarchy.
- Do not import animations. All animations must be written by us in JavaScript.

## Current Coverage

- Hierarchical models: two robot arms.
- Lights: hemisphere, directional, ceiling point lights, spot lamp, emissive indicators.
- Textures/materials: procedural floor, wall, belt, hazard, labels, metal, glass, rubber, emissive materials.
- Interactions: pause/resume, day/night, lamp toggle, machine line toggle, scanner visibility, drone visibility, robot speed toggle, room navigation, minimap navigation, walk mode, camera presets, speed slider, orbit camera.
- Animations: staged robot pick/place cycles, conveyor, varied production objects, scanner quality feedback, press machine, scanner beam, drone item tracking, propellers, sliding doors, autonomous transport cart, light pulsing.

## Responsibilities

- Hamza: environment, floor/walls, extra machines, textures, room scale, and spacing cleanup. Keep enough clearance around robots, conveyor objects, drone path, and doors.
- Marco: robot arm hierarchy and additional robot animations.
- Leo: conveyor belt, crates, drone, production objects.
- Edo: interactions, camera controls, UI, GitHub Pages, README, and final report.

## Before Pushing

- Check `PROJECT_ROADMAP.md` and make sure your change moves one roadmap item forward.
- Run `node --check src/main.js`.
- Open `http://localhost:5173`.
- Make sure your change is visible.
- Check that robot claws, conveyor objects, drone, doors, and bins are not visually passing through each other.
- Update README or final report notes if your work affects requirements.
