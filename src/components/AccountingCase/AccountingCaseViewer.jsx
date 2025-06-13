import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../../features/GlobalContext";

function AccountingCaseViewer() {
    const accountingCaseState = useContext(GlobalContext);

    console.log("AccountingCaseViewer");
    console.log(accountingCaseState);

    return <div key={accountingCaseState?.selectedQuizCaseId}>
        Accounting Case Viewer
    </div>
}

export default AccountingCaseViewer