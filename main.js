import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Sizes 

const size ={
  width:window.innerWidth, 
  height:window.innerHeight
}

// Canvas
const canvas = document.querySelector("#canvas");
canvas.width = size.width
canvas.height = size.height

// Scene, Camere, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  59,
  size.width / size.height,
  0.1,
  100
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(size.width, size.height);
document.body.appendChild(renderer.domElement);
// Controls
const controls = new OrbitControls(camera, renderer.domElement);
// Light
const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);
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


// Animation Loop
let startTimeStamp = Date.now();

function animate() {
  const endTimeStamp = Date.now();
  const elapsedTime = endTimeStamp - startTimeStamp;
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(window.devicePixelRatio);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Page Resizer
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  })
