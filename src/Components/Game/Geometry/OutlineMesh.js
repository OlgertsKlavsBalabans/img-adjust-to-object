import { BackSide, Mesh, MeshBasicMaterial, SphereGeometry } from "three";

var geometry = new SphereGeometry(5 / 30, 48, 24);
var material = new MeshBasicMaterial({
  color: 0x00ff00,
  side: BackSide,
  opacity: 0.5,
  transparent: true,
});

var OUTLINEMESH = new Mesh(geometry, material);
OUTLINEMESH.scale.multiplyScalar(1.05);
OUTLINEMESH.visible = false;

export default OUTLINEMESH;
