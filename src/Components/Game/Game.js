import { useEffect, useRef } from "react";
import CAMERA from "./Cameras/Camera";
import CUBE from "./Geometry/Cube";
import PLANE from "./Geometry/Plane";
import SUN from "./Lights/Sun";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  BackSide,
  ImageLoader,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import PICTURE from "./Geometry/Picture";
import Gui from "./Gui/Gui";
import { useState } from "react/cjs/react.development";
import OBJECTRP from "./Geometry/ObjectRotationPoint";
import PICTURERP from "./Geometry/PictureRotationPoint";
import OUTLINEMESH from "./Geometry/OutlineMesh";

function Game() {
  const mountRef = useRef(null);
  const [acitveOptions, setAcitveOptions] = useState({
    alignActions: false,
  });

  //Objects for threejs
  const [scene] = useState(new Scene());
  const [raycaster] = useState(new Raycaster());
  const [mouse] = useState(new Vector2());
  const [renderer] = useState(new WebGLRenderer());

  const [threejsState] = useState({
    rotationPointEditing: false,
    selectedPicture: null,
  });

  useEffect(() => {
    //Objects for rendering
    // const renderer = new WebGLRenderer();
    const fbxLoader = new FBXLoader();
    const imageLoader = new ImageLoader();
    //Vars for state of application
    var selectedPicture = null;

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
    scene.add(OUTLINEMESH);
    scene.add(OBJECTRP);
    scene.add(PICTURERP);

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
    // function onSceneMouseDown(event) {
    //   mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    //   mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    //   raycaster.setFromCamera(mouse, CAMERA);

    //   let intersects = raycaster.intersectObjects([PICTURE], false);
    //   console.log(intersects);
    //   if (intersects.length > 0) {
    //     selectedPicture = intersects[0];
    //     addOutlineMeshToObject(selectedPicture.object);

    //     setAcitveOptions({
    //       ...acitveOptions,
    //       alignActions: true,
    //     });

    //     selectedPicture.object.material.transparent = true;
    //   } else {
    //     console.log(selectedPicture);
    //     if (selectedPicture !== null) {
    //       OUTLINEMESH.visible = false;
    //       selectedPicture.object.material.transparent = false;
    //       selectedPicture = null;

    //       setAcitveOptions({
    //         ...acitveOptions,
    //         alignActions: false,
    //       });
    //     }
    //   }
    // }

    //Add event listeners
    window.addEventListener("resize", onWindowResize, false);
    mountRef.current.addEventListener("mousedown", onSceneMouseDown, false);
    // mountRef.current.addEventListener(
    //   "mousedown",
    //   onSceneMouseDownGlobal,
    //   false
    // ); // todo: be merged with local one

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
  //Global event listeners
  // function onSceneMouseDownGlobal() {}

  function onSceneMouseDown(event) {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, CAMERA);

    let intersects = raycaster.intersectObjects([PICTURE], false);
    console.log(intersects);
    if (intersects.length > 0) {
      threejsState.selectedPicture = intersects[0];
      addOutlineMeshToObject(threejsState.selectedPicture.object);

      setAcitveOptions({
        ...acitveOptions,
        alignActions: true,
      });

      threejsState.selectedPicture.object.material.transparent = true;
    } else {
      if (threejsState.selectedPicture !== null) {
        OUTLINEMESH.visible = false;
        threejsState.selectedPicture.object.material.transparent = false;
        threejsState.selectedPicture = null;

        setAcitveOptions({
          ...acitveOptions,
          alignActions: false,
        });
      }
    }
  }
  //Functions
  function addOutlineMeshToObject(object) {
    OUTLINEMESH.geometry = object.geometry;
    OUTLINEMESH.position.set(
      object.position.x,
      object.position.y,
      object.position.z
    );
    OUTLINEMESH.rotation.setFromVector3(object.rotation);

    OUTLINEMESH.visible = true;
  }
  function toggleRotationPointsVisible() {
    OBJECTRP.visible = !OBJECTRP.visible;
    PICTURERP.visible = !PICTURERP.visible;
  }
  function toggleRotationPointEditing() {
    // rotationPointEditing = !rotationPointEditing; // doesnt force update for whole app
    // console.log(rotationPointEditing);
  }

  // Events
  function addRotationPointPressed() {
    toggleRotationPointsVisible();
    toggleRotationPointEditing();
  }
  function rotateAndScalePressed() {
    console.log("rotate");
  }
  function adjustScalePressed() {
    console.log("sclae");
  }
  return (
    <div>
      <Gui
        acitveOptions={acitveOptions}
        addRotationPointPressed={addRotationPointPressed}
        rotateAndScalePressed={rotateAndScalePressed}
        adjustScalePressed={adjustScalePressed}
      ></Gui>
      <div ref={mountRef}></div>
    </div>
  );
}

export default Game;
