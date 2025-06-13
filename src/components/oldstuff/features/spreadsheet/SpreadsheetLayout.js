import React, { useState, useEffect } from "react";
import CompactSpreadsheetLayout from "./CompactSpreadsheetLayout";

export default function SpreadsheetLayout(props) {
  //  const [expandView, toggle_expand_view] = useState(false);

  let screenSize = null;
    return <div className="container">
 <CompactSpreadsheetLayout screenSize={screenSize}/>
    </div>
    
   

}