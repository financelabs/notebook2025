import React, { useEffect, useContext } from "react";

import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

function AccountingChooseUser() {
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalContext);

    useEffect(() => {
        console.log(state.groupvatars);
    }, [state.loading, state.showChooseUser])

    if (!state?.showChooseUser) return null

    async function doSelectUser(userEmail) {
        console.log(userEmail);
        let ava = state.groupvatars.find(item => item.id === userEmail);

        let posts = await basicfirebasecrudservices.getFirebaseNode({
            url: "usersCraft/" + userEmail + "/posts/",
            //   "usersCraft/" + "accounting@yandex.ru".replace(/[^a-zA-Z0-9]/g, "_") + "/posts/",
            type: "array",
        });


        let allaccountingrecords =
            await basicfirebasecrudservices.getFirebaseNode({
                url: "usersCraft/" + userEmail + "/posts/accounting/allbookrecords",
                type: "array",
            });


        dispatch({
            type: "SEED_STATE",
            payload: {
                objects: {
                    email: userEmail,
                    user: ava.user,
                    avatarUrl: ava.avatarUrl,
                    userEmail: userEmail,
                    posts: posts,
                    allaccountingrecords: allaccountingrecords
                },
            },
        });
    }

    return <Container>
        <Row>{Array.isArray(state.groupvatars) && state.groupvatars.length > 0 && state.groupvatars.map(ava => {
            return <Col key={ava.id}>
                <Card style={{ width: '200px' }} className="m-1">
                    <Card.Img variant="top" src={ava.avatarUrl} />
                    <Card.Body>
                        <Card.Title>{ava.user}</Card.Title>
                        <Card.Text>
                            {ava.id}
                        </Card.Text>
                        <Button variant="outline-secondary" size="sm" onClick={() => doSelectUser(ava.id)}>Select</Button>
                    </Card.Body>
                </Card>
            </Col>
        })}
        </Row>

    </Container>
}

export default AccountingChooseUser
