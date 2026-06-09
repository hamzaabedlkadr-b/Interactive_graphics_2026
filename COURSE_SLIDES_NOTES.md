# Course Slides Notes for the Robot Factory Project

These notes summarize the useful ideas from the course slides in `../sldes` and turn them into project actions.

## Slide Concepts We Should Show

- 3D transformations: robot arms, doors, drone propellers, carts, and cameras should clearly use translation, rotation, scale, and parent-child transforms.
- Textures and UV mapping: the project should show repeated procedural textures on the floor, walls, belt, hazard stripes, and labels.
- Textures on GPU: use `CanvasTexture`, repeat wrapping, and different material maps/roughness values so surfaces do not all look flat.
- Shading: use different material behavior for metal, rubber, glass, emissive lights, rough plastic, and glossy machine parts.
- Shadows and reflections: shadows should help show contact with the floor and object depth. Important machines should cast and receive shadows.
- Animation: use authored JavaScript keyframes/interpolation for robot pick/place, doors, conveyor flow, drone tracking, and machine cycles.
- Physics/simulation: add simple position/velocity or collision-inspired behavior where useful, such as bouncing warning lights, rejected items sliding into bins, or carts following paths.
- Three.js final considerations: the project should demonstrate cameras, objects, lights, materials, textures, shadows, and animations through a clear interactive scene.

## Best Upgrades To Do Next

1. Robot detail pass:
   Add pistons, cables, bolts, joint labels, and better gripper clearance so the hierarchical model is obvious.

2. Texture/material pass:
   Add procedural normal-like bump details using canvas textures, improve wall/floor roughness, and make metal/glass/rubber visually distinct.

3. Shadow/contact pass:
   Check that robots, crates, drone, shelves, and machines cast usable shadows. Objects should look grounded, not floating.

4. Animation clarity pass:
   Make each moving object follow a clear reason: pick, inspect, reject, press, transport, open door, or patrol.

5. Collision/spacing pass:
   Before each push, check the camera views and walk mode for robot hands, belt objects, bins, drone, and doors passing through each other.

6. Report evidence:
   In the final report, explicitly mention which course topics are demonstrated: hierarchical transforms, procedural textures, Phong/standard materials, shadow maps, keyframe interpolation, and user interaction.

