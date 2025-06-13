import { createSlice } from "@reduxjs/toolkit";

export const tempSlice = createSlice({
  name: 'temp',
  initialState: {
    dataObject: {},
    dataArray: [],
    dataString: "",
    firenode: null,
    type: null,
    ckeditor_node_id: null,
    ckeditor_node_content: null,
  },
  reducers: {
    setTempDataObject: (state, action) => {
      state.dataObject = action.payload?.dataObject;
      state.firenode = action.payload?.firenode;
      state.type = action.payload?.type;
    },
    setTempDataArrayItems: (state, action) => {
      state.dataArray = action.payload;
    },
    pushTempDataArrayItem: (state, action) => {
      state.dataArray.push(action.payload);
    },
    addArrayItemsToTempDataArray: (state, action) => {
      let newDataArray = [...state.dataArray, ...action.payload];
      state.dataArray = newDataArray;
    },
    setTempFireNode: (state, action) => {
      state.firenode = action.payload;
    },
    setTempType: (state, action) => {
      state.type = action.payload;
    },
    emptyTempData: (state) => {
      state.dataObject = {};
      state.dataArray = [];
      state.firenode = null;
      state.type = null;
      state.dataString=""
    },
    setTempDataString:  (state, action) => {
      state.dataString = action.payload;
    }, 
    emptyCKEditorData:  (state, action) => {
      state.ckeditor_node_id = null;
      state.ckeditor_node_content = null;
    },
    setCKEditorContent:  (state, action) => {
      state.ckeditor_node_content = action.payload;
    },
    setCKEditorNodeId:  (state, action) => {
      state.ckeditor_node_id = action.payload;
    }    
  },
});

export const { setTempDataObject, pushTempDataArrayItem, addArrayItemsToTempDataArray, setTempDataArrayItems, setTempFireNode,
  setTempType, emptyTempData, setTempDataString, emptyCKEditorData, setCKEditorContent, setCKEditorNodeId  } = tempSlice.actions;

export const selectTempData = state => state.temp;


// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = amount => dispatch => {
//     setTimeout(() => {
//       dispatch(incrementByAmount(amount));
//     }, 1000);
//   };


export default tempSlice.reducer;