import * as THREE from "./build/three.module.js";

import { GLTFLoader } from "./examples/jsm/loaders/GLTFLoader.js";

import { OrbitControls } from "./examples/jsm/controls/OrbitControls.js";

import Stats from './examples/jsm/libs/stats.module.js'

// sizes
const sizes = {
 width: 800,
 height: 600
};

// const fairwellkaal = "http://localhost/wp/coffin/wp-content/themes/twentytwenty/assets/three-master/model/sunflower.gltf"
const fairwellkaal = "http://localhost/wp/coffin/wp-content/themes/twentytwenty/assets/three-master/model/sunflower.glb"

// updat matrial function to adjust the light to the environment
const updateAllMatrials = ()=>{
    scene.traverse((child)=>{
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            child.material.envMap = environmentMap
            child.material.envMapIntensity = 3
        }
    })
}

/**
 * Environment map
 */
 const cubTextureLoader = new THREE.CubeTextureLoader()
 const environmentMap = cubTextureLoader.load([
   'http://localhost/wp/coffin/wp-content/themes/twentytwenty/assets/three-master/1/px.jpg',
   'http://localhost/wp/coffin/wp-content/themes/twentytwenty/assets/three-master/1/nx.jpg',
   'http://localhost/wp/coffin/wp-content/themes/twentytwenty/assets/three-master/1/py.jpg',
   'http://localhost/wp/coffin/wp-content/themes/twentytwenty/assets/three-master/1/ny.jpg',
   'http://localhost/wp/coffin/wp-content/themes/twentytwenty/assets/three-master/1/pz.jpg',
   'http://localhost/wp/coffin/wp-content/themes/twentytwenty/assets/three-master/1/nz.jpg'
 ])

/**
* Debug
*/

const container = document.getElementById( 'container' );

const stats = new Stats();
container.appendChild( stats.dom );

const scene = new THREE.Scene();
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap

// loader
const loader = new GLTFLoader();

loader.load( fairwellkaal, (gltf) => {

    const model = gltf.scene;
    model.position.set(0, -0.5, 0);
    model.scale.set(1, 1, 1);
    model.rotation.set(0, 90, 0);
   scene.add(model);
   updateAllMatrials()
 });

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(3, 5, 5);
scene.add(dirLight);

const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 4;
camera.position.y = 0;
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(sizes.width , sizes.height) ;
renderer.setClearColor(0xffffff, 0);
renderer.setClearAlpha(0.5);
renderer.physicallyCorrectLights = true // adjust the light
renderer.toneMapping = THREE.ACESFilmicToneMapping //adjust the light
container.appendChild( renderer.domElement );

//set size when resizing
window.onresize = function () {
 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();

//  renderer.setSize(window.innerWidth, window.innerHeight);
};

// to control the object
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const tick = () => {
 // const elapsedTime = clock.getElapsedTime();

 // Update controls
 controls.update();

 // Render
 renderer.render(scene, camera);

 // Call tick again on the next frame
 window.requestAnimationFrame(tick);
};

tick();
