import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Sizes

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector("#canvas");
canvas.width = size.width;
canvas.height = size.height;

// Scene, Camere, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  59,
  size.width / size.height,
  0.1,
  100
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(size.width, size.height);
document.body.appendChild(renderer.domElement);
// Controls
const controls = new OrbitControls(camera, renderer.domElement);
// Light
const light1 = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light1);
const light2 = new THREE.PointLight(0xffffff, 1, 100);
light2.position.set(0, 2, 6);
scene.add(light2);


// Update Camera
camera.position.z = 3;
// Add Cube
const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const cube = new THREE.Mesh(box, material);
scene.add(cube);

const loader = new GLTFLoader();

loader.load(
  "can-demo.glb",
  function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.scale.x = 10;
    gltf.scene.scale.y = 10;
    gltf.scene.scale.z = 10;

    // window.addEventListener("click", (e)=>{
    //   gltf.scene.position.x+=1

    // })
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Animation Loop
let startTimeStamp = Date.now();

function animate() {
  const endTimeStamp = Date.now();
  const elapsedTime = endTimeStamp - startTimeStamp;
  requestAnimationFrame(animate);
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(window.devicePixelRatio);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Page Resizer
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// GUI
const gui = new dat.GUI();
gui.add(camera.position, "x").name("cameraPX");
gui.add(camera.position, "y").name("cameraPY");
gui.add(camera.position, "z").name("cameraPZ");
