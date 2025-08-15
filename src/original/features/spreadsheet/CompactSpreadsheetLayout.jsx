import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

import { useSelector, useDispatch } from "react-redux";

import LoginLogout from "../application/LoginLogout";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";

import alphabet from "../../../utlities/alphabet";





import {
  selectSpreadsheetProtoData,
  selectSpreadsheetData,
  new_empty_spreadsheet,
  //  add_row_under,
  load_data,
  createProtoArray,
  createProtoObject,
} from "./spreadsheetSlice";


import { selectApplication } from "../application/applicationSlice";

import Form from "react-bootstrap/Form";
import GreenHeader from "./GreenHeader";

export default function CompactSpreadsheetLayout({screenSize}) {
  const dispatch = useDispatch();
  const [expandView, toggle_expand_view] = useState(false);
  const userProfile = useSelector(selectApplication);
  const [countLetter, setCountLetter] = useState(0);
  const [countRow, setCountRow] = useState(7);

  function doEmptySpreadsheet() {
    toggle_expand_view(false)
    dispatch(new_empty_spreadsheet());
    setTimeout(function () { toggle_expand_view(true); }, 425);
  }

  function doChangeColumn(go) {
    toggle_expand_view(false);
    if (go === "right") { setCountLetter(countLetter + 1) }
    if (go === "left") { setCountLetter(countLetter - 1) }
    setTimeout(function () { toggle_expand_view(true); }, 425);
  }

  return (
    <div className="excelstyle">
      <GreenHeader />
      {/* <div
        className="title"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: ".4rem",
        }}
      >
        {userProfile?.avatarUrl && userProfile.avatarUrl.length > 10 ? (
          <img
            src={userProfile.avatarUrl}
            alt=""
            style={{
              verticalAlign: "middle",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              filter: "grayscale(100%)",
              objectFit: "cover",
            }}
          />
        ) : null}
        <LoginLogout screenSize={screenSize}/>
      </div> */}

      <div className="icon-bar">
        <ButtonToolbar aria-label="Toggle Toolbar">

          <ButtonGroup aria-label="Posts Buttons" size="sm">
            <Button
              variant="outline-secondary"
              onClick={() => toggle_expand_view(!expandView)}
              data-toggle="tooltip"
              data-placement="bottom"
              title={expandView ? "Свернуть расчет" : "Развернуть расчет"}
            >
              {expandView ? "Сверн" : "Разв"}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => doEmptySpreadsheet()}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Новый расчет"
            >
              Нов
          </Button>
          </ButtonGroup>

          {!!userProfile?.email ? (
            <ButtonGroup aria-label="Workbook Buttons" size="sm" className="ml-3">
              <Button
                variant="outline-secondary"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Рабочая тетрадь"
              >
                <a href="../myworkbook" target="_blank">РТ</a>
              </Button>
            </ButtonGroup>
          ) : null}

        </ButtonToolbar>

      </div>

      <div className="icon-bar">
        <ButtonGroup aria-label="Posts Buttons" size="sm"  >

          {countLetter > 0 ? <Button
            variant="outline-secondary"
            onClick={() => doChangeColumn("left")}
            data-toggle="tooltip"
            data-placement="bottom"
            title={"Сместиться влево"}
          >
            {alphabet[countLetter - 1]}
          </Button> : null}


          <Button
            variant="outline-secondary"
            onClick={() => doChangeColumn("right")}
            data-toggle="tooltip"
            data-placement="bottom"
            title={"Сместиться вправо"}
          >
            {alphabet[countLetter + 1]}
          </Button>

          <Button
            variant="outline-secondary"
            onClick={() => setCountRow(countRow + 1)}
            data-toggle="tooltip"
            data-placement="bottom"
            title={"Сместиться вправо"}
          >
            {"+_"}
          </Button>

        </ButtonGroup>
      </div>


      {expandView ? <ActiveCells
        //    userProfile={userProfile}
        currentLetter={alphabet[countLetter]}
        numberOfRows={countRow}
      /> : null}
    </div>
  );
}



function ActiveCells({ currentLetter, numberOfRows }) {
  const dispatch = useDispatch();
  const protoDataObject = createProtoObject(useSelector(selectSpreadsheetProtoData));
  const calculatedData = createProtoObject(useSelector(selectSpreadsheetData));
  const methods = useForm({ defaultValues: protoDataObject });
  const { handleSubmit } = methods; //register 

  function reCalculate(data) {
    //  console.log(data);
    //  console.log(protoDataObject);
    //  console.log(calculatedData);
    dispatch(load_data({ protoData: createProtoArray({ ...protoDataObject, ...data }) }))
  }

  let filledArray = new Array(numberOfRows).fill(currentLetter);
 // console.log(filledArray);

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit((data) => reCalculate(data))} className="p-1">
        {filledArray.map((item, index) => {
          let cellAddress = item + (index + 1).toString();
    //      console.log(cellAddress);
          return <ActiveCell
            key={index}
            cellAddress={cellAddress}
            cellCalculatedData={calculatedData[cellAddress]}
          />
        })}
        {/* <ActiveCell cellAddress={"A1"} cellCalculatedData={calculatedData['A1']} />
        <ActiveCell cellAddress={"A2"} cellCalculatedData={calculatedData['A2']} />
        <ActiveCell cellAddress={"A3"} cellCalculatedData={calculatedData['A3']} />
        <ActiveCell cellAddress={"A4"} cellCalculatedData={calculatedData['A4']} />
        <ActiveCell cellAddress={"A5"} cellCalculatedData={calculatedData['A5']} />
        <ActiveCell cellAddress={"A6"} cellCalculatedData={calculatedData['A6']} />
        <ActiveCell cellAddress={"A7"} cellCalculatedData={calculatedData['A7']} /> */}
        <Button
          variant="outline-secondary"
          type="submit"
          size="sm"
          block
        >
          fx
          </Button>
        {/* <input  /> */}
      </Form>
    </FormProvider>
  );
}

function ActiveCell({ cellAddress, cellCalculatedData }) {
  const methods = useFormContext();
  return <Form.Group controlId={"formBasicEmail" + cellAddress}>
    <Form.Label className="small text-muted">{!cellCalculatedData ? cellAddress : cellAddress + ":   " + cellCalculatedData}</Form.Label>
    <Form.Control
      {...methods.register(cellAddress)}
      //   name={cellAddress}
      type="textarea"
      rows="3"
    />
    {/* <Form.Text className="text-muted">Пример: =NPV(0.1;100,200,300)-500</Form.Text> */}
  </Form.Group>
}