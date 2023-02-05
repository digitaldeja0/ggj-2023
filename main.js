import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { Material } from "three";

// Score and Timer
const timerDom = document.querySelector("#timer");
const scoreDom = document.querySelector("#score");

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
controls.update();
// Light
const light1 = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light1);
const light2 = new THREE.PointLight(0xffffff, 1, 100);
light2.position.set(0, 2, 6);
scene.add(light2);

// Update Camera
camera.rotation.x = -0.2;
camera.position.y = 3;
camera.position.z = 11;

// Add Cube

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0xfcc2fc,
    wireframe: true,
  })
);
scene.add(cube);

const cubebb = new THREE.Box3().setFromObject(cube);
const helper = new THREE.Box3Helper(cubebb, 0xffff00);
scene.add(helper);

// Add Star Box
const starCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  })
);
scene.add(starCube);

const starCubebb = new THREE.Box3().setFromObject(starCube);
const helper2 = new THREE.Box3Helper(starCubebb, 0xffff00);
scene.add(helper2);

const loader = new GLTFLoader();
let can;
let star;
let itemSize = 15;
let girl;

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

loader.load(
  "tree-sm.glb",
  function (gltf) {
    girl = gltf.scene;
    scene.add(gltf.scene);
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
world.defaultContactMaterial.contactEquationStiffness = 1e6;
world.defaultContactMaterial.contactEquationRelaxation = 10;
world.solver.iterations = 5;

const cannonDebugger = new CannonDebugger(scene, world, {
  color: "#AEE2FF",
  scale: 1,
});

const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
world.addBody(groundBody);

const GROUP1 = 1;
const GROUP2 = 2;
const GROUP3 = 4;

const groundTexture = new THREE.TextureLoader().load("/ground2.jpg");
groundTexture.repeat.x = 25;
groundTexture.repeat.y = 25;
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;

const platformTetxure = new THREE.TextureLoader().load("/cloth.png");
platformTetxure.repeat.x = 2;
platformTetxure.repeat.y = 1;
platformTetxure.wrapS = THREE.RepeatWrapping;
platformTetxure.wrapT = THREE.RepeatWrapping;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshBasicMaterial({ map: groundTexture })
);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const body = new CANNON.Body({
  mass: 1,
  collisionFilterGroup: GROUP2, // Put the box in group 2
  collisionFilterMask: GROUP1, // It can only collide with group 1 (the sphere)
});
body.addShape(shape);
body.position.set(-1, 0, 0);
body.velocity.set(0, 0, 0);
body.linearDamping = 0;
world.addBody(body);

const shape1 = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const body1 = new CANNON.Body({
  mass: 1,
  collisionFilterGroup: GROUP3, // Put the cylinder in group 3
  collisionFilterMask: GROUP1, // It can only collide with group 1 (the sphere)
});
body1.addShape(shape1);
body1.position.set(1, 0, 0);
body1.velocity.set(-5, 0, 0);
body1.linearDamping = 0;
world.addBody(body1);

const shape3 = new CANNON.Box(new CANNON.Vec3(3, 0.5, 2));
const pbody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  mass: 0,
  collisionFilterGroup: GROUP1, // Put the cylinder in group 3
  collisionFilterMask: GROUP2 | GROUP3, // It can only collide with group 1 (the sphere)
});

// Add Platform
pbody.addShape(shape3);
pbody.position.set(0, 2.5, 0);
// pbody.velocity.set(-5, 0, 0)
// pbody.linearDamping = 0
world.addBody(pbody);

const platformMovement = (i) => {
  i.position.x -= 0.05 * gameSpeed;
  if (i.position.x <= -10.05) {
    i.position.x = 20;
  }
};

const dancingStar = (i, j) => {
  i.rotation.y += 0.09;

  j.position.x -= 0.05 * (gameSpeed - 0.5);
  if (j.position.x <= -10.05) {
    j.position.x = 30;
  }
};

const platform = new THREE.Mesh(
  new THREE.BoxGeometry(5, 0.5, 5),
  new THREE.MeshBasicMaterial({
    color: "#ffffff",
  })
);
scene.add(platform);
platform.position.y = 2.5;

// Create Score and Time Keeper
let score = 0;
scoreDom.innerHTML = score;
let time = 60;
timerDom.innerHTML = time;

// Check Collision
const smash = (item1, item2) => {
  if (item1.intersectsBox(item2) == true) {
    cube.material.wireframe = false;
    score++;
    scoreDom.innerHTML = score;
  } else {
    cube.material.wireframe = true;
  }
};

// Animation Loop
let clock = new THREE.Clock();
let delta = 0;
let currentTime = 0;
let gameSpeed = 2;

function animate() {
  delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();
  let timePassed = clock.startTime;
  currentTime = Math.floor(60 - elapsedTime);
  if (currentTime <= 0) {
    timerDom.innerHTML = "Game Over";
  } else {
    timerDom.innerHTML = Math.floor(60 - elapsedTime);
  }
  requestAnimationFrame(animate);

  if (girl != undefined) {
    girl.position.x += 0.005 * gameSpeed;
  }
  platformMovement(pbody);
  if (star != undefined) {
    dancingStar(star, body1);
  }

  smash(cubebb, starCubebb);
  if (can != undefined) {
    can.position.copy(body.position);
    can.position.y = body.position.y;
    // Make condition that if button is not pressed then can is on y.0
  }
  if (star != undefined) {
    star.position.copy(body1.position);
  }
  // Cannon Game
  world.fixedStep();
  // world.step(1 / 60, deltaTime, 3);
  cannonDebugger.update();
  cube.position.copy(body.position);
  cube.quaternion.copy(body.quaternion);
  starCube.position.copy(body1.position);
  starCube.quaternion.copy(body1.quaternion);
  plane.position.copy(groundBody.position);
  plane.quaternion.copy(groundBody.quaternion);
  cubebb.copy(cube.geometry.boundingBox).applyMatrix4(cube.matrixWorld);
  starCubebb
    .copy(starCube.geometry.boundingBox)
    .applyMatrix4(starCube.matrixWorld);
  platform.position.copy(pbody.position);
  platform.quaternion.copy(pbody.quaternion);
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

window.addEventListener("keydown", (e) => {
  if (e.key == " ") {
    body.position.y += 4;
    // can.position.y+=3
  }
  if (e.key == "ArrowRight") {
    body.position.x += 1;
    // can.position.y+=3
  }
  if (e.key == "ArrowLeft") {
    body.position.x -= 1;
    // can.position.y+=3
  }
  if (e.key == "ArrowDown") {
    // body.position.x-=0.01
  }
});

let soundon = document.querySelector("#soundOn");
let soundItem;

window.addEventListener("load", (e) => {
  const listener = new THREE.AudioListener();
  camera.add(listener);
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  soundon.addEventListener("click", () => {
    console.log("true")
    audioLoader.load("/music.wav", function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.2);
      if(sound.isPlaying){
        sound.stop()
        soundon.innerHTML="Sound On 🎶"
      }else{
        sound.play()
        soundon.innerHTML="Sound Off 🚫"
      }
      
    });



  });
});



// GUI
const gui = new dat.GUI();
gui.add(camera.position, "x").name("cameraPX");
gui.add(camera.position, "y").name("cameraPY");
gui.add(camera.position, "z").name("cameraPZ");
