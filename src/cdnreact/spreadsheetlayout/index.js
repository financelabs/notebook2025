let useState = React.useState;
let useReducer = React.useReducer;
let useEffect = React.useEffect;
let createContext = React.createContext;
let useContext = React.useContext;

let { Container, Row, Col, Form, Button, ButtonGroup, Navbar, Modal, InputGroup, FormControl } = ReactBootstrap;

const ApplicationContext = createContext(null);
const ApplicationDispatchContext = createContext(null);
const SpreadsheetContext = createContext(null);
const SpreadsheetDispatchContext = createContext(null);

let spreadsheetInitialState = {
  expandView: true,

  spreadsheetContent: {},

  protoData: createProtoArray({}, 6, 6),
  data: createNewDraft(createProtoArray({}, 6, 6)),
  formulaValue: "", //createProtoArray(emptyProtoDataObject)[0][0],
  formulaRowIndex: 0,
  formulaColumnIndex: 0,
  spreadsheetTitle: '',
  countLetter: 0,
  title: "Задача",
};

function CompactActiveCell({ cellAddress = "A1", cellCalculatedData = "4" }) {
   let spreadsheetDispatch = useContext(SpreadsheetDispatchContext)
  let spreadsheetSelector = useContext(SpreadsheetContext);

  function setValue(value) {
    console.log(value);

    let valueChecked = isNaN(value)
      ? !!value
        ? value.trim()
        : ""
      : +value;

    let newSpreadsheetContent = basicfirebasecrudservices.produce(
      spreadsheetSelector.spreadsheetContent, (draft) => {
        //    console.log(action.payload);
        draft[cellAddress] = valueChecked;
      });

    let newProtoData = createProtoArray(newSpreadsheetContent, 6, 6)
    let newData = createNewDraft(newProtoData);
    spreadsheetDispatch({
      type: "SEED_STATE",
      payload: {
        objects: {
          spreadsheetContent: createProtoObject(newProtoData),
          protoData: newProtoData,
          data: newData
        }
      }
    })
  }

  return <InputGroup className="mb-3">
    <InputGroup.Prepend>
      <InputGroup.Text id={cellAddress}>
        <small>{cellAddress + " " + spreadsheetSelector.spreadsheetContent?.[cellAddress]} </small>
      </InputGroup.Text>
    </InputGroup.Prepend>
    <FormControl
      placeholder={cellCalculatedData}
      aria-label="Username"
      aria-describedby={cellAddress}
      onChange={(e) => setValue(e.target.value)}
    />
  </InputGroup>


}

function CompactActiveCells() {
   let spreadsheetSelector = useContext(SpreadsheetContext);

  // let rows = spreadsheetSelector.data[0].length;

  let letter = alphabet[spreadsheetSelector.countLetter];

  return <div>
    {[1,2,3,4].map(item => {
      return  <CompactActiveCell cellAddress={letter + item}/>
    })}
  

  </div>

}

function CompactSpreadsheetLayout({ screenSize }) {
  const [countRow, setCountRow] = useState(7);
  let spreadsheetSelector = useContext(SpreadsheetContext);

  let { expandView } = spreadsheetSelector;

  return <div className="excelstyle">
    <GreenHeader />

    {expandView ? <CompactActiveCells
      //    userProfile={userProfile}
      //     currentLetter={alphabet[countLetter]}
      numberOfRows={countRow}
    /> : null}
  </div>
}

