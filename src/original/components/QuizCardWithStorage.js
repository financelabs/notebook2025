import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectApplication } from "../features/application/applicationSlice";
import { setObjectKeyValue } from "../features/case/caseSlice"

import parse from 'html-react-parser';

import ApexEmptyOptionsChart from "../mediatemplates/ApexEmptyOptionsChart.js";
//import ScatterChartAbstractBetaCases from "../laboratory/ScatterChartAbstractBetaCases.js";

import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Navbar from "react-bootstrap/Navbar";
import Pagination from "react-bootstrap/Pagination";

import MultipleChoicesQuiz from "./MultipleChoicesQuiz.js";
import QuizWithRandomNumber from "./QuizWithRandomNumber.js";
import CaseWithRandomNumber from "../../laboratory/CaseWithRandomNumber.js";
import CaseAccountingWithTasks from "../../laboratory/CaseAccountingWithTasks.js"



import calculateRandomNumber from "../../utlities/calculateRandomNumber.js";
import shuffle from "../../utlities/shuffle.js";


import * as qSets from "../laboratory/quizesSets";


// function GetChartForQuiz({ laboratoryChart }) {
//   const [chart, setChart] = useState(null);

//   useEffect(() => {
//     setChart(laboratoryChart);
//   }, [laboratoryChart]);

//   // console.log(laboratoryChart);
//   if (!!chart && !!laboratoryChart.toString().includes("beta")) {
//     return <ScatterChartAbstractBetaCases type={laboratoryChart} />
//   }
//   return null
// }

function QuizCardWithStorage(props) {
  const email = useSelector(selectApplication).email;
  let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
  const avatarUrl = useSelector(selectApplication).avatarUrl;
  const user = useSelector(selectApplication).user;

  if (props?.type === "OneRandomManyAnswers") { return <OneRandomManyAnswers {...props} /> }
  return <div>
    {!!props?.set ? <QuizSet {...props} email={user} user={user} avatarUrl={avatarUrl} userEmail={userEmail} /> :
      <SingleQuizCardWithStorage  {...props} email={user} user={user} avatarUrl={avatarUrl} userEmail={userEmail} />}
  </div>
}

export default QuizCardWithStorage;

function OneRandomManyAnswers(props) {
  return <div>
    <h1>{props?.setTitle}</h1>
    <div className="mb-4">{!!qSets[props?.set]?.text ? parse(qSets[props.set].text): ""}</div>
    <hr />
  </div>
}


export function QuizesPagination({ setTitle, quizescases }) {
  const dispatch = useDispatch()
  const [selectedQuiz, setSelectedQuiz] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const pagesCount = Math.ceil(quizescases.length / itemsPerPage);
  //  const isPaginationShown = alwaysShown ? true : pagesCount > 1;
  const isCurrentPageFirst = currentPage === 0;
  const isCurrentPageLast = currentPage === pagesCount - 1;

  const changePage = number => {
    if (currentPage === number) return;
    setCurrentPage(number);
   
  };

  const onPreviousPageClick = () => {
    if (currentPage < 1) {
      return (changePage(currentPage => currentPage = 0));
    } else {
      changePage(currentPage => currentPage - 1);
    }

  };

  const onNextPageClick = () => {
    changePage(currentPage => currentPage + 1);
  };


  function doSelectQuiz(index) {
    console.log(quizescases[index]?.id);
    setLoading(true);
    dispatch(setObjectKeyValue({ key: "selectedQuizCaseId", value: quizescases[index]?.id }))
    setSelectedQuiz(index);
    setLoading(false);
  }

  if (quizescases.length > 10) {

    let items = [];
    for (let index = currentPage * itemsPerPage; index < currentPage * itemsPerPage + itemsPerPage; index++) {
      items.push(
        <Pagination.Item key={index} active={index === selectedQuiz}
          onClick={() => doSelectQuiz(index)}
        >
          {index + 1}
        </Pagination.Item>,
      );
    }


    return <div className="mt-1">
      <Navbar bg="light">
        <Navbar.Brand >{setTitle}</Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Pagination size="sm">
            <Pagination.Prev
              className={isCurrentPageFirst ? "disable" : ""}
              onClick={onPreviousPageClick}
              disabled={isCurrentPageFirst}
            />
            {items}
            <Pagination.Next
              onClick={onNextPageClick}
              disabled={isCurrentPageLast}
              className={isCurrentPageLast ? "disable" : ""}
            />
          </Pagination>
        </Navbar.Collapse>

      </Navbar>
      <hr />
      {loading ? <div>...</div> : <div></div>}
    </div>
  }

  return <div className="mt-1">
    <Navbar bg="light">
      <Navbar.Brand >{setTitle + " " + quizescases[selectedQuiz]?.title}</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <ButtonGroup size={quizescases.length < 5 ? "lg" : "sm"}>
          {quizescases.map((quiz, index) => (
            <Button
              variant="outline-secondary"
              onClick={() => doSelectQuiz(index)}
              key={index}
            >
              {quizescases.length < 10 ? <span className="m-2" >{index + 1}</span> : <small>{index + 1}</small>}
            </Button>
          ))}
        </ButtonGroup>
      </Navbar.Collapse>
    </Navbar>
    <hr />
    {/* <Navbar className="bg-light justify-content-between mb-3"> */}


    {loading ? <div>...</div> : <div></div>}
  </div>
}


