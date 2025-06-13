import React, { useEffect, useState, useContext, useRef } from "react";

import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";

import processquizwithrandomnumber from "../../utlities/processquizwithrandomnumber";

import timeout from "../../utlities/timeout";

import balanceItems from "../../utlities/balanceItems";
import balanceContoArray from "../../utlities/balanceContoArray";

import extract from "../../utlities/extract";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


function AccountingCaseTaskEditor() {
    const state = useContext(GlobalContext);
    const [formData, setFormData] = useState({
        taskText: '',
        taskId: '',
        taskHint: '',
        selectedQuizCaseId: null,
        selectedTaskIndex: 0,
        tasks: []
    });


    useEffect(() => {
        let selectedCase = Array.isArray(state.quizescases) && state.quizescases.find(item => item.id === state.selectedQuizCaseId);
        console.log(selectedCase);
        let tasks = selectedCase?.tasks;

        let taskText, taskId, taskHint, selectedTaskIndex;
        if (!!tasks && !!tasks[state.selectedTaskIndex]) {
            taskText = tasks[state.selectedTaskIndex]?.text;
            taskId = tasks[state.selectedTaskIndex]?.id;
            taskHint = tasks[state.selectedTaskIndex]?.hint;
            selectedTaskIndex = state.selectedTaskIndex;
        }
        else {
            taskText = ""; taskHint = "";
            taskId = basicfirebasecrudservices.getFirebaseNodeKey("openquizes/" + state.selectedQuizCaseId);
            selectedTaskIndex = 0;
            tasks = []
        }

        let selectedQuizCaseId = state.selectedQuizCaseId

        setFormData({ taskText, taskId, taskHint, selectedQuizCaseId, selectedTaskIndex, tasks })

        //  taskTextRef.current.value = taskText;
        //  taskHintRef.current.value = taskId;

    }, [state.loading, state.showCase, state.selectedTaskIndex, state.selectedQuizCaseId])

    if (state.loading || !state?.showCase || !state?.selectedTaskIndex, !state?.selectedQuizCaseId) return null

    return <ProcessTaskData defaultFormData={formData} />

}

function ProcessTaskData({ defaultFormData }) {
    const state = useContext(GlobalContext);
    const dispatch = useContext(GlobalDispatchContext);

    const [formData, setFormData] = useState({
        taskText: '',
        taskId: '',
        taskHint: '',
    });

    console.log(defaultFormData);


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    function saveNewTasks() {
        console.log(formData);
        let updates = {};
        let text = defaultFormData?.taskText === formData.taskText ? defaultFormData.taskText : formData.taskText;
        let hint = defaultFormData?.taskHint === formData.taskHint ? defaultFormData.taskHint : formData.taskHint;

        updates["openquizes/" + defaultFormData.selectedQuizCaseId + "/periods/"] = ["Декабрь 2024", "1 кв 2025", "2 кв. 2025", "3 кв 2025"]
        updates["openquizes/" + defaultFormData.selectedQuizCaseId + "/tasks/" + defaultFormData.tasks.length + "/id"] = defaultFormData.taskId;
        updates["openquizes/" + defaultFormData.selectedQuizCaseId + "/tasks/" + defaultFormData.selectedTaskIndex + "/text"] = text;

        if (!hint && hint.length > 5) {
            updates["openquizes/" + defaultFormData.selectedQuizCaseId + "/tasks/" + selectedTaskIndex + "/hint"] = hint;
        }

        // basicfirebasecrudservices.updateFirebaseNode(updates)
        timeout(475)
            .then(() => {
                console.log(updates);
            });
    }


    function updateTask() {
        console.log(formData);
        let updates = {};
        let text = defaultFormData?.taskText === formData.taskText ? defaultFormData.taskText : formData.taskText;
        let hint = defaultFormData?.taskHint === formData.taskHint ? defaultFormData.taskHint : formData.taskHint;

        updates["openquizes/" + defaultFormData.selectedQuizCaseId + "/periods/"] = ["Декабрь 2024", "1 кв 2025", "2 кв. 2025", "3 кв 2025"]
        updates["openquizes/" + defaultFormData.selectedQuizCaseId + "/tasks/" + defaultFormData.selectedTaskIndex + "/id"] = defaultFormData.taskId;
        updates["openquizes/" + defaultFormData.selectedQuizCaseId + "/tasks/" + defaultFormData.selectedTaskIndex + "/text"] = text;

        if (!hint && hint.length > 5) {
            updates["openquizes/" + defaultFormData.selectedQuizCaseId + "/tasks/" + selectedTaskIndex + "/hint"] = hint;
        }

        console.log(updates);

        basicfirebasecrudservices.updateFirebaseNode(updates)
       // timeout(5000)
            .then(() => {
                console.log(updates);

                window.location.reload()

                // let quizescases = state.quizescases.map(quizcase => {

                //     if (quizcase.id === defaultFormData.selectedQuizCaseId) {
                //         let updatedquizcase = { ...quizcase };
                //         updatedquizcase.periods = ["Декабрь 2024", "1 кв 2025", "2 кв. 2025", "3 кв 2025"];
                //         updatedquizcase.tasks[defaultFormData.selectedTaskIndex].id = defaultFormData.taskId;
                //         updatedquizcase.tasks[defaultFormData.selectedTaskIndex].text = text;
                //         if (!hint && hint.length > 5) {
                //             updatedquizcase.tasks[defaultFormData.selectedTaskIndex].hint = hint;
                //         }
                //         return updatedquizcase
                //     }
                //     return quizcase
                // })
                // console.log(quizescases);
                // dispatch({
                //     type: "SEED_STATE",
                //     payload: {
                //         objects: {
                //             quizescases: quizescases
                //         },
                //     },
                // })
            });
    }

    // function handleSaveTask(e) {
    //     e.preventDefault();
    //     const currentTarget = e.currentTarget;
    //     const formdata = new FormData(currentTarget);
    //     let { tasktext, taskhint } = Object.fromEntries(formdata);
    //     console.log(tasktext, taskhint);








    return <Form >

        <Row>
            <Col>
                <Form.Group className="mb-3" controlId="formTaskText">
                    <Form.Control size="sm" type="text"
                        name="taskText" defaultValue={defaultFormData.taskText}
                        onChange={handleInputChange}
                    />
                    <Form.Text className="text-muted">
                        {"Текст задания {=400+{var1-10}*10}"}
                    </Form.Text>
                </Form.Group>
            </Col>
        </Row>

        <Row>
            <Col>
                <Form.Group className="mb-3" controlId="formTaskHint">
                    <Form.Control size="sm" type="text"
                        name="taskHint" defaultValue={defaultFormData.taskHint}
                        onChange={handleInputChange} />
                    <Form.Text className="text-muted">
                        подсказка HTML markup
                    </Form.Text>
                </Form.Group>
            </Col>
        </Row>

        <Row>
            <Col >
                <Button variant="outline-secondary" size="sm" onClick={updateTask}>
                    Обновить
                </Button>
            </Col>
            <Col >
                <Button variant="outline-secondary" size="sm" onClick={saveNewTasks}>
                    Добавить новое задание
                </Button>
            </Col>
        </Row>

    </Form>
}

export default AccountingCaseTaskEditor