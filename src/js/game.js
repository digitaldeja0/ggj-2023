import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { Material } from "three";
import Light from "../../game/Lights";
import camera from "../../game/Camera";
import Cube from "../../game/Cube";
import BoundingBox from "../../game/BoundingBox";

// Setup Game 

const startBtn = document.querySelector(".startGameBtn");
const containerContainer = document.querySelector(".containerContainer");

const gameIntroBtn = document.querySelector(".gameIntroBtn");
const gameIntro = document.querySelector(".gameIntro");

// gameIntroBtn.addEventListener("click", () => {
//   gameIntro.style.display = "none";
// });

// Loader Const
const loaderIcon = document.querySelector(".loaderDiv");
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
// Scene
const scene = new THREE.Scene();
// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(size.width, size.height);
document.body.appendChild(renderer.domElement);
// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
// Lights
const light1 = new Light(scene, "#ffffff", 1, null);
light1.ambL();
const light2 = new Light(scene, "#ffffff", 1, "-10, 100, -100");
light2.dirL();
const light3 = new Light(scene, "#ffffff", 1, "10, 100, -100");
light3.dirL();

// Add Player Cube and Helper
const cubeInit = new Cube(scene, 1, 1, 1, "pink", true, true);
const cube = cubeInit.meshBox();
cube.position.set(-5, 0, 0);
const cubebbInit = new BoundingBox(scene, cube, "blue");
const cubebb = cubebbInit.helper();
// Add Star Box and Helper
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
// Load Player Model
const loader = new GLTFLoader();
let can;
let itemSize = 1;
loader.load(
  "can.glb",
  function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.scale.x = itemSize;
    gltf.scene.scale.y = itemSize;
    gltf.scene.scale.z = itemSize;
    gltf.scene.position.copy(cube.position);
    gltf.scene.userData.name = "can";
    can = gltf.scene;
  },
  (xhr) => {
    loaderIcon.style.display = "display";
  },
  function (error) {
    console.error(error);
  }
);
// Load Star
let star;
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
  (xhr) => {
    loaderIcon.style.display = "display";
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error(error);
  }
);
// Cannon Starter Pack
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
// Creat Cannon Collison Groups
const GROUP1 = 1;
const GROUP2 = 2;
const GROUP3 = 4;
// Create Ground Texture Three
const groundTexture = new THREE.TextureLoader().load("/kitchen3.png");
groundTexture.repeat.x = 1;
groundTexture.repeat.y = 1;
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
// Create Ground Three
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(25, 25),
  new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0.5,
    map: groundTexture,
  })
);
plane.rotation.x = Math.PI / 2;
scene.add(plane);
// Create Cannone Shape for Cube
const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const body = new CANNON.Body({
  mass: 1,
  collisionFilterGroup: GROUP2,
  collisionFilterMask: GROUP1,
});
body.addShape(shape);
body.position.set(-5, 0, 0);
body.velocity.set(0, 0, 0);
body.linearDamping = 0;
world.addBody(body);
// Create Cannon Shape Star
const shape1 = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const body1 = new CANNON.Body({
  mass: 1,
  collisionFilterGroup: GROUP3, // Put the cylinder in group 3
  collisionFilterMask: GROUP1, // It can only collide with group 1 (the sphere)
});
body1.addShape(shape1);
body1.position.set(1, 2.2, 0);
body1.velocity.set(-5, 0, 0);
body1.linearDamping = 0;
world.addBody(body1);
// Create Platform  Texture Three
const platTexture = new THREE.TextureLoader().load("/kitchen.png");
platTexture.repeat.x = 1;
platTexture.repeat.y = 1;
platTexture.wrapS = THREE.RepeatWrapping;
platTexture.wrapT = THREE.RepeatWrapping;
// Create Game Platform Three
const platform = new THREE.Mesh(
  new THREE.BoxGeometry(3, 0.5, 3),
  new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0.5,
    map: platTexture,
  })
);
scene.add(platform);
// Load Images Function
const newImageGen = (file, x, z) => {
  const imageTexture = new THREE.TextureLoader().load(file);
  const image = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.2, 2.5),
    new THREE.MeshStandardMaterial({
      metalness: 1,
      roughness: 0.5,
      map: imageTexture,
    })
  );
  image.position.x = x;
  image.position.z = z;
  scene.add(image);
};
// Create Magnets

newImageGen("/mag1.png", 0, 0);
newImageGen("/mag2.png", 5, -3);
newImageGen("/mag3.png", -6, 3);
newImageGen("/mag4.png", -1, 5);
newImageGen("/mag5.png", 6, 5);
newImageGen("/mag6.png", -6, -4);

