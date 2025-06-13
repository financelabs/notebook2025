import React from 'react';

import AccountingCase from "./index";

import Container from 'react-bootstrap/Container';

function AccountingCaseUserLayout() {
  
     return <Container>
        <AccountingCase>
                <AccountingCase.EditAccountingCaseNavs />
                 <AccountingCase.AccountingCaseViewer />
                 <AccountingCase.AccountingCaseMachine />            
        </AccountingCase>       
    </Container>
}

export default AccountingCaseUserLayout