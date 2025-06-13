import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { CSVReader } from "react-papaparse";
//import firebase from "gatsby-plugin-firebase";

import timeout from "../../../utlities/timeout";

import { selectApplication } from "../application/applicationSlice";
//import { createDataItem, empty_data, getDataItems, saveDataSuccess } from "./dataSlice";
import { addArrayItemsToTempDataArray } from "./tempSlice";

import Button from "react-bootstrap/Button";
//import ButtonGroup from "react-bootstrap/ButtonGroup";
//import Navbar from "react-bootstrap/Navbar";

function csvColumnTitles(array) {
    let columnTitlesObject = {};
    array.map((item, index) => {
        let keyString = item.replace(/\W/g, "");
        keyString = keyString.toLowerCase();
        //console.log(keyString);
        columnTitlesObject[keyString] = index;
        return null;
    });
    return columnTitlesObject;
}

function csvFinamQuotesToObject(data) {
    let csvDictObject = csvColumnTitles(data[0].data);
    // console.log(csvDictObject);
    let quotesObject = {};
    let ticker = data[1].data[csvDictObject.ticker];
    let per = data[1].data[csvDictObject.per];
    // console.log(ticker, per);
    //console.log(quotesObject);
    data.map((item, index) => {
        if (index > 0) {
            let currentQuote = {};
            Object.keys(csvDictObject).map((key) => {
                currentQuote[key] = item.data[csvDictObject[key]];
                return null;
            });

            if (
                !!currentQuote?.ticker &&
                !!currentQuote?.per &&
                !!currentQuote.date
            ) {
                //    console.log(currentQuote);
                let newQuote = {};
                newQuote[currentQuote.date] = currentQuote;
                quotesObject = { ...quotesObject, ...newQuote };
            }
        }
        return null;
    });
    return { quotesObject, ticker, per };
}

function fire_save(ticker_per_object, email) {
    let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
    let updates = {};
    //  console.log(ticker_per_object);
    Object.keys(ticker_per_object.quotesObject).map((datekey) => {
        updates[
            "/moex/" +
            ticker_per_object.ticker +
            "/" +
            ticker_per_object.per +
            "/" +
            datekey
        ] = ticker_per_object.quotesObject[datekey];
        return null;
    });
    //  updates['/moex/' + ticker_per_object.ticker + '/' + ticker_per_object.per] = ticker_per_object.quotesObject;
    updates[
        "/usersCraft/" +
        userEmail +
        "/database/moex/" +
        ticker_per_object.ticker +
        "/" +
        ticker_per_object.per
    ] = ticker_per_object.quotesObject;

    // console.log(updates);
    //  return firebase.database().ref().update(updates);
    timeout(3000)
        .then(() => console.log(updates))
}

const buttonRef = React.createRef();

export default function ImportCSVSpreadsheet(props) {
    const email = useSelector(selectApplication).email;
    const dispatch = useDispatch();

    function handleOpenDialog(e) {
        // Note that the ref is set async, so it might be null at some point
        if (buttonRef.current) {
            buttonRef.current.open(e);
        }
    }

    function handleOnFileLoad(data) {
        let ticker_per_object = csvFinamQuotesToObject(data);
        //    console.log(ticker_per_object);
        let newTempArrayItems = Object.keys(ticker_per_object.quotesObject).map(
            (element) => {
                return {
                    ...ticker_per_object.quotesObject[element],
                    id:
                        ticker_per_object.ticker +
                        "_" +
                        ticker_per_object.per +
                        "_" +
                        element,
                    quotedate: element,
                    datatype: "quote",
                };
            }
        );
        // console.log(newTempArrayItems);
        dispatch(addArrayItemsToTempDataArray(newTempArrayItems));
        fire_save(ticker_per_object, email);
    }

    function handleOnError(err, file, inputElem, reason) {
        console.log(err);
    }

    function handleOnRemoveFile(data) {
        console.log("---------------------------");
        console.log(data);
        console.log("---------------------------");
    }

    return (
        <>
            <CSVReader
                ref={buttonRef}
                onFileLoad={handleOnFileLoad}
                onError={handleOnError}
                noClick
                noDrag
                onRemoveFile={handleOnRemoveFile}
            >
                {({ file }) => (
                    //   <Navbar bg="light" expand="sm">
                    //       <ButtonGroup aria-label="Posts Buttons" size="sm">
                    <Button
                        variant="outline-secondary"
                        onClick={handleOpenDialog}
                        size="sm"
                    >
                        {props.openButton}
                    </Button>
                    // <Button variant="outline-secondary" onClick={handleRemoveFile} size="sm">Удалить файл</Button>
                    //      </ButtonGroup>
                    //     <Navbar.Brand style={{ minWidth: '150px', marginLeft: '10px' }}><small>Актив</small></Navbar.Brand>  {/*  {file && file.name} */}
                    //     </Navbar> */}
                )}
            </CSVReader>
            {/* <Button variant="outline-danger" onClick={() => dispatch(empty_data())} size="sm" className="mt-3 mb-3">Удалить котировки</Button> */}
        </>
    );
}