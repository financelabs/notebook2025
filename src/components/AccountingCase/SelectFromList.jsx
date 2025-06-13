import React, { useEffect, useState, useContext } from "react";

import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";

import { NavDropdown } from "react-bootstrap";

function SelectFromList({ arrayName = "quizescases", objectKey = "selectedQuizCaseId" }) {
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalContext);
    
    useEffect(() => {
        console.log(state);
    }, [state.loading])

    if (state.loading) return null

      function doSelectId(id) {
        console.log(id);
        dispatch({
            type: "SEED_STATE",
            payload: {
                objects: {
                    [objectKey]: id
                },
            },
        });
    }


    return <NavDropdown title="Выбрать" id="collapsible-nav-dropdown">
        {Array.isArray(state?.[arrayName]) &&
            state[arrayName].map((item) => {
                return (
                    <NavDropdown.Item
                        //  href={item.id}
                        key={item.id}
                        onClick={() => {
                            doSelectId(item.id);
                        }}
                    >
                        {item?.title}
                    </NavDropdown.Item>
                );
            })}
    </NavDropdown>
}

export default SelectFromList