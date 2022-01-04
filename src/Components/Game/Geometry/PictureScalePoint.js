import { Mesh, SphereGeometry } from "three";
import { MeshPhongMaterial } from "three";

var geometry = new SphereGeometry(0.05, 48, 24);
var material = new MeshPhongMaterial({ color: "#8AC" });
var PICTURESP = new Mesh(geometry, material);
PICTURESP.visible = false;

export default PICTURESP;
