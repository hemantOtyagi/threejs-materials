import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import * as dat from "dat-gui";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//creating a instance for loading the texture using THREE.TextureLoader
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
//const colorTexture = textureLoader.load("./public/gradients/5.jpg");
const colorTexture = textureLoader.load("./public/door/color.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "./public/door/ambientOcclusion.jpg",
); //Texture for the shadows
const doorHeightTexture = textureLoader.load("./public/door/height.jpg");
const doorNormalTexture = textureLoader.load('../public/door/normal.jpg');
const doorAplhaMapTexture = textureLoader.load('../public/door/alpha.jpg');
const enviromentMapTexture = cubeTextureLoader.load([
  '../public/environmentMaps/0/px.jpg',
  '../public/environmentMaps/0/nx.jpg',
  '../public/environmentMaps/0/py.jpg',
  '../public/environmentMaps/0/ny.jpg',
  '../public/environmentMaps/0/pz.jpg',
  '../public/environmentMaps/0/nz.jpg',
]) 

//creating a scene
const scene = new THREE.Scene();

//*
//Debug ui
//*

const gui = new dat.GUI(); //instantciating a object using dat.GUI class

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
//const material = new THREE.MeshLambertMaterial(); // this material will react to light

//Now we using the fourth material which is called MeshPhongMaterial
//const material = new THREE.MeshPhongMaterial(); //this material is similar to the MeshLambertMaterial but the strange pattern is less visible and you can also see the light reflection
//material.shininess = 1000; //we can controls the light reflection with shininess and the color of this reflection with specular
//material.specular = new THREE.Color(0x1188ff);

//Now we are using fifth material which is called MeshToonMaterial
//const material = new THREE.MeshToonMaterial(); // this is similar with the MeshLambertMaterial but with a cartoonish

//Now we are using sixth material which is called MeshStandardMaterial
const material = new THREE.MeshStandardMaterial(); //MeshStandardMaterial uses physically based rendering principles(PBR) it supports lights but with a more realistic algorithm and better parameters like roughness and metal-ness

material.gradientMap = colorTexture; //to add more steps to the coloration, you can use the gradientMap property and use the gradient texture
//We see a gradient instead of a clear sepration because the gradient is small and the magFilter tries to fix it with mipmapping
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;
colorTexture.generateMipmaps = false;

//using the gui instance of the dat.GUI to add controls
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "aoMapIntensity").min(1).max(20).step(0.5);
gui.add(material, "displacementScale").min(0).max(1).step(0.005);

//*
//Map
//*

//Alsoo map allow you to add textures on the material using material.map property
//aoMap("ambient occlusion map") will add shadows  where the texture is dark
//UV-Coordinates  two-dimensional (2D) references that specify where to apply textures to 3D models.
//material.roughness = 0.45; // add roughness to the material
//material.metalness = 0.65; // also add some metallicity to the material
//material.map = colorTexture;
//material.aoMap = ambientOcclusionTexture;
//material.aoMapIntensity = 5;
//material.displacementMap = doorHeightTexture;
//material.normalMap = doorNormalTexture;
//material.normalScale.set(0.5, 0,5);
//material.transparent = true;
//material.alphaMap = doorAplhaMapTexture;
material.envMap = enviromentMapTexture;
material.roughness = 0.2; // add roughness to the material
material.metalness = 0.7; // also add some metallicity to the material


//*
//Lights:
//*

//adding ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

//adding pointLight to the scene
const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.x = 1;
pointLight.position.y = 1;
pointLight.position.z = 2;
scene.add(pointLight);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2),
); //setting up the uv2 attribute to the plane geometry using its uv parameters
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2),
); //setting up the uv2 attribute to the sphere geometry using its uv parameters
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material,
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2),
); //setting up the uv2 attribute to the torus geometry using its uv parameters

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
  requestAnimationFrame(animate); //call the function for the next frame
}
animate();

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Update objects
  sphere.rotation.x = elapsedTime * 0.05;
  torus.rotation.x = elapsedTime * 0.05;
  plane.rotation.x = elapsedTime * 0.05;

  sphere.rotation.y = elapsedTime * 0.05;
  torus.rotation.y = elapsedTime * 0.05;
  plane.rotation.y = elapsedTime * 0.05;

  //Update controls
  controls.update();

  //render
  renderer.render(scene, camera);

  //call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
