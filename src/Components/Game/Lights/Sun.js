import { DirectionalLight } from "three";

const color = 0xffffff;
const intensity = 1;
const SUN = new DirectionalLight(color, intensity);
SUN.position.set(0, 10, 0);
SUN.target.position.set(-5, 0, 0);

export default SUN;
