import { Mesh, SphereGeometry } from "three";
import { MeshPhongMaterial } from "three";

var geometry = new SphereGeometry(5 / 30, 48, 24);
var material = new MeshPhongMaterial({ color: "#8AC" });
var OBJECTRP = new Mesh(geometry, material);
OBJECTRP.visible = false;

export default OBJECTRP;
