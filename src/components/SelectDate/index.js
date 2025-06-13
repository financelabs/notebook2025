import React from "react";

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';



function SelectDate({ setDate }) {

    async function handleChange(e) {
        let { name, value } = e.target;

        console.log(name, value);
        let d = new Date(e.target.value);

        let currentDay = new Intl.DateTimeFormat("en", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })
            .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
            .replace(/[^a-zA-Z0-9]/g, "_");
        setDate(currentDay)
    }


    return <Container>
        <Form>
            <Row>
                <Col>
                    <Form.Group controlId="formStatePeriod">
                        <Form.Label>Период</Form.Label>
                        <Form.Control type="date" name="selecteddate" required onChange={handleChange} />
                    </Form.Group>
                </Col>
            </Row>
        </Form>


    </Container>
}

export default SelectDate