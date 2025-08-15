//import { configureStore } from 'RTK';
import counterReducer from '../../original/features/counter/cdnCounterSlice';

let { configureStore } = RTK;

let store = configureStore ({
  reducer: {
    counter: counterReducer,
  },
})

console.log(store)

export default store;
