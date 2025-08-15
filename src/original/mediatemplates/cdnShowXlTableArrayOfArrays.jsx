import alphabet from "../../utlities/alphabet";

let { Table } = ReactBootstrap;

export default function ShowXlTableArrayOfArrays({xlArray}) {
    return <Table striped bordered hover>
    <thead>
      <tr>
        <th> </th>
        {xlArray[0].map((column, columnIndex) => (
          <th key={columnIndex} className="text-center">
            {alphabet[columnIndex]}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {xlArray.map((row, rowIndex) => (
        <tr key={rowIndex}>
          <td>
            {" "}
            <small className="ml-1">{rowIndex + 1}</small>
          </td>
          {row.map((column, columnIndex) => (
            <td key={rowIndex + columnIndex}>
              <small>{row[columnIndex]}</small>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
   </Table>
}


 