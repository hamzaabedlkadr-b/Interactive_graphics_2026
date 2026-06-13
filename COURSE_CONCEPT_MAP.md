# Course Concept Map

This file maps the professor's slide decks in `../sldes` to concrete evidence in the robot factory project. Use it as the source for the final presentation and report.

## Strong Concepts Already Demonstrated

| Course slide topic | Project evidence | Where it appears |
| --- | --- | --- |
| 3D transformations | Parent-child transforms, translation, rotation, scale, animated pivots | Robot arms, doors, drone rotors, AGV, technician |
| Camera/view/projection | Perspective camera, OrbitControls, camera presets, room navigation, walk mode | UI controls and room map |
| GPU/WebGL pipeline | Three.js WebGLRenderer, canvas rendering, vertex/fragment shader through ShaderMaterial | Main renderer and operator jacket shader |
| Surfaces and polygonal models | Built from mesh primitives plus one manual triangulated BufferGeometry exhibit | Factory objects and `TRI MESH` inspection table |
| Triangular meshes | Manual position buffer, UV buffer, index buffer, computed vertex normals, wireframe overlay | `createTriangulatedPrototype` |
| Raster images and alpha | Canvas textures, transparent glass, emissive screens, opacity/depth handling | Procedural textures and glass rooms |
| Texture mapping | UV textures, repeat wrapping, stripe/checker/label/fabric/skin/helmet textures | Floor, walls, belt, hazard stripes, labels, technician |
| Textures on GPU | CanvasTexture objects uploaded to GPU, sampler use in custom shader, texture repeat/filtering | Materials and operator jacket shader |
| Shading models | Standard/Physical materials, roughness/metalness, diffuse/specular response, emissive surfaces | Metal robots, glass booth, lamps, screens |
| Custom shader logic | Texture sampling, diffuse light term, view-dependent rim term | `operatorJacket` ShaderMaterial |
| Shading transformations | World normals and view direction are used in the custom shader; manual mesh computes normals | Operator jacket and `TRI MESH` normal rods |
| Lights | Hemisphere, directional, point, and spot lights | Factory lighting, ceiling lamps, inspection lamp |
| Shadows | PCF soft shadow maps, cast/receive shadow setup, widened shadow camera | Robots, walls, machines, floor contact |
| Rendering algorithms | Real-time rasterization with depth testing and antialiasing | Three.js/WebGL renderer |
| Sampling / antialiasing | Renderer antialiasing and capped device pixel ratio; texture mip/filtering through Three.js | Renderer setup |
| Keyframe animation | Authored robot pose interpolation with smoothStep easing | Robot pick/place cycle |
| Procedural animation | Time-based conveyor, scanner, drone, AGV, doors, lights, technician idle motion | Main animation loop |
| Hierarchical/skeletal idea | Articulated structures made from joints and child groups | Robot arms and technician |
| Physics-based animation | Semi-implicit Euler mass-spring cable with gravity, damping, wind, and floor collision | `SPRING SIM` hanging cable |
| Simulation state | Positions, velocities, forces, spring constraints, collision response | `updateMassSpringCable` |
| Three.js final considerations | Cameras, objects, lights, materials, textures, shadows, interactions, animations | Full application |

## Topics We Should Mention Carefully

| Topic | How to present it honestly |
| --- | --- |
| Ray tracing | We do not implement full ray tracing. We use WebGL rasterization, shadow mapping, transparent/physical materials, and reflections/specular materials as real-time approximations. |
| Path tracing / Monte Carlo sampling | Not implemented directly because it is expensive for an interactive browser scene. We can mention antialiasing and texture filtering as sampling-related real-time techniques. |
| Full rigid-body physics | We do not use a full physics engine. The mass-spring cable is our small custom physics simulation. The AGV and production line use authored/collision-inspired logic. |
| Cloth/fluid simulation | Not implemented. The mass-spring cable is the reasonable lightweight simulation example for this project scope. |
| Advanced mesh import/modeling | We do not import models; all geometry is authored in JavaScript using Three.js primitives and one manual BufferGeometry mesh. |

## Best Remaining Upgrades

1. Add a short final report/user manual with screenshots and this concept map.
2. Add GitHub Pages and put the live link in the README.
3. Add local vendored Three.js files if the professor insists that libraries must be included in the repository.
4. Add one reflection/environment-map example if there is time, then present it as a rasterization-friendly reflection approximation rather than ray tracing.
5. Run final visual QA from every camera view and walk mode.

