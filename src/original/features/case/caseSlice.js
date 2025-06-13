import { createSlice } from "@reduxjs/toolkit";


export const caseSlice = createSlice({
  name: 'case',
  initialState: {
    id: null,
    type: null, //"accountingwithprofitscash"
    dataArray: [],
    title: null,
    theme: null,
    spreadsheetObject: {A1: ""},
    periods: ["2024", "2025", "2026", "2027"],
    tasks: [],
    currentTaskIndex: 0,
    ckeditorContent: null,
    ckeditorNodeId: null,
    selectedQuizCaseId: null
    // dataObject: {},
    // dataArray: [],
    // dataString: "",
    // firenode: null,    
    // ckeditor_node_id: null,
    // ckeditor_node_content: null,
  },
  reducers: {
    setObjectKeyValue: (state, action) => {
      state[action.payload?.key] = action.payload.value;     
    },
    setObjectKeyValuePairs: (state, action) => {
    //  console.log(action.payload);
     Object.keys(action.payload).forEach(objKey => {
      state[objKey] = action.payload[objKey];
     })  
    },
    pushItemToArray:  (state, action) => {
      state[action.payload.arrayName].push(action.payload.item) 
     },


    // setTempDataObject: (state, action) => {
    //   state.dataObject = action.payload?.dataObject;
    //   state.firenode = action.payload?.firenode;
    //   state.type = action.payload?.type;
    // },
    // setTempDataArrayItems: (state, action) => {
    //   state.dataArray = action.payload;
    // },
    // pushTempDataArrayItem: (state, action) => {
    //   state.dataArray.push(action.payload);
    // },
    // addArrayItemsToTempDataArray: (state, action) => {
    //   let newDataArray = [...state.dataArray, ...action.payload];
    //   state.dataArray = newDataArray;
    // },
    // setTempFireNode: (state, action) => {
    //   state.firenode = action.payload;
    // },
    // setTempType: (state, action) => {
    //   state.type = action.payload;
    // },
    // emptyTempData: (state) => {
    //   state.dataObject = {};
    //   state.dataArray = [];
    //   state.firenode = null;
    //   state.type = null;
    //   state.dataString=""
    // },
    // setTempDataString:  (state, action) => {
    //   state.dataString = action.payload;
    // }, 
    // emptyCKEditorData:  (state, action) => {
    //   state.ckeditor_node_id = null;
    //   state.ckeditor_node_content = null;
    // },
    // setCKEditorContent:  (state, action) => {
    //   state.ckeditor_node_content = action.payload;
    // },
    // setCKEditorNodeId:  (state, action) => {
    //   state.ckeditor_node_id = action.payload;
    // }    
  },
});

export const { 
  setObjectKeyValue, setObjectKeyValuePairs, pushItemToArray
  // setTempDataObject, pushTempDataArrayItem, addArrayItemsToTempDataArray, setTempDataArrayItems, setTempFireNode,
  // setTempType, emptyTempData, setTempDataString, emptyCKEditorData, setCKEditorContent, setCKEditorNodeId
  } = caseSlice.actions;

export const selectCaseData = state => state.case;
export const selectCaseId = state => state.case.selectedQuizCaseId;
export const selectCaseTasks = state => state.case.tasks;
export const selectCKEditorContent = state => state.case.ckeditorContent;
export const selectCKEditorNodeId = state => state.case.ckeditorNodeId;




// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = amount => dispatch => {
//     setTimeout(() => {
//       dispatch(incrementByAmount(amount));
//     }, 1000);
//   };


export default caseSlice.reducer;