let { useDispatch, useSelector } = ReactRedux;
let { useState, useEffect } = React;

let { Card, Modal, Alert, FormControl, InputGroup, Button, ButtonGroup, Container, Row, Col, Form } = ReactBootstrap;

import ShowXlTableArrayOfArrays from "../../mediatemplates/cdnShowXlTableArrayOfArrays";

import { selectApplication } from "../application/cdnApplicationSlice";
import { createPost } from "./cdnPostsSlice";

import {
  selectSpreadsheetProtoData,
  load_data,
  new_empty_spreadsheet,
  set_spreadsheetTitle,
  createProtoArray,
  createProtoObject,
  selectSpreadsheetExpand,
  toggleExpandView
} from "../spreadsheet/cdnSpreadsheetSlice";


export default function PostsButtonGroup(props) {
  const dispatch = useDispatch();
  const expandView = useSelector(selectSpreadsheetExpand);
  const [showSave, setShowSave] = useState(false);
  const [showOpen, setShowOpen] = useState(false);

  const handleClose = () => {
    setShowSave(false);
    setShowOpen(false);
  };
  const handleSaveShow = () => setShowSave(true);
  const handleOpenShow = () => setShowOpen(true);

  return (
    <>
      <ButtonGroup aria-label="Posts Buttons" size="sm">
        <Button
          variant="outline-secondary"
          onClick={() => dispatch(new_empty_spreadsheet())}
          data-toggle="tooltip"
          data-placement="bottom"
          title="Новый расчет"
        >
          Нов
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => handleSaveShow()}
          data-toggle="tooltip"
          data-placement="bottom"
          title="Сохранить расчет"
        >
          Сохр
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => handleOpenShow()}
          data-toggle="tooltip"
          data-placement="bottom"
          title="Открыть расчет"
        >
          Откр
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => dispatch(toggleExpandView())}
          data-toggle="tooltip"
          data-placement="bottom"
          title={props.expandView ? "Свернуть расчет" : "Развернуть расчет"}
        >
          {expandView ? "Сверн" : "Разв"}
        </Button>
      </ButtonGroup>
      {showSave ? (
        <SavePostModal
          show={showSave}
          handleClose={handleClose}
          quizString={props?.quizString}
          title={props?.title}
          answer={props?.answer}
          theme={props?.theme}
          answerIsRight={props?.answerIsRight}
        />
      ) : null}
      {showOpen ? (
        <SelectAndOpenModal show={showOpen} handleClose={handleClose} />
      ) : null}
    </>
  );
}

function SavePostModal(props) {
  const dispatch = useDispatch();
  const content = useSelector(selectSpreadsheetProtoData);
  const email = useSelector(selectApplication).email;
  const user = useSelector(selectApplication).user;
  const avatarUrl = useSelector(selectApplication)?.avatarUrl;
  const [savedSuccessfully, DoSavedSuccessfully] = useState(false);


  const [formDataObject, setFormDataObject] = useState({
    title: "",
    comment: "",
  });
  const [editPostTitleComment, doEditPostTitleComment] = useState(true);

  function setFormObject(objectWithNamesValues) {
    doEditPostTitleComment(false);
    setFormDataObject(objectWithNamesValues);
  }

  function savePost() {
    if (email.length > 6) {
      let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
      let idPost = basicfirebasecrudservices.getFirebaseNodeKey("/usersTemplates/posts/");

      let postObject = {
        id: idPost,
        title: formDataObject.title.length > 2 ? formDataObject.title : props?.title,
        theme: "Мои шаблоны",
        answer: "",
        comment: formDataObject.comment, //Тема
        type: "spreadsheet",
        content: createProtoObject(content),
        quizString: "", //!!props?.quizString ? props.quizString : "",
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

      dispatch(createPost(postObject));
      var updates = {};
      updates['/usersCraft/' + userEmail + '/posts/' + idPost] = postObject;
      updates['/usersTemplates/posts/' + idPost] = postObject;
      // updates['/currentDay/' + currentDay + '/posts/' + idPost] = currentDayObject;
      // updates['/posts/' + user +  newPostKey] = postData;
      // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
      return basicfirebasecrudservices.updateFirebaseNode(updates)
        .then(() => DoSavedSuccessfully(true));

    }
  }

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Сохранить расчет как Шаблон</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="primary">
          <Alert.Heading>Скорее всего, вам не нужно пользоваться этой функцией</Alert.Heading>
          <p className="mb-1">
            Расчеты-таблицы по Правильно решенным задачам сохраняются в Рабочей тетради Автоматически
          </p>
        </Alert>
        {editPostTitleComment ? (

          <PostFormHook title={!!props.title ? props.title : ''} setFormObject={setFormObject} />
        ) : (
          <Card>
            <Card.Header>Шаблон</Card.Header>
            <Card.Body>
              <Card.Title>{formDataObject.title}</Card.Title>
              <Card.Text>
                {formDataObject.comment}
              </Card.Text>
              <ShowXlTableArrayOfArrays xlArray={createProtoArray(createProtoObject(content), 0, 0)} />
              {savedSuccessfully ? "Сохранено" : <Button
                variant="outline-secondary"
                onClick={() => savePost()}>
                Сохранить шаблон
              </Button>}
            </Card.Body>
          </Card>
        )}
      </Modal.Body>
      {/* <Modal.Footer></Modal.Footer> */}
    </Modal>
  );
}



