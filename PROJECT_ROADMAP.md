# Robot Factory Project Roadmap

This roadmap defines what still needs to be done before final delivery. Every task should support at least one course requirement: hierarchical models, lights/textures, user interaction, or JavaScript-authored animations.

## Priority Order

1. Fix visible realism problems:
   Robot hands, belt objects, drone path, bins, doors, and machines must not visibly pass through each other.

2. Improve course-concept evidence:
   The scene should clearly demonstrate hierarchical transforms, procedural/repeated textures, shading/material differences, shadows, keyframe animation, and interaction.

3. Polish usability:
   Camera views, walk mode, UI states, and room navigation should be easy to understand during the presentation.

4. Prepare final delivery:
   GitHub Pages, README, final report, screenshots, and contribution explanation must be ready.

## Hamza - Factory Environment, Materials, and Realism

### Required Tasks

- Expand and polish room details: add more believable walls, door frames, floor markings, warning signs, shelves, vents, pipes, maintenance panels, and service areas.
- Improve materials/textures: add more procedural texture variation for floor, wall panels, metal, rubber, and hazard zones.
- Improve lighting/shadows: make important machines cast visible shadows and make objects feel grounded.
- Run a final spacing pass: check that robots, conveyor, drone, crates, bins, carts, and doors have enough clearance.

### Course Concepts Covered

- 3D transformations for room layout and repeated structural objects.
- Procedural/repeated textures from the texture slides.
- Shading/material differences from the shading slides.
- Shadow mapping/contact perception from the shadows slides.

### Done Means

- The factory no longer feels empty or randomly placed.
- At least three different procedural textures/material styles are visible.
- Objects look grounded with shadows.
- No obvious object intersections from the main camera views.

### Current Status

- Mostly complete after the environment/material pass.
- Added procedural floor/wall scuffs, bump-style material detail, maintenance panels, floor drains, cable trays, loading markings, concrete service pads, safety bollards, and wider directional-light shadow coverage.
- Added a marked AGV road and rerouted the autonomous cart around the open factory perimeter so it does not pass through the conveyor or room walls.
- Added AGV load/drop docks and cargo visibility states so the cart visibly receives a crate, carries it, unloads it, and returns with cargo again.
- Added a marked `ROBOT CLEAR` lane and moved the inspection wall, scanner, press, rear robot, and background props farther from the conveyor so the robot/belt interaction is easier to see.
- Remaining check: final visual QA from every camera view and walk mode after Marco/Leo/Edo finish their parts.

## Marco - Robot Hierarchy and Robot Animation

### Required Tasks

- Add robot arm details: pistons, cables, bolts, joint caps, labels, and status lights.
- Make the grippers look and behave like industrial robot hands.
- Improve pick/place animation alignment: approach object, close claw, lift, rotate, place, release, return.
- Make the two robot arms visually different in timing, position, and purpose.

### Course Concepts Covered

- Hierarchical model using parent-child transforms.
- 3D rotations around joints.
- Keyframe interpolation and smooth animation.
- Authored JavaScript animation, not imported animation.

### Done Means

- A viewer can clearly explain the robot hierarchy: base, waist, shoulder, elbow, wrist, gripper.
- The claw does not pass through the belt or objects in normal views.
- The pick/place sequence has a visible purpose.
- The report can include a diagram or paragraph explaining the hierarchy.

### Current Status

- Mostly complete after the robot hierarchy/detail pass.
- Added base rings, bolts, joint caps, hydraulic rods, local cables, warning details, nameplates, stage lights, wrist lights, and industrial gripper details.
- Improved the authored JavaScript keyframe cycle so it reads as approach, close claw, lift, rotate, lower, release, and return.
- Added a synchronized belt workpiece so the robot visibly picks from the conveyor and returns the part to the conveyor instead of only moving an empty hand.
- Remaining check: final visual QA from the main camera views to confirm gripper/belt clearance after Leo's production-flow updates.

## Leo - Conveyor, Drone, Production Flow, and Objects

### Required Tasks

- Improve conveyor realism: rollers, rails, belt texture, supports, bins, scanner station, reject lane, and production spacing.
- Improve production objects: crates, batteries, chassis, finished units, rejected units should look distinct and detailed.
- Improve drone behavior: recognizable quadcopter shape, propellers, sensor beam, patrol/tracking movement, and safe height.
- Connect object flow to machines: scanner checks, press stamps, robot picks/places, reject/accept bins receive items.

### Course Concepts Covered

- Animation loops and time-based movement.
- Procedural/repeated texture for belt and hazard areas.
- Simple collision/simulation-inspired behavior for reject/accept flow.
- Shading/material differences for glass, metal, rubber, emissive lights, and plastic.

### Done Means

- Belt objects are not simple cubes.
- The drone is immediately recognizable.
- Moving objects are spaced correctly and do not overlap badly.
- The production line tells a clear story: raw part, inspection, processing, accept/reject.

### Current Status

- Mostly complete after the production-flow/drone pass.
- Added a real drone patrol route across scanner, belt, press, accept/reject, and control zones.
- Drone now dips during inspection, follows selected items, pulses a scan beam/ring, tilts while moving, and changes status lights for normal/reject inspection.
- Remaining check: final visual QA to ensure drone beam/ring does not hide important robot or conveyor details in the main camera views.

## Edo - Interaction, UI, Camera, Deployment, and Report

### Required Tasks

- Improve UI states: active/inactive buttons should clearly show current state.
- Add/verify controls: pause, speed, day/night, lights, machines, scanner, drone, robot speed, camera views, room navigation, walk mode.
- Polish camera views: each camera should show a useful room or machine angle without blocking UI.
- Set up GitHub Pages and verify the online version from a fresh browser.
- Lead final report: project description, course concepts, implementation details, controls, screenshots, team contributions, known limitations.

### Course Concepts Covered

- User interaction.
- Camera/view transformations.
- Scene presentation and Three.js final considerations.
- Documentation of lights, textures, hierarchy, and animations.

### Done Means

- A user can explore the whole factory without code knowledge.
- UI buttons accurately match the scene state.
- GitHub Pages link works.
- Final report is 5-10 pages and includes screenshots plus technical explanations.

## Global Quality Checklist

- `node --check src/main.js` passes.
- Project opens from a local web server.
- GitHub Pages opens from a fresh browser.
- Main camera views show no major object intersections.
- Walk mode can move between rooms without getting visually trapped.
- All required course topics are visible in the project.
- README explains how to run and use the project.
- Final report explains team contributions and course concepts.
- No imported animations are used.

## Suggested Final Presentation Story

1. Start in assembly room and show the conveyor/object flow.
2. Show robot hierarchy and pick/place animation.
3. Toggle lights/night mode and explain materials/shadows/textures.
4. Show scanner/drone/accept-reject behavior.
5. Walk between rooms and use camera/room controls.
6. End by explaining how each teammate contributed and which course requirements are satisfied.
