import alphabet from "./alphabet";

function makeInnerHTMLforContentArray(tableArray) {
    console.log(tableArray);
    let newTable = "<table class='table table-bordered table-sm'><thead><tr><th></th>";

    Array.isArray(tableArray) && !!tableArray[0].forEach((_, columnIndex) => {
        newTable += "<th class='text-center'>" + alphabet[columnIndex] + "</th>";
    });

    newTable += "</tr></thead><tbody>"

    Array.isArray(tableArray) && !!tableArray.forEach((_, rowIndex) => {
        newTable += "<tr><td scope='row'>" + (rowIndex + 1) + "</td>";

       !!tableArray[rowIndex] && tableArray[rowIndex].forEach((_, columnIndex) => {
            newTable += "<td>" + tableArray[rowIndex][columnIndex] + "</td>"
        })

        newTable += "</tr>"
       
    });




    newTable += "<tbody></table>";
    return newTable

}




export default makeInnerHTMLforContentArray