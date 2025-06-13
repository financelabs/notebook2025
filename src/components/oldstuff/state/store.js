import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from "@reduxjs/toolkit/query";
import { fincalculationsApi } from '../services/fincalculations';
import applicationReducer from '../features/application/applicationSlice';
import spreadsheetReducer from '../features/spreadsheet/spreadsheetSlice';



let store = configureStore({
    reducer: {
        application: applicationReducer,
        spreadsheet: spreadsheetReducer,
        [fincalculationsApi.reducerPath]: fincalculationsApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(fincalculationsApi.middleware),
    devTools: true,
});

setupListeners(store.dispatch);

export default store

