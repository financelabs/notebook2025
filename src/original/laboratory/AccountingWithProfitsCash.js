import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; //

import SpreadsheetLayout from "../features/spreadsheet/SpreadsheetLayout";

//import HTMLEditorClassic from "../components/HTMLEditorClassic";
import CKEditorClassic from "../components/CKEditorClassic";



import {
  selectApplication,
  set_currentProject,
} from "../features/application/applicationSlice";
import { selectPosts, setPostsArrayItems, change_post_content } from "../features/posts/postsSlice";

import {
  selectTempData,
  emptyTempData,
  setTempDataArrayItems,
  pushTempDataArrayItem,
  setTempFireNode,
  setTempType,
  // emptyCKEditorData,
  // setCKEditorContent,
  // setCKEditorNodeId
} from "../features/temp/tempSlice";

import {
  selectCKEditorData,
  setCKEditorContent,
  setCKEditorNodeId, emptyCKEditorData
} from "../features/ckeditor/ckeditorSlice";

import {
  selectSpreadsheetProtoData,
  load_data,
  set_spreadsheetTitle,
  createProtoArray,
  createProtoObject,
} from "../features/spreadsheet/spreadsheetSlice";

import { useFirebaseNode } from "../hooks/useFirebaseNode";

import {
  ShowCashFlow,
  ShowFinancialResults,
  ShowBalance,
} from "../mediatemplates/MediaTemplatesAccountingWithProfitsCash";

// import AddMediaItemToPostsGlobalState from "../mediatemplates/AddMediaItemToPostsGlobalState";


import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import Navbar from "react-bootstrap/Navbar";
//import Alert from "react-bootstrap/Alert";

import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";

import balanceItems from "../../utlities/balanceItems";
import timeout from "../../utlities/timeout";

// export default function AccountingWithProfitsCash() {
//   return <div>Бюджетирование</div>
// }

//function AccountingWithProfitsCashLayout() {

import AccountingMachine from "./AccountingMachine";

 function AccountingWithProfitsCash() {
  const applicationState = useSelector(selectApplication);
  const dispatch = useDispatch();
  const email = applicationState?.email;
  const userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");

  const { data: userProjects, loading, error } = useFirebaseNode(
    "usersCraft/" + userEmail + "/posts/"
  );

  React.useEffect(() => {
    dispatch(emptyTempData());
  }, []);

  // console.log(userProjects, loading, error);

  if (!!loading) {
    return <div>...</div>;
  }

  if (!userProjects || !!error) {
    return <NoPrjectLayout />;
  }

  let myAccountingWithProfitsCashProjects = Object.keys(userProjects)
    .map((item) => userProjects[item])
    .filter((item) => item?.type === "accountingwithprofitscash");

  console.log(myAccountingWithProfitsCashProjects);

  if (!myAccountingWithProfitsCashProjects || myAccountingWithProfitsCashProjects.length < 1) {
    return <NoPrjectLayout />;
  }

  return (
    <CheckForProjectSelection
      userEmail={userEmail}
      myAccountingWithProfitsCashProjects={myAccountingWithProfitsCashProjects}
    />
  );
}

function CheckForProjectSelection(props) {
  const firenode = useSelector(selectTempData).firenode;

  let id = !!firenode
    ? firenode
    : props.myAccountingWithProfitsCashProjects[0].id;

  // console.log(id);

  return <SomeProjectsFoundLayout key={id} firenode={id} {...props} />;
}

function SomeProjectsFoundLayout({
  firenode,
  userEmail,
  myAccountingWithProfitsCashProjects,
}) {
  const { data: currentProjectObject, loading, error } = useFirebaseNode(
    "usersCraft/" + userEmail + "/posts/" + firenode
  );

  // console.log(firenode, currentProjectObject, loading, error);

  if (!!loading || !currentProjectObject) {
    return <div>...</div>;
  }

  // console.log(currentProjectObject);

  return (
    <LoadProjectDataToState
      currentProjectObject={currentProjectObject}
      myAccountingWithProfitsCashProjects={myAccountingWithProfitsCashProjects}
    />
  );
}

