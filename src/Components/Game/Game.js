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
  Vector3,
  Vector2,
  WebGLRenderer,
} from "three";
import PICTURE from "./Geometry/Picture";
import Gui from "./Gui/Gui";
import { useState } from "react/cjs/react.development";
import OBJECTRP from "./Geometry/ObjectRotationPoint";
import PICTURERP from "./Geometry/PictureRotationPoint";
import OUTLINEMESH from "./Geometry/OutlineMesh";
import MONKEY from "./Geometry/Monkey";

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
  const [controls, setControls] = useState();

  const [threejsState] = useState({
    rotationPointEditing: false,
    selectedPicture: null,
    pictureRotationPointAdded: false,
    rotateAndScaleMode: false,
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
    setControls(controls);

    //Add objects
    scene.add(PLANE);

    scene.add(SUN);
    scene.add(SUN.target);

    scene.add(PICTURE);
    scene.add(OUTLINEMESH);
    scene.add(OBJECTRP);
    scene.add(PICTURERP);
    scene.add(MONKEY);

    function animate() {
      setTimeout(() => {
        if (threejsState.rotateAndScaleMode) {
          // console.log("rotate&scale");
          // console.log(threejsState.selectedPicture.object.position.length());
          let rotationVector = new Vector3(
            CAMERA.position.x - OBJECTRP.position.x,
            CAMERA.position.y - OBJECTRP.position.y,
            CAMERA.position.z - OBJECTRP.position.z
          );
          // console.log(CAMERA.position);
          // console.log(OBJECTRP.position);
          console.log(PICTURERP.position);

          let rotationVectorScale =
            1 - (rotationVector.length() - 2) / rotationVector.length();
          // console.log(rotationVector);

          // console.log(rotationVectorScale);
          PICTURERP.position.set(
            CAMERA.position.x - rotationVector.x * rotationVectorScale,
            CAMERA.position.y - rotationVector.y * rotationVectorScale,
            CAMERA.position.z - rotationVector.z * rotationVectorScale
          );
          // threejsState.selectedPicture.object.position.set(
          //   CAMERA.position.x,
          //   CAMERA.position.y,
          //   CAMERA.position.z
          // );
        }
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
  //Global event listeners

  function onSceneMouseDown(event) {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, CAMERA);

    if (threejsState.rotationPointEditing) {
      addRotationPoint();
    } else if (threejsState.rotateAndScaleMode) {
    } else {
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
  }

  //Functions
  function addRotationPoint() {
    if (threejsState.pictureRotationPointAdded) {
      let intersects = raycaster.intersectObjects([MONKEY.children[0]], false);
      if (intersects.length > 0) {
        threejsState.pictureRotationPointAdded = false;
        OBJECTRP.position.set(
          intersects[0].point.x,
          intersects[0].point.y,
          intersects[0].point.z
        );
      }
    } else {
      let intersects = raycaster.intersectObjects(
        [threejsState.selectedPicture.object],
        false
      );
      if (intersects.length > 0) {
        threejsState.pictureRotationPointAdded = true;
        PICTURERP.position.set(
          intersects[0].point.x,
          intersects[0].point.y,
          intersects[0].point.z
        );
      }
    }
  }

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
    threejsState.rotationPointEditing = !threejsState.rotationPointEditing;
  }
  function toggleRotateAndScaleMode() {
    threejsState.rotateAndScaleMode = !threejsState.rotateAndScaleMode;
  }
  function toggleCamera() {}
  function toggleRoationControlls() {
    if (threejsState.rotateAndScaleMode) {
      controls.target.set(
        OBJECTRP.position.x,
        OBJECTRP.position.y,
        OBJECTRP.position.z
      );
    } else {
      controls.target.set(0, 1, 0);
    }
  }
  // Events
  function addRotationPointPressed() {
    toggleRotationPointsVisible();
    toggleRotationPointEditing();
  }
  function rotateAndScalePressed() {
    toggleRotateAndScaleMode();
    toggleCamera();
    toggleRoationControlls();
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
