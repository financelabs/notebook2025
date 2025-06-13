import React from 'react';
import ReducerContextCRUD from '../components/templates/ReducerContextCRUD';
import { ChoicesProvider } from './features/choices/ChoicesContext';


function App({ quizid }) {
  
  return <ReducerContextCRUD quizid={quizid} />
}


// Find all DOM containers, and render Like buttons into them.
document.querySelectorAll('.like_button_container')
  .forEach(domContainer => {
    // Read the comment ID from a data-* attribute.
    // const commentID = parseInt(domContainer.dataset.quizid, 10);
    const root = ReactDOM.createRoot(domContainer);
    root.render(
      <ChoicesProvider>
        <App quizid={domContainer.dataset.quizid} />
      </ChoicesProvider>



    );
  });
