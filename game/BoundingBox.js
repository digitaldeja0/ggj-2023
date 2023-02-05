import * as THREE from "three";

class BoundingBox {
  constructor(scene,cube, color) {
    this.scene = scene;
    this.cube = cube
    this.color = color;
    this.ColorChoice;
    this.blue = "#362FD9";
    this.pink = "#913175";
    this.purple = "#A084DC";
    this.green = "#658864";
    this.yellow = "#B7B78A";
    switch (this.color) {
      case "blue":
        this.ColorChoice = this.blue;
        break;
      case "pink":
        this.ColorChoice = this.pink;
        break;
      case "purple":
        this.ColorChoice = this.purple;
        break;
      case "green":
        this.ColorChoice = this.green;
        break;
      case "yellow":
        this.ColorChoice = this.yellow;
        break;
      default:
        this.ColorChoice = this.blue;
    }
  }

 helper() {
      const bb = new THREE.Box3().setFromObject(this.cube);
      const helper = new THREE.Box3Helper(bb, this.ColorChoice);
      this.scene.add(helper);
      return bb
  }
}

export default BoundingBox;