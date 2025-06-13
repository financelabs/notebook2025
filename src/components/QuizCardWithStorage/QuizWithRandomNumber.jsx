import React, { useState, useContext } from "react";
import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext.jsx";

//import { Parser as FormulaParser } from "hot-formula-parser";
//import { createPost } from "../features/posts/postsSlice";


import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import ShowQuizMedia from "./ShowQuizMedia.jsx"

import extract from "../../utlities/extract.js";
import createMarkup from "../../utlities/createMarkup.js";

function QuizWithRandomNumber() {
  let state = useContext(GlobalContext);
  let dispatch = useContext(GlobalDispatchContext);

  const [value, setValue] = useState("");
  const [showAnswer, setShowAnswer] = useState(null);
  const [answerIsRight, setAnswerIsRight] = useState(null);

  let { spreadsheetContent, email, user, avatarUrl, loading, set, selectedQuizIndex, randomNumber } = state;

  if (loading || !email || !Array.isArray(set) || !selectedQuizIndex || Array.isArray(set[selectedQuizIndex]?.choices)) { return null }

  let { text, answer: quizanswer, title, theme, setId, header, media, hint } = set[selectedQuizIndex];




  function handleChange(event) {
    setValue(event.target.value);
  }

  let parser = new formulaParser.Parser();
  //let parser = new FormulaParser();



  let quizString = text;
  //let quizString = `this {={var1-10}+1} some {=2+{var1-10}} that can be {=3+{var1-10}} with a {=4+{var1-10}} function`;
  const searchRegExp = /{var1-10}/g;
  const replaceWith = randomNumber.toString();
  quizString = quizString.replace(searchRegExp, replaceWith);

  let answer = quizanswer.replace(searchRegExp, replaceWith);
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
          title: title,
          theme: theme,
          answer: answer,
          comment: title + " (" + theme + ")", //Тема
          type: "spreadsheet",
          content: spreadsheetContent,
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
        console.log(updates);
        // updates['/posts/' + user +  newPostKey] = postData;
        // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
        //   basicfirebasecrudservices.updateFirebaseNode(updates);
        //   return firebase.database().ref().update(updates);
      }
    }
  }

  return (

    <Card bg={"light"} style={{ width: "95%", margin: "1rem" }}>
      <Card.Header >{header}</Card.Header>
      <Card.Body>
        <Card.Title>{!!setId ? setId : ""} {title}</Card.Title>
        <div dangerouslySetInnerHTML={createMarkup(quizString)} />

        {!!media && <ShowQuizMedia media={media} randomNumber={randomNumber} />}
   

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
            size="sm"
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

        {!!hint ?
          <div className="text-secondary ml-3 mb-2 text-break"
            dangerouslySetInnerHTML={createMarkup(hint)} /> : null}
      </>

      )}

      {!!hint && showAnswer ? <div className="text-secondary ml-3 mb-2"
        dangerouslySetInnerHTML={createMarkup(hint)} /> : null}
    </Card>
  );
}

export default QuizWithRandomNumber

