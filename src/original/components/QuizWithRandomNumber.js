
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//import { Parser as FormulaParser } from "hot-formula-parser";
import parse from 'html-react-parser';

import { createPost } from "../features/posts/postsSlice";

import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";


import {
  selectSpreadsheetProtoData,
  createProtoObject
} from "../features/spreadsheet/spreadsheetSlice";

import { selectApplication } from "../features/application/applicationSlice";

import SpreadsheetLayout from "../features/spreadsheet/SpreadsheetLayout";


import extract from "../../utlities/extract.js";

function QuizWithRandomNumber(props) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const [showAnswer, setShowAnswer] = useState(null);
  const [answerIsRight, setAnswerIsRight] = useState(null);

  const dispatch = useDispatch();
  const content = useSelector(selectSpreadsheetProtoData);
  const email = useSelector(selectApplication).email;
  const user = useSelector(selectApplication).user;
  const avatarUrl = useSelector(selectApplication)?.avatarUrl;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleChange(event) {
    setValue(event.target.value);
  }

  let parser = new formulaParser.Parser();
  //let parser = new FormulaParser();



  let quizString = props.text;
  //let quizString = `this {={var1-10}+1} some {=2+{var1-10}} that can be {=3+{var1-10}} with a {=4+{var1-10}} function`;
  const searchRegExp = /{var1-10}/g;
  const replaceWith = props.randomNumber.toString();
  quizString = quizString.replace(searchRegExp, replaceWith);

  let answer = props.answer.replace(searchRegExp, replaceWith);
  answer = Math.round(parser.parse(answer).result * 1000) / 1000;

  let stringExtractor = extract(["{=", "}"]);
  let stuffIneed = stringExtractor(quizString);
  //console.log(stuffIneed);
  // Outputs: [ 'is', 'text', 'extracted', 'reusable' ]

  for (let i = 0; i < stuffIneed.length; i++) {
    let feedback = Math.round(parser.parse(stuffIneed[i]).result * 1000) / 1000;
    // console.log(answer);
    quizString = quizString.replace("{=" + stuffIneed[i] + "}", feedback);
  }

  function handleCheckAnswer() {
    setShowAnswer(true);
    if (
      parseFloat(value) / parseFloat(answer) < 1.02 &&
      parseFloat(value) / parseFloat(answer) > 0.98
    ) {
      setAnswerIsRight(true);
      if (email.length > 6) {
        let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
        let idPost = basicfirebasecrudservices.getFirebaseNodeKey("usersCraft/" + userEmail + "/posts");
        // firebase.database().ref(userEmail).child("posts").push().key;
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
          answer: answer,
          comment: props.title + " (" + props.theme + ")", //Тема
          type: "spreadsheet",
          content: createProtoObject(content),
          quizString: quizString,
          deleted: false,
          email: email,
          user: user,
          avatarUrl: !!avatarUrl ? avatarUrl : null,
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

        dispatch(createPost(postObject));
        var updates = {};
        updates["/usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
        updates[
          "/currentDay/" + currentDay + "/posts/" + idPost
        ] = currentDayObject;
        // updates['/posts/' + user +  newPostKey] = postData;
        // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
        basicfirebasecrudservices.updateFirebaseNode(updates);
        //   return firebase.database().ref().update(updates);
      }
    }
  }

  return (
    <>
      <Card bg={"light"} style={{ width: "95%", margin: "1rem" }}>
        <Card.Header onClick={handleShow}>{props.header}</Card.Header>
        <Card.Body>
          <Card.Title>{!!props?.setId ? props.setId : ""} {props.title}</Card.Title>
          <Card.Text>{parse(quizString)}</Card.Text>
          {!!props?.media && <ShowQuizMedia media={props.media} randomNumber={props.randomNumber} />}
          {/* <Card.Text>
            <ReactMarkdown source={quizString} escapeHtml={false} />
          </Card.Text> */}
          <SpreadsheetLayout quizString={quizString} theme={props.theme} />
        </Card.Body>

        {showAnswer ? (
          <InputGroup size="sm" style={{ width: "95%", margin: "1rem" }}>


            <InputGroup.Text id="basic-addon1">
              <span
                className={answerIsRight ? "text-success" : "text-danger"}
              >
                Правильный ответ: {answer}
              </span>
            </InputGroup.Text>

            <FormControl
              value={value}
              type="number"
              onChange={handleChange}
              aria-label="Answer"
              aria-describedby="inputGroup-answer"
              readOnly
            />
          </InputGroup>
        ) : (<>
          <InputGroup size="sm" style={{ width: "95%", margin: "1rem" }}>

            <Button variant="outline-secondary" size="sm" onClick={handleCheckAnswer}>
              Ответ
            </Button>

            <FormControl
              value={value}
              type="number"
              onChange={handleChange}
              aria-label="Answer"
              aria-describedby="inputGroup-answer"
            />
          </InputGroup>

          {!!props?.hint ? (
            <div className="text-secondary ml-3 mb-2 text-break">
              {parse(props.hint)}
            </div>
          ) : // <ReactMarkdown source={props.hint} escapeHtml={false} /></div>
            null}
        </>

        )}

        {!!props?.hint && showAnswer ? (
          <Card.Text><div className="text-secondary ml-3 mb-2">
            {parse(props.hint)}
          </div></Card.Text>

        ) : // <ReactMarkdown source={props.hint} escapeHtml={false} /></div>
          null}
      </Card>
      <Modal show={show} onHide={handleClose} size="xl" scrollable centered>
        <Modal.Header closeButton>
          <small>{props.title}</small>
          {/* <Modal.Title>{props.title}</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <small>{parse(quizString)}</small>
          {/* <ReactMarkdown source={quizString} escapeHtml={false} /> */}
          <SpreadsheetLayout
            quizString={quizString}
            title={props.title}
            answer={answer}
            answerIsRight={answerIsRight}
            theme={props.theme}
          />
        </Modal.Body>
        <Modal.Footer>
          <InputGroup size="sm" style={{ width: "95%", margin: "1rem" }}>

            {showAnswer ? (<>
              <InputGroup.Text id="basic-addon1">
                <span
                  className={answerIsRight ? "text-success text-break" : "text-danger text-break"}
                >
                  Правильный ответ: {answer}
                </span>
              </InputGroup.Text>

              {!!props?.hint ? (
                <div className="text-secondary ml-3 mb-2 text-break">
                  {parse(props.hint)}
                </div>
              ) : // <ReactMarkdown source={props.hint} escapeHtml={false} /></div>
                null}
            </>

            ) : (
              <Button variant="outline-secondary" size="dm" onClick={handleCheckAnswer}>
                Ответ
              </Button>
            )}

            <FormControl
              value={value}
              type="number"
              onChange={handleChange}
              aria-label="Answer"
              aria-describedby="inputGroup-answer"
            />
          </InputGroup>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default QuizWithRandomNumber
