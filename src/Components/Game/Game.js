import { useEffect, useRef } from "react";
import CAMERA from "./Cameras/Camera";
import CUBE from "./Geometry/Cube";
import PLANE from "./Geometry/Plane";
import SUN from "./Lights/Sun";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ImageLoader, Scene, WebGLRenderer } from "three";
import PICTURE from "./Geometry/Picture";

function Game() {
  const mountRef = useRef(null);

  useEffect(() => {
    var scene = new Scene();
    var renderer = new WebGLRenderer();
    const fbxLoader = new FBXLoader();
    const imageLoader = new ImageLoader();

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    //Orbit controlls
    const controls = new OrbitControls(CAMERA, renderer.domElement);
    controls.target.set(0, 1, 0);

    //Add objects
    scene.add(PLANE);

    scene.add(SUN);
    scene.add(SUN.target);

    scene.add(PICTURE);

    fbxLoader.load(process.env.PUBLIC_URL + "Models/Monkey.fbx", (object) => {
      object.scale.set(0.01, 0.01, 0.01);
      object.position.set(0, 1, 0);
      scene.add(object);
    });

    function animate() {
      setTimeout(() => {
        requestAnimationFrame(animate);
        renderer.render(scene, CAMERA);
      }, 1000 / 60);
    }

    //Event listeners

    function onWindowResize() {
      CAMERA.aspect = window.innerWidth / window.innerHeight;
      CAMERA.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function onSceneMouseDown() {
      console.log("pp");
    }
    window.addEventListener("resize", onWindowResize, false);
    // mountRef.addEventListener("mousedown", onSceneMouseDown, false);

    animate();

    return () => mountRef.current.removeChild(renderer.domElement);
  }, []);

  return <div ref={mountRef}></div>;
}

export default Game;
