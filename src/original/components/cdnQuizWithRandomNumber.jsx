
let { useSelector } = ReactRedux;
let { useState } = React;
let { Card, InputGroup, Button, FormControl } = ReactBootstrap;

//import { createPost } from "../features/posts/postsSlice.js";

import {
  selectSpreadsheetProtoData,
  createProtoObject
} from "../features/spreadsheet/cdnSpreadsheetSlice.js";

//import { selectApplication } from "../features/application/cdnApplicationSlice.js";
import SpreadsheetLayout from "../features/spreadsheet/cdnSpreadsheetLayout.jsx";

import extract from "../../utlities/extract.js";

function QuizWithRandomNumber(
  {email, user, avatarUrl, header="h", randomNumber = 5, answer: quizanswer, media=null,
  title, imageurl = null, setId = null, text = null, hint = "", theme=""}
) {
  const [value, setValue] = useState("");
  const [showAnswer, setShowAnswer] = useState(null);
  const [answerIsRight, setAnswerIsRight] = useState(null);

  //  const dispatch = useDispatch();
  const content = useSelector(selectSpreadsheetProtoData);

//  let { email, user, avatarUrl } = useSelector(selectApplication);

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
          title: title,
          theme: theme,
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
        //   return firebase.database().ref().update(updates);
      }
    }
  }

  return <Card bg={"light"} style={{ width: "95%", margin: "1rem" }}>
    <Card.Header>{header}</Card.Header>
    <Card.Body>
      <Card.Title>{!!setId ? setId : ""} {title}</Card.Title>
      <div dangerouslySetInnerHTML={{ __html: quizString }} />

    
      {/* 
        {!!media && <ShowQuizMedia media={media} randomNumber={randomNumber} />}
        
      */}

      <SpreadsheetLayout quizString={quizString} theme={theme} />
      
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

      {!!hint ? (
        <div className="text-secondary ml-3 mb-2 text-break"
          dangerouslySetInnerHTML={{ __html: hint }}>
        </div>
      ) : // <ReactMarkdown source={props.hint} escapeHtml={false} /></div>
        null}
    </>

    )}

    {!!hint && showAnswer ? <div className="text-secondary ml-3 mb-2"
      dangerouslySetInnerHTML={{ __html: hint }} /> :
      null}
  </Card>
}

export default QuizWithRandomNumber
