import React, { useEffect, useReducer, useContext } from "react";

import {GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";
import caseReducer from "../../features/case/caseReducer";

import parse from "html-react-parser";

//import transactionsListFull from "../../utlities/transactionsListFull";
import transactionsList from "../../utlities/transactionsList";

import {
  ShowBalance, ShowBalanceStackedBars, ShowFinancialResults,
  ShowCashFlow, ShowRecords
} from "../../original/mediatemplates/MediaTemplatesAccountingWithProfitsCash";
import { MediaItems } from "../../original/mediatemplates/ShowMedia.js";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";



function AccountingCaseDetails() {
 const dispatch = useContext(GlobalDispatchContext);
 const state = useContext(GlobalContext);
  const [localState, localDispatch] = useReducer(caseReducer, {
    balance: false,
    chart: false,
    finresults: false,
    cashflow: false,
    records: false,
    mediaitems: false,
    allaccountingrecords: false
  });

  useEffect(() => {
    console.log(state);
  }, [])

  if (state.loading || !Array.isArray(state?.records) || !state?.showCaseDetails ) { return null } 


  function changeLayout(e) {
    console.log(e.target.id);

    if (e.target.id === "newentry") {
      dispatch({
        type: "SEED_STATE",
        payload: {
          objects: {
            showCaseDetails: false,
            showCaseNewEntry: true,
          },
        },
      });
    } else {
      localDispatch({
        type: "SET_STORE_OBJECT",
        payload: {
          key: e.target.id,
          value: !localState[e.target.id],
        },
      });
    }
  }

  let periods = [...new Set(state.records.map(item => item.period))];

  return <Container>
    <Row className="my-3">
      <Col><Button type="button" variant="outline-primary" size="sm" id="newentry" onClick={changeLayout}>
        Вернуться к заданиям
      </Button></Col>
      <Col><Button type="button" size="sm" variant={localState.balance ? "secondary" : "outline-secondary"} id="balance" onClick={changeLayout}>Баланс</Button></Col>
      <Col><Button type="button" size="sm" variant={localState.chart ? "secondary" : "outline-secondary"} id="chart" onClick={changeLayout}>Баланс Диагр</Button></Col>
      <Col><Button type="button" size="sm" variant={localState.finresults ? "secondary" : "outline-secondary"} id="finresults" onClick={changeLayout}>Финрезультаты</Button></Col>
      <Col><Button type="button" size="sm" variant={localState.cashflow ? "secondary" : "outline-secondary"} id="cashflow" onClick={changeLayout}>Кэш-фло</Button></Col>
      <Col><Button type="button" size="sm" variant={localState.records ? "secondary" : "outline-secondary"} id="records" onClick={changeLayout}>Операции</Button></Col>

      {!!state?.mediaItems &&
        <Col><Button type="button" size="sm" variant={localState.mediaitems ? "secondary" : "outline-secondary"} id="mediaitems" onClick={changeLayout}>Приложения</Button></Col>}

      <Col><Button type="button" size="sm" variant={localState.allaccountingrecords ? "secondary" : "outline-secondary"} id="records" onClick={changeLayout}>Все изученные проводки</Button></Col>



    </Row>

    {localState.balance && <Container><ShowBalance periods={periods} records={state.records} /></Container>}

    {localState.chart && <Container><ShowBalanceStackedBars periods={periods} records={state.records} /></Container>}

    {localState.finresults && <Container><ShowFinancialResults periods={periods} records={state.records} /></Container>}

    {localState.cashflow && <Container><ShowCashFlow periods={periods} records={state.records} /></Container>}

    {localState.records && <Container><ShowRecords periods={periods} records={state.records} /></Container>}

    {localState.mediaitems && <Container><MediaItems mediaItems={state.mediaItems} /></Container>}

    {localState.allaccountingrecords && <Container><div>{parse(transactionsList(state.allaccountingrecords))}</div></Container>}

  </Container>
}

export default AccountingCaseDetails