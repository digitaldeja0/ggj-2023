import * as THREE from "three";

const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
const camera = new THREE.PerspectiveCamera(
    75,
    size.width / size.height,
    0.1,
    100
  );

camera.rotation.x = -0.2;
camera.position.y = 1;
camera.position.z = 5;

export default camera