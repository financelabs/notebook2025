import React from "react";


function NumbersColumns(props) {
    
    const numbersColumns = [];
    for (let y = 1; y < props.y + 1; y += 1) {
      numbersColumns.push(
        <div key={y} className="cells__number">
          {y}
        </div>
      );
    }

    return <React.Fragment>{numbersColumns}</React.Fragment>;
  }

  export default NumbersColumns;