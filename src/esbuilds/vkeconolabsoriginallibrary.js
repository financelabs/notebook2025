import { getApps, deleteApp, initializeApp } from "firebase/app";
import { getDatabase, get, ref, update, push, child } from "firebase/database";
import { produce } from "immer";

import saveState from "../../src/utlities/saveState";
import generateUser from "../../src/utlities/generateUser";
import createProtoObject from "../../src/utlities/createProtoObject";

import { Button } from "@vkontakte/vkui";

import { createApi } from 'unsplash-js';

console.log("vkeconolabsoriginallibrary");

// console.log(window.formulaParser);

// let formulaParser = !!window?.formulaParser ? window.formulaParser : ()=>void



function createNewDraft(data) {
  //   console.log(data);
  //    return calcData(data);
  return calcDataWithImmer(data);
}
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
          if ((typeof cellValue === "string" || cellValue instanceof String) && cellValue.toString().includes("=")) {
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
  });
  // console.log(newdata);
  return newdata;
}



function calculateFormula(data, formula) {
  let windowformulaParser = window.formulaParser;
  let parser = new windowformulaParser.Parser();
  let dependencies = [];

  //     console.log(data, formula);

  parser.on("callCellValue", (cellCoord, done) => {
    const x = cellCoord.column.index + 1;
    const y = cellCoord.row.index + 1;
    dependencies.push({
      x: x,
      y: y
    });

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
    for (var row = startCellCoord.row.index; row <= endCellCoord.row.index; row++) {
      var rowData = data[row];
      var colFragment = [];
      for (var col = startCellCoord.column.index; col <= endCellCoord.column.index; col++) {
        var value = rowData[col];
        dependencies.push({
          x: col,
          y: row
        });
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
    if ((typeof cellValue === "string" || cellValue instanceof String) && cellValue.toString().includes("=")) {
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


//Firebase

let app;
if (getApps().length > 1) {
  deleteApp(getApps()[1])
    .then(function () {
      console.log("App deleted successfully");
    })
    .catch(function (error) {
      console.log("Error deleting app:", error);
    });
}
if (getApps().length < 1) {
  let fireconf = {};
  try {
    fireconf = document.body.dataset;
  } catch (err) {
    throw new Error('Unable to get params' + err)
  }
  const firebaseConfig = {
    apiKey: fireconf.api,
    databaseURL: "https://" + fireconf.base + ".firebaseio.com",
    appId: fireconf.app
  };
  app = initializeApp(firebaseConfig);
}
const db = getDatabase();

async function getFirebaseNode({
  url = "crafts/temp_gmail_com/posts/-Ml6DEjYhdnjuW6HiHB7",
  type = "array"
}) {
  try {
    let snapshot = await get(ref(db, url));
    if (snapshot.exists()) {
      let res = snapshot.val();
      if (type === "array") { return Object.keys(res).map(objKey => res[objKey]) }
      return res
    } else {
      if (type === "array") { return [] } else { return null }
    }
  }
  catch (err) {
    console.log(err);
    if (type === "array") { return [] } else { return {} }
  }
}

async function updateFirebaseNode(updates = { temp: "temp" }) {
  try {
    //let res = await timeout(3000); console.log(updates);
    await update(ref(db), updates);
    return true
  }
  catch (error) {
    console.error(error)
    return error
  }
}

function getFirebaseNodeKey(url) {
  return push(child(ref(db), url + "/")).key;
}


function caseReducer(state = {}, action) {
  // console.log(action);
  switch (action.type) {

    // case "ADD_BOOK":
    // return produce(state, (draft) => {
    //   draft.books.list.push({ ...payload });
    // });


    case "SEED_ARRAY":
      return produce(state, (draft) => {
        draft[action.payload.arrayName] = action.payload.arrayItems;

      })

    case 'LOAD_DATA':
      return produce(state, (draft) => {
        draft.data = action.payload.data;
        draft.protoData = action.payload.protoData;
        draft.expandView = true;
      });


    case 'NEW_EMPTY_SPREADSHEET': {
      return produce(state, (draft) => {
        draft.data = action.payload.data;
        draft.protoData = action.payload.protoData;;
        draft.formulaValue = action.payload.protoData[0][0];
        draft.expandView = true;
      })
    }

    case 'UPDATE_FORMULA':
      return produce(state, (draft) => {
        draft.formulaValue = action.payload.formulaValue;
        draft.formulaRowIndex = action.payload.formulaRowIndex;
        draft.formulaColumnIndex = action.payload.formulaColumnIndex;
        draft.formulaIsInFocus = false;
      });

    case 'SAVE_CELL_AND_SET_NEXT_CELL_ACTIVE':
      return produce(state, (draft) => {
        draft.data = action.payload.data;
        draft.protoData = action.payload.protoData;
        // action.payload.value
        draft.formulaValue = action.payload.formulaValue;
        draft.formulaRowIndex = action.payload.formulaRowIndex;
        draft.formulaColumnIndex = action.payload.formulaColumnIndex;
      });

    case "SET_STORE_OBJECT":
      return produce(state, (draft) => {
        draft[action.payload.key] = action.payload.value;
      });

    case "PUSH_ITEM_TO_ARRAY":
      return produce(state, (draft) => {
        draft[action.payload.arrayName].push(action.payload.item)
      });



    default:
      return state;
  }
  ;

  //   case 'UPDATE_DATA': {
  //     return produce(state, (draft) => {
  //       let newProtoData = draft.protoData;
  //       newProtoData[action.payload.rowIndex][action.payload.columnIndex] = action.payload.value;
  //       draft.data = createNewDraft(newProtoData);
  //       draft.protoData = newProtoData;  
  //     })
  //   }

  //   case 'NEW_EMPTY_SPREADSHEET': {
  //     let protoArray = createProtoArray({}, 12, 2);
  //     return produce(state, (draft) => {
  //       draft.protoData = protoArray;
  //       draft.data = createNewDraft(protoArray);
  //       draft.formulaValue = protoArray[0][0];
  //       draft.expandView = true;
  //     })
  //   }

  /*  switch (action.type) {
 
         case "PUSH_SOME_ITEMS_TO_ARRAY":
           return {
             ...state,
             [action.payload.arrayName]: [
               ...state[action.payload.arrayName],
               ...action.payload.newArrayItems
             ]
           }
     
     
         case "PUSH_ITEM_TO_ARRAY":
           let pushnewarray = [...state[action.payload.arrayName]].push(action.payload.item);
           return {
             ...state,
             [action.payload.arrayName]: pushnewarray
           }
     
         case "DELETE_ITEM_FROM_ARRAY":
           let deletenewarray = [...state[action.payload.arrayName]].filter(item => item.id !== action.payload.item.id);
           return {
             ...state,
             [action.payload.arrayName]: deletenewarray
           }
     
     
         case "UPDATE_ITEM_IN_ARRAY":
           const index = state[action.payload.arrayName].findIndex(item => item.id === action.payload.id)
           if (index !== -1) {
             let updatenewarray = [...state[action.payload.arrayName]]
             updatenewarray[index] = action.payload.item
             return {
               ...state,
               [action.payload.arrayName]: updatenewarray
             }
     
           } else {
             return { ...state }
           }
     
         default:
           return { ...state }
       } */
};



function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadState() {
  try {
    const serializedState = localStorage.getItem('econolabs');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined
  }
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function extract([beg, end]) {
  const matcher = new RegExp(`${beg}(.*?)${end}`, "gm");
  const normalise = (str) => str.slice(beg.length, end.length * -1);
  return function (str) {
    return str.match(matcher).map(normalise);
  };
}

function transactionsListFull(bookrecords) {
    let markup =
      Array.isArray(bookrecords) && bookrecords.length > 0
        ? `<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Дебет</th>
      <th scope="col">Кредит</th>
      <th scope="col">Сумма</th>
      <th scope="col">Период</th>
    </tr>
  </thead>
  <tbody>
    ` +
        bookrecords
          .map((item, index) => {
            return `
        <tr>
      <th scope="row">${index + 1}</th>
      <td>${item?.bookD}</td>
      <td>${item?.bookK}</td>
      <td>${item?.sum}</td>
       <td>${item?.period}</td>
    </tr>
    <tr>
    <th scope='row'>Ком</th>
    <td colspan='4'>${!!item?.comment ? item.comment : ""}</td>
    </tr>
    `;
          })
          .join("") +
        `
    </tbody>
  </table> 
    `
        : "";
  
    return markup;
  }



let basicfirebasecrudservices = Object.assign({},
  {
    createNewDraft: createNewDraft,
    getFirebaseNode: getFirebaseNode,
    getFirebaseNodeKey: getFirebaseNodeKey,
    updateFirebaseNode: updateFirebaseNode,
    caseReducer: caseReducer,
    timeout: timeout,
    loadState: loadState,
    shuffle: shuffle,
    extract: extract,
    produce: produce,
    saveState: saveState,
    generateUser: generateUser,
    createProtoObject: createProtoObject,
    transactionsListFull: transactionsListFull,
    createApi: createApi,
    Button: Button
  })

export default basicfirebasecrudservices

