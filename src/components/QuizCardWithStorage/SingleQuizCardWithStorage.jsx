import React, { useContext, useEffect } from "react";
//import parse from "html-react-parser";

import { GlobalContext } from "../../features/GlobalContext";

import QuizWithRandomNumber from "./QuizWithRandomNumber";
import MultipleChoicesQuiz from "./MultipleChoicesQuiz";

import createMarkup from "../../utlities/createMarkup";
import shuffle from "../../utlities/shuffle";

import { Card } from "react-bootstrap";

function SingleQuizCardWithStorage() {
    let state = useContext(GlobalContext);

    useEffect(()=>{
        console.log(state.selectedQuizIndex);
        console.log(state.set[state.selectedQuizIndex]);
    }, [state.selectedQuizIndex])

    if (!Array.isArray(state?.set) && state.set.length === 0 || !state?.selectedQuizIndex) { return null }

   

    if (state.set[state.selectedQuizIndex]?.choices) {
        let { choices, ...other } = state.set[state.selectedQuizIndex];
        return <MultipleChoicesQuiz choices={shuffle(choices)} {...other} />;
      }

    if (state.set[state.selectedQuizIndex].text.includes("{=")) {
        let randomNumber = Math.random();
        return <QuizWithRandomNumber randomNumber={randomNumber} />;
      }

    let { header, text, imageurl, title } = state.set[state.selectedQuizIndex];

    return <Card bg={"light"} style={{ width: "95%", margin: "1rem" }} >
        <Card.Header>{header}</Card.Header>
        <Card.Body>
            {!!imageurl ? (
                <Card.Img variant="top" src={imageurl} />
            ) : null}
            <Card.Title>{title}</Card.Title>

            <div dangerouslySetInnerHTML={createMarkup(text)}/>
               
           
           
        </Card.Body>
    </Card>
}

export default SingleQuizCardWithStorage