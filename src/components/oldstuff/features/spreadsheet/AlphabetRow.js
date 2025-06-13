import React from "react";


export const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];


function AlphabetRow(props) {
    const alphabetRow = [];
    for (let x = 0; x < props.x + 1; x += 1) {
      alphabetRow.push(
        <div key={alphabet[x]} className="cells__alphabet">
          {alphabet[x]}
        </div>
      );
    }
    return <React.Fragment>{alphabetRow}</React.Fragment>;
  }

  export default AlphabetRow;
  