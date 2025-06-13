import alphabet from "./alphabet";

function makeDomNodeForSpreadsheet(tableArray) {

    var tbl = document.createElement("table");
    tbl.setAttribute('class', "table table-bordered table-sm");

    var tblHead = document.createElement("thead");
    var row = document.createElement("tr");

    var cell = document.createElement("th");
    cell.innerText = " ";
    row.appendChild(cell);

    !!tableArray && Array.isArray(tableArray) && !!tableArray[0] && tableArray[0].forEach((column, columnIndex) => {
        var cell = document.createElement("th");
        cell.setAttribute('class', "text-center");
        cell.innerText = alphabet[columnIndex];
        row.appendChild(cell);
    })

    tblHead.appendChild(row);
    tbl.appendChild(tblHead);

    var tblBody = document.createElement("tbody");

    !!tableArray && Array.isArray(tableArray) && tableArray.forEach((row, rowIndex) => {
        var row = document.createElement("tr");

        var cell = document.createElement("td");
        cell.setAttribute('scope', "row");
        cell.innerText = rowIndex + 1;
        row.appendChild(cell);

        !!tableArray[rowIndex] && tableArray[rowIndex].forEach((column, columnIndex) => {
            var cell = document.createElement("td");
            //      cell.setAttribute('class', "text-center");
            cell.innerText = tableArray[rowIndex][columnIndex];
            row.appendChild(cell);
        })

        tblBody.appendChild(row);
    })
    tbl.appendChild(tblBody);

    return tbl
}

export default makeDomNodeForSpreadsheet