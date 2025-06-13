import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; //

import SpreadsheetLayout from "../features/spreadsheet/SpreadsheetLayout";

// import HTMLEditorClassic from "../components/HTMLEditorClassic";
// import CKEditorClassic from "../components/CKEditorClassic";



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
import balanceContoArray from "../../utlities/balanceContoArray";


import {pushItemToArray, selectCaseData } from "../features/case/caseSlice";


// export default function AccountingWithProfitsCash() {
//   return <div>Бюджетирование</div>
// }


function AccountingMachine() {
    const dispatch = useDispatch();

    const [d, setD] = useState(null);
    const [k, setK] = useState(null);
  
      //  const [periods, setPeriods] = useState(["2024", "2025", "2026", "2027"]);
    // const applicationState = useSelector(selectApplication);
    // const user = applicationState?.user;
    // const email = applicationState?.email;
    // const comment = applicationState?.currentProjectComment;
    // const avatarUrl = applicationState?.avatarUrl;
    // const records = useSelector(selectTempData).dataArray;
    // const projectTitle = useSelector(selectTempData).type;
    // const id = useSelector(selectTempData).firenode;
  //  const content = useSelector(selectSpreadsheetProtoData);

    let { id, type, dataArray: records, title, theme, spreadsheetObject: content, periods, tasks,  currentTaskIndex } = useSelector(selectCaseData);
    let { user, email, comment: projectComment, avatarUrl, userEmail } = useSelector(selectApplication);
  
    async function onSave(updatedRecs) {
      if (userEmail) {
       // let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
        let idPost = !!id
          ? id
          : basicfirebasecrudservices.getFirebaseNodeKey("usersCraft/" + userEmail + "/posts");
  
        let postObject = {
          id: idPost, // "accountingwithprofitscash",
          title,
          theme,
          answer: "Операции и прогнозная отчетность",
          comment: projectComment, // projectComment, // "Лекционный пример",
          type,
          content: updatedRecs,
          quizString: createProtoObject(content),
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
      //  updates["/openmedia/" + idPost] = postObject;
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
  
    function handleChange(e) {
      let { name, value } = e.target;
      console.log(name, value);
      if (name === "d") { setD(value) }
      if (name === "k") { setK(value) }
    }
  
    async function handleSubmit(e) {
      e.preventDefault();
      const currentTarget = e.currentTarget;
      const formdata = new FormData(currentTarget);
      let { d, k, sum, bookD, bookK, comment } = Object.fromEntries(formdata);
      console.log(d, k, sum, bookD, bookK, comment);
      comment = !!tasks[currentTaskIndex]?.text ? tasks[currentTaskIndex].text : "" + "<br>" + comment;
      dispatch(pushTempDataArrayItem({ d, k, sum, bookD, bookK, comment }));
      dispatch(pushItemToArray({arrayName: "dataArray" , item: { d, k, sum, bookD, bookK,
        comment: comment }}));  

      onSave([...records, { d, k, sum, bookD, bookK, comment }]).then(() => {
        setD(null);
        setK(null);
        currentTarget.reset();
      });
    }
  
  
    // const onSubmit = (data) => {
    //   //     updateRecords((draft) => { draft.push(data)});
    //   dispatch(pushTempDataArrayItem(data));
    //   reset({ d: "...", k: "...", sum: 0 });
    //   setTimeout(onSave([...records, data]), 1000);
    //   //   console.log(data);
    // };
  
    let capitalIncrease, capitalDecrease, cashIncrease, cashDecrease, costsCalculation;
  
    if (d === "Нераспределенная прибыль") { capitalIncrease = true }
    if (k === "Нераспределенная прибыль") { capitalDecrease = true }
  
    if (d === "Деньги") { cashIncrease = true }
    if (k === "Деньги") { cashDecrease = true }
  
    if (d === "Незавершенное производство") { costsCalculation = true }
  
  
  
    return (
      <div key={id}>
        <div className="p-3 mb-2 bg-secondary text-white">Новая операция</div>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="formStatePeriod">
                <Form.Label>Период</Form.Label>
                <Form.Control as="select" name="period" required>
                  {["...", ...periods].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formStateD">
                <Form.Label>Актив+ или Пассив- (Дт)</Form.Label>
                <Form.Control as="select" name="d" required onChange={handleChange}>
                  {["...", ...balanceItems]
                    .map(item => { return <option key={item}>{item}</option> })}
  
                </Form.Control>
              </Form.Group>
            </Col>
  
            <Col>
              <Form.Group controlId="formStateK">
                <Form.Label>Актив- или Пассив+ (Кт)</Form.Label>
                <Form.Control as="select" name="k" required onChange={handleChange}>
                  {["...", ...balanceItems]
                    .map(item => { return <option key={item}>{item}</option> })}
  
                </Form.Control>
              </Form.Group>
            </Col>
  
            <Col>
              <Form.Group controlId="formStateSum">
                <Form.Label>Сумма</Form.Label>
                <Form.Control as="input" name="sum" required />
              </Form.Group>
            </Col>
  
          </Row>
  
          {capitalIncrease ? (
            <Row>
              <Col>
                <Form.Group as={Col} controlId="formCapitalIncrease">
                  <Form.Label>Увеличение капитала (прибыль, доход)</Form.Label>
                  <Form.Control as="select" name="type" required>
                    <option>...</option>
                    <option>Выручка</option>
                    <option>Прочие доходы</option>
                    <option>Дивиденды к получению</option>
                    <option>Проценты к получению</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          ) : null}
  
          {capitalDecrease ? (
            <Row>
              <Col>
                <Form.Group controlId="formCapitalDecrease">
                  <Form.Label>Уменьшение капитала (убыток, расходы)</Form.Label>
                  <Form.Control as="select" name="type" required>
                    <option>...</option>
                    <option>Себестоимость продукции, работ, услуг</option>
                    <option>Коммерческие расходы</option>
                    <option>Управленческие расходы</option>
                    <option>Проценты к уплате</option>
                    <option>Прочие расходы</option>
                    <option>Налог на прибыль</option>
                    <option>Дивиденды к начислению</option>
                  </Form.Control>
                </Form.Group>
              </Col>
  
            </Row>
          ) : null}
  
          {cashIncrease ? (
            <Row>
              <Col>
                <Form.Group controlId="formCashIncrease">
                  <Form.Label>Поступление денежных средств</Form.Label>
                  <Form.Control as="select" name="type" required>
                    <option>...</option>
                    <option>Поступления по текущей деятельности</option>
                    <option>Поступления по инвестиционной деятельности</option>
                    <option>Поступления по финансовой деятельности</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          ) : null}
  
          {cashDecrease ? (
            <Row>
              <Col>
                <Form.Group controlId="formCashDecrease">
                  <Form.Label>Платежи (выбытие) денежных средств</Form.Label>
                  <Form.Control as="select" name="type" required>
                    <option>...</option>
                    <option>Платежи по текущей деятельности</option>
                    <option>Платежи по инвестиционной деятельности</option>
                    <option>Платежи по финансовой деятельности</option>
                  </Form.Control>
                </Form.Group>
              </Col>
  
            </Row>
          ) : null}
  
          {costsCalculation ? (
            <Row>
              <Col>
                <Form.Group controlId="formCostsCalculation">
                  <Form.Label>Статья калькуляции</Form.Label>
                  <Form.Control as="select" name="type" required>
                    <option>...</option>
                    <option>Материальные затраты (Прямые затраты)</option>
                    <option>Оплата труда и соцстрахование (Прямые затраты)</option>
                    <option>Амортизация (Постоянные затраты)</option>
                    <option>Услуги и работы (Прямые затраты)</option>
                    <option>Услуги и работы (Косвенные затраты)</option>
                    <option>Реклама (Косвенные затраты)</option>
                    <option>Материальные затраты (Косвенные затраты)</option>
                    <option>
                      Оплата труда и соцстрахование (Косвенные затраты)
                    </option>
                    <option>
                      Управленческие расходы (другие Косвенные затраты)
                    </option>
                    <option>Коммерческие расходы (другие Косвенные затраты)</option>
                  </Form.Control>
                </Form.Group>
              </Col>
  
            </Row>
          ) : null}

                    <Row>
                          <Col> {
                              !!d && <Form.Group controlId="formStateD">
                                  <Form.Label>Д</Form.Label>
                                  <Form.Control as="select" name="bookD" onChange={handleChange} size="sm" required>
                                      {["...", ...balanceContoArray.find(item => item.id === d).children]
                                          .map(item => { return <option key={item}>{item}</option> })}
                                  </Form.Control>
                              </Form.Group>
                          }
                          </Col>
          
                          <Col>
                              {!!k && <Form.Group controlId="formStateK">
                                  <Form.Label>К</Form.Label>
                                  <Form.Control as="select" name="bookK" onChange={handleChange} size="sm" required>
                                      {["...", ...balanceContoArray.find(item => item.id === k).children]
                                          .map(item => { return <option key={item}>{item}</option> })}
                                  </Form.Control>
                              </Form.Group>}
                          </Col>
          
                      </Row>

                     
                      <Form.Group className="mb-3" controlId="formComment">
                              <Form.Label>Содержание</Form.Label>
                              <Form.Control as="textarea" rows={3} name="comment" />
                            </Form.Group>
                     
  
          <Button variant="outline-secondary my-3" type="submit">Провести операцию</Button>
        </Form>
      </div>
    );
  }

  export default AccountingMachine