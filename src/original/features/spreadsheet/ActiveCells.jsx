
import React from "react";
import { useSelector } from "react-redux";

import Cell from "./Cell";

import AlphabetRow from "./AlphabetRow";
import NumbersColumns from "./NumbersColumns";


import {
  // selectSpreadsheetValue,
  selectSpreadsheetData,
  selectSpreadsheetFormulaRowIndex,
  selectSpreadsheetFormulaColumnIndex,
  selectSpreadsheetExpand

} from "./spreadsheetSlice";


function ActiveCells() {
    const expandView = useSelector(selectSpreadsheetExpand);
    const data = useSelector(selectSpreadsheetData);
    //  selectSpreadsheetFormulaValue,
    const formulaRowIndex = useSelector(selectSpreadsheetFormulaRowIndex);
    const formulaColumnIndex = useSelector(selectSpreadsheetFormulaColumnIndex);

    if (!expandView) return null;
  
    let numberOfX = data[0].length - 1;
    let numberOfY = data.length;
  
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

  export default  ActiveCells
  