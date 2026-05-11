# Robot Factory Assembly Line

Interactive Graphics course project prototype.

## Theme

The project is an interactive robot factory where a hierarchical robot arm works on an animated conveyor belt. The scene is designed to satisfy the course requirements with hierarchical models, lights, textures, user interaction, and JavaScript-authored animations.

## Current Features

- Hierarchical robot arm with base, rotating waist, shoulder, elbow, wrist, and claw.
- Animated conveyor belt, moving crates, robot arm cycle, and inspection drone.
- Directional light, hemisphere light, and toggleable factory lamp.
- Procedural color and stripe textures generated in JavaScript.
- User controls for pause/resume, day/night mode, lamp toggle, camera views, and animation speed.

## Suggested Team Split

- Person 1: factory environment, floor/walls, extra machines, textures.
- Person 2: robot arm hierarchy and additional robot animations.
- Person 3: conveyor belt, crates, drone, production objects.
- Person 4: interactions, camera controls, UI, README, and final report.

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
