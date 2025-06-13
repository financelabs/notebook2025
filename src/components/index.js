import React from 'react';
import ReactDOM from 'react-dom/client';

import store from './state/store'
import { Provider } from 'react-redux'

import App from './App';

ReactDOM.createRoot(document.querySelector('#root')).render(
   <Provider store={store}>
      <App />
    </Provider>
   
);