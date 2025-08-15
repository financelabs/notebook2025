import React from "react";


function NumbersColumns({y}) {
    
    const numbersColumns = [];
    for (let i = 1; i < y + 1; i += 1) {
      numbersColumns.push(
        <div key={i} className="cells__number">
          {i}
        </div>
      );
    }

    return <React.Fragment>{numbersColumns}</React.Fragment>;
  }

  export default NumbersColumns;