function IconBar({ quizString, title, answer, theme, answerIsRight }) {
  let spreadsheetSelector = useContext(SpreadsheetContext);
  let applicationSelector = useContext(ApplicationContext);
  let spreadsheetDispatch = useContext(SpreadsheetDispatchContext)

  let { expandView } = spreadsheetSelector;
  let { email } = applicationSelector;

  function toggleExpandView() {
    console.log("toggleExpandView")
  }

  function new_empty_spreadsheet() {
    console.log("new_empty_spreadsheet")
  }

  function toggleExpandView() {
    console.log("toggleExpandView")
  }

  function add_row_under() {
    console.log("add_row_under")
  }





  //   const dispatch = useDispatch();

  return <div className="icon-bar">
    {!!email ? (
      <PostsButtonGroup
        expandView={expandView}
        toggle_expand_view={toggleExpandView()}
        quizString={quizString}
        title={title}
        answer={answer}
        theme={theme}
        answerIsRight={answerIsRight}
      />
    ) : (
      <ButtonGroup aria-label="Posts Buttons" size="sm">
        <Button
          variant="outline-secondary"
          onClick={() => new_empty_spreadsheet()}
          data-toggle="tooltip"
          data-placement="bottom"
          title="Новый расчет"
        >
          Нов
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => toggleExpandView()}
          data-toggle="tooltip"
          data-placement="bottom"
          title={expandView ? "Свернуть расчет" : "Развернуть расчет"}
        >
          {expandView ? "Сверн" : "Разв"}
        </Button>
      </ButtonGroup>
    )}

    <ButtonGroup aria-label="Rows Buttons" size="sm">
      <Button
        variant="outline-secondary"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Добавить строку ниже"
        onClick={() => add_row_under()}
      >
        +_
      </Button>
      <Button
        variant="outline-secondary"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Добавить строку выше"
        onClick={() => add_row_before()}
      >
        +-
      </Button>
      <Button
        variant="outline-secondary"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Удалить эту строку"
        onClick={() => delete_row()}
      >
        x-
      </Button>
    </ButtonGroup>

    <ButtonGroup aria-label="Columns Buttons" size="sm">
      <Button
        variant="outline-secondary"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Добавить колонку справа"
        onClick={() => add_column_after()}
      >
        +|
      </Button>
      <Button
        variant="outline-secondary"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Добавить колонку слева"
        onClick={() => add_column_before()}
      >
        |+
      </Button>
      <Button
        variant="outline-secondary"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Удалить эту колонку"
        onClick={() => delete_column()}
      >
        x|
      </Button>
    </ButtonGroup>

    {!!email ? (
      <ButtonGroup aria-label="Workbook Buttons" size="sm">

        <Button
          variant="outline-secondary"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Рабочая тетрадь"
        >
          <a href="../myworkbook" target="_blank">
            РТ
          </a>
        </Button>


      </ButtonGroup>
    ) : null}
  </div>
}

function FormulaBlock() {
  let spreadsheetSelector = useContext(SpreadsheetContext);
  let spreadsheetDispatch = useContext(SpreadsheetDispatchContext)

  let { formulaValue, formulaRowIndex, formulaColumnIndex, protoData } = spreadsheetSelector;
  // const formulaValue = useSelector(selectSpreadsheetFormulaValue);
  // const formulaRowIndex = useSelector(selectSpreadsheetFormulaRowIndex);
  // const formulaColumnIndex = useSelector(selectSpreadsheetFormulaColumnIndex);

  const [formula, setFormula] = useState("");

  // const dispatch = useDispatch();

  React.useEffect(() => {
    setFormula(formulaValue);
  }, [formulaValue]);

  function onKeyPressOnInput(e) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  function handleSubmit() {
    let valueChecked = isNaN(formula)
      ? !!formula
        ? formula.trim()
        : ""
      : +formula;



    let newProtoData = basicfirebasecrudservices.produce(
      spreadsheetSelector.protoData, (draft) => {
        //    console.log(action.payload);
        draft[formulaRowIndex][formulaColumnIndex] = valueChecked;
      })

    let newData = createNewDraft(newProtoData);

    //   JSON.parse(JSON.stringify(state.protoData));
    // newProtoData[action.payload.rowIndex][action.payload.columnIndex] = action.payload.value;
    // state.data = createNewDraft(newProtoData);
    // state.protoData = newProtoData;

    spreadsheetDispatch({
      type: "SEED_STATE",
      payload: {
        objects: {
          protoData: newProtoData,
          data: newData,
          spreadsheetContent: createProtoObject(newProtoData),
        },
      },
    });

    // dispatch(
    //   update_data({
    //     rowIndex: formulaRowIndex,
    //     columnIndex: formulaColumnIndex,
    //     value: valueChecked,
    //   })
    // );
    //   setFormula("");
  }

  return (
    <div className="cell-content">
      <div>fx</div>
      <Button
        onClick={() => handleSubmit()}
        variant="outline-secondary"
        size="sm"
      >
        <span>&#10003;</span>
      </Button>
      {/* <button onClick={() => handleSubmit()}> <span >&#10003;</span></button> */}

      <div>
        <input
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            marginLeft: "3px",
            fontSize: "1.2rem",
          }}
          value={formula === "" ? formulaValue : formula}
          onChange={(e) => setFormula(e.target.value)}
          onKeyPress={(e) => onKeyPressOnInput(e)}
        />
      </div>
    </div>
  );
}


