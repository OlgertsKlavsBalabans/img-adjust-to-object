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
  Euler,
  Raycaster,
  Scene,
  Vector3,
  Vector2,
  WebGLRenderer,
  Quaternion,
  Fog,
  TextureLoader,
  Loader,
} from "three";
import PICTURE from "./Geometry/Picture";
import Gui from "./Gui/Gui";
import { useState } from "react/cjs/react.development";
import OBJECTRP from "./Geometry/ObjectRotationPoint";
import PICTURERP from "./Geometry/PictureRotationPoint";
import OUTLINEMESH from "./Geometry/OutlineMesh";
import MONKEY from "./Geometry/Monkey";
import PICTURESP from "./Geometry/PictureScalePoint";
import SCALINGPLANE from "./Geometry/ScalingPlane";
import BACKGROUND from "./Geometry/Background";

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
    controls: null,
    rotationPointEditing: false,
    selectedPicture: null,
    pictureRotationPointAdded: false,
    rotateAndScaleMode: false,
    pictureRPRelativePosition: new Vector3(),
    pictureRotationBeforeRotating: new Euler(),
    scaleMode: false,
    ScalingSelectedPicture: false,
    pictureSPRelativePosition: new Vector3(),
    cameraDistanceFromPictureRP: 3,
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
    threejsState.controls = new OrbitControls(CAMERA, renderer.domElement);
    threejsState.controls.target.set(0, 1, 0);

    //Add objects
    scene.add(PLANE);

    scene.add(SUN);
    scene.add(SUN.target);

    scene.add(PICTURE);
    scene.add(OUTLINEMESH);
    scene.add(OBJECTRP);
    scene.add(PICTURERP);
    scene.add(PICTURESP);
    scene.add(SCALINGPLANE);

    scene.add(MONKEY);

    scene.background = BACKGROUND;
    //scene ambiance

    function animate() {
      setTimeout(() => {
        if (threejsState.rotateAndScaleMode) {
          //Keep PICTURERP aligned between OBJECTRP and camera
          let rotationVector = new Vector3(
            CAMERA.position.x - OBJECTRP.position.x,
            CAMERA.position.y - OBJECTRP.position.y,
            CAMERA.position.z - OBJECTRP.position.z
          );
          let rotationVectorScale =
            1 -
            (rotationVector.length() -
              threejsState.cameraDistanceFromPictureRP) /
              rotationVector.length();
          PICTURERP.position.set(
            CAMERA.position.x - rotationVector.x * rotationVectorScale,
            CAMERA.position.y - rotationVector.y * rotationVectorScale,
            CAMERA.position.z - rotationVector.z * rotationVectorScale
          );
          // Move selected picture to PICTURERP location + relative position

          PICTURERP.lookAt(CAMERA.position);
          threejsState.selectedPicture.object.rotation.setFromVector3(
            PICTURERP.rotation
          );
          //Create temp relative position of picture from rotation point and apply rotation euler
          let rotatedRelativeRPPosition = new Vector3(
            threejsState.pictureRPRelativePosition.x,
            threejsState.pictureRPRelativePosition.y,
            threejsState.pictureRPRelativePosition.z
          );
          // IMPORTANT first apply negative euler of starting rotation then apply positive euler othervise doesnt work
          rotatedRelativeRPPosition.applyEuler(
            new Euler(
              -threejsState.pictureRotationBeforeRotating.x,
              -threejsState.pictureRotationBeforeRotating.y,
              -threejsState.pictureRotationBeforeRotating.z
            )
          );
          rotatedRelativeRPPosition.applyEuler(
            threejsState.selectedPicture.object.rotation
          );

          //Position the selected picture relatively from Picture rotation point
          threejsState.selectedPicture.object.position.set(
            PICTURERP.position.x + rotatedRelativeRPPosition.x,
            PICTURERP.position.y + rotatedRelativeRPPosition.y,
            PICTURERP.position.z + rotatedRelativeRPPosition.z
          );
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
    mountRef.current.addEventListener("mouseup", onSceneMouseUp, false);
    mountRef.current.addEventListener("mousemove", onMouseMove, false);

    animate();
    // Remove everything on destroy
    return () => {
      window.removeEventListener("resize", onWindowResize, false);
      mountRef.current.removeEventListener(
        "mousedown",
        onSceneMouseDown,
        false
      );
      mountRef.current.removeEventListener("mouseup", onSceneMouseUp, false);
      mountRef.current.removeEventListener("mousemove", onMouseMove, false);

      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);
  //Global event listeners

  function onMouseMove(event) {
    if (threejsState.ScalingSelectedPicture) {
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, CAMERA);
      let intersects = raycaster.intersectObjects([SCALINGPLANE], false);
      console.log(intersects);

      //should always have intersect point becouse of outlineMesh being there when this is used
      //Scale picture
      let intersectPoint = intersects[0].point;
      let selectedPicturePosition =
        threejsState.selectedPicture.object.position;
      let vectorBetweenPoints = new Vector3(
        intersectPoint.x - selectedPicturePosition.x,
        intersectPoint.y - selectedPicturePosition.y,
        intersectPoint.z - selectedPicturePosition.z
      );
      let quaternionRotation = new Quaternion();
      quaternionRotation.setFromEuler(
        threejsState.selectedPicture.object.rotation
      );
      quaternionRotation.invert();
      vectorBetweenPoints.applyQuaternion(quaternionRotation);
      let scaleX =
        (vectorBetweenPoints.x * 2) /
        threejsState.selectedPicture.object.geometry.parameters.width;
      let scaleY =
        (vectorBetweenPoints.y * 2) /
        threejsState.selectedPicture.object.geometry.parameters.height;
      threejsState.selectedPicture.object.scale.x = scaleX;
      threejsState.selectedPicture.object.scale.y = scaleY;

      //Move picture relative to Picture scale point
      let tempSPRelPos = new Vector3(
        threejsState.pictureSPRelativePosition.x,
        threejsState.pictureSPRelativePosition.y,
        threejsState.pictureSPRelativePosition.z
      );
      tempSPRelPos.applyQuaternion(quaternionRotation);
      tempSPRelPos.set(
        tempSPRelPos.x * scaleX,
        tempSPRelPos.y * scaleY,
        tempSPRelPos.z
      );
      quaternionRotation.invert();
      tempSPRelPos.applyQuaternion(quaternionRotation);
      threejsState.selectedPicture.object.position.set(
        PICTURESP.position.x - tempSPRelPos.x,
        PICTURESP.position.y - tempSPRelPos.y,
        PICTURESP.position.z - tempSPRelPos.z
      );
    }
  }
  function onSceneMouseUp(event) {
    if (threejsState.scaleMode) {
      toggleScalingSelectedPicture();
      toggleOrbitControlls();
    }
  }

  function onSceneMouseDown(event) {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, CAMERA);

    if (threejsState.rotationPointEditing) {
      addRotationPoint();
    } else if (threejsState.rotateAndScaleMode) {
    } else if (threejsState.scaleMode) {
      addScalePoint();
      toggleScalingSelectedPicture();
      toggleOrbitControlls();
      setPictureSPRelativePosition();
    } else {
      let intersects = raycaster.intersectObjects([PICTURE], false);

      // console.log(intersects);
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
    OUTLINEMESH.scale.x = object.scale.x;
    OUTLINEMESH.scale.y = object.scale.y;
    OUTLINEMESH.scale.z = object.scale.z;

    OUTLINEMESH.scale.multiplyScalar(1.01);
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
  function toggleRoationControlls() {
    if (threejsState.rotateAndScaleMode) {
      threejsState.controls.target.set(
        OBJECTRP.position.x,
        OBJECTRP.position.y,
        OBJECTRP.position.z
      );
    } else {
      threejsState.controls.target.set(0, 1, 0); // default state
    }
  }
  function savePictureRPPosition() {
    threejsState.pictureRPRelativePosition.set(
      threejsState.selectedPicture.object.position.x - PICTURERP.position.x,
      threejsState.selectedPicture.object.position.y - PICTURERP.position.y,
      threejsState.selectedPicture.object.position.z - PICTURERP.position.z
    );
    // console.log(threejsState.pictureRPRelativePosition);
  }

  function togglePictureSPVisible() {
    PICTURESP.visible = !PICTURESP.visible;
  }
  function toggleScaleMode() {
    threejsState.scaleMode = !threejsState.scaleMode;
  }

  function addScalePoint() {
    let intersects = raycaster.intersectObjects(
      [threejsState.selectedPicture.object],
      false
    );
    if (intersects.length > 0) {
      PICTURESP.position.set(
        intersects[0].point.x,
        intersects[0].point.y,
        intersects[0].point.z
      );
    }
  }
  function toggleScalingSelectedPicture() {
    let intersects = raycaster.intersectObjects([SCALINGPLANE], false);
    if (intersects.length > 0) {
      threejsState.ScalingSelectedPicture =
        !threejsState.ScalingSelectedPicture;
    }
  }

  function toggleOrbitControlls() {
    threejsState.controls.enabled = !threejsState.controls.enabled;
  }

  function setPictureSPRelativePosition() {
    threejsState.pictureSPRelativePosition = new Vector3(
      PICTURESP.position.x - threejsState.selectedPicture.object.position.x,
      PICTURESP.position.y - threejsState.selectedPicture.object.position.y,
      PICTURESP.position.z - threejsState.selectedPicture.object.position.z
    );
  }

  function addScalingPlane() {
    SCALINGPLANE.position.set(
      threejsState.selectedPicture.object.position.x,
      threejsState.selectedPicture.object.position.y,
      threejsState.selectedPicture.object.position.z
    );
    SCALINGPLANE.rotation.setFromVector3(
      threejsState.selectedPicture.object.rotation
    );
    SCALINGPLANE.geometry = threejsState.selectedPicture.object.geometry;
  }
  // Events
  function addRotationPointPressed() {
    toggleRotationPointsVisible();
    toggleRotationPointEditing();
  }
  function rotateAndScalePressed() {
    toggleRotateAndScaleMode();
    toggleRoationControlls();
    savePictureRPPosition();
    threejsState.pictureRotationBeforeRotating.setFromVector3(
      threejsState.selectedPicture.object.rotation
    );
    console.log("rotate");
  }
  function adjustScalePressed() {
    togglePictureSPVisible();
    toggleScaleMode();
    addScalingPlane();
    console.log("sclae");
  }

  function cameraDistanceSliderChanged(value) {
    threejsState.cameraDistanceFromPictureRP = value;
  }
  function opacitySliderChanged(value) {
    threejsState.selectedPicture.object.material.opacity = value;
  }
  function scaleSliderChanged(value) {
    threejsState.selectedPicture.object.scale.x = value;
    threejsState.selectedPicture.object.scale.y = value;
    threejsState.selectedPicture.object.scale.z = value;
  }
  return (
    <div>
      <Gui
        acitveOptions={acitveOptions}
        addRotationPointPressed={addRotationPointPressed}
        rotateAndScalePressed={rotateAndScalePressed}
        adjustScalePressed={adjustScalePressed}
        cameraDistanceSliderChanged={cameraDistanceSliderChanged}
        opacitySliderChanged={opacitySliderChanged}
        scaleSliderChanged={scaleSliderChanged}
      ></Gui>
      <div ref={mountRef}></div>
    </div>
  );
}

export default Game;
