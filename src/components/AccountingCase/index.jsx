import React, { useReducer } from 'react';

import caseReducer from '../../features/case/caseReducer';
import { GlobalContext, GlobalDispatchContext } from '../../features/GlobalContext';

import EditAccountingCaseNavs from './EditAccountingCaseNavs';
import AccountingCaseViewer from './AccountingCaseViewer';
import AccountingCaseMachine from './AccountingCaseMachine';
import AccountingUserNavigation from './AccountingUserNavigation';
import AccountingCaseDetails from './AccountingCaseDetails';
import PageContentWithRandomNumber from "./PageContentWithRandomNumber";
import SaveCaseComponent from "./SaveCaseComponent";
import ShowTaskRecords from "./ShowTaskRecords";
import AccountingUserInitialLoad from "./AccountingUserInitialLoad";
import AccountingCaseWorkBook from './AccountingCaseWorkBook';
import TestShowCaseDetails from "./TestShowCaseDetails";
import AccountingEditorInitialLoad from "./AccountingEditorInitialLoad";

import AccountingCaseConsoleLog from "./AccountingCaseConsoleLog";
import AccountingChooseUser from "./AccountingChooseUser";
import AccountingCaseEditorPages from "./AccountingCaseEditorPages";
import AccountingCaseUserAllAccountingRecords from "./AccountingCaseUserAllAccountingRecords";
import AccountingCaseSelectProject from "./AccountingCaseSelectProject";
import AccountingCaseTaskEditor from "./AccountingCaseTaskEditor";
import Temporary from "./Temporary";
import SelectFromList from './SelectFromList';
import AccountingCaseForm from "./AccountingCaseForm";
import AccountingCaseSelectArray from "./AccountingCaseSelectArray";


let initialState = {
  loading: true,
  email: null,
  user: null,
  avatarUrl: "",
  userEmail: "",
  posts: [],

  selectedItem: {},

  caseIds: [],
  quizescases: [],
  
  groupvatars: [],

  id: null,
  quizString: { A1: "" },
  selectedQuizCaseId: null,
  selectedTaskIndex: null,
  
  records: [],
  bookrecords: [],
  allaccountingrecords: [],
  type: "accountingwithprofitscash",
  periods: ["2024", "2025", "2026", "2027"],
  accountingteacherposts: [],

  // triggerListUpdate: null,
  
  showCaseDetails: false,
  showCaseNewEntry: false,
  showChooseUser: false,
  showAllAccountingRecords: false,
  showCase: false
}



function AccountingCase({ children }) {
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

AccountingCase.EditAccountingCaseNavs = EditAccountingCaseNavs;
AccountingCase.AccountingCaseViewer = AccountingCaseViewer;
AccountingCase.AccountingCaseMachine = AccountingCaseMachine;
AccountingCase.AccountingUserNavigation = AccountingUserNavigation;
AccountingCase.AccountingCaseDetails = AccountingCaseDetails;
AccountingCase.PageContentWithRandomNumber = PageContentWithRandomNumber;
AccountingCase.SaveCaseComponent = SaveCaseComponent;
AccountingCase.ShowTaskRecords = ShowTaskRecords;
AccountingCase.AccountingUserInitialLoad = AccountingUserInitialLoad;
AccountingCase.AccountingCaseWorkBook = AccountingCaseWorkBook;
AccountingCase.TestShowCaseDetails = TestShowCaseDetails;
AccountingCase.AccountingEditorInitialLoad = AccountingEditorInitialLoad;
AccountingCase.AccountingCaseConsoleLog = AccountingCaseConsoleLog;
AccountingCase.AccountingChooseUser = AccountingChooseUser;
AccountingCase.AccountingCaseEditorPages = AccountingCaseEditorPages;
AccountingCase.AccountingCaseUserAllAccountingRecords = AccountingCaseUserAllAccountingRecords;
AccountingCase.AccountingCaseSelectProject = AccountingCaseSelectProject;
AccountingCase.AccountingCaseTaskEditor = AccountingCaseTaskEditor;
AccountingCase.SelectFromList = SelectFromList;
AccountingCase.Temporary = Temporary;
AccountingCase.AccountingCaseForm = AccountingCaseForm;
AccountingCase.AccountingCaseSelectArray = AccountingCaseSelectArray;

export default AccountingCase