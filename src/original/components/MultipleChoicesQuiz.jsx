import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//import { Parser as FormulaParser } from "hot-formula-parser";
import parse from 'html-react-parser';

import { createPost } from "../features/posts/postsSlice";


//import ApexEmptyOptionsChart from "../mediatemplates/ApexEmptyOptionsChart.js";
//import ScatterChartAbstractBetaCases from "../laboratory/ScatterChartAbstractBetaCases.js";

import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";


import { selectApplication } from "../features/application/applicationSlice";


function MultipleChoicesQuiz(props) {
  const [showAnswer, setShowAnswer] = useState(null);
  const [answerIsRight, setAnswerIsRight] = useState(null);
  const [value, setValue] = useState("");

//  const dispatch = useDispatch();
  // const content = useSelector(selectSpreadsheetProtoData);
  const email = useSelector(selectApplication).email;
  const user = useSelector(selectApplication).user;
  const avatarUrl = useSelector(selectApplication)?.avatarUrl;



  function handleCheckboxChange(event) {
    // console.log(event.target.id);
    // const target = event.target;
    // const checked = target.checked;
    // const name = target.name;
    setValue(event.target.id);
  }

  function handleCheckAnswer() {
    setShowAnswer(true);
    if (value === props.answers[0]) {
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
          title: props.title,
          theme: props.theme,
          answer: props.answers[0],
          comment: props.title + " (" + props.theme + ")", //Тема
          type: "multiplechoices",
          content: props.text,
          quizString: props.text,
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
          title: props.title,
          theme: props.theme,
          email: email,
          user: user,
          avatarUrl: !!avatarUrl ? avatarUrl : null,
          timestamp: +Date.now(),
        };

     //   dispatch(createPost(postObject));
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
    <>
      <Card bg={"light"} style={{ width: "95%", margin: "1rem" }}>
        <Card.Header onClick={handleShow}>{props.header}</Card.Header>
        <Card.Body>
          <Card.Title>{!!props?.setId ? props.setId : ""} {props.title}</Card.Title>
          {!!props?.imageurl ? (
            <Card.Img variant="top" src={props.imageurl} />
          ) : null}

          {!!props?.laboratoryChart ? <GetChartForQuiz laboratoryChart={props.laboratoryChart} /> : null}
          <Card.Text>{parse(props.text)}</Card.Text>
          <Card.Text>
            {/*       <ReactMarkdown source={props.text} escapeHtml={false} /> */}
            <Form.Group controlId={"formBasicCheckbox"} >
              {props.choices.map((item, index) =>
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
                Правильный ответ: {props.answers[0]}
              </span>
            </InputGroup.Text>
            {!!props?.hint ? (
              <div className="text-secondary ml-3 mb-2 text-break">
                {parse(props.hint)}
              </div>
            ) : // <ReactMarkdown source={props.hint} escapeHtml={false} /></div>
              null}</>
          ) : (
            <Button variant="outline-secondary" onClick={handleCheckAnswer}>
              Ответ
            </Button>
          )}

        </InputGroup>
      </Card>

    </>
  );
}

export default MultipleChoicesQuiz