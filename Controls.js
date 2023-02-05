import * as THREE from "three";

export class CharControls {
  constructor(model, camera, controls, body,cube) {
    this.toggleRun = true;
    this.currentAction = "pause";
    this.model = model;
    this.body = body;
    this.cube =cube
    this.camera = camera;
    this.controls = controls;

    // temporary data
    this.walkDirection = new THREE.Vector3();
    this.rotateAngle = new THREE.Vector3(0, 1, 0);
    this.rotateQuarternion = new THREE.Quaternion();
    this.cameraTarget = new THREE.Vector3();

    // constants
    this.fadeDuration = 0.2;
    this.runVelocity = 20;
    this.walkVelocity = 10;
  }


  update(delta, keyPressed) {
    // const dirArr = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];
    const dirArr = [ "arrowup", "arrowdown", "arrowleft", "arrowright"," "];

    let checkMe = (key) => keyPressed[key] == true;
    const directionPressed = dirArr.some(checkMe);

    if(directionPressed){
        this.currentAction="moving"
    }else{
        this.currentAction="pause"
    }

  

    if (this.currentAction == "moving") {
      // calculate towards camera direction
      var angleYCameraDirection = Math.atan2(
        this.camera.position.x - this.body.position.x,
        this.camera.position.z - this.body.position.z
      );
    //   var angleYCameraDirection = Math.atan2(
    //     this.camera.position.x - this.body.position.x,
    //     this.camera.position.z - this.body.position.z
    //   );
      // directional offset
      var directionOffset = this.directionOffset(keyPressed);

      // rotate model
      this.rotateQuarternion.setFromAxisAngle(
        this.rotateAngle,
        angleYCameraDirection + directionOffset
      );
      this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.5);

      // calculate direction
      this.camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0
      this.walkDirection.normalize();
      this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

      // run/walk velocity
      const velocity =
        this.currentAction == "moving" ? this.runVelocity : this.walkVelocity;

      // move model & camera
      const moveX = this.walkDirection.x * velocity * delta;
      const moveZ = this.walkDirection.z * velocity * delta;
      this.body.position.x -= moveX;
      this.body.position.z -= moveZ;
      this.updateCameraTarget(moveX, moveZ);
    }
  }
  //   New Function

  updateCameraTarget(moveX, moveZ) {
    // move camera
    this.camera.position.x -= moveX;
    this.camera.position.z -= moveZ;
    this.camera.position.y = this.model.position.y +.5

    // update camera target
    this.cameraTarget.x = this.cube.position.x;
    this.cameraTarget.y = this.cube.position.y + 1;
    this.cameraTarget.z = this.cube.position.z;
    this.controls.target = this.cameraTarget;
  }

  //   New Function

  directionOffset(keyPressed) {
      // let A = "a";
    // let D = "d";
    // let W = "w";
    // let S = "s";

    let A = "arrowleft";
    let D = "arrowright";
    let W = "arrowup";
    let S = "arrowdown";
    let space = " "


    var directionOffset = 0;

  
    if (keyPressed[S]) {
      if (keyPressed[D]) {
        directionOffset = Math.PI / 4;
      } else if (keyPressed[A]) {
        directionOffset = -Math.PI / 4;
      }
    } else if (keyPressed[W]) {
      if (keyPressed[D]) {
        directionOffset = Math.PI / 4 + Math.PI / 2;
      } else if (keyPressed[A]) {
        directionOffset = -Math.PI / 4 - Math.PI / 2;
      } else {
        directionOffset = Math.PI;
      }
    } else if (keyPressed[D]) {
      directionOffset = Math.PI / 2;
    } else if (keyPressed[A]) {
      directionOffset = -Math.PI / 2;
    } else if (keyPressed[space]){
        directionOffset = 0
        // console.log("hi")
    }

 

    return directionOffset;
  }
}