function GreenHeader() {
  const applicationSelector = useContext(ApplicationContext);
  let spreadsheetSelector = useContext(SpreadsheetContext);
  let applicationDispatch = useContext(ApplicationDispatchContext);

  let { avatarUrl } = applicationSelector;
  let { title } = spreadsheetSelector;

  function selectAvatar() {
    console.log("ava");
    applicationDispatch({
      type: "SEED_STATE",
      payload: {
        objects: {
          showModal: true,
          modal: {
            title: "Пользователь",
            component: "LoginLogout"
          }
        },
      },
    });
  }



  return <div className="excelstyle mt-1">
    <div
      className="title"
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: ".4rem",
      }}
    >
      {avatarUrl && avatarUrl.length > 10 ? (
        <img
          src={avatarUrl}
          alt=""
          style={{
            verticalAlign: "middle",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            filter: "grayscale(100%)",
            objectFit: "cover",
          }}
        />
      ) : null}

      {!!title ? (
        <span style={{ marginLeft: "1rem" }}>{title}</span>
      ) : (
        <span>Calc</span>
      )}



      <Button variant="outline-secondary" size="sm"
        onClick={() => selectAvatar()}
      >
        <small>{applicationSelector.user}</small>
      </Button>


      {/* <LoginLogout />  */}
    </div>
  </div>
}







function SpreadsheetLayout() {
  return <div className="container excel">
    <CompactSpreadsheetLayout />
    {/* <GreenHeader />
     <FormulaBlock />
    <ActiveCells /> */}
  </div>
}

