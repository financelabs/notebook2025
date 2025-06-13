import React, { useContext } from "react";

import saveState from "../../utlities/saveState";


import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";


import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";


function AccountingUserNavigation() {
  const dispatch = useContext(GlobalDispatchContext);
  const state = useContext(GlobalContext);

  if (state.loading) { return null }

  if (!state?.email || state.email.length < 5) {
    async function handleSubmit(e) {
      e.preventDefault();
      const currentTarget = e.currentTarget;
      const formdata = new FormData(currentTarget);
      let { email, user } = Object.fromEntries(formdata);

      if (email.length > 5 && user.length > 5) {
        console.log(user, email);
        saveState({
          application: { email, user, avatarUrl: "../freelancer.jpg" },
        });
        setTimeout(() => window.location.reload(), 3000);
      }
    }

    return (
      <Navbar className="bg-body-tertiary m-1">
        <Form inline="true"  onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="email"
                className="m-3"
                name="email"
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="user"
                className="m-3"
                name="user"
              />
            </Col>
            <Col md="auto">
              <Button className="m-3" variant="outline-primary" type="submit">
                Сохранить
              </Button>
            </Col>
          </Row>
        </Form>
      </Navbar>
    );
  }

  async function doSelectCase(id) {
    let userCase = await basicfirebasecrudservices.getFirebaseNode({
      url: "usersCraft/" + state?.userEmail + "/posts/" + id,
      type: "object",
    });
    let {
      theme,
      title,
      tasks = {},
    } = await basicfirebasecrudservices.getFirebaseNode({
      url: "openquizes/" + id,
      type: "object",
    });
    let records = userCase?.content
      ? Object.keys(userCase.content).map((objKey) => userCase.content[objKey])
      : [];
    let bookrecords = userCase?.bookrecords
      ? Object.keys(userCase.bookrecords).map(
        (objKey) => userCase.bookrecords[objKey]
      )
      : [];

    let processedTasks = Object.keys(tasks).map(objKey => tasks[objKey]).sort((a, b) => (a.sortby > b.sortby) ? 1 : ((b.sortby > a.sortby) ? -1 : 0))
   // console.log(processedTasks);
    dispatch({
      type: "SEED_STATE",
      payload: {
        objects: {
          theme,
          id,
          title,
          tasks,
          records,
          bookrecords,
          tasks: processedTasks
        },
      },
    });
  }



  function doShowCaseDetails() {

    dispatch({
      type: "SEED_STATE",
      payload: {
        objects: {
          showCaseDetails: true,
          showCaseNewEntry: false,
          showWorkBook: false
        },
      },
    })
  }

  function doShowMyWorkBook() {
    dispatch({
      type: "SEED_STATE",
      payload: {
        objects: {
          showCaseDetails: false,
          showCaseNewEntry: false,
          showWorkBook: true
        },
      },
    });
  }
  
  return (
    <Navbar className="bg-body-tertiary m-1" key={state?.id}>
      <Container>
        <Navbar.Brand href="#home">
          <img
            loading="lazy"
            src={!!state?.avatarUrl ? state.avatarUrl : "../freelancer.jpg"}
            alt="me"
            style={{
              marginRight: "20px",
              marginLeft: "20px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              filter: "grayscale(100%)",
              objectFit: "cover",
            }}
          ></img>
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link
            href={
              !!state?.id
                ? "https://econolabs.github.io/print/?id=" + state.id
                : "#case"
            }
          >
            Кейс
          </Nav.Link>
          <NavDropdown title="Выбрать" id="collapsible-nav-dropdown">
            {Array.isArray(state?.quizescases) &&
              state.quizescases.map((item) => {
                return (
                  <NavDropdown.Item
                    //  href={item.id}
                    key={item.id}
                    onClick={() => {
                      doSelectCase(item.id);
                    }}
                  >
                    {item?.title}
                  </NavDropdown.Item>
                );
              })}
          </NavDropdown>
        </Nav>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <small className="m-1 p-1">{state?.theme}</small>
          </Navbar.Text>
          {!!state?.title && <Navbar.Text className="p-1">
            <Button type="button" variant="outline-secondary" size="sm"
              onClick={() => doShowCaseDetails()}
            >
              <small>{"Подробнее про " + state.title}</small>
            </Button>
          </Navbar.Text>}

          <Navbar.Text className="p-1">
            <Button type="button" variant="outline-secondary" size="sm"
              onClick={() => doShowMyWorkBook()}
            >
              <small>{"РТ " + Array.isArray(state?.posts) ? state.posts.length : "0"}</small>
            </Button>
          </Navbar.Text>

          {/* <SaveMyRecords state={state} /> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AccountingUserNavigation