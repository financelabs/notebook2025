import { createSlice } from "@reduxjs/toolkit";
import createNewDraft from "./createNewDraft";

import alphabet from "../../../utlities/alphabet";


export function createProtoArray(protoDataObject={}, maxRow = 15, maxColumn = 6) {
  Object.keys(protoDataObject).map((objKey) => {
      const [col, ...row] = objKey;
      let currentColIndex = alphabet.findIndex(item => item === col);
      if (currentColIndex > maxColumn) { maxColumn = currentColIndex };
      if (parseInt(row) > maxRow) { maxRow = parseInt(row) }
  });
//  console.log(maxColumn, maxRow);

  var array = new Array(maxRow);
  for (var i = 0; i < array.length; i++) {
      array[i] = Array(maxColumn + 1).fill('');
  }

  Object.keys(protoDataObject).map((objKey) => {
    const [col, ...row] = objKey;
      let colArrayIndex = alphabet.findIndex((item) => item === col);
      let rowArrayIndex = parseInt(row) - 1;
      array[rowArrayIndex][colArrayIndex] = protoDataObject[objKey];
  });
  return array;
}

export function createProtoObject(protoArray) {
  let protoObject = {};
  for (var i = 0; i < protoArray.length; i++) {
    var row = protoArray[i];
    for (var j = 0; j < row.length; j++) {
      if (protoArray[i][j] !== "") {
        protoObject[alphabet[j] + (i+1)] = protoArray[i][j];
      }
    }
  }
  return protoObject;
}

function insert(arr, index, newItem) {
  return [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index),
  ];
}

export const spreadsheetSlice = createSlice({
  name: "spreadsheet",
  initialState: {
    //    value: 0,
    protoData: createProtoArray({}, 6, 6),
    data: createNewDraft(createProtoArray({}, 6, 6)),
    formulaValue: "", //createProtoArray(emptyProtoDataObject)[0][0],
    formulaRowIndex: 0,
    formulaColumnIndex: 0,
    spreadsheetTitle: '',
    expandView: true
  },
  reducers: {
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
    toggleExpandView: (state) => {
       state.expandView = !state.expandView
     },
    add_row_under: (state) => {
      let add_row_under_newProtoData = JSON.parse(
        JSON.stringify(state.protoData)
      );
      let newRow = new Array(add_row_under_newProtoData[0].length).fill("");
      add_row_under_newProtoData = insert(
        add_row_under_newProtoData,
        state.formulaRowIndex + 1,
        newRow
      );
      state.data = createNewDraft(add_row_under_newProtoData);
      state.protoData = add_row_under_newProtoData;
    },
    add_row_before: (state) => {
      let add_row_before_newProtoData = JSON.parse(
        JSON.stringify(state.protoData)
      );
      let newProtoBeforeRow = new Array(
        add_row_before_newProtoData[0].length
      ).fill("");
      add_row_before_newProtoData = insert(
        add_row_before_newProtoData,
        state.formulaRowIndex,
        newProtoBeforeRow
      );
      state.data = createNewDraft(add_row_before_newProtoData);
      state.protoData = add_row_before_newProtoData;
    },

    delete_row: (state) =>{ 
      let delete_row__newProtoData = JSON.parse(
        JSON.stringify(state.protoData)
      );
      delete_row__newProtoData = delete_row__newProtoData.filter(
        (row, index) => index !== state.formulaRowIndex
      );
      state.data = createNewDraft(delete_row__newProtoData);
      state.protoData = delete_row__newProtoData;
    },

    add_column_after: (state) => {
      let add_column_after__newProtoData = JSON.parse(
        JSON.stringify(state.protoData)
      );
      add_column_after__newProtoData = state.protoData.map((row) => {
        return insert(row, state.formulaColumnIndex + 1, "");
      });
      state.data = createNewDraft(add_column_after__newProtoData);
      state.protoData = add_column_after__newProtoData;
    },

    add_column_before: (state) => {
      let add_column_before__newProtoData = JSON.parse(
        JSON.stringify(state.protoData)
      );
      add_column_before__newProtoData = state.protoData.map((row) => {
        return insert(row, state.formulaColumnIndex, "");
      });
      state.data = createNewDraft(add_column_before__newProtoData);
      state.protoData = add_column_before__newProtoData;
    },

    delete_column: (state)=> {
      let delete_column__newProtoData = JSON.parse(
        JSON.stringify(state.protoData)
      );
      delete_column__newProtoData = state.protoData.map((row) => {
        return row.filter(
          (element, index) => index !== state.formulaColumnIndex
        );
      });
      state.data = createNewDraft(delete_column__newProtoData);
      state.protoData = delete_column__newProtoData;
    },

    update_formula: (state, action) => {
      state.formulaValue = action.payload.value;
      state.formulaRowIndex = action.payload.rowIndex;
      state.formulaColumnIndex = action.payload.columnIndex;
    },
    update_data: (state, action) => {
      let newProtoData = JSON.parse(JSON.stringify(state.protoData));
      newProtoData[action.payload.rowIndex][action.payload.columnIndex] = action.payload.value;
      state.data = createNewDraft(newProtoData);
      state.protoData = newProtoData;
    },
    load_data: (state, action) => {
      state.data = createNewDraft(action.payload.protoData);
      state.protoData = action.payload.protoData;
      state.expandView = true;
    },
    new_empty_spreadsheet: (state) => {
      let protoArray = createProtoArray({}, 6, 6)
      state.protoData = protoArray;
      state.data = createNewDraft(protoArray);
      state.formulaValue = protoArray[0][0];
      state.expandView = true;
    },
    set_spreadsheetTitle: (state, action) => {
      state.spreadsheetTitle = action.payload.spreadsheetTitle;
    },

    loadData: (state, action) => {
      state.data = createNewDraft(action.payload.protoData);
      state.protoData = action.payload.protoData;
      state.expandView = true;
    },
  },
});

export const {
  loadData,
  // increment,
  // decrement,
  // incrementByAmount,
  add_row_under,
  add_row_before,

  delete_row,
  add_column_after,
  add_column_before,
  delete_column,


  update_formula,
  update_data,
  load_data,
  new_empty_spreadsheet,
  set_spreadsheetTitle,

  toggleExpandView
} = spreadsheetSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
//export const selectSpreadsheetValue = (state) => state.spreadsheet.value;

export const selectSpreadsheetProtoData = (state) =>
  state.spreadsheet.protoData;
export const selectSpreadsheetData = (state) => state.spreadsheet.data;

export const selectSpreadsheetFormulaValue = (state) =>
  state.spreadsheet.formulaValue;
export const selectSpreadsheetFormulaRowIndex = (state) =>
  state.spreadsheet.formulaRowIndex;
export const selectSpreadsheetFormulaColumnIndex = (state) =>
  state.spreadsheet.formulaColumnIndex;

export const selectSpreadsheetTitle = (state) =>
  state.spreadsheet.spreadsheetTitle;

 export const selectSpreadsheetExpand = (state) =>
 state.spreadsheet.expandView;

export default spreadsheetSlice.reducer;