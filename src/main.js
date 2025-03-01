import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";

const sizes = {
  width: 600,
  height: 800,
};

//creating a scene
const scene = new THREE.Scene();

//creating multiple objects using simple mesh basic material
const material = new THREE.MeshBasicMaterial();

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material,
);
sphere.position.x = -1.5;
torus.position.x = 1.5;
scene.add(sphere, plane, torus);

//creating a camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000,
);
camera.position.z = 3;
scene.add(camera);

//creating a renderer
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.render(scene, camera);

//setting up the pixel ratio
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//adding orbital-controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//resizing the mesh as the window resizes
window.addEventListener("resize", () => {
  //updating the sizes object as the resize even triggers resize
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // updating the camera aspect ratio
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //updating the renderer size
  renderer.setSize(sizes.width, sizes.height);
});

function animate() {
  controls.update(); // Required for damping effect
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update objects
  sphere.rotation.x = elapsedTime * 0.5;
  torus.rotation.x = elapsedTime * 0.5;
  plane.rotation.x = elapsedTime * 0.5;

  sphere.rotation.y = elapsedTime * 0.5;
  torus.rotation.y = elapsedTime * 0.5;
  plane.rotation.y = elapsedTime * 0.5;

  //Update controls
  controls.update();

  //render
  renderer.render(scene, camera);

  //call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
