import React, { useEffect, useState, useContext } from "react";
import parse from "html-react-parser";

import { GlobalContext } from "../../features/GlobalContext";

import transactionsList from "../../utlities/transactionsList";

import { Container } from "react-bootstrap";

function AccountingCaseUserAllAccountingRecords() {  
    const state = useContext(GlobalContext);

       useEffect(()=>{
        console.log(state.loading, state.showAllAccountingRecord, state?.userEmail);
     }, [state.loading, state.showAllAccountingRecords, state?.userEmail])

    if (state.loading || !state?.showAllAccountingRecords || !state?.userEmail) { return null }

    return <Container>{parse(transactionsList(state.allaccountingrecords))}</Container>
}

export default AccountingCaseUserAllAccountingRecords