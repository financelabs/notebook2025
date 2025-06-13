import React, { useEffect, useState, useContext } from "react";

import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";

import createForm from "../../utlities/createForm";

// Usage

let fieldsArray = [
    { id: 'username', value: "Ha ha", type: 'text', name: 'username', label: 'Username', small: "It's You" },
    { id: 'email', value: "Haha@gmail.com", type: 'email', name: 'email', label: 'Email', small: null },
    { id: 'comment', value: "<h1>Ha Ha</h1>", type: 'textarea', name: 'comment', label: 'Comment', small: null, rows: 3 },
    {
        id: 'conto', value: "1", name: 'conto', type: 'select', label: 'Conto', small: null,
        options: ["1", "2", "3", "4", "5"]
    },

]



function AccountingCaseForm() {
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalContext);

    useEffect(()=>{
        console.log("Rerender Form")
    }, [state?.loading, state.selectedItem?.needUpdate, state.selectedItem?.id])

    if (state?.loading) return null

    let objectKeys = Object.keys(state.selectedItem);

    const UserForm = createForm(fieldsArray.map(field => {
        if (objectKeys.includes(field.name)) {
            return {...field, value: state.selectedItem[field.name]} 
        } else { return field}
    }));

    const handleFormSubmit = (data) => {
        console.log(state?.selectedItem);
        console.log('Form Submitted:', data);
        dispatch({
            type: "SET_STORE_OBJECT",
            payload: {
                key: "selectedItem",
                value: { ...state.selectedItem, ...data, needUpdate: Math.random() }
            },
        });
        dispatch({
            type: "SET_STORE_OBJECT",
            payload: {
                key: "triggerSave",
                value: Math.random()
            },
        });


    };

    return <UserForm onSubmit={handleFormSubmit} />;
}

export default AccountingCaseForm