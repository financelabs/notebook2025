import React, { useState, useContext } from "react";

import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";

import processquizwithrandomnumber from "../../utlities/processquizwithrandomnumber";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";



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





function PageContentWithRandomNumber() {
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalContext)
    const [activePageNumber, setActivePageNumber] = useState(1);
 
    if (state.loading || !state?.showCaseNewEntry || !state?.id || !Array.isArray(state?.quizescases)) { return null}

    let tasks = state.quizescases.find(item => item.id === state.id)?.tasks;

    if (!Array.isArray(tasks) || tasks.length === 0 ) { return null}
    
   

    function doSetActiveTask(number) {
        setActivePageNumber(number);
          
        dispatch({
            type: "SEED_STATE",
            payload: { objects: {
                currentTaskIndex: number - 1,
                currentTaskId: tasks[number - 1]?.id
            }},
        });
    }

    let items = [];
    for (let number = 1; number <= tasks.length; number++) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === activePageNumber}
                onClick={() => doSetActiveTask(number)}
            >
                {number}
            </Pagination.Item>
        );
    }

    let quiztext = Array.isArray(tasks) && tasks[activePageNumber - 1]?.text;

    return (
        <Row key={state?.id}>
            <Col className="p-1">
                <small>{state.title}</small>
                <Pagination size="sm">{items}</Pagination>
            </Col>
            <Col className="p-1">{processTaskText(quiztext, state?.email)}</Col>
        </Row>
    );
}

export default PageContentWithRandomNumber