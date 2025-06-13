import alphabet from "./alphabet";

function createMinimalProtoArray(protoDataObject = {}) {
    let maxRow = 0;
    let maxColumn = 0;

    Object.keys(protoDataObject).forEach(objKey => {
        if (maxColumn < alphabet.findIndex(item => item === objKey.substring(0, 1))) {
            maxColumn = alphabet.findIndex(item => item === objKey.substring(0, 1)) + 1
        }
        if (maxRow < parseInt(objKey.substring(1))) {
            maxRow = parseInt(objKey.substring(1))
        }
    });

    //  console.log(maxColumn);
    //  console.log(maxRow);
    let array = new Array(maxRow).fill('').map(() => new Array(maxColumn).fill(''));
    //  console.log(array);

    Object.keys(protoDataObject).map((objKey) => {
        let col = objKey.substring(0, 1)
        let row = objKey.substring(1)
        //  const [col, ...row] = objKey;
        //     console.log(row);
        let colArrayIndex = alphabet.findIndex((item) => item === col);
        let rowArrayIndex = parseInt(row) - 1;
        //     console.log(colArrayIndex, rowArrayIndex, protoDataObject[objKey])
        array[rowArrayIndex][colArrayIndex] = protoDataObject[objKey];
    });

    return array;
}

export default createMinimalProtoArray