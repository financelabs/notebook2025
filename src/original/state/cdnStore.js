import counterReducer from '../features/counter/cdnCounterSlice';
import spreadsheetReducer from '../features/spreadsheet/cdnSpreadsheetSlice';
import applicationReducer from '../features/application/cdnApplicationSlice';
import postsReducer from '../features/posts/cdnPostsSlice';
let { configureStore } = RTK;

let store = configureStore({
    reducer: {
        counter: counterReducer,
        spreadsheet: spreadsheetReducer,
        application: applicationReducer,
        posts: postsReducer
    },
})

console.log(store)

export default store;