function isObject(val) {
  if (val === null) {
    return false;
  }
  return typeof val === "function" || typeof val === "object";
}

function LoadProjectDataToState({
  currentProjectObject,
  myAccountingWithProfitsCashProjects,
}) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  // const [htmlfeedback, setHtmlfeedback] = useState(currentProjectObject.comment);

  // function updateHtmlContent(htmlfeedback) {
  //   dispatch(
  //     set_currentProject({
  //       //   currentProjectTitle: item.theme, //title,
  //       currentProjectComment: htmlfeedback,
  //       //   currentProjectMediaAndDataAndTemplatesURL: item.id,
  //       //   currentProjectSourseDataURL: item.answer, //content,
  //       //   currentProjectMoneyScale: item.quizString,
  //       //   currentProjectReportIndicatorsDictionary: item.content
  //       // }));
  //     })
  //   );
  // }

  // console.log(currentProjectObject);

  React.useEffect(() => {

    dispatch(emptyCKEditorData());


    let records = !!currentProjectObject?.content
      ? currentProjectObject.content.map((item) => {
        return item;
      })
      : [];
    //  console.log(records);
    dispatch(
      set_spreadsheetTitle({ spreadsheetTitle: currentProjectObject.title })
    );

    let spreadsheetArray = currentProjectObject?.mediaItems
      ? currentProjectObject?.mediaItems.filter(
        (item) => item.comment === "Расчет"
      )
      : [];

    if (spreadsheetArray.length > 0) {
      dispatch(
        load_data({
          protoData: createProtoArray(spreadsheetArray[0].content),
        })
      );
    } else {
      if (isObject(currentProjectObject.quizString)) {
        //     console.log(currentProjectObject.quizString);
        //     console.log(createProtoArray(currentProjectObject.quizString));
        dispatch(
          load_data({
            protoData: createProtoArray(currentProjectObject.quizString),
          })
        );
      }
    }

    let commentArray = !!currentProjectObject?.mediaItems && currentProjectObject?.mediaItems.filter(item => item.comment === "Комментарий");
    if (commentArray.length > 0) {
      dispatch(set_currentProject({ currentProjectComment: commentArray[0].content }));
      dispatch(setCKEditorContent(commentArray[0].content));
      dispatch(setCKEditorNodeId('accountingwithprofitscashcomment'));


    } else {
      dispatch(set_currentProject({ currentProjectComment: !!currentProjectObject?.comment ? currentProjectObject.comment : "" }));
      dispatch(setCKEditorContent(!!currentProjectObject?.comment ? currentProjectObject.comment : ""));
      dispatch(setCKEditorNodeId('accountingwithprofitscashcomment'));
    }

    dispatch(setTempFireNode(currentProjectObject.id));
    dispatch(setTempDataArrayItems(records));
    dispatch(setTempType(currentProjectObject.title));

    dispatch(setPostsArrayItems(
      !!currentProjectObject?.mediaItems ? currentProjectObject.mediaItems : []
    ))

    // if (!!currentProjectObject?.mediaItems) {
    //   dispatch(setPostsArrayItems(
    //     currentProjectObject.mediaItems.map(item => { return currentProjectObject.mediaItems[item] })));
    // } else {
    //   dispatch(setPostsArrayItems([]))

    //   dispatch(setPostsArrayItems([]));
    // }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div>...</div>;
  }

  function setHtmlfeedback(id, content) {
    dispatch(set_currentProject({ currentProjectComment: content }));
    //   dispatch(setCKEditorContent(content));
  }





  //  let commentArray = !!currentProjectObject?.mediaItems && currentProjectObject?.mediaItems.filter(item => item.comment === "Комментарий");

  return (
    <div>
      <AccountingNavBar
        myAccountingWithProfitsCashProjects={
          myAccountingWithProfitsCashProjects
        }
      />
      <AccountingReports />
      <Container className="mt-3 mb-3">
        <CKEditorClassic
          id={"new_comment_accountingwithprofitscashcomment"} content={currentProjectObject.comment}
          htmlfeedback={currentProjectObject.comment}
          setHtmlfeedback={setHtmlfeedback}
        />
        <EditMediaItems />
      </Container>
      {/* <AddMediaItemToPostsGlobalState /> */}
      <AccountingMachine />
    </div>
  );
}

