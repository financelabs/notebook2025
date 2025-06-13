import React, { useState } from "react";
//import { useQuizCardContext } from '../services/QuizCardContext';

let Card = ReactBootstrap.Card;
let Modal = ReactBootstrap.Modal;
let Button = ReactBootstrap.Button;
let InputGroup = ReactBootstrap.InputGroup;
let Form = ReactBootstrap.Form;

function GetChartForQuiz() {
  return null
}


function CDNMultipleChoicesQuiz(quiz) {
  const [show, setShow] = useState(false);
  const [showAnswer, setShowAnswer] = useState(null);
  const [answerIsRight, setAnswerIsRight] = useState(null);
  const [value, setValue] = useState("");

  console.log(quiz)
  //  const tasks = useTasks();

  //  const dispatch = useDispatch();
  // const content = useSelector(selectSpreadsheetProtoData);
  //const email = useEmail();
  //const user = useUser();
  //const avatarUrl = useAvatarUrl();

  //console.log(useQuizCardContext)

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

      if (quiz.email.length > 6) {


        let idPost = basicfirebasecrudservices.getFirebaseNodeKey("usersCraft/" + quiz.userEmail + "/posts");
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
          email: quiz.email,
          user: quiz.user,
          avatarUrl: quiz.avatarUrl,
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
          email: quiz.email,
          user: quiz.user,
          avatarUrl: quiz.avatarUrl,
          timestamp: +Date.now(),
        };

        let updates = {};
        updates["/usersCraft/" + quiz.userEmail + "/posts/" + idPost] = postObject;
        updates[
          "/currentDay/" + currentDay + "/posts/" + idPost
        ] = currentDayObject;
        console.log(updates);

       basicfirebasecrudservices.updateFirebaseNode(updates).then(res => console.log(res))

      }
    }
  }

  return <>
    <Card bg={"light"} style={{ width: "95%", margin: "1rem" }}>
      <Card.Header onClick={handleShow}>{!!quiz?.header ? quiz.header : "Типовая задача"}</Card.Header>

      <Card.Body>
        <Card.Title>{!!quiz?.setId ? quiz.setId : ""} {quiz.title}</Card.Title>
        {!!quiz?.imageurl ? (
          <Card.Img variant="top" src={quiz.imageurl} />
        ) : null}

        {!!quiz?.laboratoryChart ? <GetChartForQuiz laboratoryChart={quiz.laboratoryChart} /> : null}

        <Card.Text
          dangerouslySetInnerHTML={{ __html: quiz.text }}>
        </Card.Text>

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
        <Card.Title>{quiz.title}</Card.Title>
        <Card.Text
          dangerouslySetInnerHTML={{ __html: quiz.text }}>
        </Card.Text>
        <Card.Text>
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
                <div className="text-secondary ml-3 mb-2"
                  dangerouslySetInnerHTML={{ __html: quiz.hint }}
                />
              ) :
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





}

export default CDNMultipleChoicesQuiz