function SaveSpreadsheet() {
  const spreadsheetSelector = useContext(SpreadsheetContext);
  const applicationSelector = useContext(ApplicationContext);
  let applicationDispatch = useContext(ApplicationDispatchContext);


  useEffect(() => {
    async function saveContent() {
      // if (content.length > 0) {
      //     let postObject = {
      //         deleted: false,
      //         content: content,
      //         comment: basicfirebasecrudservices.transactionsListFull(content),
      //         email: applicationSelector.email,
      //         user: applicationSelector.user,
      //         avatarUrl: applicationSelector.avatarUrl,
      //         date: new Intl.DateTimeFormat("ru", {
      //             weekday: "short",
      //             year: "numeric",
      //             month: "short",
      //             day: "numeric",
      //             hour: "numeric",
      //             minute: "numeric",
      //         }).format(new Date()), //Date().toJSON()
      //     };

      //     let htmlPost = {
      //         answer: "",
      //         comment: "Проводки",
      //         quizString: "",
      //         deleted: false,
      //         email: applicationSelector.email,
      //         user: applicationSelector.user,
      //         avatarUrl: applicationSelector.avatarUrl,
      //         date: new Intl.DateTimeFormat("ru", {
      //             weekday: "short",
      //             year: "numeric",
      //             month: "short",
      //             day: "numeric",
      //             hour: "numeric",
      //             minute: "numeric",
      //         }).format(new Date()), //Date().toJSON()
      //     };

      //     let currentDay = new Intl.DateTimeFormat("en", {
      //         weekday: "short",
      //         year: "numeric",
      //         month: "short",
      //         day: "numeric",
      //     })
      //         .format(new Date())
      //         .replace(/[^a-zA-Z0-9]/g, "_");


      //     let updates = {};
      //     updates["/usersCraft/" + applicationSelector.userEmail + "/posts/" + spreadsheetContext.id] = postObject;
      //     updates[
      //         "/usersTemplates/projects/" + applicationSelector.userEmail + "/" + spreadsheetContext.id
      //     ] = postObject;

      //     updates["currentDay/" + currentDay + "/posts/" + spreadsheetContext.id + applicationSelector.userEmail + "media"] =
      //     {
      //         ...htmlPost,
      //         id: spreadsheetContext.id + applicationSelector.userEmail + "media",
      //         theme: spreadsheetContext.theme,
      //         title: spreadsheetContext.title + " " + applicationSelector.user,
      //         content: basicfirebasecrudservices.transactionsListFull(content),
      //         type: "html",
      //     };
      //     updates["/usersCraft/" + applicationSelector.userEmail + "/posts/" + spreadsheetContext.id + applicationSelector.userEmail + "media"] = {
      //         ...htmlPost,
      //         id: spreadsheetContext.id + applicationSelector.userEmail + "media",
      //         theme: spreadsheetContext.theme,
      //         title: spreadsheetContext.title + " " + applicationSelector.user,
      //         content: basicfirebasecrudservices.transactionsListFull(content),
      //         type: "html",
      //     };

      //     console.log(updates);

      //     return await basicfirebasecrudservices.updateFirebaseNode(updates);
      // }
      // return null
    }

    saveContent().then((res) => {
      console.log("Saved");
      console.log(spreadsheetSelector);
      //  console.log(applicationSelector);
    })



  }, [spreadsheetSelector?.triggerRerender])

  //  console.log(selectApplication)

  function selectAvatar() {
    console.log("ava");
    applicationDispatch({
      type: "SEED_STATE",
      payload: {
        objects: {
          showModal: true,
          modal: {
            title: "Пользователь",
            component: "LoginLogout"
          }
        },
      },
    });
  }

  return null
}

function GlobalModal() {
  const applicationSelector = useContext(ApplicationContext);
  let applicationDispatch = useContext(ApplicationDispatchContext);

  function handleClose() {
    console.log("Close");
    applicationDispatch({
      type: "SEED_STATE",
      payload: {
        objects: {
          showModal: false,
          modal: {}
        },
      },
    });
  }

  return <Modal show={applicationSelector?.showModal} onHide={handleClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>{applicationSelector?.modal?.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>

      {applicationSelector?.modal?.component === "LoginLogout" && <LoginLogout />}

      {applicationSelector?.modal?.component === "EditRecordType" && <EditRecordType />}

      {applicationSelector?.modal?.component === "EditRecordComment" && <EditRecordComment />}

    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" size="sm" onClick={handleClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
}


function caseReducer(state = {}, action) {
  // console.log(action);
  //https://immerjs.github.io/immer/update-patterns
  switch (action.type) {

    case "SET_STORE_OBJECT":
      return basicfirebasecrudservices.produce(state, (draft) => {
        console.log(action.payload);
        draft[action.payload.key] = action.payload.value;
      });

    case "SEED_STATE": {
      return basicfirebasecrudservices.produce(state, (draft) => {
        Object.keys(action.payload.objects).map((key) => {
          draft[key] = action.payload.objects[key];
        });
      });
    }

    case "DELETE_FROM_ARRAY_BY_INDEX": {
      return basicfirebasecrudservices.produce(state, (draft) => {
        draft[action.payload.arrayName].splice(action.payload.itemIndex, 1);
        draft.triggerRerender = action.payload.itemIndex;
      });
    }

    case "DELETE_FROM_ARRAY_BY_ID": {
      return basicfirebasecrudservices.produce(state, (draft) => {
        const index = draft[action.payload.arrayName].findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          draft.triggerRerender = action.payload.index;
          draft[action.payload.arrayName].splice(index, 1);
        }
      });
    }

    case "UPDATE_ITEM_IN_ARRAY":
      return basicfirebasecrudservices.produce(state, (draft) => {
        console.log(action.payload);
        const index = draft[action.payload.arrayName].findIndex(item => item.id === action.payload.item.id);
        if (index !== -1) draft[action.payload.arrayName][index] = action.payload.item
      });



    case "UPDATE_ITEM_PROPERTY_IN_ARRAY":
      return basicfirebasecrudservices.produce(state, (draft) => {
        console.log(action.payload);
        const index = draft[action.payload.arrayName].findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          draft.triggerRerender = action.payload.id;
          draft
          [action.payload.arrayName]
          [index]
          [action.payload.objKey] = action.payload.objValue
        }
      });

    default:
      return state;
  }
}

