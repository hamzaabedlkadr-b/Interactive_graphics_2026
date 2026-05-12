# Robot Factory Assembly Line

Interactive Graphics course project starter.

## Theme

The project is an interactive robot factory where hierarchical robot arms work around an animated conveyor belt. The scene is designed to satisfy the course requirements with complex hierarchical models, multiple lights, procedural textures, user interaction, and JavaScript-authored animations.

## Current Features

- Two hierarchical robot arms with base, rotating waist, shoulder, elbow, wrist, and claw.
- Animated conveyor belt, moving crates, robot arm cycles, inspection drone, scanner gate, and press machine.
- Enclosed factory floor with walls, wall panels, guard rails, hazard stripes, ceiling lamps, cables, and control desk.
- Directional light, hemisphere light, ceiling lights, emissive indicators, and toggleable factory lamps.
- Procedural floor, wall, conveyor, and hazard textures generated in JavaScript.
- User controls for pause/resume, day/night mode, lamp toggle, camera views, and animation speed.

## Suggested Team Split

- Hamza: factory environment, floor/walls, extra machines, textures.
- Marco: robot arm hierarchy and additional robot animations.
- Leo: conveyor belt, crates, drone, production objects.
- Edo: interactions, camera controls, UI, lighting controls, day/night mode, animation speed controls, scene polish, GitHub Pages setup, README, and final report.

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
