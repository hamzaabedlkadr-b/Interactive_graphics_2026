# Robot Factory Assembly Line - Project Summary

## Project Theme

We built an interactive multi-room robot factory for the Interactive Graphics course. The scene represents a robot assembly line where production objects move on a conveyor, robot arms perform pick-and-place operations, a drone inspects and carries samples, and an AGV cart transports cargo around the factory.

The project is implemented with Three.js and JavaScript. All models and animations are authored in code; no premade animated models are imported.

## Team Order and Responsibilities

1. Hamza: factory environment, rooms, floor/walls, extra machines, textures, lighting, spacing, and overall realism.
2. Marco: robot arm hierarchy, robot details, and purposeful pick/place robot animations.
3. Leo: conveyor belt, crates, drone, production objects, scanner/press flow, and moving production details.
4. Edo: interactions, camera controls, UI controls, room navigation, README, roadmap, final notes, and project polish.

## Main Features Implemented

- Multi-room factory layout with assembly, storage, control, and inspection/service areas.
- Large enclosed factory floor with wall panels, partitions, door frames, glass walls, pipes, ceiling beams, vents, warning panels, maintenance panels, cable trays, safety bollards, floor drains, oil stains, loading zones, and floor labels.
- Animated conveyor belt with rollers, rails, supports, moving belt texture, varied production objects, scanner station, press machine, accept/reject behavior, and better object spacing.
- Two detailed hierarchical robot arms with base, rotating waist, shoulder, elbow, wrist, and claw/gripper parts.
- Purposeful robot animation cycle: approach object, close claw, lift, rotate, place/release, and return.
- Visible robot workpiece logic: the picked object disappears from the belt, appears in the gripper, then reappears at a separate side drop position.
- Quadcopter-style drone with body, arms, propellers, sensor beam, scan ring, status lights, cargo clamp, cargo pickup, carry, and return sequence.
- AGV transport cart moving on a marked road around the factory perimeter, with load/drop cargo states so it does not just drive through the scene empty.
- Control-room technician character with hierarchical body/head/arms/legs/tablet parts, procedural skin/helmet/fabric textures, and animated idle/tablet motion.
- User controls for pause/resume, speed, day/night mode, lamp toggle, machine toggle, scanner toggle, drone toggle, robot speed toggle, camera presets, room navigation, minimap navigation, walk mode, and orbit controls.
- Improved camera presets and room views so the project can be presented from useful angles.
- README, team notes, roadmap, and this project summary documenting features, responsibilities, and course requirement coverage.

## Course Requirements Covered

### Hierarchical Models

- Robot arms are the main complex hierarchical models.
- Each robot uses parent-child transformations for base, waist, shoulder, elbow, wrist, gripper, claw pads, lights, cables, pistons, and labels.
- The control-room technician is another hierarchical model with body, head, shoulder pivots, forearm pivots, leg pivots, helmet, tablet, and accessories.
- Drone and AGV also use grouped sub-parts, such as drone body/arms/rotors/cargo and AGV body/wheels/cargo.

### Lights and Textures

- Lights include hemisphere light, directional light, ceiling point lights, spot lamp, and emissive machine indicators.
- Procedural textures are generated in JavaScript using canvas textures.
- Texture/material examples include floor checker/scuff texture, wall panel texture, conveyor stripe texture, hazard stripe texture, labels, fabric texture, fabric bump texture, skin texture, helmet texture, glass material, metal materials, rubber materials, emissive materials, and oil/glass transparency.
- The technician jacket uses a custom shader with texture sampling, diffuse lighting, and rim shading to demonstrate implemented shading logic.

### User Interaction

- Users can pause/resume the scene.
- Users can change animation speed.
- Users can toggle day/night mode and factory lamps.
- Users can toggle machines, scanner visibility, drone visibility, and robot speed.
- Users can switch camera presets.
- Users can navigate between assembly, storage, control, and inspection rooms.
- Users can use walk mode with keyboard controls.
- Users can use orbit controls to inspect the scene.

### Animations

- Conveyor belt movement is animated with moving texture offsets.
- Production objects move along the belt and react near scanner/press/reject zones.
- Robot arms use JavaScript-authored staged motion, not imported animation.
- Drone patrols, tracks objects, scans, dips toward pickup/return points, spins propellers, carries cargo, and changes status lights.
- AGV follows a road path and changes cargo visibility at load/drop points.
- Sliding doors animate when room navigation changes.
- Ceiling lights pulse slightly.
- The technician has idle body, head, arm, leg, and tablet motion.

## Files Updated During the Project

- `index.html`: main page structure, canvas, HUD, controls, room navigation, and labels.
- `src/main.js`: full Three.js scene, geometry, materials, procedural textures, lighting, animation loop, interactions, camera/room logic, robot/drone/AGV behavior, and technician model.
- `src/styles.css`: UI layout, responsive controls, HUD, room map, active/inactive states, and mobile control polish.
- `README.md`: project description, feature list, course checklist, team split, run instructions, and progress notes.
- `TEAM_NOTES.md`: shared team rules, current coverage, responsibilities, and pre-push checklist.
- `PROJECT_ROADMAP.md`: owner-by-owner roadmap, done criteria, remaining checks, and final presentation story.
- `COURSE_SLIDES_NOTES.md`: local notes connecting the project to the course slides and requirements.
- `PROJECT_SUMMARY.md`: this final overview file.

## How to Run Locally

From the project folder:

```bash
python -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

## Suggested Presentation Flow

1. Start with the assembly room and explain the robot factory theme.
2. Show the conveyor, varied production objects, scanner, press, and accept/reject flow.
3. Focus on the robot arm hierarchy and explain the parent-child transforms.
4. Show the robot pick/place cycle and how the object transfers from belt to gripper to side drop.
5. Show the drone scanning, pickup, carry, and return cycle.
6. Show the AGV road and cargo load/drop behavior.
7. Move to the control room and show the textured technician as the extra shading/texture/hierarchy example.
8. Toggle night/lamp/machines/scanner/drone/robot speed to demonstrate interactions.
9. Explain the procedural textures, lights, shadows, glass, metal, rubber, emissive materials, and custom jacket shader.
10. End by summarizing team contributions and confirming the four main requirements: hierarchical models, lights/textures, user interaction, and JavaScript-authored animations.

## Current Validation

- `node --check src/main.js` passes.
- The local server responds at `http://127.0.0.1:5173`.
- Latest pushed commit before this summary: `a207d6d Add textured control room operator`.

