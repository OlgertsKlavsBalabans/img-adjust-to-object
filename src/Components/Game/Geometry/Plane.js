import { Mesh } from "three";
import { MeshPhongMaterial } from "three";
import { PlaneGeometry } from "three";

const planeGeo = new PlaneGeometry(60, 60);
const planeMat = new MeshPhongMaterial({ color: "#8AC" });
const PLANE = new Mesh(planeGeo, planeMat);
PLANE.rotation.x = Math.PI * -0.5;
PLANE.position.set(0, -1, 0);

export default PLANE;
