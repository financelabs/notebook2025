import React, { useEffect, useState, useContext } from "react";

import { GlobalContext } from "../../features/GlobalContext";

import { ProcessWorkBook } from "../../original/pages/myworkbook";

function AccountingCaseWorkBook() {
  
    const state = useContext(GlobalContext);

    useEffect(()=>{
        console.log(state.loading, state.showWorkBook, state.userEmail);
     }, [state.loading, state.showWorkBook, state.userEmail])

    if (state.loading || !state?.showWorkBook) { return null }

    if (!Array.isArray(state?.posts) || state.posts.length === 0) {
        return <div>Рабочая тетрадь по этому email пуста</div>
    }

    return <ProcessWorkBook
     userPosts={state.posts}
     avatarUrl={state?.avatarUrl}
     user={state?.user}
     userEmail={state?.userEmail}
     /> 
}

export default AccountingCaseWorkBook