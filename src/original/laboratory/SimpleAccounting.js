import React, { useState, useCallback } from "react";
//import { useForm } from "react-hook-form";
//import { useImmer } from "use-immer";
import { produce } from "immer";
import timeout from "../../utlities/timeout";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";

import balanceItems from "../../utlities/balanceItems";
import balanceContoArray from "../../utlities/balanceContoArray";


export default function SimpleAccounting() {
    //  const { register, handleSubmit, reset } = useForm(); //, watch, errors
    const [records, updateRecords] = useState([]);
    const [open, setOpen] = useState(false);

    const [d, setD] = useState(null);
    const [k, setK] = useState(null);

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
        let { d, k, sum, bookD, bookK } = Object.fromEntries(formdata);
        console.log(d, k, sum, bookD, bookK );
        handleAdd({ d, k, sum, bookD, bookK  });
        timeout(275).then(() => {
            setD(null);
            setK(null);
            currentTarget.reset();
        });
    }

    const handleAdd = useCallback(({ d, k, sum }) => {
        updateRecords(
            produce((draft) => {
                draft.push({ d, k, sum });
            })
        );
    }, []);





    function processRecords(indicator) {
        let DValues = 0;
        let KValues = 0;
        let processed = records.map(item => {
            if (item.d === indicator) { DValues = DValues + parseFloat(item.sum) }
            if (item.k === indicator) { KValues = KValues + parseFloat(item.sum) }
            return null
        })
        if (indicator === "Основные средства" || indicator === "Материалы" ||
            indicator === "Незавершенное производство" || indicator === "Готовая продукция" ||
            indicator === "Дебиторская задолженность" || indicator === "Деньги") { return DValues - KValues } else { return KValues - DValues }
    }

    return <div>
        <Container>
            <Row>
                <Col>Основные средства {processRecords("Основные средства")}</Col>
                <Col>Уставный капитал {processRecords("Уставный капитал")}</Col>
            </Row>
            <Row>
                <Col>{" "}</Col>
                <Col>Нераспределенная прибыль {processRecords("Нераспределенная прибыль")}</Col>
            </Row>
            <Row>
                <Col>Материалы {processRecords("Материалы")}</Col>
                <Col>{" "}</Col>
            </Row>
            <Row>
                <Col>Незавершенное производство {processRecords("Незавершенное производство")}  </Col>
                <Col>Долгосрочный банковский кредит {processRecords("Долгосрочный банковский кредит")} </Col>
            </Row>
            <Row>
                <Col>Готовая продукция {processRecords("Готовая продукция")} </Col>
                <Col>{" "}</Col>
            </Row>
            <Row>
                <Col>Дебиторская задолженность {processRecords("Дебиторская задолженность")} </Col>
                <Col>Краткосрочный банковский кредит {processRecords("Краткосрочный банковский кредит")}  </Col>
            </Row>
            <Row>
                <Col>Деньги {processRecords("Деньги")} </Col>
                <Col>Кредиторская задолженность {processRecords("Кредиторская задолженность")} </Col>
            </Row>
        </Container>
        <hr />
        <Button
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
            variant="outline-secondary"
            className="mb-3"
        >
            {open ? "Скрыть Журнал" : "Показать журнал"}
        </Button>
        <Collapse in={open}>
            <div id="example-collapse-text">
                <Container>
                    {records.map((row, index) => <Row key={index}>
                        <Col>{row.d}</Col>
                        <Col>{row.k}</Col>
                        <Col>{row.sum}</Col>
                    </Row>)}
                </Container>
            </div>
        </Collapse>
        <hr />
        <Form onSubmit={handleSubmit}>
            {/* <Form> */}
            <Row>
                <Col>
                    <Form.Group controlId="formStateD">
                        <Form.Label>Д</Form.Label>
                        <Form.Control as="select" name="d" onChange={handleChange} required>
                            {["...", ...balanceItems]
                                .map(item => { return <option key={item}>{item}</option> })}
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group controlId="formStateK">
                        <Form.Label>К</Form.Label>
                        <Form.Control as="select" name="k" onChange={handleChange} required>
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
            {/* </Form> */}

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


            <Button variant="outline-secondary my-3" type="submit" >Провести операцию</Button>
        </Form>
    </div >
}