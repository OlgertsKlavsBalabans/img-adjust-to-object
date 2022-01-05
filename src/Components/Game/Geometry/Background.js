import {
  CubeTextureLoader,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  TextureLoader,
} from "three";

const BACKGROUND = new CubeTextureLoader().load([
  process.env.PUBLIC_URL + "Images/ulukai/corona_ft.png",
  process.env.PUBLIC_URL + "Images/ulukai/corona_bk.png",
  process.env.PUBLIC_URL + "Images/ulukai/corona_up.png",
  process.env.PUBLIC_URL + "Images/ulukai/corona_dn.png",
  process.env.PUBLIC_URL + "Images/ulukai/corona_rt.png",
  process.env.PUBLIC_URL + "Images/ulukai/corona_lf.png",
]);

// var geometry = new SphereGeometry(500, 60, 40);
// var material = new MeshBasicMaterial({
//   map: new TextureLoader().load(
//     process.env.PUBLIC_URL + "Images/night_sky.jpg"
//   ),
// });
// var BACKGROUND = new Mesh(geometry, material);
// BACKGROUND.scale.set(-1, 1, 1); // important step!

export default BACKGROUND;
