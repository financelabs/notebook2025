import { Parser as FormulaParser } from "hot-formula-parser";
import { produce } from "immer"

function createNewDraft(data) {
 //   console.log(data);
 //    return calcData(data);
     return calcDataWithImmer(data)
}

export default createNewDraft;

function calcDataWithImmer(data) {
  //let newdata = JSON.parse(JSON.stringify(data));
  //let formulas = [];

  const newdata = produce(data, draft => {
    let oneMoreLoop = true;
    while (oneMoreLoop) {
      oneMoreLoop = false;
      for (let row = 0; row < draft.length; row++) {
        for (let ix = 0; ix < draft[row].length; ix++) {
          let cellValue = draft[row][ix];
          //    console.log(cellValue);
          if (
            (typeof cellValue === "string" || cellValue instanceof String) &&
            cellValue.toString().includes("=")
          ) {
  
            let mapObj = {
               СТЕПЕНЬ: "POWER",
               ЧПС: "NPV",
               ВСД: "IRR",
               МВСД: "MIRR",
               СУММ: "SUM",
               СРЗНАЧ: "AVERAGE",
               ОКРУГЛ: "ROUND",
               СТАНДОТКЛОН: "STDEV"
              };
            let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
            cellValue = cellValue.replace(re, function (matched) {
              return mapObj[matched];
            });
  
            let result = calculateFormula(draft, cellValue.slice(1));
            //       formulas.push({ formula: cellValue, result: result })
            if (result.later) {
              draft[row][ix] = cellValue;
              oneMoreLoop = true;
            } else {
              draft[row][ix] = result.res.result;
            }
          } else draft[row][ix] = cellValue;
        }
      }
    }
//    draft["id1"].done = true
})
  // console.log(newdata);
  return newdata;
}


// function calcData(data) {
//     let newdata = JSON.parse(JSON.stringify(data));
//     //let formulas = [];
  
//     let oneMoreLoop = true;
//     while (oneMoreLoop) {
//       oneMoreLoop = false;
//       for (let row = 0; row < newdata.length; row++) {
//         for (let ix = 0; ix < newdata[row].length; ix++) {
//           let cellValue = newdata[row][ix];
//           //    console.log(cellValue);
//           if (
//             (typeof cellValue === "string" || cellValue instanceof String) &&
//             cellValue.toString().includes("=")
//           ) {
  
//             let mapObj = {
//                СТЕПЕНЬ: "POWER",
//                ЧПС: "NPV",
//                ВСД: "IRR",
//                МВСД: "MIRR",
//                СУММ: "SUM",
//                СРЗНАЧ: "AVERAGE",
//                ОКРУГЛ: "ROUND",
//                СТАНДОТКЛОН: "STDEV"
//               };
//             let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
//             cellValue = cellValue.replace(re, function (matched) {
//               return mapObj[matched];
//             });
  
//             let result = calculateFormula(newdata, cellValue.slice(1));
//             //       formulas.push({ formula: cellValue, result: result })
//             if (result.later) {
//               newdata[row][ix] = cellValue;
//               oneMoreLoop = true;
//             } else {
//               newdata[row][ix] = result.res.result;
//             }
//           } else newdata[row][ix] = cellValue;
//         }
//       }
//     }
//     // console.log(newdata);
//     return newdata;
//   }
  
  function calculateFormula(data, formula) {
    let parser = new FormulaParser();
  
    let dependencies = [];
  
//     console.log(data, formula);
  
    parser.on("callCellValue", (cellCoord, done) => {
      const x = cellCoord.column.index + 1;
      const y = cellCoord.row.index + 1;
  
      dependencies.push({ x: x, y: y });
  
      // if (data[y - 1][x - 1].toString().slice(0, 1) === "=") {
      //   return done(parseFloat(calculateFormula(data[y - 1][x - 1].toString().slice(1))));
      // }
  
      if (!data[y - 1] || !data[y - 1][x - 1]) {
        return done("");
      }
      //  console.log(y - 1, x - 1);
      done(data[y - 1][x - 1]);
    });
  
    parser.on("callRangeValue", (startCellCoord, endCellCoord, done) => {
      var fragment = [];
  
      for (
        var row = startCellCoord.row.index;
        row <= endCellCoord.row.index;
        row++
      ) {
        var rowData = data[row];
        var colFragment = [];
  
        for (
          var col = startCellCoord.column.index;
          col <= endCellCoord.column.index;
          col++
        ) {
          var value = rowData[col];
  
          dependencies.push({ x: col, y: row });
  
          colFragment.push(value);
        }
        fragment.push(colFragment);
      }
  
      // console.log(fragment);
  
      if (fragment) {
        done(fragment);
      }
    });
  
    let resultObj = parser.parse(formula);
  
    // console.log('formula: ' + formula);
    let later = false;
    let dependendentOn = [];
    dependencies.forEach(item => {
      let cellValue = null;
      try {
        cellValue = data[item.y - 1][item.x - 1];
        //   console.log(cellValue);
        dependendentOn.push(cellValue);
      } catch {
        //      console.log(formula);
      }
  
      if (
        (typeof cellValue === "string" || cellValue instanceof String) &&
        cellValue.toString().includes("=")
      ) {
        later = true;
      }
    });
    // console.log('dependendentOn: ' + dependendentOn);
    // console.log('---------');
  
    return {
      res: resultObj,
      dependencies: dependencies,
      later: later,
      dependendentOn: dependendentOn
    };
  }
  
  