import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";


import {
  // selectSpreadsheetValue,
  selectSpreadsheetProtoData,
  selectSpreadsheetData,
  selectSpreadsheetFormulaValue,
  selectSpreadsheetFormulaRowIndex,
  selectSpreadsheetFormulaColumnIndex,
  add_row_under,
  add_row_before,
  delete_row,
  add_column_after,
  add_column_before,
  delete_column,
  update_formula,
  update_data,
  selectSpreadsheetTitle,
  new_empty_spreadsheet,
  load_data,
  createProtoArray,
  createProtoObject,
  //toggle_expand_view,
  //selectSpreadsheetExpand
} from "./spreadsheetSlice";


function FormulaBlock() {
  const formulaValue = useSelector(selectSpreadsheetFormulaValue);
  const formulaRowIndex = useSelector(selectSpreadsheetFormulaRowIndex);
  const formulaColumnIndex = useSelector(selectSpreadsheetFormulaColumnIndex);

  const [formula, setFormula] = useState("");

  const dispatch = useDispatch();

  React.useEffect(() => {
    setFormula(formulaValue);
  }, [formulaValue]);

  function onKeyPressOnInput(e) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  function handleSubmit() {
    let valueChecked = isNaN(formula)
      ? !!formula
        ? formula.trim()
        : ""
      : +formula;

    // let newProtoData = basicfirebasecrudservices.produce(
    //   spreadsheetSelector.protoData, (draft) => {
    //      draft[formulaRowIndex][formulaColumnIndex] = valueChecked;
    //   })
    // let newData = createNewDraft(newProtoData);
    // spreadsheetDispatch({
    //   type: "SEED_STATE",
    //   payload: {
    //     objects: {
    //       protoData: newProtoData,
    //       data: newData
    //     },
    //   },
    // });

    dispatch(
      update_data({
        rowIndex: formulaRowIndex,
        columnIndex: formulaColumnIndex,
        value: valueChecked,
      })
    );
    //   setFormula("");
  }

  return (
    <div className="cell-content">
      <div>fx</div>
      <Button
        onClick={() => handleSubmit()}
        variant="outline-secondary"
        size="sm"
      >
        <span>&#10003;</span>
      </Button>
      {/* <button onClick={() => handleSubmit()}> <span >&#10003;</span></button> */}

      <div>
        <input
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            marginLeft: "3px",
            fontSize: "1.2rem",
          }}
          value={formula === "" ? formulaValue : formula}
          onChange={(e) => setFormula(e.target.value)}
          onKeyPress={(e) => onKeyPressOnInput(e)}
        />
      </div>
    </div>
  );
}

export default FormulaBlock