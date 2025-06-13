import React, { useState, useContext } from "react";
import { GlobalContext } from "../../features/GlobalContext";

import ActiveCells from "./ActiveCells";
import GreenHeader from "./GreenHeader";

function SpreadsheetLayout() {
  const state = useContext(GlobalContext);


  return <div className="container excel">
    <GreenHeader />
    <ActiveCells />
  </div>
}

export default SpreadsheetLayout