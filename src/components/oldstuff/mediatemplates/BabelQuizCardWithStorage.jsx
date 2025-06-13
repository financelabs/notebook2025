import React, { useState } from 'react';
import { useFetchOpenQuizCaseByIdQuery } from '../services/fincalculations';
//import MultipleChoicesQuiz from '../laboratory/MultipleChoicesQuiz';

import Select from 'react-select';



function MyComponent() {
  const [topping, setTopping] = useState("Medium")

  const onOptionChange = e => {
    setTopping(e.target.value)
  }

  return <div className='container'>
    <div className="form-check">
  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
   checked={topping === "Regular"}
   onChange={onOptionChange}
  />
  <label className="form-check-label" for="flexRadioDefault1">
    Default radio
  </label>
</div>
<div className="form-check">
  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" 
   checked={topping === "Regular"}
   onChange={onOptionChange}
  />
  <label className="form-check-label" for="flexRadioDefault2">
    Default checked radio
  </label>
</div>
  </div>
  
}
const BabelQuizCardWithStorage = ({ quizid }) => {
  const [hint, showHint] = useState(null);

  const { data, error, isLoading } = useFetchOpenQuizCaseByIdQuery(quizid)
  // Individual hooks are also accessible under the generated endpoints:
  // const { data, error, isLoading } = pokemonApi.endpoints.getPokemonByName.useQuery('bulbasaur')

  if (isLoading) {
    return <div className="d-flex justify-content-center">
      <div className="spinner-grow spinner-grow-sm" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }

  console.log(data, error, isLoading, quizid);

  // let quizesWithText = data.filter(item => !!item?.text);

  // let number = Math.floor(Math.random() * 15);

  // console.log(data.filter(item => !!item?.answers));

  // function createMarkup(html) {
  //   return { __html: html };
  // }


  return (
    <div>
      Ha Ha

      <MyComponent />
      {/* {data?.answers ?
      <MultipleChoicesQuiz quiz={data}/>
      : null} */}
      
      {/* <p>Count: {quizesWithText.length}</p>
      {!!quizesWithText[number]?.exampleQuizString ? <div dangerouslySetInnerHTML={createMarkup(quizesWithText[number].exampleQuizString)} /> : null}
      {!!quizesWithText[number]?.hint ?
        <button className='btn btn-sm btn-outline-secondary'
          onClick={() => showHint(quizesWithText[number].hint)}>Hint</button>
        : null}
      {!!hint ?
        <div dangerouslySetInnerHTML={createMarkup(hint)} />
        : null} */}

    </div>
  );
};

export default BabelQuizCardWithStorage