export function QuizSet({ set, setTitle }) {
  const [selectedQuiz, setSelectedQuiz] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const pagesCount = Math.ceil(qSets[set].length / itemsPerPage);
  //  const isPaginationShown = alwaysShown ? true : pagesCount > 1;
  const isCurrentPageFirst = currentPage === 0;
  const isCurrentPageLast = currentPage === pagesCount - 1;

  const changePage = number => {
    if (currentPage === number) return;
    setCurrentPage(number);
    // scrollToTop();
  };

  const onPreviousPageClick = () => {
    if (currentPage < 1) {
      return (changePage(currentPage => currentPage = 0));
    } else {
      changePage(currentPage => currentPage - 1);
    }

  };

  const onNextPageClick = () => {
    changePage(currentPage => currentPage + 1);
  };


  function doSelectQuiz(index) {
    setLoading(true);
    setSelectedQuiz(index);
    setLoading(false);
  }

  let quizprops = qSets[set][selectedQuiz];

  if (qSets[set].length > 10) {


    let items = [];
    for (let index = currentPage * itemsPerPage; index < currentPage * itemsPerPage + itemsPerPage; index++) {
      items.push(
        <Pagination.Item key={index} active={index === selectedQuiz}
          onClick={() => doSelectQuiz(index)}
        >
          {index + 1}
        </Pagination.Item>,
      );
    }


    return <div className="mt-1">
      <Navbar bg="light">
        <Navbar.Brand >{setTitle }</Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Pagination size="sm">
            <Pagination.Prev
              className={isCurrentPageFirst ? "disable" : ""}
              onClick={onPreviousPageClick}
              disabled={isCurrentPageFirst}
            />
            {items}
            <Pagination.Next
              onClick={onNextPageClick}
              disabled={isCurrentPageLast}
              className={isCurrentPageLast ? "disable" : ""}
            />
          </Pagination>
        </Navbar.Collapse>

      </Navbar>
      <hr />
      {/* <Navbar className="bg-light justify-content-between mb-3"> */}



      {loading ? <div>...</div> : <QuizCardWithStorage key={selectedQuiz} setId={selectedQuiz + 1} {...quizprops} />}
    </div>
  }

  return <div className="mt-1">
    <Navbar bg="light">
      <Navbar.Brand >{setTitle}</Navbar.Brand>

      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <ButtonGroup size={qSets[set].length < 5 ? "lg" : "sm"}>
          {qSets[set].map((quiz, index) => (
            <Button
            variant={selectedQuiz === index ? "secondary" : "outline-secondary" }
              onClick={() => doSelectQuiz(index)}
              key={index}
            >
              {qSets[set].length < 10 ? <span className="m-2" >{index + 1}</span> : <small>{index + 1}</small>}
            </Button>
          ))}
        </ButtonGroup>
      </Navbar.Collapse>

    </Navbar>
    <hr />
    {/* <Navbar className="bg-light justify-content-between mb-3"> */}


    {loading ? <div>...</div> : <QuizCardWithStorage key={selectedQuiz} setId={selectedQuiz + 1} {...quizprops} />}
  </div>
}




function SingleQuizCardWithStorage(props) {
  const [show, setShow] = useState(false);

  console.log(props);

  let randomNumber = Math.random() * 10;

  if (props.type === "accountingwithprofitscash") {
    return <CaseAccountingWithTasks {...props} randomNumber={randomNumber}
    />;
  }



  if (props.type === "casewithrandomnumber") {
    return <CaseWithRandomNumber {...props} randomNumber={randomNumber} />;
  }


  if (props.text.includes("{=")) {
    return <QuizWithRandomNumber {...props} randomNumber={randomNumber} />;
  }

  if (!!props?.choices) {
    let { choices, ...other } = props;
    return <MultipleChoicesQuiz choices={shuffle(choices)} {...other} />;
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Card bg={"light"} style={{ width: "95%", margin: "1rem" }} key={props.key}>
        <Card.Header onClick={handleShow}>{props.header}</Card.Header>
        <Card.Body>
          {!!props.imageurl ? (
            <Card.Img variant="top" src={props.imageurl} />
          ) : null}
          <Card.Title>{props.title}</Card.Title>

          <Card.Text>
            {parse(props.text)}
            {/* <ReactMarkdown source={props.text} escapeHtml={false} /> */}
          </Card.Text>
          {props.children}
        </Card.Body>
      </Card>
      <Modal show={show} onHide={handleClose} size="xl" scrollable centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{parse(props.text)}</div>
          {/* <ReactMarkdown source={props.text} escapeHtml={false} /> */}
          {props.children}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}




export function ShowQuizMedia({ media, randomNumber }) {

  return <div>
    {media.map((item, index) => {
      let series = item.series.map(seriesItem => {
        let itemData = seriesItem.data.map(dataItem => {
          if ((typeof dataItem === 'string' || dataItem instanceof String) && dataItem.startsWith('{=')) {
            console.log(dataItem, randomNumber);
            return calculateRandomNumber(dataItem, randomNumber) // 1000
          } else { return dataItem }

        })
        return { ...seriesItem, data: itemData }
      })
      return <ApexEmptyOptionsChart
        key={index}
        showAs={item.type}
        options={item.options}
        series={series}
        categories={item.categories}
        chartTitle={item.chartTitle}
        xaxisTitle={item.xaxisTitle}
        yaxisTitle={item.yaxisTitle}
      />
    })}

  </div>
}