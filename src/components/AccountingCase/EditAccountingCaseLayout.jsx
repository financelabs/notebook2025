import React from 'react';

import AccountingCase from "./index";

import Container from 'react-bootstrap/Container';

function EditAccountingCaseLayout() {
  
     return <Container>
        <AccountingCase>
                <AccountingCase.EditAccountingCaseNavs />
                 <AccountingCase.AccountingCaseViewer />
                 <AccountingCase.AccountingCaseMachine />            
        </AccountingCase>       
    </Container>
}

export default EditAccountingCaseLayout