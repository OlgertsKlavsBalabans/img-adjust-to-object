import { Mesh, MeshBasicMaterial, TextureLoader } from "three";
import { PlaneGeometry } from "three";

const planeGeo = new PlaneGeometry(10, 10);
const texture = new TextureLoader().load(
  process.env.PUBLIC_URL + "Images/Monkey.png"
);
const material = new MeshBasicMaterial({ map: texture });
const PICTURE = new Mesh(planeGeo, material);
// PICTURE.rotation.x = Math.PI * -0.5;
PICTURE.rotation.y = -0.8;
PICTURE.position.set(-10, 2, 10);

export default PICTURE;
