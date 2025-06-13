import React, { useReducer } from "react";

import caseReducer from "../../features/case/caseReducer";

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

import SelectDate from "../SelectDate";


function ShowUsers({ users, doCheckUser }) {
    console.log(users);
    return <ListGroup as="ol" numbered>
        {users.map(user => {
            return <ListGroup.Item key={user.id} as="li"
                className="d-flex justify-content-between align-items-start"
            >
                <div className="me-auto">
                    <img src={user?.avatarUrl} className="avatar" />
                </div>
                <div className="p-3">
                    <small className="fw-bold ">{user?.user}</small>
                    <br/>
                    <button type="button" className="btn btn-secondary btn-sm"
                        onClick={() => doCheckUser(user.id)}
                    >Check</button>
                </div>

            </ListGroup.Item>
        })}
    </ListGroup>
}

function ShowTitles({ titles, userTitlesForSelectedDates, userEmail, deleteTitle }) {
    console.log(titles);

    function doDeleteTitle(e) {
        console.log(e.target.id);
        deleteTitle(e.target.id)
    }

    if (!!userEmail) {
        return <ListGroup as="ol" numbered>
            {titles.map(title => {
                return <ListGroup.Item key={title} as="li"
                    className="d-flex justify-content-between align-items-start"

                >
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">{title}</div>
                    </div>

                    <Badge bg="danger" pill className="mx-1"><span className="text-white" id={title} onClick={doDeleteTitle}>&#x2715;</span></Badge>

                    {userTitlesForSelectedDates.includes(title) && <Badge bg="success" className="mx-1" pill><span className="text-white">&#x2713;</span></Badge>}

                </ListGroup.Item>
            })}
        </ListGroup>
    }


    return <ListGroup as="ol" numbered>
        {titles.map(title => {
            return <ListGroup.Item key={title} as="li"
                className="d-flex justify-content-between align-items-start"
            >
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{title}</div>
                </div>
            </ListGroup.Item>
        })}
    </ListGroup>
}

function SelectUsersQuizesByDate() {

    const [state, dispatch] = useReducer(caseReducer, {
        loading: true,
        users: [],
        titles: [],
        userTitlesForSelectedDates: [],
        userEmail: null
    });


    async function handleChange(currentDay) {

        let res = await basicfirebasecrudservices.getFirebaseNode({
            url: "/currentDay/" + currentDay + "/posts",
            type: "array",
        });

        console.log(res);

        let uniqueUserEmails = [...new Set(res.map(item => item?.email.replace(/[^a-zA-Z0-9]/g, "_")))];
        let uniqueTitles = [...new Set(res.map(item => item?.title))];
        let uniqueUsers = [...new Set(res.map(item => item?.user))];

        let updatedopenavatars = {};

        await Promise.all(uniqueUserEmails.map(userEmail => {
            return basicfirebasecrudservices.getFirebaseNode({
                url: "openavatars/" + userEmail,
                type: "object"
            })
        }))
            .then(values => {
                values.forEach((result, index) =>
                    updatedopenavatars[uniqueUserEmails[index]] = result
                );
                console.log(updatedopenavatars);
            });

        let users = [...state.users];
        let titles = [...state.titles];

        uniqueTitles.forEach(item => {
            if (!titles.includes(item)) {
                titles.push(item)
            }
        })

        Object.keys(updatedopenavatars).forEach(objKey => {

            let user = res.find(item => item.email.replace(/[^a-zA-Z0-9]/g, "_") === objKey)?.user;

            console.log(user);

            if (!users.find(item => item.id === objKey)) {
                console.log("Adding " + objKey)
                if (!!updatedopenavatars[objKey]) {
                    users.push(updatedopenavatars[objKey])
                } else {
                    users.push({ id: objKey, avatarUrl: "../freelancer.jpg", user: "Freelancer " + objKey + " " + user })
                }
            } else {
                console.log("Already added " + objKey)
            }
            console.log("---")
        });

        dispatch({
            type: "SEED_STATE",
            payload: {
                objects: { users, titles, loading: false },
            },
        });

    }

    //   if (state?.loading) return null

    console.log(state);

    async function doCheckUser(userEmail) {
        let res = await basicfirebasecrudservices.getFirebaseNode({
            url: "usersCraft/" + userEmail + "/posts/",
            type: "array",
        });
        let userTitlesForSelectedDates = [];
        let uniqueUserTitles = [...new Set(res.map(item => item?.title))];
        state.titles.forEach(item => {
            if (uniqueUserTitles.includes(item)) { userTitlesForSelectedDates.push(item) }
        });
        console.log(userTitlesForSelectedDates);
        dispatch({
            type: "SEED_STATE",
            payload: {
                objects: { userTitlesForSelectedDates, userEmail },
            },
        });
    }

    function deleteTitle(title) {
        dispatch({
            type: "DELETE_ITEM_FROM_ARRAY",
            payload: {
                arrayName: "titles",
                item: title
            },
        });
    }


    return <Container>

        <SelectDate setDate={handleChange} />

        <Row>
            <Col><ShowUsers users={state.users} doCheckUser={doCheckUser} /> </Col>
            <Col><ShowTitles titles={state.titles}
                userTitlesForSelectedDates={state.userTitlesForSelectedDates}
                userEmail={state.userEmail}
                deleteTitle={deleteTitle}
            /></Col>
        </Row>
    </Container>
}

export default SelectUsersQuizesByDate