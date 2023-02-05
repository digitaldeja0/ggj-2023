import * as THREE from "three";

class ModelLoader {
  constructor(scene, loader, file, scaleSize, nickName) {
    this.scene = scene;
    this.loader = loader
    this.file = file;
    this.scaleSize = scaleSize;
    this.nickName = nickName;
    this.model = undefined;
    this.loader.load(
      this.file,
      (gltf) => {
        this.scene.add(gltf.scene);
        gltf.scene.scale.x = this.scaleSize;
        gltf.scene.scale.y = this.scaleSize;
        gltf.scene.scale.z = this.scaleSize;
        gltf.scene.userData.name = this.nickName;
        this.model = gltf.scene;
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }

  storeModel() {
    return this.model;
  }
}

export default ModelLoader;

// const loader = new GLTFLoader();
// const loadStar = new ModelLoader(scene, loader, "star.glb", 10, "star");
// let star = loadStar.storeModel();

// const loadTree = new ModelLoader(scene, loader, "tree-sm.glb", 1, "tree");
// const tree = loadTree.storeModel();
