HeartQuest 3D Models

This folder contains lightweight placeholder models (OBJ) that you can use immediately or replace with high‑quality assets later.

Included placeholders
- avatar_lowpoly.obj: blocky avatar stand‑in
- car_lowpoly.obj: simple car proxy mesh
- palm_lowpoly.obj: stand‑in palm (stacked blocks)

Usage in Three.js (GLTF recommended for production)
- You can load OBJ via THREE.OBJLoader (from examples). For production, prefer glTF (.glb/.gltf) with PBR materials.

Example (OBJ):
// <script src="https://unpkg.com/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>
const loader = new THREE.OBJLoader();
loader.load('assets/models/car_lowpoly.obj', (obj) => {
  obj.traverse(c=>{ if(c.isMesh){ c.material = new THREE.MeshLambertMaterial({color:0xFF0000}); }});
  obj.position.set(0,0,0);
  scene.add(obj);
});

Notes
- Replace these with proper GLB models when available.
- Keep polygon counts low for mobile performance.

