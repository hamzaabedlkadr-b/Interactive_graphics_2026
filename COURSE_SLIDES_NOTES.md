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

## Course Topics Now Visible In The Project

- 3D transformations: robot arm joint hierarchy, sliding doors, drone rotors, AGV path, camera presets, room navigation, and walk mode.
- GPU/WebGL pipeline: Three.js `WebGLRenderer`, canvas rendering, device-pixel-ratio handling, antialiasing, shadow maps, and GLSL through `ShaderMaterial`.
- Surfaces and triangle meshes: the new `TRI MESH` table uses manual `BufferGeometry` with positions, UVs, indices, wireframe overlay, vertex markers, and normal rods.
- Texture mapping: procedural `CanvasTexture` objects are mapped onto floor, walls, belt, hazard stripes, labels, fabric, skin, helmet, and the new mesh exhibit.
- Textures on GPU: texture repeat wrapping, texture offsets on the moving belt, and sampler usage inside the operator jacket shader.
- Shading: standard/physical materials for metal, rubber, glass, emissive screens, and the custom operator jacket shader with texture sampling, diffuse lighting, and rim shading.
- Normal handling: `computeVertexNormals()` on the manual mesh and transformed world normals in the custom shader.
- Lighting: hemisphere, directional, point, spot, and emissive lights with day/night and lamp toggles.
- Shadows/reflections: PCF soft shadow mapping, cast/receive shadows, transparent glass, and specular/roughness material behavior.
- Rendering/rasterization: real-time WebGL rasterization, depth testing, antialiasing, transparency handling, and tone mapping.
- Animation: authored keyframe interpolation for robot poses, procedural animation for drones/conveyor/doors/AGV/technician, and no imported animations.
- Physics-based animation: the new `SPRING SIM` cable uses particles, velocities, spring forces, damping, gravity, semi-implicit Euler integration, and simple collision response.
- Three.js final considerations: the project demonstrates cameras, objects, materials, textures, lights, shadows, animations, and user interaction in one browser scene.

## Topics To Mention As Not Fully Implemented

- Ray tracing and path tracing are not directly implemented; the project uses the real-time rasterization path in Three.js.
- Full rigid-body, cloth, or fluid simulation is not implemented; the mass-spring cable is the lightweight physics/simulation example.
- Imported mesh/model workflows are not used because the project intentionally authors geometry and animation in JavaScript.

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
