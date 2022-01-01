import { useEffect, useState } from "react";
import * as S from "./GuiStyles";

export default function Gui(props) {
  const [subOptions, setSubOptions] = useState({ align: false });
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
            <button>Add rotation point</button>
            <button>Rotate&scale</button>
            <button>Adjust scale</button>
          </>
        ) : null}
      </S.SeconderyActions>
    </S.Gui>
  );
}

// export default Gui;
