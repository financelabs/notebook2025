import React, { useEffect, useState, useContext } from "react";

import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";

import createForm from "../../utlities/createForm";
import { Container } from "react-bootstrap";

// Usage

let fieldsArray = [
    {
        id: 'selectedarray', value: "allaccountingrecords", name: 'selectedarray', type: 'select', label: 'Selected Array', small: null,
        options: ["allaccountingrecords", "periods", "quizescases"]
    }
];


function AccountingCaseSelectArray() {
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalContext);

    useEffect(() => {
        //    console.log("Rerender Form")
    }, [state?.loading])

    if (state?.loading) return null

    const UserForm = createForm(fieldsArray);

     const handleFormSubmit = (data) => {
        console.log('Form Submitted:', data);
    };

    return <Container>
        <UserForm onSubmit={handleFormSubmit} />
    </Container>
}

export default AccountingCaseSelectArray
