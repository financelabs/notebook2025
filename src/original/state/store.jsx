import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from "@reduxjs/toolkit/query";

import spreadsheetReducer from '../features/spreadsheet/spreadsheetSlice';
import applicationReducer from '../features/application/applicationSlice';
import postsReducer from '../features/posts/postsSlice';
import dataReducer from '../features/data/dataSlice';
//import ckeditorReducer from '../features/ckeditor/ckeditorSlice';
import tempReducer from '../features/temp/tempSlice';
import caseReducer from '../features/case/caseSlice';

import throttle from 'lodash/throttle';

// let store = configureStore({
//   reducer: {}
// })

let store = configureStore({
    reducer: {
      spreadsheet: spreadsheetReducer,
      application: applicationReducer,
      posts: postsReducer,
      data: dataReducer,
      temp: tempReducer,
      case: caseReducer,
   //   ckeditor: ckeditorReducer,
     // [userDataApi.reducerPath]: userDataApi.reducer
    },
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat(userDataApi.middleware),
    // devTools: true,
  });

  // store.subscribe(throttle(() => {
  //   saveState({
  //    posts: [],
  //    data: store.getState().data,
  //     application: store.getState().application,
  //     spreadsheet: store.getState().spreadsheet
  //   });
  // }, 10000
  // ))
  
  const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('econolabs', serializedState);
    } catch (err) {
      console.log(err)
    }
  }
  
  setupListeners(store.dispatch);
  

function ReduxStoreProvider({children}) {
    return <React.StrictMode>
    <Provider store={store}>
      {children}
    </Provider>
  </React.StrictMode>
}

export { store }
export default  ReduxStoreProvider


