import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";

const sizes = {
  width: 600,
  height: 800,
};

//creating a instance for loading the texture using THREE.TextureLoader
const textureLoader = new THREE.TextureLoader();
//const colorTexture = textureLoader.load("./public/gradients/5.jpg");
const colorTexture = textureLoader.load("./public/matcaps/3.png");

//creating a scene
const scene = new THREE.Scene();

//*
//Materials:
//*
//creating multiple objects using simple mesh basic material
//const material = new THREE.MeshBasicMaterial({
//map: colorTexture,  //here i combine both the texture and the color on the same Material using colorTexture  by map and color by Color class
//color: 0xff00ff,
//});

//we can also set the color of the meatrial using the Color class of three.js without defining it into the material itself
//material.color = new THREE.Color("pink");

//Now we are using the second metarial which is called MeshNormalMaterial
//const material = new THREE.MeshNormalMaterial();
//material.flatShading = true; // normal material property used to show the flat surface of the material

//Now we using the third material which is called MeshMatcapMaterial
//const material = new THREE.MeshMatcapMaterial(); //will display the color by using the normals as a reference to pick the right color on a texture that looks like a sphere
//material.matcap = colorTexture; //setting up my matcap texture to the matcap property
// NOTE -- by using matcap material with the matcap texture we get an the illusion that the object is being illuminated

//Now we are using the third material which is called MeshDepthMaterial
//const material = new THREE.MeshDepthMaterial(); //will simply color the geometry in white if its close to the near  and in black if its close to the far value of the camera

//Now we using the fourth material which is called MeshNormalMaterial
const material = new THREE.MeshLambertMaterial(); // this material will react to light

//*
//Lights:
//*
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

//adding pointLight to the scene
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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
  //updating the sizes of camera and renderer as the "resize" event triggers
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
