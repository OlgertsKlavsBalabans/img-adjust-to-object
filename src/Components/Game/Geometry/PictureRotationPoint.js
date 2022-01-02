import { Mesh, SphereGeometry } from "three";
import { MeshPhongMaterial } from "three";

var geometry = new SphereGeometry(0.05, 48, 24);
var material = new MeshPhongMaterial({ color: "#8AC" });
var PICTURERP = new Mesh(geometry, material);
PICTURERP.visible = false;

export default PICTURERP;