let initialState = {
  loading: true,
  email: null,
  user: null,
  avatarUrl: "",
  userEmail: "",
  posts: [],
  showModal: false,
  modal: {}
}

function App() {
  const [state, applicationDispatch] = useReducer(
    caseReducer,
    initialState
  );

  const [spreadsheetState, spreadsheetDispatch] = useReducer(
    caseReducer,
    spreadsheetInitialState
  );




  useEffect(() => {
    async function getUser() {
      let localStorageData = basicfirebasecrudservices.loadState('econolabs');

      console.log(document.getElementById("spreadsheet").dataset.openquizid);

      let onlineopenquiz = await basicfirebasecrudservices.getFirebaseNode({
        url: "openquiz/" + document.getElementById("spreadsheet").dataset.openquizid,
        type: "object",
      });


      // let updates = {};
      // updates["/openquiz/financialaccounting4"] = {
      //     id: "financialaccounting3",
      //     title: "Учет денежных средств и финансовых вложений",
      //     theme: "БФУ",
      //     answer: "Операции и отчетность",
      //     comment: "Операции и отчетность",
      //     type: "accountingwithprofitscash",
      // };
      // let res = basicfirebasecrudservices.updateFirebaseNode(updates);
      // console.log(res);

      let openquiz = !!onlineopenquiz && Object.keys(onlineopenquiz).length > 0 ?
        onlineopenquiz :
        {
          id: document.getElementById("spreadsheet").dataset.openquizid,
          title: "Задание от " + new Intl.DateTimeFormat("ru", {
            year: "numeric",
            month: "short",
            day: "numeric"
          }).format(new Date()),
          theme: "Бухгалтерский учет и прогнозирование",
          answer: "Операции и отчетность",
          comment: "Операции и отчетность",
          type: "accountingwithprofitscash",
        };


      if (!!localStorageData?.application?.email) {
        let userEmail = localStorageData?.application?.email.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        );

        let openavatar = await basicfirebasecrudservices.getFirebaseNode({
          url: "openavatars/" + userEmail,
          type: "object",
        });

        let openquizid = document.getElementById("spreadsheet").dataset.openquizid;

        let userspreadsheetpostcontent = await basicfirebasecrudservices.getFirebaseNode({
          url: "/usersCraft/" + userEmail + "/posts/" + openquizid + "/content",
          type: "array",
        });

        userspreadsheetpostcontent = userspreadsheetpostcontent.map(item => {
          if (!item?.id) {
            return {
              ...item,
              id: basicfirebasecrudservices.getFirebaseNodeKey("/usersCraft/" + userEmail + "/posts/" + openquizid + "/content")
            }
          }
          return item
        })

        // let posts = await basicfirebasecrudservices.getFirebaseNode({
        //     url: "/usersCraft/" + userEmail + "/posts/",
        //     type: "array",
        // });
        // console.log(posts.filter(item => item.type === "accountingwithprofitscash"))


        return {
          email: localStorageData?.application?.email,
          user: localStorageData?.application?.user,
          avatarUrl: !!openavatar?.avatarUrl
            ? openavatar.avatarUrl
            : !!localStorageData?.application?.avatarUrl
              ? localStorageData.application.avatarUrl
              : "../freelancer.jpg",
          userEmail: userEmail,
          openquiz: openquiz,
          userspreadsheetpostcontent: userspreadsheetpostcontent
        }
      } else {
        let identity = basicfirebasecrudservices.generateUser();
        basicfirebasecrudservices.saveState({
          application: {
            email: identity.email,
            user: identity.user,
            avatarUrl: "../freelancer.jpg",
            userEmail: identity.userEmail
          }
        });
        return {
          email: identity.email,
          user: identity.user,
          avatarUrl: "../freelancer.jpg",
          userEmail: identity.userEmail,
          openquiz: openquiz,
          userspreadsheetpostcontent: []
        }
      }
    }

    getUser().then((res) => {
      let {
        userEmail,
        email,
        user,
        avatarUrl,
      } = res;

      applicationDispatch({
        type: "SEED_STATE",
        payload: {
          objects: {
            loading: false,
            email: email,
            user: user,
            avatarUrl: avatarUrl,
            userEmail: userEmail
          },
        },
      });


      spreadsheetDispatch({
        type: "SEED_STATE",
        payload: {
          objects: {
            ...spreadsheetInitialState,
            ...res.openquiz,
            content: res.userspreadsheetpostcontent,
            triggerRerender: "loaded"
          },
        },
      });

    })
  }, []);


  if (state.loading) { return null }




  return <ApplicationContext.Provider value={state}>
    <ApplicationDispatchContext.Provider value={applicationDispatch}>
      <SpreadsheetContext.Provider value={spreadsheetState}>
        <SpreadsheetDispatchContext.Provider value={spreadsheetDispatch}>
          <GlobalModal />
          <SaveSpreadsheet />
          <SpreadsheetLayout
            avatarUrl={state.avatarUrl}
            user={state.user}
            setTitle="Тесты по балансовым уравнениям"

          />
        </SpreadsheetDispatchContext.Provider>
      </SpreadsheetContext.Provider>
    </ApplicationDispatchContext.Provider>
  </ApplicationContext.Provider>
}

