import React from 'react';

import store from '../components/state/store'
import { Provider } from 'react-redux'

import BabelQuizCardWithStorage from './mediatemplates/BabelQuizCardWithStorage';


function App({quizid}) {
  return <Provider store={store}>
    <BabelQuizCardWithStorage quizid={quizid}/>
  </Provider>
}


// Find all DOM containers, and render Like buttons into them.
document.querySelectorAll('.like_button_container')
  .forEach(domContainer => {
   // Read the comment ID from a data-* attribute.
   // const commentID = parseInt(domContainer.dataset.quizid, 10);
    const root = ReactDOM.createRoot(domContainer);
    root.render(
      <App quizid={domContainer.dataset.quizid} />
    );
  });
