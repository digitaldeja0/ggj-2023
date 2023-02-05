import * as THREE from "three";

class Light{
    constructor(scene, color, intensity, pos){
        this.scene = scene
        this.color = color
        this.intensity = intensity
        this.pos = pos || undefined
        this.light;
    }

    ambL(){
        this.light = new THREE.AmbientLight(this.color,this.intensity)
        this.scene.add(this.light)
        
    }
    dirL(){
        this.light =  new THREE.DirectionalLight(this.color,this.intensity)
        this.light.position.set = this.pos
        this.scene.add(this.light)
    }
    spoL(){
        this.light = new THREE.SpotLight(this.color,this.intensity )
        this.light.position.set = this.pos
        this.scene.add(this.light)
    }
}

export default Light

