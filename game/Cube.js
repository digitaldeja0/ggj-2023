import * as THREE from "three";

class Cube {
  constructor(scene, w, h, d, color, wireframe, transparent, opacity) {
    this.scene = scene;
    this.w = w;
    this.h = h;
    this.d = d;
    this.wireframe = wireframe;
    this.color = color;
    this.ColorChoice;
    this.blue = "#362FD9";
    this.pink = "#913175";
    this.purple = "#A084DC";
    this.green = "#658864";
    this.yellow = "#B7B78A";
    this.transparent=transparent
    this.opacity=opacity
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

  meshBox() {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(this.w, this.h, this.d),
      new THREE.MeshBasicMaterial({
        color: this.ColorChoice,
        transparent:this.transparent,
        opacity:this.opacity,
        wireframe: this.wireframe,
      })
    );
    this.scene.add(cube);
    return cube
  }
}

export default Cube;
