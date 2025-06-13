import React, { useReducer } from 'react';

import caseReducer from '../../features/case/caseReducer';
import { GlobalContext, GlobalDispatchContext } from '../../features/GlobalContext';

import { createProtoArray } from '../../original/features/spreadsheet/spreadsheetSlice';
import createNewDraft from '../../original/features/spreadsheet/createNewDraft';

import SpreadsheetLayout from './SpreadsheetLayout';
import GreenHeader from './GreenHeader';
import IconBar from './IconBar';
import ActiveCells from './ActiveCells';

let initialState = {
  loading: true,
  email: null,
  user: null,
  avatarUrl: "",
  userEmail: "",

  spreadsheetContent: {},

 

  protoData: createProtoArray({}, 6, 6),
  data: createNewDraft(createProtoArray({}, 6, 6)),
  formulaValue: "", //createProtoArray(emptyProtoDataObject)[0][0],
  formulaRowIndex: 0,
  formulaColumnIndex: 0,
  spreadsheetTitle: '',
}



function Spreadsheet({ children }) {
    const [state, dispatch] = useReducer(
        caseReducer,
        initialState
    );

     return <div className='container'>
        <GlobalContext.Provider value={state}>
            <GlobalDispatchContext.Provider value={dispatch}>
            { children }
            </GlobalDispatchContext.Provider>
        </GlobalContext.Provider>
       
    </div>
}

Spreadsheet.SpreadsheetLayout = SpreadsheetLayout;
Spreadsheet.GreenHeader = GreenHeader;
Spreadsheet.IconBar = IconBar;
Spreadsheet.ActiveCells = ActiveCells;


export default Spreadsheet