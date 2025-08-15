let { useSelector } = ReactRedux;
//let { useState } = React;
//let { Card, Pagination, Navbar, Form, InputGroup, Button, ButtonGroup } = ReactBootstrap;

import Cell from "./cdnCel";
import AlphabetRow from "./cdnAlphabetRow";
import NumbersColumns from "./cdnAlphabetRow";

import {
  // selectSpreadsheetValue,
  selectSpreadsheetData,
  selectSpreadsheetFormulaRowIndex,
  selectSpreadsheetFormulaColumnIndex,
  selectSpreadsheetExpand

} from "./cdnSpreadsheetSlice";


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
  