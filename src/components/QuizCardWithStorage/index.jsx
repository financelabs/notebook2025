import React, { useReducer } from 'react';

import caseReducer from '../../features/case/caseReducer';
import { GlobalContext, GlobalDispatchContext } from '../../features/GlobalContext';

import { createProtoArray } from '../../original/features/spreadsheet/spreadsheetSlice';
import createNewDraft from '../../original/features/spreadsheet/createNewDraft';

import QuizSet from './QuizSet';
import SingleQuizCardWithStorage from "./SingleQuizCardWithStorage";
import QuizWithRandomNumber from './QuizWithRandomNumber';
import MultipleChoicesQuiz from './MultipleChoicesQuiz';
import QuizCardUserInitialLoad from "./QuizCardUserInitialLoad";
import GreenHeader from '../Spreadsheet/GreenHeader';
import ActiveCells from '../Spreadsheet/ActiveCells';
import IconBar from '../Spreadsheet/IconBar';

let initialState = {
  loading: true,
  email: null,
  user: null,
  avatarUrl: "",
  userEmail: "",

  selectedQuizIndex: null,
  set: [],

  expandView: true,
  spreadsheetContent: { A1: "2", A2: "2", A3: "=A1+A2"},
  protoData: createProtoArray({}, 6, 6),
  data: createNewDraft(createProtoArray({A1: "2", A2: "2", A3: "=A1+A2"}, 6, 6)),
  formulaValue: "", //createProtoArray(emptyProtoDataObject)[0][0],
  formulaRowIndex: 0,
  formulaColumnIndex: 0,
  spreadsheetTitle: '',

   quizString: "",
   title: "",
   answer: "",
   answerIsRigh: ""
}



function QuizCardWithStorage({ children }) {
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

QuizCardWithStorage.QuizSet = QuizSet;
QuizCardWithStorage.SingleQuizCardWithStorage = SingleQuizCardWithStorage;
QuizCardWithStorage.QuizWithRandomNumber = QuizWithRandomNumber;
QuizCardWithStorage.MultipleChoicesQuiz = MultipleChoicesQuiz;
QuizCardWithStorage.QuizCardUserInitialLoad = QuizCardUserInitialLoad;
QuizCardWithStorage.GreenHeader = GreenHeader;
QuizCardWithStorage.ActiveCells = ActiveCells;
QuizCardWithStorage.IconBar = IconBar;


export default QuizCardWithStorage