function PostFormHook({setFormObject}) {

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(e.currentTarget.elements.formTitle.value);
    console.log(e.currentTarget.elements.formComment.value);

    setFormObject({
      title: e.currentTarget.elements.formTitle.value,
      comment: e.currentTarget.elements.formComment.value
    })
  };

  return <Form onSubmit={handleSubmit}>

    <InputGroup className="mb-3" size="sm" controlId="formTitle">
      <InputGroup.Prepend><InputGroup.Text style={{ width: '8rem' }}>Название</InputGroup.Text></InputGroup.Prepend>
      <FormControl
        key={"title"}
        type="text"
        as={"input"}
        name={"formTitle"}
      />
    </InputGroup>

    <InputGroup className="mb-3" size="sm" controlId="formComment">
      <InputGroup.Prepend><InputGroup.Text style={{ width: '8rem' }}>Комментарий</InputGroup.Text></InputGroup.Prepend>
      <FormControl
        key={"comment"}
        type="textarea"
        as={"textarea"}
        name={"formComment"}
      />
    </InputGroup>

    <Button variant="outline-secondary" type="submit" size="sm">Сохранить</Button>

  </Form>


}


function SelectAndOpenModal(props) {
  const email = useSelector(selectApplication).email;
  let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
  // const [filter, setFilter] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const dispatch = useDispatch();

  const [userPosts, setUserPosts] = useState(null)

  useEffect(() => {

    async function getPosts() {
      let posts = await basicfirebasecrudservices.getFirebaseNode({
        url: "usersCraft/" + userEmail + "/posts/",
        type: "array"
      });
      return posts
    }

    getPosts().then(res => {
      setUserPosts(res)
    })
  }, [])

  function closeModalopenSpreadsheet(content, title) {
    //  console.log(content)
    dispatch(load_data({ protoData: content }));
    dispatch(set_spreadsheetTitle({ spreadsheetTitle: title }));
    setTimeout(props.handleClose(), 3000);
  }


  if (!userPosts) { return <div>...</div> }

  let data = Object.keys(userPosts).map((item) => userPosts[item]).filter((quiz) => quiz.type === "spreadsheet").filter((post) => !post.deleted);

  const uniqueThemes = !!data
    ? [...new Set(data.map((item) => item.theme))]
    : []; // [ 'A', 'B']

  return <Modal size="lg" show={props.show} onHide={props.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Открыть расчет</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {!!uniqueThemes &&
        uniqueThemes.map((theme) =>
          <Button
            key={theme}
            variant="outline-secondary"
            onClick={() => setSelectedTheme(theme)}
            // data-toggle="tooltip"
            // data-placement="bottom"
            // title="Сохранить расчет"
            className="m-1"
            size="sm"
          >
            {theme}
          </Button>
        )}
      <Container>
        {data
          .filter((quiz) => quiz.theme === selectedTheme)
          .map((calc, index) =>
            // {data.map(calc =>
            <Row className="justify-content-md-center" key={index}>
              <Col md="auto">
                <Button variant="outline-secondary" size="sm" onClick={() => closeModalopenSpreadsheet(createProtoArray(calc.content), calc.title)}>
                  Откр
                </Button>
              </Col>
              <Col>{calc.title}</Col>
              <Col>{calc.comment}</Col>
            </Row>
          )}
      </Container>

    </Modal.Body>
    {/* <Modal.Footer>
               <Button variant="outline-secondary" onClick={() => props.handleClose()}>S</Button>
        </Modal.Footer> */}
  </Modal>
}