ReactDOM.createRoot(document.querySelector("#spreadsheet")).render(<App />);


function createProtoArray(protoDataObject = {}, maxRow = 15, maxColumn = 6) {
  Object.keys(protoDataObject).map((objKey) => {
    const [col, ...row] = objKey;
    let currentColIndex = alphabet.findIndex(item => item === col);
    if (currentColIndex > maxColumn) { maxColumn = currentColIndex };
    if (parseInt(row) > maxRow) { maxRow = parseInt(row) }
  });
  //  console.log(maxColumn, maxRow);

  var array = new Array(maxRow);
  for (var i = 0; i < array.length; i++) {
    array[i] = Array(maxColumn + 1).fill('');
  }

  Object.keys(protoDataObject).map((objKey) => {
    const [col, ...row] = objKey;
    let colArrayIndex = alphabet.findIndex((item) => item === col);
    let rowArrayIndex = parseInt(row) - 1;
    array[rowArrayIndex][colArrayIndex] = protoDataObject[objKey];
  });
  return array;
}

function createProtoObject(protoArray) {
  let protoObject = {};
  for (var i = 0; i < protoArray.length; i++) {
    var row = protoArray[i];
    for (var j = 0; j < row.length; j++) {
      if (protoArray[i][j] !== "") {
        protoObject[alphabet[j] + (i + 1)] = protoArray[i][j];
      }
    }
  }
  return protoObject;
}

function insert(arr, index, newItem) {
  return [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index),
  ];
}



