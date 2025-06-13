import React, { useState, useEffect, useContext } from "react";
import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";

import { produce } from "immer";

import createNewDraft from "../../original/features/spreadsheet/createNewDraft";
import { createProtoObject } from "../../original/features/spreadsheet/spreadsheetSlice";

function Cell({active, rowIndex, columnIndex }) {
  const dispatch = useContext(GlobalDispatchContext);
  const state = useContext(GlobalContext);

  const data = state.data[rowIndex][columnIndex];
  const proDataValue = state.protoData[rowIndex][columnIndex];

  const [value, setValue] = useState(data);

  useEffect(() => {
    setValue(data);
  }, [data]);

  function onKeyPressOnInput(e) {
    if (e.key === "Enter") {
      let valueChecked = isNaN(value) ? (!!value ? value : "") : +value;

      const newProtoData = produce(state.protoData, draft => {
        draft[rowIndex][columnIndex] = valueChecked;
      })

      dispatch({
        type: "SEED_STATE",
        payload: { objects: {
          data: createNewDraft(newProtoData),
          spreadsheetContent: createProtoObject(newProtoData),
          protoData: newProtoData,
          formulaValue: valueChecked,
          formulaRowIndex: rowIndex,
          formulaColumnIndex: columnIndex
        } }
      })

     
    }
  }

  function clicked() {
    dispatch({
      type: "SEED_STATE",
      payload: { objects: {
        formulaValue: proDataValue,
        formulaRowIndex: rowIndex,
        formulaColumnIndex: columnIndex
      } }
    })

   
  }

  return (
    <input
      type="text"
      className={active ? "cells__input__active" : "cells__input"}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClick={() => clicked()}
      onKeyPress={(e) => onKeyPressOnInput(e)}
    />
  );
}

export default Cell