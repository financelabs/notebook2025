import { createSlice } from "@reduxjs/toolkit";

export const ckeditorSlice = createSlice({
  name: 'ckeditor',
  initialState: {
    ckeditor_node_id: null,
    ckeditor_node_content: null,
  },
  reducers: {
    emptyCKEditorData: (state, action) => {
      state.ckeditor_node_id = null;
      state.ckeditor_node_content = null;
    },
    setCKEditorContent: (state, action) => {
      state.ckeditor_node_content = action.payload;
    },
    setCKEditorNodeId: (state, action) => {
      state.ckeditor_node_id = action.payload;
    }
  },
});

export const { emptyCKEditorData, setCKEditorContent, setCKEditorNodeId } = ckeditorSlice.actions;

export const selectCKEditorData = state => state.ckeditor;


// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = amount => dispatch => {
//     setTimeout(() => {
//       dispatch(incrementByAmount(amount));
//     }, 1000);
//   };


export default ckeditorSlice.reducer;