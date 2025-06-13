import { produce } from "immer";

function caseReducer(state = {}, action) {
    // console.log(action);
    switch (action.type) {
      case "SEED_STATE": {
        return produce(state, (draft) => {
          Object.keys(action.payload.objects).map((key) => {
            draft[key] = action.payload.objects[key];
          });
        });
      }
  
      // case "ADD_BOOK":
      // return produce(state, (draft) => {
      //   draft.books.list.push({ ...payload });
      // });
  
      case "SEED_ARRAY":
        return produce(state, (draft) => {
          draft[action.payload.arrayName] = action.payload.arrayItems;
        });
  
      case "LOAD_DATA":
        return produce(state, (draft) => {
          draft.data = action.payload.data;
          draft.protoData = action.payload.protoData;
          draft.expandView = true;
        });
  
      case "NEW_EMPTY_SPREADSHEET": {
        return produce(state, (draft) => {
          draft.data = action.payload.data;
          draft.protoData = action.payload.protoData;
          draft.formulaValue = action.payload.protoData[0][0];
          draft.expandView = true;
        });
      }
  
      case "UPDATE_FORMULA":
        return produce(state, (draft) => {
          draft.formulaValue = action.payload.formulaValue;
          draft.formulaRowIndex = action.payload.formulaRowIndex;
          draft.formulaColumnIndex = action.payload.formulaColumnIndex;
          draft.formulaIsInFocus = false;
        });
  
      case "SAVE_CELL_AND_SET_NEXT_CELL_ACTIVE":
        return produce(state, (draft) => {
          draft.data = action.payload.data;
          draft.protoData = action.payload.protoData;
          // action.payload.value
          draft.formulaValue = action.payload.formulaValue;
          draft.formulaRowIndex = action.payload.formulaRowIndex;
          draft.formulaColumnIndex = action.payload.formulaColumnIndex;
        });
  
      case "SET_STORE_OBJECT":
        return produce(state, (draft) => {
          draft[action.payload.key] = action.payload.value;
        });
  
      case "PUSH_ITEM_TO_ARRAY":
        return produce(state, (draft) => {
          draft[action.payload.arrayName].push(action.payload.item);
        });
  
      default:
        return state;
    }
  }
  
  export default caseReducer