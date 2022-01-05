import { Mesh, MeshPhongMaterial } from "three";
import { PlaneGeometry } from "three";

const planeGeo = new PlaneGeometry(30, 30);
const planeMat = new MeshPhongMaterial({ color: "#8AC" });

const SCALINGPLANE = new Mesh(planeGeo, planeMat);
SCALINGPLANE.scale.x = 5;
SCALINGPLANE.scale.y = 5;
SCALINGPLANE.visible = false;

export default SCALINGPLANE;
