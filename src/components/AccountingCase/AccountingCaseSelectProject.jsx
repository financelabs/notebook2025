import React, { useEffect, useState, useContext } from "react";

import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";
import { Container, Dropdown, Row, Col, ButtonGroup, Button } from "react-bootstrap";


function AccountingCaseSelectProject() {
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalContext);

    useEffect(() => {
        console.log(state.groupvatars);
    }, [state.loading, state.showCase, state.selectedTaskId, state.selectedQuizCaseId])

    if (state.loading || !state?.showCase) return null


    console.log(state);

    function doSelectProject(eventKey) {
        console.log(eventKey);
        dispatch({
            type: "SEED_STATE",
            payload: {
                objects: {
                    selectedQuizCaseId: eventKey
                },
            },
        });
    }




  
  

    return <Container>
        <Row>
            <Col>
                <Dropdown onSelect={doSelectProject}>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        {!!state.selectedQuizCaseId ? state.selectedQuizCaseId : "Кейс"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>



                        {Array.isArray(state.quizescases) && state.quizescases
                            .filter(item => !item.id.includes("demo"))
                            .map(item => {
                                return <Dropdown.Item
                                    eventKey={item.id}>
                                    {item.title}
                                </Dropdown.Item>
                            })}




                    </Dropdown.Menu>
                </Dropdown>
            </Col>
            <Col><RadioButtons /></Col>
            <Col><SelectTaskId /></Col>
        </Row>

    </Container>
}

function RadioButtons() {

    function doSelectCaseType(id) {
        console.log(id)
    }

    return <ButtonGroup size={"sm"}>
        <Button
            variant="outline-secondary"
            onClick={() => doSelectCaseType("demo")}
        >
            <small>Demo</small>
        </Button>
        <Button
            variant="outline-secondary"
            onClick={() => doSelectCaseType("random")}
        >
            <small>Random</small>
        </Button>
    </ButtonGroup>
}

function SelectTaskId() {
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalContext);

    useEffect(() => {
      //  console.log(state.groupvatars);
    }, [state.loading, state.showCase, state.selectedTaskId, state.selectedQuizCaseId])

    if (state.loading || !state?.showCase || !state?.selectedQuizCaseId) return null

    let selectedCase = Array.isArray(state.quizescases) && state.quizescases.find(item => item.id === state.selectedQuizCaseId);
    let tasks = selectedCase?.tasks ? Object.keys(selectedCase.tasks).map(objKey => selectedCase.tasks[objKey]) : null;

    if (!Array.isArray(tasks)) return null;

    function doSelectTaskIndex(taskIndex) {
        console.log(taskIndex);
        dispatch({
            type: "SEED_STATE",
            payload: {
                objects: {
                    selectedTaskIndex: taskIndex
                },
            },
        });
    }

    return <div>
      
            <ButtonGroup size={"sm"}>
                {tasks.map((_, index) => (
                    <Button
                        variant={state?.selectedTaskIndex === index ? "secondary" : "outline-secondary"}
                        onClick={() => doSelectTaskIndex(index)}
                        key={index}
                    >
                        <small>{index + 1}</small>
                    </Button>
                ))}
            </ButtonGroup> 

    </div>
}

export default AccountingCaseSelectProject