import React, { useState, useEffect, useContext } from "react";
import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";
import { Container, Row, Col, Button } from "react-bootstrap";
import timeout from "../../utlities/timeout";

function Temporary() {
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalContext);
    const [isLoading, setLoading] = useState(true);

    let { userEmail, id, posts } = state;

    useEffect(() => {
        if (!state.loading) {
            setLoading(false);
            console.log(state);
            console.log(posts.find(post => post.id === "-MYq31PEnR3Pviq-trvL"))
        };
    }, [state.loading, state.records.length, state.triggerSave])

    async function saveRecords() {
        setLoading(true);
        let post = state.posts.find(post => post.id === "-MYq31PEnR3Pviq-trvL");
        let checkedRecords = Array.isArray(post?.content) ? post?.content : null;
        //  let res = timeout(5000);
        if (checkedRecords) {
            var updates = {};
            updates["/usersCraft/" + userEmail + "/posts/" + post.id + "/content"] = checkedRecords;
            updates["/usersCraft/" + userEmail + "/posts/" + post.id + "/date"] = new Intl.DateTimeFormat("ru",
                {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                }).format(new Date()), //Date().toJSON()
                console.log(updates);
            basicfirebasecrudservices
                .updateFirebaseNode(updates)
                //  return timeout(475)
                .then(() => {
                    console.log(updates);
                    setLoading(false);
                });
            // dispatch({
            //     type: "SET_STORE_OBJECT",
            //     payload: {
            //         key: "triggerSave",
            //         value: Math.random(),
            //     },
            // });


        }
    }


    return <Container>

        <Row className="mt-1">
            <Col>Temporary</Col>
            <Col>
                <Button
                    type="button"
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => saveRecords()}
                >
                    {isLoading ?
                        <div className="d-flex justify-content-center">
                            <div className="spinner-grow spinner-grow-sm" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div> : "Save Case"}
                </Button>
            </Col>
        </Row>

        <Row>
            <Col><img className="avatar" src={state?.avatarUrl} /></Col>
            <Col>{state?.user}</Col>
            <Col>{state?.type}</Col>
        </Row>
    </Container>
}

export default Temporary