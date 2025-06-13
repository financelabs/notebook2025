import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectSpreadsheetProtoData,
  selectSpreadsheetData,
  update_formula,
  update_data,

} from "./spreadsheetSlice";




function Cell(props) {
    const data = useSelector(selectSpreadsheetData)[props.rowIndex][
      props.columnIndex
    ];
    const proDataValue = useSelector(selectSpreadsheetProtoData)[props.rowIndex][
      props.columnIndex
    ];
  
    const dispatch = useDispatch();
    const [value, setValue] = useState(data);
  
    useEffect(() => {
      setValue(data);
    }, [data]);
  
    function onKeyPressOnInput(e) {
      if (e.key === "Enter") {
        let valueChecked = isNaN(value) ? (!!value ? value : "") : +value;
        dispatch(
          update_data({
            rowIndex: props.rowIndex,
            columnIndex: props.columnIndex,
            value: valueChecked,
          })
        );
        dispatch(
          update_formula({
            rowIndex: props.rowIndex,
            columnIndex: props.columnIndex,
            value: !!value ? value : "",
          })
        );
      }
    }
  
    function clicked() {
      dispatch(
        update_formula({
          rowIndex: props.rowIndex,
          columnIndex: props.columnIndex,
          value: proDataValue,
        })
      );
    }
  
    return (
      <input
        type="text"
        className={props.active ? "cells__input__active" : "cells__input"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClick={() => clicked()}
        onKeyPress={(e) => onKeyPressOnInput(e)}
      />
    );
  }

  export default Cell