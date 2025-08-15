import React from "react";
import { useFirebaseNode } from "../hooks/useFirebaseNode";

import { doFindValuesForArrayOfArraysTable } from "../features/data/dataSlice";

import Table from "react-bootstrap/Table";



export default function ShowXlTableWithPredefinedIndicators({ quiz, xlArray }) {
  const { data: projectData, loading, error } = useFirebaseNode('openmediadata/' + quiz.answer);

  if (!!loading || !projectData) { return <div>...</div> }
  if (!!error) { return <div>:-(</div> }

  let projectDataArray = Object.keys(projectData)
    .map((item) => { return projectData[item] })

  // console.log(quiz);
  // console.log(projectDataArray);

  let tableWithData = doFindValuesForArrayOfArraysTable(projectDataArray, xlArray);
  // console.log(tableWithData);


  return <Table striped bordered hover size="sm">
    <thead>
      <tr>
        {tableWithData[0].map((column, columnIndex) => (
          <th key={columnIndex} className="text-center">
            {tableWithData[0][columnIndex]}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {tableWithData.map((row, rowIndex) => {
        if (rowIndex > 0) {
          return <tr key={rowIndex}>
            {row.map((column, columnIndex) => (
              <td key={rowIndex + columnIndex} >
            <small className={"ml-1"}> {row[columnIndex]}</small>   {/* <small>{row[columnIndex]}</small>  */}
              </td>
            ))}
          </tr>
        }
      })}
    </tbody>
  </Table>
}