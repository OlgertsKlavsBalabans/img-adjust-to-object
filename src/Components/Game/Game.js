import { useEffect, useRef } from "react";
import CAMERA from "./Cameras/Camera";
import CUBE from "./Geometry/Cube";
import PLANE from "./Geometry/Plane";
import SUN from "./Lights/Sun";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  BackSide,
  BoxGeometry,
  ImageLoader,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  Ray,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import PICTURE from "./Geometry/Picture";

function Game() {
  const mountRef = useRef(null);

  useEffect(() => {
    //Vars for rendering
    const scene = new Scene();
    const renderer = new WebGLRenderer();
    const fbxLoader = new FBXLoader();
    const imageLoader = new ImageLoader();
    //Vars for calculation
    const raycaster = new Raycaster();
    var mouse = new Vector2();
    //Vars for state of application
    var selectedPicture = null;
    var outlineMesh;

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    //SHADERS???
    var outlineMaterial = new MeshBasicMaterial({
      color: 0x00ff00,
      side: BackSide,
      opacity: 0.5,
      transparent: true,
    });

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
    function onSceneMouseDown(event) {
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, CAMERA);

      let intersects = raycaster.intersectObjects([PICTURE], false);
      console.log(intersects);
      if (intersects.length > 0) {
        scene.remove(outlineMesh);
        selectedPicture = intersects[0];
        outlineMesh = new Mesh(
          selectedPicture.object.geometry,
          outlineMaterial
        );
        outlineMesh.position.set(
          selectedPicture.object.position.x,
          selectedPicture.object.position.y,
          selectedPicture.object.position.z
        );
        outlineMesh.rotation.setFromVector3(selectedPicture.object.rotation);
        outlineMesh.scale.multiplyScalar(1.05);
        scene.add(outlineMesh);

        selectedPicture.object.material.transparent = true;
      } else {
        if (selectedPicture !== null) {
          scene.remove(outlineMesh);
          selectedPicture.object.material.transparent = false;
          selectedPicture = null;
          console.log("pp");
        }
      }
    }
    //Add event listeners
    window.addEventListener("resize", onWindowResize, false);
    mountRef.current.addEventListener("mousedown", onSceneMouseDown, false);

    animate();
    // Remove everything on destroy
    return () => {
      window.removeEventListener("resize", onWindowResize, false);
      mountRef.current.removeEventListener(
        "mousedown",
        onSceneMouseDown,
        false
      );
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
}

export default Game;
