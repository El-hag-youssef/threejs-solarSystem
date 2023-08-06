import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'

// scene graph

import *  as THREE from 'three'
const canvas = document.getElementById('ss');
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { AxesHelper } from 'three';
import GUI from 'lil-gui';



let size = {
  w:canvas.getBoundingClientRect().width,
  h:canvas.getBoundingClientRect().height,
}

// array of 3D object
const objects = [];


//create scene
const scene = new THREE.Scene();
// *********************************************************



// ************************************************************
// create camera
const camera = new THREE.PerspectiveCamera(75,size.w / size.h , 0.1,1000);
camera.position.set(0, 30, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);
// *********************************************************



// ************************************************************
// create lights

const light = new THREE.PointLight(0xFFFFFF , 3);
// light.position.set(0,25,0);
scene.add(light);
// *********************************************************



// ************************************************************
//! create solar system space

const solarSys = new THREE.Object3D();
scene.add(solarSys);
objects.push(solarSys)
// create our sun
const sun = new THREE.Mesh(
                            new THREE.SphereGeometry(1,36,36),
                            new THREE.MeshPhongMaterial({emissive: 0xFFFF00})
                          )
sun.scale.set(5,5,5)
solarSys.add(sun);
objects.push(sun);

// create earth orbit
const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 15;
solarSys.add(earthOrbit);
objects.push(earthOrbit);

//create earth
const earth=  new THREE.Mesh(
                              new THREE.SphereGeometry(2,36,36),
                              new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244})
                            )
earthOrbit.add(earth);
objects.push(earth);

const moon=  new THREE.Mesh(
  new THREE.SphereGeometry(0.8,18,18),
  new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222})
)
moon.position.x = 5
earthOrbit.add(moon);
objects.push(moon);
//create moon

// *********************************************************

// add cube map enviroment
const mapEnviroLoader = new THREE.CubeTextureLoader();
const mapEnviro = mapEnviroLoader.load([
  './cubeMap/px.png',
  './cubeMap/nx.png',

  './cubeMap/py.png',
  './cubeMap/ny.png',

  './cubeMap/pz.png',
  './cubeMap/nz.png',
])

scene.background = mapEnviro;
scene.environment = mapEnviro;


// ************************************************************
//create renderer

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(size.w , size.h);
renderer.render(scene, camera);
// *********************************************************



// ************************************************************
// add orbit controll 

const orbitsControl = new OrbitControls(camera , canvas);
orbitsControl.update()
// *********************************************************



// ************************************************************
// resize and full screen
window.addEventListener('resize',(eve)=>{
  size.w = canvas.getBoundingClientRect().width;
  size.h = canvas.getBoundingClientRect().height;
  camera.aspect =size.w / size.h ;
  renderer.setSize(size.w , size.h);

  console.log(size);

});
// *********************************************************



// *********************************************************



// ************************************************************
//axes

objects.forEach((object)=>{
  const axes = new THREE.AxesHelper();
  axes.material.depthTest = false;
  axes.renderOrder = 1
  object.add(axes);
})


// ************************************************************
// amination

const clock = new THREE.Clock();

(function animate(){
  const timeElapsed=clock.getElapsedTime()
  moon.rotation.x = timeElapsed;
  moon.rotation.z = timeElapsed;
  objects.forEach((object)=>{
    object.rotation.y =timeElapsed ;
  })

  

  renderer.render(scene, camera);
  requestAnimationFrame(animate);

})();
