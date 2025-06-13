import React, { useEffect, useReducer, useContext } from "react";

import {GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";

function AccountingCaseConsoleLog() {
 const dispatch = useContext(GlobalDispatchContext);
 const state = useContext(GlobalContext);

  console.log(state);

 useEffect(()=>{
    console.log(state);
 }, [state.loading])



 return <div>Accounting Case Console Log</div>
}

export default AccountingCaseConsoleLog


