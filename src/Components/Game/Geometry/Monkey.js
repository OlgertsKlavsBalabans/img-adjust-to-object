import { BoxGeometry, Group, Mesh, MeshPhongMaterial } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const fbxLoader = new FBXLoader();
const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshPhongMaterial({ color: "#8AC" });
var MONKEY = new Group();
fbxLoader.load(process.env.PUBLIC_URL + "Models/Monkey.fbx", (object) => {
  MONKEY.children = object.children;
  MONKEY.children[0].scale.set(1, 1, 1);
  MONKEY.children[0].position.set(0, 1, 0);
});

export default MONKEY;
