import React, { useState } from 'react';
import CustomPagination from '../layout/CustomPagination.jsx';

import ChoiceList from './ChoiceskList.jsx';
import AddChoice from './AddChoice.jsx';

import useFetch from '../services/fetchFirebaseDataWithCdns.js';

let Card = ReactBootstrap.Card;
let Button = ReactBootstrap.Button;

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
    <>
      <label>First Name:</label>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
      />
      <label>Last Name:</label>
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
      />
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <label>Address:</label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />
      {/* ... potentially many more individual input fields */}
    </>
  );
}


export default function ReducerContextCRUD() {
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
    <div >
    

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
            <AddChoice />
            <ChoiceList />
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>

        <AddOpenQuizForm />


    
    </div>
  );
}