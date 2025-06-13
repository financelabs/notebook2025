import React from 'react';
import QuizCardWithStorage from './laboratory/QuizCardWithStorage';

function App({quizid}) {
   return (<>
        <QuizCardWithStorage quizid={quizid}/>
      </>);
}

export default App;