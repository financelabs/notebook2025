import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";


import { ButtonGroup } from 'react-bootstrap';


import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";


import saveState from "../../utlities/saveState";


function EditAccountingCaseNavs() {
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalContext);

  const [selectedQuizCaseId, setSelectedQuizCaseId] = useState(null);
  const [radioValue, setRadioValue] = useState('demo');

  console.log(state);

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
            <Col >
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

  if (!Array.isArray(state?.quizescases) || state.quizescases.length === 0 ) { return null }
  

  function doSelectCaseId(id) {
   dispatch({
      type: "SET_STORE_OBJECT",
      payload: {
        key: 'selectedQuizCaseId', 
        value: id
      },
    })
    setSelectedQuizCaseId(id)
  }

  function doSelectMode(e) {
    console.log(e.currentTarget)
    // dispatch({
    //   type: "SEED_STATE",
    //   payload: {
    //     objects: {
    //       loading: false,         
    //     },
    //   }});
      setRadioValue(e.currentTarget.name)
   }

  const radios = [
    { name: 'Demo', value: 'demo' },
    { name: 'User', value: 'user' }
  ];

  return <Container>
    {state.quizescases.map(item => {
      return <Button
        onClick={() => doSelectCaseId(item.id)}
        variant={selectedQuizCaseId === item.id ? 'secondary' : 'outline-secondary'}
        className='m-1' size='sm' key={item.id}>
        {item.id}
      </Button>
    })}

<br />

      <ButtonGroup>
        {radios.map((radio, idx) => (
          <Button
            size='sm'
            key={idx}
            variant={radio.value === radioValue ? "secondary": "outline-secondary"  } 
            name={radio.value}
            onChange={(e) => doSelectMode(e)}
          >
            {radio.name}
          </Button>
        ))}
      </ButtonGroup>


  </Container>
}

export default EditAccountingCaseNavs


