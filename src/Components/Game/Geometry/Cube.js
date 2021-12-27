import { Mesh } from "three";
import { MeshPhongMaterial } from "three";
import { BoxGeometry } from "three";

var geometry = new BoxGeometry(1, 1, 1);
var material = new MeshPhongMaterial({ color: "#8AC" });
var CUBE = new Mesh(geometry, material);

export default CUBE;
