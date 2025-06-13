import React, { useEffect, useState, useContext } from "react";

import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";

import processquizwithrandomnumber from "../../utlities/processquizwithrandomnumber";

import timeout from "../../utlities/timeout";

import balanceItems from "../../utlities/balanceItems";
import balanceContoArray from "../../utlities/balanceContoArray";

import SelectFromList from "./SelectFromList";

import extract from "../../utlities/extract";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function getHash(input) {
  let [before, _] = input.split("@");
  // console.log(Math.abs(before.charCodeAt(before.length - 2)))
  return Math.abs(before.charCodeAt(before.length - 2) + input.length * 5);
}

function processTaskText(quiztext, email) {
  if (typeof quiztext === "string" && quiztext.includes("var1-10")) {
    return processquizwithrandomnumber({
      quizString: quiztext,
      answer: "{var1-10}",
      randomNumber: (getHash(email) / 200) * (10 - 1) + 1,
    }).quizString;
  }

  if (typeof quiztext === "string") {
    return quiztext;
  }

  return "";
}

function changeFormulaToX({ quizString, feedback }) {
  if (!quizString.includes("{=")) return quizString;

  const searchRegExp = /{var1-10}/g;
  const replaceWith = "X";
  quizString = quizString.replace(searchRegExp, replaceWith);

  let stringExtractor = extract(["{=", "}"]);
  let stuffIneed = stringExtractor(quizString);
  for (let i = 0; i < stuffIneed.length; i++) {
    quizString = quizString.replace("{=" + stuffIneed[i] + "}", feedback);
  }

  // let stringExtractor = extract(["{=", "}"]);
  // let stuffIneed = stringExtractor(quizString);
  // for (let i = 0; i < stuffIneed.length; i++) {
  //   updatedQuizString = updatedQuizString.replace("{=" + stuffIneed[i] + "}", feedback);
  // }

  return quizString;
}




