import React, { useState, useContext } from "react";
import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";

import GetChartForQuiz from "./GetChartForQuiz";


//import { Parser as FormulaParser } from "hot-formula-parser";
import createMarkup from "../../utlities/createMarkup";

//import ApexEmptyOptionsChart from "../mediatemplates/ApexEmptyOptionsChart.js";
//import ScatterChartAbstractBetaCases from "../laboratory/ScatterChartAbstractBetaCases.js";

import Card from "react-bootstrap/Card";

import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";





function MultipleChoicesQuiz() {
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalContext);

    const [showAnswer, setShowAnswer] = useState(null);
    const [answerIsRight, setAnswerIsRight] = useState(null);
    const [value, setValue] = useState("");

    let {  email, user, avatarUrl, loading, set, selectedQuizIndex } = state;

    if (loading || !email || !Array.isArray(set) || !selectedQuizIndex ) { return null}

    Array.isArray(set[selectedQuizIndex]?.choices)

    return <div>MultipleChoicesQuiz</div>


    console.log(state.set[selectedQuizIndex]);

    let { answers, laboratoryChart, choices, imageurl, text, answer, title, theme, setId, header, media, hint } = state.set[selectedQuizIndex];


    function handleCheckboxChange(event) {
        // console.log(event.target.id);
        // const target = event.target;
        // const checked = target.checked;
        // const name = target.name;
        setValue(event.target.id);
    }

    function handleCheckAnswer() {
        setShowAnswer(true);
        if (value === answers[0]) {
            setAnswerIsRight(true);

            if (email.length > 6) {
                let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
                let idPost = basicfirebasecrudservices.getFirebaseNodeKey("usersCraft/" + userEmail + "/posts");
                let currentDay = new Intl.DateTimeFormat("en", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })
                    .format(new Date())
                    .replace(/[^a-zA-Z0-9]/g, "_");

                let postObject = {
                    id: idPost, //Math.floor(Math.random() * 1001),
                    title: title,
                    theme: theme,
                    answer: answers[0],
                    comment: title + " (" + theme + ")", //Тема
                    type: "multiplechoices",
                    content: text,
                    quizString: text,
                    deleted: false,
                    email: email,
                    user: user,
                    avatarUrl: !!avatarUrl ? avatarUrl : "",
                    date: new Intl.DateTimeFormat("ru", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                    }).format(new Date()), //Date().toJSON()
                };

                let currentDayObject = {
                    id: idPost,
                    title: title,
                    theme: theme,
                    email: email,
                    user: user,
                    avatarUrl: !!avatarUrl ? avatarUrl : null,
                    timestamp: +Date.now(),
                };

                dispatch({
                    type: "PUSH_ITEM_TO_ARRAY",
                    payload: { arrayName: "posts", item: postObject }
                });

                var updates = {};
                updates["/usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
                updates[
                    "/currentDay/" + currentDay + "/posts/" + idPost
                ] = currentDayObject;
                // updates['/posts/' + user +  newPostKey] = postData;
                // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
                basicfirebasecrudservices.updateFirebaseNode(updates);
                // return firebase.database().ref().update(updates);
            }
        }
    }

    return (
       
            <Card bg={"light"} style={{ width: "95%", margin: "1rem" }}>
                <Card.Header>{header}</Card.Header>
                <Card.Body>
                    <Card.Title>{!!setId ? setId : ""} {title}</Card.Title>
                    {!!imageurl ? (
                        <Card.Img variant="top" src={imageurl} />
                    ) : null}

                    {!!laboratoryChart ? <GetChartForQuiz laboratoryChart={laboratoryChart} /> : null}
                    <div  dangerouslySetInnerHTML={createMarkup(text)}/>
                    <Card.Text>
                        {/*       <ReactMarkdown source={props.text} escapeHtml={false} /> */}
                        <Form.Group controlId={"formBasicCheckbox"} >
                            {choices.map((item, index) =>
                                <Form.Check
                                    key={index}
                                    type='radio' // "checkbox"
                                    label={item}
                                    onChange={handleCheckboxChange}
                                    name={"item"}
                                    id={item}
                                    className="mb-2"
                                />
                            )}
                        </Form.Group>

                    </Card.Text>
                </Card.Body>
                <InputGroup size="sm" style={{ width: "95%", margin: "1rem" }}>



                    {showAnswer ? (<>
                        <InputGroup.Text id="basic-addon1">
                            <span
                                className={answerIsRight ? "text-success text-break" : "text-danger text-break"}
                            >
                                Правильный ответ: {answers[0]}
                            </span>
                        </InputGroup.Text>
                        {!!hint ? (
                            <div className="text-secondary ml-3 mb-2 text-break"  dangerouslySetInnerHTML={createMarkup(hint)}/>
                            
                        ) : // <ReactMarkdown source={props.hint} escapeHtml={false} /></div>
                            null}</>
                    ) : (
                        <Button variant="outline-secondary" onClick={handleCheckAnswer}>
                            Ответ
                        </Button>
                    )}

                </InputGroup>
            </Card>

     
    );
}

export default MultipleChoicesQuiz

