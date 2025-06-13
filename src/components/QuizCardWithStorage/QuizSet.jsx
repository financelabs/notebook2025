import React, {useContext, useEffect, useState} from "react";

import { GlobalDispatchContext, GlobalContext } from "../../features/GlobalContext";

import { Navbar, ButtonGroup, Button } from "react-bootstrap";

function QuizSet({set, setTitle}) {
    let state = useContext(GlobalContext);
    let dispatch = useContext(GlobalDispatchContext);
   
    useEffect(()=>{
        console.log(set);
       dispatch({
            type: "SEED_STATE",
            payload: { objects: {
              set
            } }
          })
    }, [state.selectedQuizIndex]) // state.loading, 

 

    if (!Array.isArray(set) || state.loading ) { return null}

    function doSelectQuiz(index) {
        console.log(index);
        dispatch({
            type: "SEED_STATE",
            payload: { objects: {
              selectedQuizIndex: index
            } }
          });       
   
      }
    
   
    return <div className="container">
      <Navbar bg="light">
        <Navbar.Brand >{setTitle}</Navbar.Brand>
      </Navbar>
      <br />
      <ButtonGroup size={set.length < 5 ? "lg" : "sm"}>
        {set.map((_, index) => (
          <Button
            variant={state.selectedQuizIndex === index ? "secondary" : "outline-secondary" }
            onClick={() => doSelectQuiz(index)}
            key={index}
          >
            {set.length < 10 ? <span className="m-2" >{index + 1}</span> : <small>{index + 1}</small>}
          </Button>
        ))}
      </ButtonGroup>



      </div>
     
  
     
}

export default QuizSet