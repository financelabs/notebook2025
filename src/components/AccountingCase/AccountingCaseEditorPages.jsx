import React, { useEffect, useReducer, useContext } from "react";

import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";

import { Button, Container, Row, Col } from "react-bootstrap";

function AccountingCaseEditorPages() {
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalContext);

    useEffect(() => { }, [
        state?.loading,
        state?.showWorkBook
    ])

    if (state.loading) return null;

    function doChangeLayout(id) {

        if (id === "showWorkBook") {
            dispatch({
                type: "SEED_STATE",
                payload: {
                    objects: {
                        showCaseDetails: false,
                        showCaseNewEntry: false,
                        showChooseUser: false,
                        showAllAccountingRecords: false,
                        showCase: false,

                        showWorkBook: true
                    },
                },
            })
        }

        if (id === "showChooseUser") {
            dispatch({
                type: "SEED_STATE",
                payload: {
                    objects: {
                        showCaseDetails: false,
                        showCaseNewEntry: false,
                        showWorkBook: false,
                        showAllAccountingRecords: false,
                        showCase: false,

                        showChooseUser: true
                    },
                },
            })
        }

        if (id === "showAllAccountingRecords") {
            dispatch({
                type: "SEED_STATE",
                payload: {
                    objects: {
                        showCaseDetails: false,
                        showCaseNewEntry: false,
                        showWorkBook: false,
                        showChooseUser: false,
                        showCase: false,
                        
                        showAllAccountingRecords: true
                    },
                },
            })
        }

        if (id === "showCase") {
            dispatch({
                type: "SEED_STATE",
                payload: {
                    objects: {
                        showCaseDetails: false,
                        showCaseNewEntry: false,
                        showWorkBook: false,
                        showChooseUser: false,
                        showAllAccountingRecords: false,

                        showCase: true
                    },
                },
            })
        }







    }




    return <Container>
        <Row>

            <Col className="p-1">
                <Button type="button" size="sm"
                    variant={!!state?.showWorkBook ? "secondary" : "outline-secondary"}
                    onClick={() => doChangeLayout("showWorkBook")}
                >
                    <small>{Array.isArray(state?.posts) ? "РТ " + state.posts.length : "РТ 0"}</small>
                </Button>
            </Col>

            <Col className="p-1">
                <Button type="button" size="sm"
                    variant={!!state?.showCase ? "secondary" : "outline-secondary"}
                    onClick={() => doChangeLayout("showCase")}
                >
                    <small>Show Cases</small>
                </Button>
            </Col>

            <Col className="p-1">
                <Button type="button" size="sm"
                    variant={!!state?.showAllAccountingRecords ? "secondary" : "outline-secondary"}
                    onClick={() => doChangeLayout("showAllAccountingRecords")}
                >
                    <small>All Records {Array.isArray(state?.allaccountingrecords) ? "Пров " + state.allaccountingrecords.length : "Пров 0"}</small>
                </Button>
            </Col>

            <Col className="p-1">
                <Button type="button" size="sm"
                    variant={!!state?.showChooseUser ? "secondary" : "outline-secondary"}
                    onClick={() => doChangeLayout("showChooseUser")}
                >
                    <small>Choose user</small>
                </Button>
            </Col>

        </Row>
    </Container>
}

export default AccountingCaseEditorPages