function EditMediaItems() {
  const mediaItems = useSelector(selectPosts).posts;
  const dispatch = useDispatch();

  function setHtmlfeedbackForMediaList(id, content) {
    dispatch(change_post_content({ id, content }));
    console.log(id, content);
  }

  return <div>
    {!!mediaItems && mediaItems.length > 0 && mediaItems.filter(item => item.comment !== "Комментарий" && item.comment !== "Расчет").map((item, index) =>
      <div key={index}>{item.comment}</div>
      // <CKEditorClassic
      //   key={item.id}
      //   id={item.id} content={item.content}
      //   htmlfeedback={item.content}
      //   setHtmlfeedback={setHtmlfeedbackForMediaList}
      // />
    )}
  </div>
}

function NoPrjectLayout() {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  // const [htmlfeedback, setHtmlfeedback] = useState("Комментарий");

  // function updateHtmlContent(htmlfeedback) {
  //   dispatch(
  //     set_currentProject({
  //       //   currentProjectTitle: item.theme, //title,
  //       currentProjectComment: htmlfeedback,
  //       //   currentProjectMediaAndDataAndTemplatesURL: item.id,
  //       //   currentProjectSourseDataURL: item.answer, //content,
  //       //   currentProjectMoneyScale: item.quizString,
  //       //   currentProjectReportIndicatorsDictionary: item.content
  //       // }));
  //     })
  //   );
  // }

  React.useEffect(() => {
    dispatch(emptyCKEditorData());
    dispatch(setTempFireNode("accountingwithprofitscash"));
    dispatch(setTempDataArrayItems([]));
    dispatch(set_spreadsheetTitle("Расчеты по проекту"));
    dispatch(setTempType("Бюджетирование по трем формам формам"));
    dispatch(setCKEditorContent("<p>Комментарий</p>"));

    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div>...</div>;
  }

  function setHtmlfeedback(id, content) {
    //   dispatch(setCKEditorContent(content));
    dispatch(set_currentProject({ currentProjectComment: content }));
  }


  return (
    <div>
      <AccountingNavBar />
      <AccountingReports />
      <Container className="mt-3 mb-3">
        <CKEditorClassic
          id={"new_comment_accountingwithprofitscashcomment"} content={"<p>Комментарий</p>"}
          htmlfeedback={"<p>Комментарий</p>"}
          setHtmlfeedback={setHtmlfeedback}
        />
      </Container>
      <AccountingMachine />
    </div>
  );
}

function AccountingNavBar({ myAccountingWithProfitsCashProjects = [] }) {
  const applicationState = useSelector(selectApplication);
  const mediaItems = useSelector(selectPosts).posts;
  const dispatch = useDispatch();
  const user = applicationState?.user;
  const email = applicationState?.email;
  const comment = applicationState?.currentProjectComment;
  const avatarUrl = applicationState?.avatarUrl;
  const records = useSelector(selectTempData).dataArray;
  const projectTitle = useSelector(selectTempData).type;
  const id = useSelector(selectTempData).firenode;
  const content = useSelector(selectSpreadsheetProtoData);
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectComment, setProjectComment] = useState("Лекционный пример");

  // console.log(mediaItems);

  function onSave() {

    let filteredMediaItemsWithoutComment = mediaItems.filter(item => item?.comment !== "Комментарий");
    let filteredMediaItemsWithoutCalculations = filteredMediaItemsWithoutComment.filter(item => item?.comment !== "Расчет");
    console.log(filteredMediaItemsWithoutCalculations);

    let mediaItemsForSaving = [
      { mediaType: "html", comment: "Комментарий", content: comment },
      {
        mediaType: "spreadsheet",
        comment: "Расчет",
        content: createProtoObject(content),
      },
      ...filteredMediaItemsWithoutCalculations
    ];

    console.log(mediaItemsForSaving);

    if (email.length > 6) {
      let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
      let idPost = !!id
        ? id
        : basicfirebasecrudservices.getFirebaseNodeKey("usersCraft/" + userEmail + "/posts");

      let postObject = {
        id: idPost, // "accountingwithprofitscash",
        title: projectTitle, // "Планирование и бюджетирование по трем формам"
        theme: "Планирование и бюджетирование", //data.currentProjectTitle.length > 2 ? data.currentProjectTitle : 'Проект',
        answer: "Операции и прогнозная отчетность",
        comment: comment, // projectComment, // "Лекционный пример",
        type: "accountingwithprofitscash",
        content: records,
        quizString: createProtoObject(content),
        mediaItems: mediaItemsForSaving,
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

      //     console.log(postObject);
      //    dispatch(createPost(postObject));
      var updates = {};
      updates["/usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
      updates["/openmedia/" + idPost] = postObject;
      updates[
        "/usersTemplates/projects/" + userEmail + "/" + idPost
      ] = postObject;

      return timeout(3000)
        .then(() => {
          console.log(updates)
          //      DoSavedSuccessfully(true);
          //      doEditPostTitleComment(false);
        });
    }
  }

  const handleShowNewProject = () => setShowNewProject(true);
  const handleCloseNewProject = () => setShowNewProject(false);

  function setFormObject(data) {
    dispatch(
      setTempFireNode(
        basicfirebasecrudservices.getFirebaseNodeKey("usersCraft/" + userEmail + "/posts")
      )
    );
    dispatch(setTempDataArrayItems([]));
    dispatch(set_spreadsheetTitle(data.title));
    dispatch(setTempType(data.title));
    setProjectComment(data.comment);
  }

  return (
    <>
      <Navbar className="bg-light justify-content-between mb-3">
        <Navbar.Brand>{projectTitle}</Navbar.Brand>
        {myAccountingWithProfitsCashProjects.length < 2 ? null : (
          <DrowpdownWithUserProjects
            myAccountingWithProfitsCashProjects={
              myAccountingWithProfitsCashProjects
            }
          />
        )}
      </Navbar>
      <Navbar className="bg-light justify-content-between mb-3">
        <Button
          variant="outline-secondary"
          size="sm"
          //  disabled={updatedRecords.length === 0}
          onClick={() => onSave()}
        >
          Сохр
        </Button>

        <Button
          variant="outline-secondary"
          size="sm"
          //     disabled={records.length === 0}
          onClick={() => handleShowNewProject()}
        >
          +Нов
        </Button>
        <SelectAndImportProjectModalButton />
      </Navbar>
      <Modal
        show={showNewProject}
        onHide={() => handleCloseNewProject()}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Сведения о проекте</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewProjectForm setFormObject={setFormObject} />
        </Modal.Body>
        {/*    <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Закрыть</Button> 
      </Modal.Footer> */}
      </Modal>
    </>
  );
}

function DrowpdownWithUserProjects({
  myAccountingWithProfitsCashProjects = [],
}) {
  const dispatch = useDispatch();
  return (
    <SplitButton
      size="sm"
      drop="left"
      variant="outline-secondary"
      title="Выбрать"
    >
      {" "}
      {myAccountingWithProfitsCashProjects.map((item, index) => (
        <Dropdown.Item
          key={item.id}
          eventKey={index}
          onClick={() => {
            dispatch(setTempFireNode(item.id));
            // dispatch(set_currentProject({
            //   currentProjectTitle: item.theme, //title,
            //   currentProjectComment: item.comment,
            //   currentProjectMediaAndDataAndTemplatesURL: item.id,
            //   currentProjectSourseDataURL: item.answer, //content,
            //   currentProjectMoneyScale: item.quizString,
            //   currentProjectReportIndicatorsDictionary: item.content
            // }));
          }}
        >
          {item.title}
        </Dropdown.Item>
      ))}
    </SplitButton>
  );
}

function AccountingReports() {
  const records = useSelector(selectTempData).dataArray;
  const [open, setOpen] = useState(false);

  let periods = ["2024", "2025", "2026", "2027"]


  return (
    <div>
      <ShowBalance records={records} periods={periods}/>
      <hr />
      <ShowFinancialResults records={records} periods={periods}/>
      <hr />
      <ShowCashFlow records={records} periods={periods}/>
      <hr />
      <SpreadsheetLayout />
      <hr className="mb-3 mt-3" />
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="outline-secondary"
        className="mb-3 mt-3"
      >
        {open ? "Скрыть Журнал" : "Показать журнал"}
      </Button>
      <Collapse in={open}>
        <div id="example-collapse-text">
          <RecordsList records={records} />
        </div>
      </Collapse>
    </div>
  );
}



let modalForm = [
  { name: "title", title: "Название", type: "text" },
  { name: "comment", title: "Комментарий", type: "textarea" },
];

function NewProjectForm() {
  const applicationState = useSelector(selectApplication);
  const dispatch = useDispatch();
  const email = applicationState?.email;
  const user = applicationState?.user;
  const avatarUrl = applicationState?.avatarUrl;

  async function handleSubmit(e) {
    e.preventDefault();
    const currentTarget = e.currentTarget;
    const formdata = new FormData(currentTarget);
    let { title, comment } = Object.fromEntries(formdata);
    console.log(title, comment);
    setFormObject({title, comment})
    .then(()=>window.location.reload())
   
  }

async  function setFormObject(data) {
    if (email.length > 6) {
      let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
      let idPost = basicfirebasecrudservices.getFirebaseNodeKey("usersCraft/" + userEmail + "/posts");

      let postObject = {
        id: idPost, // "accountingwithprofitscash",
        title: data.title, // "Планирование и бюджетирование по трем формам"
        theme: "Планирование и бюджетирование", //data.currentProjectTitle.length > 2 ? data.currentProjectTitle : 'Проект',
        answer: "Операции и прогнозная отчетность",
        comment: data.comment, // "Лекционный пример",
        type: "accountingwithprofitscash",
        content: [],
        quizString: "Операции и прогнозная отчетность",
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

      var updates = {};
      updates["/usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
      // updates['/openmedia/' + idPost] = postObject;
      // updates["/usersTemplates/projects/" + userEmail + '/' + idPost] = postObject;
      console.log(updates)
      let res = await timeout(3000)
      .then(()=>   console.log(updates))
      return res
    }

 
  }

  return (
    <Form onSubmit={handleSubmi}>
      {modalForm.map((item) => (
        <InputGroup className="mb-3" size="sm" key={item.name}>
          <InputGroup>
            <InputGroup.Text style={{ width: "8rem" }}>
              {item.title}
            </InputGroup.Text>
          </InputGroup>
          <FormControl
            key={item.name}
            name={item.name}
            type={item.type}
           as={item.type === "textarea" ? "textarea" : "input"}
          />
        </InputGroup>
      ))}
      <Button variant="outline-secondary" type="submit" size="sm">
        Сохранить
      </Button>
    </Form>
  );
}

function RecordsList({ records }) {

  const [filter, setFilter] = useState({ d: null, k: null });

function handleSubmit(e) {
    e.preventDefault();
    const currentTarget = e.currentTarget;
    const formdata = new FormData(currentTarget);
    let { d, k } = Object.fromEntries(formdata);
    console.log(d, k);
    setFilter({ d, k}); 
   
  }

  let uniqueD = [...new Set(records.map((item) => item.d))];
  let uniqueK = [...new Set(records.map((item) => item.k))];

  // console.log(uniqueD); console.log(uniqueK); console.log(filter);

  let filteredDrecords = !!filter.d
    ? records.filter((item) => item.d === filter.d)
    : records.map((item) => item);
  let filteredKrecords = !!filter.k
    ? filteredDrecords.filter((item) => item.k === filter.k)
    : filteredDrecords.map((item) => item);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
          <Form.Group  controlId="formAssetIncreaseLiabiliesDecrease">
            <Form.Label>Активы +, Пассивы -</Form.Label>
            <Form.Control as="select"  name="d" required>
              {uniqueD.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Form.Control>
          </Form.Group>
          </Col>
         
         <Col>
         <Form.Group controlId="formAssetDecreaseLiabiliesIncrease">
            <Form.Label>Активы -, Пассивы +</Form.Label>
            <Form.Control as="select"   name="k" required>
              {uniqueK.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Form.Control>
          </Form.Group>
         </Col>
         
        </Row>
        <Container>
          <Row>
            <Col>
              <Button variant="outline-secondary" type="submit">
                Применить фильтр
              </Button>
            </Col>
            <Col>
              <Button
                variant="outline-secondary"
                onClick={() => setFilter({ d: null, k: null })}
              >
                Все операции
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>

      {filteredKrecords.map((row, index) => (
        <Row key={index}>
          <Col xs={2}>
            <small>{row.period}</small>
          </Col>
          <Col xs={3}>
            <small>{row.d}</small>
          </Col>
          <Col xs={3}>
            <small>{row.k}</small>
          </Col>
          <Col xs={4}>
            <small>{row.sum}</small>
            {!!row?.type ? <small>{" " + row.type}</small> : <small> </small>}
          </Col>
        </Row>
      ))}
    </Container>
  );
}

let templateProjects = [
  {
    id: 1,
    title: "МНб-26",
    firenode:
      "usersCraft/katyakaterinamasha_yandex_ru/posts/accountingwithprofitscash",
  },
];

function SelectAndImportProjectModalButton() {
  const [showImportProject, setShowImportProject] = useState(false);

  const applicationState = useSelector(selectApplication);
  const dispatch = useDispatch();
  const email = applicationState?.email;
  const user = applicationState?.user;

  const handleOpenImportProject = () => setShowImportProject(true);
  const handleCloseImportProject = () => setShowImportProject(false);

  function closeModalImportProject(firenode, title) {
    let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
    let idPost = basicfirebasecrudservices.getFirebaseNodeKey("usersCraft/" + userEmail + "/posts");
    console.log(firenode);
    basicfirebasecrudservices.getFirebaseNode({
      url: firenode,
      type: "object"
    })
      .then(res => {
        let postObject = {
          ...res,
          id: idPost,
          user: user,
          title: title,
          email: email,
          date: new Intl.DateTimeFormat("ru", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }).format(new Date()),
        };

        var updates = {};
        updates["/usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
        updates["/openmedia/" + idPost] = postObject;
        updates[
          "/usersTemplates/projects/" + userEmail + "/" + idPost
        ] = postObject;
        console.log(updates)

        timeout(3000)
          .then(() => {
            window.location.reload();
          })
          .catch((error) => console.log(error));

        // dispatch(set_spreadsheetTitle({ spreadsheetTitle: snapshot.title }));
        // dispatch(setTempFireNode(idPost));
        // dispatch(setTempDataArrayItems(snapshot.content));
        // dispatch(setTempType(snapshot.title));
        // if (!!snapshot?.mediaItems) { dispatch(setPostsArrayItems(snapshot.mediaItems)) }
        // if (isObject(snapshot.quizString)) {
        //   dispatch(load_data({ protoData: createProtoArray(snapshot.quizString) }))
        // };
        // dispatch(set_currentProject({ currentProjectComment: snapshot.comment }))
        // setTimeout(handleCloseImportProject(), 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => handleOpenImportProject()}
      >
        Из Шабл
      </Button>
      <Modal
        show={showImportProject}
        onHide={() => handleCloseImportProject()}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Выберите проект</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Проекты
          <Container>
            {templateProjects.map((item, index) => (
              // {data.map(calc =>
              <Row className="justify-content-md-center m-2" key={index}>
                <Col md="2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() =>
                      closeModalImportProject(item.firenode, item.title)
                    }
                  >
                    Откр
                  </Button>
                </Col>
                <Col md="10">{item.title}</Col>
              </Row>
            ))}
          </Container>
        </Modal.Body>
        {/*    <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Закрыть</Button> 
      </Modal.Footer> */}
      </Modal>
    </>
  );}
  
  export default AccountingWithProfitsCash