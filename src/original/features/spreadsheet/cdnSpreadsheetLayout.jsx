//import React from "react";
//import { useSelector, useDispatch } from "react-redux";
//import useClippy from 'use-clippy';
//import SheetClip from 'sheetclip';

//import CompactSpreadsheetLayout from "./CompactSpreadsheetLayout";
import FormulaBlock from "./cdnFormulaBlock";
//import Cell from "./Cell";
//import wCompactSpreadsheetLayout from "./NewCompactSpreadsheetLayout";

//import { arrayToExcel } from "../../hooks/ArrayToExcel";

import GreenHeader from "./cdnGreenHeader";
import ActiveCells from "./cdnActiveCells";
import IconBar from "./cdnIconBar";

import useMedia from "../../hooks/useMedia";

//function makeArray(string) { return string.split("/n").map((line) => line.split("/t")); }

export default function SpreadsheetLayout(props) {

  const screenSize = useMedia(
    // Media queries
    ["(min-width: 810px)", "(min-width: 400px)", "(min-width: 100px)"],
    // Column counts (relates to above media queries by array index)
    ["large", "medium", "small"],
    // Default column count
    "large"
  );

  // if (screenSize === "small") {
  //   return <CompactSpreadsheetLayout screenSize={screenSize} />
  //   //    return <SmallScreenCalculations />;
  // }

  // if (screenSize === 'medium') { return <MediumCalculations /> }

  // if (screenSize === "medium") {
  //   // if (data.length > 3) {
  //   //   dispatch(
  //   //     load_data({
  //   //       protoData: [[""], [""], [""], [""], [""], [""], [""], [""]],
  //   //     })
  //   //   );
  //   // }

  //   return <CompactSpreadsheetLayout screenSize={screenSize} />

  //   //    return <CompactSpreadsheetLayout />;
  // }


  return (
    <div className="excelstyle">
      <GreenHeader />
      <IconBar {...props} />
      <FormulaBlock />
      <ActiveCells />
    </div>
  );
}


