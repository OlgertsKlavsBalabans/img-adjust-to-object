import { useEffect, useRef } from "react";
import * as THREE from "three";
import CAMERA from "./Cameras/Camera";
import CUBE from "./Geometry/Cube";
import PLANE from "./Geometry/Plane";
import SUN from "./Lights/Sun";

function Game() {
  const mountRef = useRef(null);

  useEffect(() => {
    var scene = new THREE.Scene();

    var renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    scene.add(PLANE);
    scene.add(CUBE);

    scene.add(SUN);
    scene.add(SUN.target);

    function animate() {
      setTimeout(() => {
        requestAnimationFrame(animate);
        CUBE.rotation.x += 0.01;
        CUBE.rotation.y += 0.01;
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
