import React from "react";

import alphabet from "../../../utlities/alphabet";

function AlphabetRow({x}) {
    const alphabetRow = [];
    for (let i = 0; i < x + 1; i += 1) {
      alphabetRow.push(
        <div key={alphabet[i]} className="cells__alphabet">
          {alphabet[i]}
        </div>
      );
    }
    return <React.Fragment>{alphabetRow}</React.Fragment>;
  }

  export default AlphabetRow;
  