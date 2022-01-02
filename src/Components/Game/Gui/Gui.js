import { useEffect, useState } from "react";
import * as S from "./GuiStyles";

export default function Gui(props) {
  const [subOptions, setSubOptions] = useState({ align: false });
  return (
    <S.Gui>
      {console.log("Gui updated")}
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
          </>
        ) : null}
      </S.SeconderyActions>
    </S.Gui>
  );
}

// export default Gui;
