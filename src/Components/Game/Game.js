import { useEffect, useRef } from "react";
import CAMERA from "./Cameras/Camera";
import CUBE from "./Geometry/Cube";
import PLANE from "./Geometry/Plane";
import SUN from "./Lights/Sun";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ImageLoader, Scene, WebGLRenderer } from "three";
// import MonkeyModel from process.env.PUBLIC_URL + "Models/Monkey.fbx";

function Game() {
  const mountRef = useRef(null);

  useEffect(() => {
    var scene = new Scene();
    var renderer = new WebGLRenderer();
    const fbxLoader = new FBXLoader();

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(CAMERA, renderer.domElement);
    controls.target.set(0, 1, 0);

    //Add objects
    scene.add(PLANE);

    scene.add(SUN);
    scene.add(SUN.target);

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

    function onWindowResize() {
      CAMERA.aspect = window.innerWidth / window.innerHeight;
      CAMERA.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onWindowResize, false);

    animate();

    return () => mountRef.current.removeChild(renderer.domElement);
  }, []);

  return <div ref={mountRef}></div>;
}

export default Game;
