import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
import CannonDebugger from 'cannon-es-debugger'

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
controls.update()
// Light
const light1 = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light1);
const light2 = new THREE.PointLight(0xffffff, 1, 100);
light2.position.set(0, 2, 6);
scene.add(light2);

// Update Camera
camera.position.z = 10;
camera.position.y = 5;
camera.rotation.x = -25.50;


// Add Cube

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
  color: 0xFCC2FC,
  wireframe: true,
}));
scene.add(cube);

const starCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
}));
scene.add(starCube);

const loader = new GLTFLoader();
let can;
let star;
let itemSize = 15

loader.load(
  "can-demo.glb",
  function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.scale.x = itemSize;
    gltf.scene.scale.y = itemSize;
    gltf.scene.scale.z = itemSize;
    gltf.scene.position.copy(cube.position);
    gltf.scene.userData.name = "can";
    can = gltf.scene;
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

loader.load(
  "star.glb",
  function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.scale.x = 10;
    gltf.scene.scale.y = 10;
    gltf.scene.scale.z = 10;
    gltf.scene.userData.name = "star";
    star = gltf.scene;
  },
  undefined,
  function (error) {
    console.error(error);
  }
);




// Cannon Starter
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
});
world.defaultContactMaterial.contactEquationStiffness = 1e6
world.defaultContactMaterial.contactEquationRelaxation = 10
world.solver.iterations = 5


const cannonDebugger = new CannonDebugger (scene, world, {
  color:"#AEE2FF",
  scale: 1,
})

const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(),
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
world.addBody(groundBody)


const plane = new THREE.Mesh(new THREE.PlaneGeometry( 25, 25 ),new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} ) );
plane.rotation.x = Math.PI / 2;
scene.add( plane );

const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
const body = new CANNON.Body({
  mass: 1,
})
body.addShape(shape)
body.position.set(-2, 0, 0)
body.velocity.set(-5, 0, 0)
body.linearDamping = 0
world.addBody(body)

const shape1 = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
const body1 = new CANNON.Body({
  mass: 1,
})
body1.addShape(shape1)
body.position.set(2, 0, 0)
body.velocity.set(-5, 0, 0)
body.linearDamping = 0
world.addBody(body1)



// Animation Loop
let startTimeStamp = Date.now();

function animate() {
  const endTimeStamp = Date.now();
  const elapsedTime = endTimeStamp - startTimeStamp;
  requestAnimationFrame(animate);
  if (can != undefined) {
    can.position.copy(body.position);
    can.position.y = 0
  }
  if (star != undefined) {
    star.position.copy(body1.position);
    star.position.y = 0
  }
  // Cannon Game
  world.fixedStep();
  // world.step(1 / 60, deltaTime, 3);
  cannonDebugger.update()
  cube.position.copy(body.position)
  cube.quaternion.copy(body.quaternion)
  starCube.position.copy(body1.position)
  starCube.quaternion.copy(body1.quaternion)
  plane.position.copy(groundBody.position)
  plane.quaternion.copy(groundBody.quaternion)
  // Cannon Game End
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

window.addEventListener("keydown", (e)=>{
  console.log(e.key)
  if(e.key=="ArrowUp"){
    body.position.x+=0.01
  }
  if(e.key=="ArrowDown"){
    body.position.x-=0.01
  }
})

// GUI
const gui = new dat.GUI();
gui.add(camera.position, "x").name("cameraPX");
gui.add(camera.position, "y").name("cameraPY");
gui.add(camera.position, "z").name("cameraPZ");
