import React, { useState } from 'react';
import CustomPagination from './CustomPagination.jsx';
import { Provider, useSelector, useDispatch } from 'react-redux';
//import { ChoicesProvider } from '../features/choices/ChoicesContext.js';
// import ChoiceList from './ChoiceskList.jsx';
// import AddChoice from './AddChoice.jsx';

import useFetch from '../services/fetchFirebaseDataWithCdns.js';

let Card = ReactBootstrap.Card;
let Button = ReactBootstrap.Button;



function ChoiceList() {
  const choices = useSelector(state => state.choices);
  return (
    <div className='container'>
      {choices.map(choice => (
        <div key={choice.id} className='p-1'>
          <Choice choice={choice} />
        </div>
      ))}
    </div>
  );
}

function Choice({ choice }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  console.log(choice);

  let choiceContent;
  if (isEditing) {
    choiceContent = (
      <>
        <input
          class="form-control form-control-sm"
          value={choice.text}
          onChange={e => {
            dispatch({
              type: "UPDATE_ITEM_IN_ARRAY",
              payload: {
                arrayName: "choices",
                item: {
                  ...choice,
                  text: e.target.value
                }
              }
            });
            // dispatch({
            //   type: 'changed',
            //   choice: {
            //     ...choice,
            //     text: e.target.value
            //   }
            // });
          }} />
        <button
          className='btn btn-sm btn-outline-secondary m-1'
          onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    choiceContent = (
      <>
        <span className='mx-1'>{choice.text}</span>
        <button
          className='btn btn-sm btn-outline-secondary m-1'
          onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <div className='d-flex'>
      <input
        type="checkbox"
        class="form-check-input"
        checked={choice.isRight}
        onChange={e => {
          dispatch({
            type: "UPDATE_ITEM_IN_ARRAY",
            payload: {
              arrayName: "choices",
              item: {
                ...choice,
                isRight: e.target.checked
              }
            }
          });
          // dispatch({
          //   type: 'changed',
          //   choice: {
          //     ...choice,
          //     isRight: e.target.checked
          //   }
          // });
        }}
      />
      <span className='mx-1'>{choiceContent}</span>
      <button
        className='btn btn-sm btn-outline-danger m-1'
        onClick={() => {

          dispatch({
            type: "DELETE_ITEM_FROM_ARRAY",
            payload: {
              arrayName: "choices",
              id: choice.id
            }
          });
        }}>
        Delete
      </button>
    </div>
  );
}

function AddChoice() {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  return (
    <>
      <div class="input-group m-1">
        <span class="input-group-text" id="basic-addon1">Choice</span>
        <input type="text" class="form-control" placeholder="Add choice" aria-label="Username" aria-describedby="basic-addon1"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <button
        className='btn btn-sm btn-outline-secondary m-1'
        onClick={() => {
          setText('');

          // dispatch({
          //   type: 'added',
          //   id: nextId++,
          //   text: text,
          // });

          dispatch({
            type: "PUSH_ITEM_TO_ARRAY",
            payload: {
              arrayName: "choices",
              item: {
                id: Math.random() * 100,
                text: text,
              }
            }
          });  
      }}>Add</button >
    <hr />
    </>
  );
}


export default function ReactReduxCRUD() {
  const { data, loading, error } = useFetch({ url: 'quizescases/quizesCasesIds/', type: 'array' });
  const [currentPage, setCurrentPage] = useState(1);

  function doSetCurrentPage(args) {
    setCurrentPage(args)
  }

  if (loading || error || !Array.isArray(data)) {
    return <div className="d-flex justify-content-center">
      <div className="spinner-grow spinner-grow-sm" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }

  // console.log(data);
  console.log(data[currentPage]);

  return (
    <div>


      <CustomPagination
        itemsCount={data.length}
        itemsPerPage={1}
        currentPage={currentPage}
        setCurrentPage={doSetCurrentPage}
        alwaysShown={true}
      />


      <Card style={{ width: '36rem' }}>
        <Card.Img variant="top" src="https://images.unsplash.com/photo-1671170378099-17a7243769b8?q=100&w=720&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        <Card.Body>
          <Card.Title>{data[currentPage]?.theme}</Card.Title>
          <Card.Text>
            {data[currentPage]?.title}
          </Card.Text>

          <hr />
          {/* <AddChoice />
            <ChoiceList /> */}
          <AddChoice />
          <ChoiceList />
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>

      <AddOpenQuizForm />



    </div>
  );
}

function AddOpenQuizForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    // ... potentially many more individual properties
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className='container'>
      <label>First Name:</label>
      <input
        class="form-control form-control-sm"
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
      />
      <label>Last Name:</label>
      <input
        class="form-control form-control-sm"
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
      />
      <label>Email:</label>
      <input
        class="form-control form-control-sm"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <label>Address:</label>
      <input
        class="form-control form-control-sm"
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />
      {/* ... potentially many more individual input fields */}
    </div>
  );
}