function AccountingCaseMachine() {
  const dispatch = useContext(GlobalDispatchContext);
  const state = useContext(GlobalContext);

  const [d, setD] = useState(null);
  const [k, setK] = useState(null);

  useEffect(() => {
    console.log(state.groupvatars);
  }, [state.loading, state.showCase, state.selectedTaskIndex, state.selectedQuizCaseId])

  if (state.loading || !state?.showCase || !state?.selectedTaskIndex, !state?.selectedQuizCaseId) return null

  let selectedCase = Array.isArray(state.quizescases) && state.quizescases.find(item => item.id === state.selectedQuizCaseId);

  let taskText;
  //let tasks = Array.isArray(selectedCase?.tasks) ? selectedCase.tasks : null;


  // useEffect(() => {
  //   setTasks(state.tasks);
  // }, [state.currentTaskIndex, state.id]);

  // if (!state.id) return null;

  // let { periods } = state;

  // function handleChange(e) {
  //   let { name, value } = e.target;
  //   console.log(name, value);
  //   if (name === "d") {
  //     setD(value);
  //   }
  //   if (name === "k") {
  //     setK(value);
  //   }
  // }


  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   const currentTarget = e.currentTarget;
  //   const formdata = new FormData(currentTarget);
  //   let { d, k, sum, bookD, bookK, comment, period, type } =
  //     Object.fromEntries(formdata);
  //   // console.log(d, k, sum, bookD, bookK, comment, period);


  //   let taskObject = state?.quizescases.find(item => item.id === state?.id)[state?.currentTaskIndex]

  //   let taskId = taskObject?.id; // tasks[state.currentTaskIndex].id;

  //   let task = taskObject?.text ? taskObject.text : '';

  //   comment = !!task
  //     ? processTaskText(task, state?.email) + "<br>" + comment
  //     : comment;
  //   task = changeFormulaToX({
  //     quizString: task,
  //     feedback: "X руб.",
  //   });
  //   //  console.log("processesed " + task);

  //   let checkedType = !!type ? type : "";

  //   let id = new Intl.DateTimeFormat("ru", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //     hour: "numeric",
  //     minute: "numeric",
  //     second: "numeric",
  //   }).format(new Date()); //Date().toJSON()

  //   dispatch({
  //     type: "PUSH_ITEM_TO_ARRAY",
  //     payload: {
  //       arrayName: "records",
  //       item: {
  //         id,
  //         d,
  //         k,
  //         sum,
  //         type: checkedType,
  //         period,
  //         bookD,
  //         bookK,
  //         comment: comment,
  //         task,
  //         taskId
  //       },
  //     },
  //   });

  //   dispatch({
  //     type: "PUSH_ITEM_TO_ARRAY",
  //     payload: {
  //       arrayName: "bookrecords",
  //       item: { id, sum, bookD, bookK, comment, period, task, type },
  //     },
  //   });

  //   timeout(475).then(() => {
  //     dispatch({
  //       type: "SET_STORE_OBJECT",
  //       payload: {
  //         key: "triggerSave",
  //         value: Math.random(),
  //       },
  //     });
  //     setD(null);
  //     setK(null);
  //     currentTarget.reset();
  //   });
  // }

  // let capitalIncrease,
  //   capitalDecrease,
  //   cashIncrease,
  //   cashDecrease,
  //   costsCalculation;

  // if (k === "Нераспределенная прибыль") {
  //   capitalIncrease = true;
  // }
  // if (d === "Нераспределенная прибыль") {
  //   capitalDecrease = true;
  // }

  // if (d === "Деньги") {
  //   cashIncrease = true;
  // }
  // if (k === "Деньги") {
  //   cashDecrease = true;
  // }

  // if (d === "Незавершенное производство") {
  //   costsCalculation = true;
  // }

  // let tasks = Object.keys(selectedCase.tasks).map(objKey => selectedCase.tasks[objKey]);
  // let taskText = tasks[state.selectedTaskIndex]?.text;

  return <Container>
    <Row>
      <Col><small>{selectedCase?.theme}</small></Col>
      <Col><small>{selectedCase?.title}</small></Col>
      <Col><small>{taskText}</small></Col>
    </Row>

    <Row>
      <Col><SelectFromList /></Col>
    </Row>


  </Container>
  //   <div key={!!state?.id ? state.id : "id" + !!state?.currentTaskIndex ? state.currentTaskIndex : "index"}>
  //     <div className="p-3 mb-2 bg-secondary text-white">Новая операция</div>
  //     <Form onSubmit={handleSubmit}>
  //       <Row>
  //         <Col>
  //           <Form.Group controlId="formStatePeriod">
  //             <Form.Label>Период</Form.Label>
  //             <Form.Control as="select" name="period" required>
  //               {["...", ...periods].map((item) => (
  //                 <option key={item}>{item}</option>
  //               ))}
  //             </Form.Control>
  //           </Form.Group>
  //         </Col>
  //       </Row>
  //       <Row>
  //         <Col>
  //           <Form.Group controlId="formStateD">
  //             <Form.Label>Актив+ или Пассив- (Дт)</Form.Label>
  //             <Form.Control
  //               as="select"
  //               name="d"
  //               required
  //               onChange={handleChange}
  //             >
  //               {["...", ...balanceItems].map((item) => {
  //                 return <option key={item}>{item}</option>;
  //               })}
  //             </Form.Control>
  //           </Form.Group>
  //         </Col>

  //         <Col>
  //           <Form.Group controlId="formStateK">
  //             <Form.Label>Актив- или Пассив+ (Кт)</Form.Label>
  //             <Form.Control
  //               as="select"
  //               name="k"
  //               required
  //               onChange={handleChange}
  //             >
  //               {["...", ...balanceItems].map((item) => {
  //                 return <option key={item}>{item}</option>;
  //               })}
  //             </Form.Control>
  //           </Form.Group>
  //         </Col>

  //         <Col>
  //           <Form.Group controlId="formStateSum">
  //             <Form.Label>Сумма</Form.Label>
  //             <Form.Control as="input" name="sum" required />
  //           </Form.Group>
  //         </Col>
  //       </Row>

  //       {capitalIncrease ? (
  //         <Row>
  //           <Col>
  //             <Form.Group as={Col} controlId="formCapitalIncrease">
  //               <Form.Label>Увеличение капитала (прибыль, доход)</Form.Label>
  //               <Form.Control as="select" name="type" required>
  //                 <option>...</option>
  //                 <option>Выручка</option>
  //                 <option>Прочие доходы</option>
  //                 <option>Дивиденды к получению</option>
  //                 <option>Проценты к получению</option>
  //               </Form.Control>
  //             </Form.Group>
  //           </Col>
  //         </Row>
  //       ) : null}

  //       {capitalDecrease ? (
  //         <Row>
  //           <Col>
  //             <Form.Group controlId="formCapitalDecrease">
  //               <Form.Label>Уменьшение капитала (убыток, расходы)</Form.Label>
  //               <Form.Control as="select" name="type" required>
  //                 <option>...</option>
  //                 <option>Себестоимость продукции, работ, услуг</option>
  //                 <option>Коммерческие расходы</option>
  //                 <option>Управленческие расходы</option>
  //                 <option>Проценты к уплате</option>
  //                 <option>Прочие расходы</option>
  //                 <option>Налог на прибыль</option>
  //                 <option>Дивиденды к начислению</option>
  //               </Form.Control>
  //             </Form.Group>
  //           </Col>
  //         </Row>
  //       ) : null}

  //       {cashIncrease ? (
  //         <Row>
  //           <Col>
  //             <Form.Group controlId="formCashIncrease">
  //               <Form.Label>Поступление денежных средств</Form.Label>
  //               <Form.Control as="select" name="type" required>
  //                 <option>...</option>
  //                 <option>Поступления по текущей деятельности</option>
  //                 <option>Поступления по инвестиционной деятельности</option>
  //                 <option>Поступления по финансовой деятельности</option>
  //               </Form.Control>
  //             </Form.Group>
  //           </Col>
  //         </Row>
  //       ) : null}

  //       {cashDecrease ? (
  //         <Row>
  //           <Col>
  //             <Form.Group controlId="formCashDecrease">
  //               <Form.Label>Платежи (выбытие) денежных средств</Form.Label>
  //               <Form.Control as="select" name="type" required>
  //                 <option>...</option>
  //                 <option>Платежи по текущей деятельности</option>
  //                 <option>Платежи по инвестиционной деятельности</option>
  //                 <option>Платежи по финансовой деятельности</option>
  //               </Form.Control>
  //             </Form.Group>
  //           </Col>
  //         </Row>
  //       ) : null}

  //       {costsCalculation ? (
  //         <Row>
  //           <Col>
  //             <Form.Group controlId="formCostsCalculation">
  //               <Form.Label>Статья калькуляции</Form.Label>
  //               <Form.Control as="select" name="type" required>
  //                 <option>...</option>
  //                 <option>Материальные затраты (Прямые затраты)</option>
  //                 <option>
  //                   Оплата труда и соцстрахование (Прямые затраты)
  //                 </option>
  //                 <option>Амортизация (Постоянные затраты)</option>
  //                 <option>Услуги и работы (Прямые затраты)</option>
  //                 <option>Услуги и работы (Косвенные затраты)</option>
  //                 <option>Реклама (Косвенные затраты)</option>
  //                 <option>Материальные затраты (Косвенные затраты)</option>
  //                 <option>
  //                   Оплата труда и соцстрахование (Косвенные затраты)
  //                 </option>
  //                 <option>
  //                   Управленческие расходы (другие Косвенные затраты)
  //                 </option>
  //                 <option>
  //                   Коммерческие расходы (другие Косвенные затраты)
  //                 </option>
  //               </Form.Control>
  //             </Form.Group>
  //           </Col>
  //         </Row>
  //       ) : null}

  //       <Row>
  //         <Col>
  //           {" "}
  //           {!!d && (
  //             <Form.Group controlId="formStateD">
  //               <Form.Label>Д</Form.Label>
  //               <Form.Control
  //                 as="select"
  //                 name="bookD"
  //                 onChange={handleChange}
  //                 size="sm"
  //                 required
  //               >
  //                 {[
  //                   "...",
  //                   ...balanceContoArray.find((item) => item.id === d).children,
  //                 ].map((item) => {
  //                   return <option key={item}>{item}</option>;
  //                 })}
  //               </Form.Control>
  //             </Form.Group>
  //           )}
  //         </Col>

  //         <Col>
  //           {!!k && (
  //             <Form.Group controlId="formStateK">
  //               <Form.Label>К</Form.Label>
  //               <Form.Control
  //                 as="select"
  //                 name="bookK"
  //                 onChange={handleChange}
  //                 size="sm"
  //                 required
  //               >
  //                 {[
  //                   "...",
  //                   ...balanceContoArray.find((item) => item.id === k).children,
  //                 ].map((item) => {
  //                   return <option key={item}>{item}</option>;
  //                 })}
  //               </Form.Control>
  //             </Form.Group>
  //           )}
  //         </Col>
  //       </Row>

  //       <Form.Group className="mb-3" controlId="formComment">
  //         <Form.Label>Содержание</Form.Label>
  //         <Form.Control as="textarea" rows={3} name="comment" />
  //       </Form.Group>

  //       <Button variant="outline-secondary" type="submit">
  //         Провести операцию
  //       </Button>
  //     </Form>
  //   </div>
  // );

}

export default AccountingCaseMachine