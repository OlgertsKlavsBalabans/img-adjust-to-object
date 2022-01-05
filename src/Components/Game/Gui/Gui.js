import { useEffect, useState } from "react";
import * as S from "./GuiStyles";

export default function Gui(props) {
  const [subOptions, setSubOptions] = useState({ align: false });
  const [cameraDistance, setCameraDistance] = useState(3);
  const [opacity, setOpacity] = useState(0.9);
  const [scale, setScale] = useState(1);

  return (
    <S.Gui>
      <S.MainActions>
        {props.acitveOptions.alignActions ? (
          <button
            onClick={() => {
              setSubOptions({ ...subOptions, align: !subOptions.align });
            }}
          >
            Align actions
          </button>
        ) : null}
      </S.MainActions>
      <S.SeconderyActions>
        {props.acitveOptions.alignActions && subOptions.align ? (
          <>
            <button
              onClick={() => {
                props.addRotationPointPressed();
              }}
            >
              Add rotation point
            </button>
            <button
              onClick={() => {
                props.rotateAndScalePressed();
              }}
            >
              Rotate&scale
            </button>
            <button
              onClick={() => {
                props.adjustScalePressed();
              }}
            >
              Adjust scale
            </button>
            <S.GUIText>Camera distance</S.GUIText>
            <input
              onChange={(e) => {
                setCameraDistance(e.target.value);
                props.cameraDistanceSliderChanged(e.target.value);
              }}
              type="range"
              min="1"
              max="10"
              step={0.1}
              value={cameraDistance}
              id="cameraDistance"
            ></input>
            <S.GUIText>Opacity</S.GUIText>
            <input
              onChange={(e) => {
                setOpacity(e.target.value);
                props.opacitySliderChanged(e.target.value);
              }}
              type="range"
              min="0"
              max="1"
              step={0.05}
              value={opacity}
              id="opacity"
            ></input>
            <S.GUIText>Scale</S.GUIText>
            <input
              onChange={(e) => {
                setScale(e.target.value);
                props.scaleSliderChanged(e.target.value);
              }}
              type="range"
              min="0.1"
              max="2"
              step={0.05}
              value={scale}
              id="scale"
            ></input>
          </>
        ) : null}
      </S.SeconderyActions>
    </S.Gui>
  );
}

// export default Gui;