function Cell({ active, rowIndex, columnIndex }) {
  const spreadsheetDispatch = useContext(SpreadsheetDispatchContext);
  const spreadsheetSelector = useContext(SpreadsheetContext);

  const data = spreadsheetSelector.data[rowIndex][columnIndex];
  const proDataValue = spreadsheetSelector.protoData[rowIndex][columnIndex];

  const [value, setValue] = useState(data);

  useEffect(() => {
    setValue(data);
  }, [data]);

  function onKeyPressOnInput(e) {
    if (e.key === "Enter") {
      let valueChecked = isNaN(value) ? (!!value ? value : "") : +value;

      const newProtoData = basicfirebasecrudservices.produce(spreadsheetSelector.protoData, draft => {
        draft[rowIndex][columnIndex] = valueChecked;
      })

      spreadsheetDispatch({
        type: "SEED_STATE",
        payload: {
          objects: {
            data: createNewDraft(newProtoData),
            spreadsheetContent: createProtoObject(newProtoData),
            protoData: newProtoData,
            formulaValue: valueChecked,
            formulaRowIndex: rowIndex,
            formulaColumnIndex: columnIndex
          }
        }
      })


    }
  }

  function clicked() {
    spreadsheetDispatch({
      type: "SEED_STATE",
      payload: {
        objects: {
          formulaValue: proDataValue,
          formulaRowIndex: rowIndex,
          formulaColumnIndex: columnIndex
        }
      }
    })


  }

  return (
    <input
      type="text"
      className={active ? "cells__input__active" : "cells__input"}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClick={() => clicked()}
      onKeyPress={(e) => onKeyPressOnInput(e)}
    />
  );
}

function ActiveCells() {
  const spreadsheetSelector = useContext(SpreadsheetContext);
  let { data, formulaRowIndex, formulaColumnIndex, expandView } = spreadsheetSelector;

  let numberOfX = data[0].length - 1;
  let numberOfY = data.length;

  if (!expandView) return null;

  return <div
    className="cells"
    style={{
      gridTemplateColumns: `40px repeat(${numberOfX + 1
        }, calc((100% - 50px) / ${numberOfX + 1}))`,
      gridTemplateRows: `repeat(${numberOfY}, 25px)`,
    }}
  >
    <div className="cells__spacer"></div>
    <AlphabetRow x={numberOfX} />
    <NumbersColumns y={numberOfY} />
    {data.map((row, rowIndex) => {
      return row.map((_, columnIndex) => {
        return (
          <Cell
            key={"" + rowIndex + "_" + columnIndex}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            active={
              formulaRowIndex === rowIndex &&
                formulaColumnIndex === columnIndex
                ? true
                : false
            }
          />
        );
      });
    })}
  </div>
}

function NumbersColumns({ y }) {

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

function AlphabetRow({ x }) {
  const alphabetRow = [];
  for (let i = 0; i < x + 1; i += 1) {
    alphabetRow.push(
      <div key={alphabet[i]} className="cells__alphabet">
        {alphabet[i]}
      </div>
    );
  }
  return <React.Fragment>{alphabetRow}</React.Fragment>;
}


const alphabet = [
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

function createNewDraft(data) {
  //   console.log(data);
  //    return calcData(data);
  return calcDataWithImmer(data)
}



function calcDataWithImmer(data) {
  //let newdata = JSON.parse(JSON.stringify(data));
  //let formulas = [];

  const newdata = basicfirebasecrudservices.produce(data, draft => {
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

function LoginLogout() {
  const applicationSelector = useContext(ApplicationContext);
  //  const [show, setShow] = useState(false);

  let user = applicationSelector?.user;
  let email = applicationSelector?.email;

  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log(e.currentTarget.elements.formEmail.value);
    // console.log(e.currentTarget.elements.formUser.value);

    basicfirebasecrudservices.saveState({
      application: {
        email: e.currentTarget.elements.formEmail.value,
        user: e.currentTarget.elements.formUser.value,
        avatarUrl: "../freelancer.jpg",
        userEmail: e.currentTarget.elements.formEmail.value.replace(
          /[^a-zA-Z0-9]/g, "_")
      }
    });

    setTimeout(() => window.location.reload(), 3000)
    //    handleClose();
  };



  return <Form onSubmit={handleSubmit}>
    <Form.Group className="mb-3" controlId="formEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control type="email"
        placeholder={email}
      />
      <Form.Text className="text-muted">
        We'll never share your email with anyone else.
      </Form.Text>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formUser">
      <Form.Label>User</Form.Label>
      <Form.Control type="text"
        placeholder={user}
      />
    </Form.Group>

    <Button variant="primary" type="submit">
      Submit
    </Button>
  </Form>
}


function calculateFormula(data, formula) {
  let parser = new formulaParser.Parser();
  // let parser = new FormulaParser.Parser();

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




