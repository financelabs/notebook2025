import React, { useState } from "react";
import { useSelector } from "react-redux"; // useDispatch
//import firebase from "gatsby-plugin-firebase";


//import { useInView } from 'react-intersection-observer';
//import { createPost } from "../features/posts/postsSlice";

import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

import { selectApplication } from "../features/application/applicationSlice";

function MultipleChoicesQuiz({quiz}) {
    const [show, setShow] = useState(false);
    const [showAnswer, setShowAnswer] = useState(null);
    const [answerIsRight, setAnswerIsRight] = useState(null);
    const [value, setValue] = useState("");
  
  //  const dispatch = useDispatch();
    // const content = useSelector(selectSpreadsheetProtoData);
    const email = useSelector(selectApplication).email;
    const user = useSelector(selectApplication).user;
    const avatarUrl = useSelector(selectApplication)?.avatarUrl;
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    function handleCheckboxChange(event) {
      // console.log(event.target.id);
      // const target = event.target;
      // const checked = target.checked;
      // const name = target.name;
      setValue(event.target.id);
    }
  
    function handleCheckAnswer() {
      setShowAnswer(true);
      if (value === quiz.answers[0]) {
        setAnswerIsRight(true);
  
        if (email.length > 6) {
          let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
          let idPost = firebase.database().ref(userEmail).child("posts").push()
            .key;
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
            title: quiz.title,
            theme: quiz.theme,
            answer: quiz.answers[0],
            comment: quiz.title + " (" + quiz.theme + ")", //Тема
            type: "multiplechoices",
            content: quiz.text,
            quizString: quiz.text,
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
            title: quiz.title,
            theme: quiz.theme,
            email: email,
            user: user,
            avatarUrl: !!avatarUrl ? avatarUrl : null,
            timestamp: +Date.now(),
          };
  
        //  dispatch(createPost(postObject));
          var updates = {};
          updates["/usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
          updates[
            "/currentDay/" + currentDay + "/posts/" + idPost
          ] = currentDayObject;
          console.log(updates);
          // updates['/posts/' + user +  newPostKey] = postData;
          // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
         // return firebase.database().ref().update(updates);
        }
      }
    }
  
    return (
      <>
        <Card bg={"light"} style={{ width: "95%", margin: "1rem" }}>
          <Card.Header onClick={handleShow}>{quiz.header}</Card.Header>
          <Card.Body>
            <Card.Title>{!!quiz?.setId ? quiz.setId : ""} {quiz.title}</Card.Title>
            {!!quiz?.imageurl ? (
              <Card.Img variant="top" src={quiz.imageurl} />
            ) : null}
  
            {!!quiz?.laboratoryChart ? <GetChartForQuiz laboratoryChart={quiz.laboratoryChart} /> : null}
            <Card.Text>{ReactHtmlParser(quiz.text)}</Card.Text>
            <Card.Text>
              {/*       <ReactMarkdown source={quiz.text} escapeHtml={false} /> */}
              <Form.Group controlId={"formBasicCheckbox"} >
                {quiz.choices.map((item, index) =>
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
            <InputGroup.Text>
              {showAnswer ? (
                <InputGroup.Text id="basic-addon1">
                  <span
                    className={answerIsRight ? "text-success" : "text-danger"}
                  >
                    Правильный ответ: {quiz.answers[0]}
                  </span>
                </InputGroup.Text>
              ) : (
                <Button variant="outline-secondary" onClick={handleCheckAnswer}>
                  Ответ
                </Button>
              )}
            </InputGroup.Text>
          </InputGroup>
        </Card>
        <Modal show={show} onHide={handleClose} size="xl" scrollable centered>
          <Modal.Header closeButton>
            <Modal.Title>{quiz.title}</Modal.Title>
          </Modal.Header>
          <Card.Body>
            <Card.Title> {quiz.title}</Card.Title>
            <Card.Text>{ReactHtmlParser(quiz.text)}</Card.Text>
            <Card.Text>
              {/* <ReactMarkdown source={quiz.text} escapeHtml={false} /> */}
              {quiz.choices.map((item, index) => (
                <Form.Group controlId={"formBasicCheckbox" + index} key={index}>
                  <Form.Check
                    type="checkbox"
                    label={item}
                    onChange={handleCheckboxChange}
                    name={item}
                  />
                </Form.Group>
              ))}
            </Card.Text>
          </Card.Body>
          <InputGroup size="sm" style={{ width: "95%", margin: "1rem" }}>
            <InputGroup.Text>
              {showAnswer ? (
                <div>
                  <InputGroup.Text id="basic-addon1">
                    <span
                      className={answerIsRight ? "text-success" : "text-danger"}
                    >
                      Правильный ответ: {quiz.answers[0]}
                    </span>
                  </InputGroup.Text>
                  {!!quiz?.hint ? (
                    <div className="text-secondary ml-3 mb-2">
                      {ReactHtmlParser(quiz.hint)}
                    </div>
                  ) : // <ReactMarkdown source={quiz.hint} escapeHtml={false} /></div>
                    null}
                </div>
              ) : (
                <Button variant="outline-secondary" onClick={handleCheckAnswer}>
                  Ответ
                </Button>
              )}
            </InputGroup.Text>
          </InputGroup>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </>
    );
  }

  export default MultipleChoicesQuiz