// Create Platform Shape Cannon
const shape3 = new CANNON.Box(new CANNON.Vec3(2, 0.5, 1));
const pbody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  mass: 0,
  collisionFilterGroup: GROUP1,
  collisionFilterMask: GROUP2 | GROUP3,
});
pbody.addShape(shape3);
pbody.position.set(0, 2.2, 0);
world.addBody(pbody);
// Check Collision Function Star and Can
let hit = false;
const smash = (item1, item2) => {
  if (item1.intersectsBox(item2) == true) {
    cube.material.wireframe = false;
    score++;
    scoreDom.innerHTML = score;
    const listener1 = new THREE.AudioListener();
    cube.add(listener1);
    const sound1 = new THREE.Audio(listener1);
    const audioLoader1 = new THREE.AudioLoader();
    audioLoader1.load("/collect.mp3", function (buffer) {
      sound1.setBuffer(buffer);
      sound1.setLoop(false);
      sound1.setVolume(0.9);
      sound1.play();
    });
    newLevel();
  } else {
    cube.material.wireframe = true;
  }
};
// Move Shapes
let newX;
let newY;
let newZ;
const newLevel = () => {
  newZ = Math.floor(Math.random() * (4 - -5) + -5);
  newX = Math.floor(Math.random() * (4 - -5) + -5);
  pbody.position.x = newX;
  pbody.position.z = newZ;
  body1.position.x = newX;
  body1.position.z = newZ;
  body.position.z = 6;
  body.position.x = -2;
  return;
};
// Create Score and Time Keeper
let score = 0;
scoreDom.innerHTML = score;
let time = 60;
timerDom.innerHTML = time;
// Move Player Function
var pressed = false;
const moveplayer = (player) => {
  window.addEventListener("keydown", (e) => {
    if (pressed) return;
    if (e.key == " " ) {
      player.position.y += 2;
      const listener2 = new THREE.AudioListener();
      cube.add(listener2);
      const sound2 = new THREE.Audio(listener2);
      const audioLoader2 = new THREE.AudioLoader();
      audioLoader2.load("/jump.mp3", function (buffer) {
        sound2.setBuffer(buffer);
        sound2.setLoop(false);
        sound2.setVolume(0.2);
        sound2.play();
      });
      pressed = true;
    }
    if (e.key == "ArrowRight") {
      player.position.x += 0.001;
    }
    if (e.key == "ArrowLeft") {
      player.position.x -= 0.001;
    }
    if (e.key == "ArrowUp") {
      player.position.z -= 0.001;
    }
    if (e.key == "ArrowDown") {
      player.position.z += 0.001;
    }
  });
  window.addEventListener("keyup", (e) => {
    pressed = false;
  });
};
// Animation Loop
let clock = new THREE.Clock();
let delta = 0;
let currentTime = 0;
let gameSpeed = 2;
// Start Animation Loop
let totalScore;
function animate() {
  // Update Camera
  camera.position.x = 0;
  camera.position.y = 6;
  camera.position.z = 10;
  camera.aspect = window.innerWidth / window.innerHeight;
  // Start Timer and Maintin Timer
  delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();
  let timePassed = clock.startTime;
  currentTime = Math.floor(30 - elapsedTime);
  if (currentTime <= 0) {
    timerDom.innerHTML = "Game Over";
    totalScore=score.toString()
    gameOver()
  } else {
    timerDom.innerHTML = Math.floor(30 - elapsedTime);
  }
  // Move Player Function Called
  if (can != undefined) {
    moveplayer(body);
  }
  // Collsion Check Funciton Called
  smash(cubebb, starCubebb);
  // Make Can Follow Cubes
  if (can != undefined) {
    can.position.copy(body.position);
    can.position.y = body.position.y;
  }
  // Make Star follow star Cuube
  if (star != undefined) {
    star.position.copy(body1.position);
    star.rotation.y += 0.05
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
  requestAnimationFrame(animate);
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(window.devicePixelRatio);
  controls.update();
  renderer.render(scene, camera);
}
// Call Animation
animate();
// Gameover Function 
const gameOver=()=>{
  localStorage.setItem("scoreTotal", JSON.stringify({ scoreTotal: totalScore }));
  window.location='end.html'
}


/*------------------------------------------------------------*/
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// Create Sound
let soundon = document.querySelector("#soundOn");
let soundItem;
window.addEventListener("load", (e) => {
  const listener = new THREE.AudioListener();
  camera.add(listener);
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  soundon.addEventListener("click", () => {
    console.log("true");
    audioLoader.load("/music-full.wav", function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.9);
      if (sound.isPlaying) {
        sound.stop();
        soundon.innerHTML = "Music On 🎶";
      } else {
        sound.play();
        soundon.innerHTML = "Music Off 🚫";
      }
    });
  });
});


THREE.DefaultLoadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
};

THREE.DefaultLoadingManager.onLoad = function () {
  document.querySelector(".loaderDiv").style.display = "none";
};

THREE.DefaultLoadingManager.onProgress = function (
  url,
  itemsLoaded,
  itemsTotal
) {
  document.querySelector(".loaderDiv").style.display = "flex";

};

THREE.DefaultLoadingManager.onError = function (url) {
  console.log("There was an error loading " + url);
};

export default score