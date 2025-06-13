import React, { useEffect, useContext } from "react";
import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";

import parse from "html-react-parser";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

function ShowTaskRecords() {
  const dispatch = useContext(GlobalDispatchContext);
  const state = useContext(GlobalContext);

  useEffect(() => {
    console.log(state?.currentTaskIndex);
  }, [state?.id, state?.currentTaskIndex]);

  if (!state?.id || !Array.isArray(state?.quizescases) || !state?.currentTaskIndex) {
    return null;
  }

  let taskObject = state.quizescases.find(item => item.id === state.id)[state.currentTaskIndex]

  let requiredRecords = state.records.filter((record) => record.taskId === taskObject?.id);

  if (requiredRecords.length === 0) { return null }

  function delRecord(index) {
    console.log(requiredRecords[index].id);
    dispatch({
      type: "DELETE_ITEM_FROM_ARRAY",
      payload: {
        arrayName: "records",
        id: requiredRecords[index].id,
      },
    });
    dispatch({
      type: "DELETE_ITEM_FROM_ARRAY",
      payload: {
        arrayName: "bookrecords",
        id: requiredRecords[index].id,
      },
    });
  }



  return (
    <Container>
      {requiredRecords.map((item, index) => {
        return (
          <div className="m-1" key={index}>
            <Row>
              <Col>{index}</Col>
              <Col>{item?.period} </Col>
              <Col>{item?.bookD} </Col>
              <Col>{item?.bookK} </Col>
              <Col>{item?.sum} </Col>
            </Row>
            <Row>
              <Col>{parse(!!item?.comment ? item.comment : "")}</Col>
              <Col md="auto">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => delRecord(index)}
                >
                  X
                </Button>
              </Col>
            </Row>
          </div>
        );
      })}
    </Container>
  );
}

export default ShowTaskRecords