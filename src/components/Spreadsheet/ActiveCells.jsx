import React, { useContext } from "react";
import { GlobalContext } from "../../features/GlobalContext";


import AlphabetRow from "../../original/features/spreadsheet/AlphabetRow";
import NumbersColumns from "../../original/features/spreadsheet/NumbersColumns";

import Cell from "./Cell";

function ActiveCells() {
  const state = useContext(GlobalContext);
  let { data, formulaRowIndex, formulaColumnIndex, expandView } = state;

  let numberOfX = data[0].length - 1;
  let numberOfY = data.length;

  if (!expandView) return null;

  return <div
    className="cells"
    style={{
      gridTemplateColumns: `40px repeat(${numberOfX + 1
        }, calc((100% - 50px) / ${numberOfX + 1}))`,
      gridTemplateRows: `repeat(${numberOfY}, 25px)`,
    }}
  >
    <div className="cells__spacer"></div>
    <AlphabetRow x={numberOfX} />
    <NumbersColumns y={numberOfY} />
    {data.map((row, rowIndex) => {
      return row.map((_, columnIndex) => {
        return (
          <Cell
            key={"" + rowIndex + "_" + columnIndex}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            active={
              formulaRowIndex === rowIndex &&
                formulaColumnIndex === columnIndex
                ? true
                : false
            }
          />
        );
      });
    })}
  </div>
}

export default ActiveCells