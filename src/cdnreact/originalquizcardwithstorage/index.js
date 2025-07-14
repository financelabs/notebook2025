let useState = React.useState;
let useReducer = React.useReducer;
let useEffect = React.useEffect;
let createContext = React.createContext;
let useContext = React.useContext;
//let useCallback = React.useCallback;

let { Card, ButtonGroup, Container, Row, Col, Form, Button, Collapse, Navbar, Modal, InputGroup, FormControl } = ReactBootstrap;

const ApplicationContext = createContext(null);
const ApplicationDispatchContext = createContext(null);
const ProjectContext = createContext(null);
const ProjectDispatchContext = createContext(null);
const SpreadsheetContext = createContext(null);
const SpreadsheetDispatchContext = createContext(null);

let { createNewDraft } = basicfirebasecrudservices;

let defaultQSets = {
    corporate_taxes: [
        {
            id: "tax001",
            header: "Типовая задача",
            title: "Валовый внутренний продукт и НДС",
            theme: "Основные корпоративные налоги",
            text: "Нарубили лес на {=50+{var1-10}*5} ден. ед. Изготовили из леса ДСП и продали за {=750-{var1-10}*50} ден. ед. Изготовили из ДСП мебель и продали за {=800+{var1-10}*20} ден. ед. Чему равен ВВП этой экономики?",
            answer: "800+{var1-10}*20"
        },
        {
            id: "tax002",
            header: "Типовая задача",
            title: "НДС добывающей отрасли",
            theme: "Основные корпоративные налоги",
            text: "Нарубили лес на {=50+{var1-10}*5} ден. ед. Изготовили из леса ДСП и продали за {=750-{var1-10}*50} ден. ед. Изготовили из ДСП мебель и продали за {=800+{var1-10}*20} ден. ед. Чему равен НДС заготовителей леса?",
            answer: "(50+{var1-10}*5)*20/100"
        },
        {
            id: "tax003",
            header: "Типовая задача",
            title: "НДС отрасли промежуточного потребления",
            theme: "Основные корпоративные налоги",
            text: "Нарубили лес на {=50+{var1-10}*5} ден. ед. Изготовили из леса ДСП и продали за {=750-{var1-10}*50} ден. ед. Изготовили из ДСП мебель и продали за {=800+{var1-10}*20} ден. ед. Чему равен НДС производителей ДСП?",
            answer: "(750-{var1-10}*50-(50+{var1-10}*5))*20/100"
        },
        {
            id: "tax004",
            header: "Типовая задача",
            title: "НДС отрасли потребительских товаров",
            theme: "Основные корпоративные налоги",
            text: "Нарубили лес на {=50+{var1-10}*5} ден. ед. Изготовили из леса ДСП и продали за {=750-{var1-10}*50} ден. ед. Изготовили из ДСП мебель и продали за {=800+{var1-10}*20} ден. ед. Чему равен НДС производителей мебели?",
            answer: "(800+{var1-10}*20-(750-{var1-10}*50))*20/100"
        }
    ]
}


function QuizSet() {
    let projectSelector = useContext(ProjectContext);
    let projectDispatch = useContext(ProjectDispatchContext);
    let spreadsheetDispatch = useContext(SpreadsheetDispatchContext);
    // const [selectedQuiz, setSelectedQuiz] = useState(0);
    // const [loading, setLoading] = useState(false);

    let { qSets, title, set, selectedQuizNumber } = projectSelector;


    function doSelectQuiz(index) {

        projectDispatch({
            type: "SET_STORE_OBJECT",
            payload: {
                key: "selectedQuizNumber",
                value: index
            },
        });

         spreadsheetDispatch({
            type: "SET_STORE_OBJECT",
            payload: {
                key: "spreadsheetContent",
                value: {A1: ""}
            },
        });

        

    }


    return <div key={selectedQuizNumber}>
        <Navbar bg="light">
            <Navbar.Brand >{title}</Navbar.Brand>
        </Navbar>
        <br />

        <ButtonGroup size={qSets[set].length < 5 ? "lg" : "sm"}>
            {qSets[set].map((_, index) => (
                <Button
                    variant="outline-secondary"
                    onClick={() => doSelectQuiz(index)}
                    key={index}
                >
                    {qSets[set].length < 10 ? <span className="m-2" >{index + 1}</span> : <small>{index + 1}</small>}
                </Button>
            ))}
        </ButtonGroup>


        {/* {loading ? <div>...</div> : <QuizCardWithStorage />} */}


    </div>
}


function QuizWithRandomNumber() {
    const applicationSelector = useContext(ApplicationContext);
    const spreadsheetSelector = useContext(SpreadsheetContext);
    const projectSelector = useContext(ProjectContext);
    const [value, setValue] = useState("");
    const [showAnswer, setShowAnswer] = useState(null);
    const [answerIsRight, setAnswerIsRight] = useState(null);

    let { qSets, set, selectedQuizNumber, randomNumber } = projectSelector;

     useEffect(()=>{
        setShowAnswer(false);
        setValue("");
     }, [selectedQuizNumber])

    let quiz = qSets[set][selectedQuizNumber];
    console.log(quiz)

    if (!(quiz?.text && quiz.text.includes("{="))) {
        return null
    }

    let { email, user, avatarUrl, userEmail } = applicationSelector;
    // console.log(email, user, avatarUrl, userEmail);
    // console.log(selectedQuizNumber, qSets, set, randomNumber);
    // console.log(quiz);

    let parser = new formulaParser.Parser();
    let quizString = quiz.text;
    // let quizString = `this {={var1-10}+1} some {=2+{var1-10}} that can be {=3+{var1-10}} with a {=4+{var1-10}} function`;
    const searchRegExp = /{var1-10}/g;
    const replaceWith = randomNumber.toString();
    quizString = quizString.replace(searchRegExp, replaceWith);
    console.log(quizString);

    let stringExtractor = basicfirebasecrudservices.extract(["{=", "}"]);
    let stuffIneed = stringExtractor(quizString);
    //console.log(stuffIneed);
    //   // Outputs: [ 'is', 'text', 'extracted', 'reusable' ]
    for (let i = 0; i < stuffIneed.length; i++) {
        let feedback = Math.round(parser.parse(stuffIneed[i]).result * 1000) / 1000;
        // console.log(answer);
        quizString = quizString.replace("{=" + stuffIneed[i] + "}", feedback);
    }


    let answer = quiz.answer.replace(searchRegExp, replaceWith);
    answer = Math.round(parser.parse(answer).result * 1000) / 1000;

    console.log(quizString, answer);

    function handleChange(event) {
        setValue(event.target.value);
    }

    function handleCheckAnswer() {
        setShowAnswer(true);
        if (
            parseFloat(value) / parseFloat(answer) < 1.02 &&
            parseFloat(value) / parseFloat(answer) > 0.98
        ) {
            setAnswerIsRight(true);
            if (email.length > 6) {
                let idPost = basicfirebasecrudservices.getFirebaseNodeKey("usersCraft/" + userEmail + "/post");
                let currentDay = new Intl.DateTimeFormat("en", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })
                    .format(new Date())
                    .replace(/[^a-zA-Z0-9]/g, "_");

                let currentDayObject = {
                    id: idPost,
                    title: quiz.title,
                    theme: quiz.theme,
                    email: email,
                    user: user,
                    avatarUrl: !!avatarUrl ? avatarUrl : null,
                    timestamp: +Date.now(),
                };

                let postObject = {
                    ...currentDayObject,
                    answer: answer,
                    comment: quiz.title + " (" + quiz.theme + ")", //Тема
                    type: "spreadsheet",
                    content: spreadsheetSelector?.spreadsheetContent,
                    quizString: quizString,
                    deleted: false,
                    date: new Intl.DateTimeFormat("ru", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                    }).format(new Date()), //Date().toJSON()
                };




                var updates = {};
                updates["/usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
                updates[
                    "/currentDay/" + currentDay + "/posts/" + idPost
                ] = currentDayObject;

                return basicfirebasecrudservices.updateFirebaseNode(updates);
            }
        }
    }




    return <Card key={selectedQuizNumber} bg={"light"} style={{ width: "95%", margin: "1rem" }}>
        <Card.Header>{quiz.header}</Card.Header>
        <Card.Body>
            <Card.Title>{!!quiz?.setId ? quiz.setId : ""} {quiz.title}</Card.Title>
            <Card.Text
                dangerouslySetInnerHTML={{ __html: quizString }}></Card.Text>
            {/* {!!quiz?.media && <ShowQuizMedia media={qiiz.media} randomNumber={randomNumber} />}
          <SpreadsheetLayout quizString={quizString} theme={props.theme} /> */}
        </Card.Body>

        {showAnswer ? (
            <InputGroup size="sm" style={{ width: "95%", margin: "1rem" }}>
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">
                        <span
                            className={answerIsRight ? "text-success" : "text-danger"}
                        >
                            Правильный ответ: {answer}
                        </span>
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    value={value}
                    type="number"
                    onChange={handleChange}
                    aria-label="Answer"
                    aria-describedby="inputGroup-answer"
                    readOnly
                />
            </InputGroup>
        ) : (
            <InputGroup size="sm" style={{ width: "95%", margin: "1rem" }}>
                <InputGroup.Prepend>
                    <Button variant="outline-secondary" onClick={handleCheckAnswer}>
                        Ответ
                    </Button>
                </InputGroup.Prepend>
                <FormControl
                    value={value}
                    type="number"
                    onChange={handleChange}
                    aria-label="Answer"
                    aria-describedby="inputGroup-answer"
                />
            </InputGroup>
        )}

        {!!quiz?.hint && showAnswer ? (
            <Card.Text><div className="text-secondary ml-3 mb-2"
                dangerouslySetInnerHTML={{ __html: quiz.hint }}
            >

            </div></Card.Text>

        ) : // <ReactMarkdown source={props.hint} escapeHtml={false} /></div>
            null}

    </Card>
}


function MultipleChoicesQuiz() {
    const applicationSelector = useContext(ApplicationContext);
    const projectSelector = useContext(ProjectContext);
    const [value, setValue] = useState("");
    const [showAnswer, setShowAnswer] = useState(null);
    const [answerIsRight, setAnswerIsRight] = useState(null);

    let { qSets, set, selectedQuizNumber, randomNumber } = projectSelector;

    // useEffect(()=>{}, [selectedQuizNumber])

    let quiz = qSets[set][selectedQuizNumber];
    console.log(quiz)

    if (!quiz?.choices) { return null }

    return <div>MultipleChoicesQuiz</div>
}


function OneRandomManyAnswers() {
    return <div>OneRandomManyAnswers</div>
}


let projectInitialState = {

    set: "balance_sheet_financials",
    title: "Задачи",
    selectedQuizNumber: 0,
    set: "basic",
    qSets: {
        basic: [
            {
                header: "Типовая задача",
                title: "Валовый внутренний продукт и НДС",
                theme: "Основные корпоративные налоги",
                text: "Нарубили лес на {=50+{var1-10}*5} ден. ед. Изготовили из леса ДСП и продали за {=750-{var1-10}*50} ден. ед. Изготовили из ДСП мебель и продали за {=800+{var1-10}*20} ден. ед. Чему равен ВВП этой экономики?",
                answer: "800+{var1-10}*20"
            }
        ]
    },
    randomNumber: Math.round((1 + Math.random() * 9) * 100) / 100,
    // id: "financialaccounting1",
    // title: "Общее знакомство c БФУ",
    // theme: "БФУ",
    // answer: "Операции и прогнозная отчетность",
    // comment: "Операции и прогнозная отчетность",
    // type: "accountingwithprofitscash",
    content: [],
    deleted: false,
    triggerRerender: null,
    triggerSave: false,
    saveOptions: {},
    openLedger: false,
    openSpreadsheet: false,

};

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




function App() {
    const [state, applicationDispatch] = useReducer(
        caseReducer,
        initialState
    );

    const [projectState, projectDispatch] = useReducer(
        caseReducer,
        projectInitialState
    );

    const [spreadsheetState, spreadsheetDispatch] = useReducer(
        caseReducer,
        spreadsheetInitialState
    );


    useEffect(() => {
        async function getUser() {
            let localStorageData = basicfirebasecrudservices.loadState('econolabs');

            const paramsString = window.location.search;
            const searchParams = new URLSearchParams(paramsString);
            console.log(searchParams.get("openquizset"));

            let set;

            if (!!searchParams.get("openquizset")) {
                set = searchParams.get("openquizset");
            } else {
                set = document.getElementById("quizcardwithstorage").dataset.openquizset;
            }

            console.log(set);

            let onlineopenqSets = await basicfirebasecrudservices.getFirebaseNode({
                url: "openquiz/" + set,
                type: "array",
            });
            //   if (!!onlineopenquiz?.theme) {
            //     console.log(onlineopenquiz?.theme);
            //     document.querySelector(".card-title").innerText = onlineopenquiz?.theme;
            //     document.querySelector(".quiztitle").innerText = onlineopenquiz?.title;
            // }


            console.log(onlineopenqSets);

            let qSets;

            if (onlineopenqSets.length > 0) {
                qSets = { [set]: onlineopenqSets }
            }
            else {
                let updates = {};
                updates["/openquiz/" + set] = defaultQSets;
                let res = basicfirebasecrudservices.updateFirebaseNode(updates);
                console.log(res);
            }

            console.log(qSets);

            if (!!localStorageData?.application?.email) {
                let userEmail = localStorageData?.application?.email.replace(
                    /[^a-zA-Z0-9]/g,
                    "_"
                );

                let openavatar = await basicfirebasecrudservices.getFirebaseNode({
                    url: "openavatars/" + userEmail,
                    type: "object",
                });


                let userprojectspreadsheet = {
                    A1: "",
                    A2: "",
                    A3: "",
                    A4: "",
                    A5: "",
                    A6: ""
                }


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
                    //   openquiz: openquiz,
                    //   userprojectpostcontent: userprojectpostcontent,
                    userprojectspreadsheet: userprojectspreadsheet,
                    qSets: qSets,
                    set: set
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
                    //   openquiz: openquiz,
                    //  userprojectpostcontent: [],
                    userprojectspreadsheet: userprojectspreadsheet,
                    qSets: qSets,
                    onlineopenquizset
                }
            }
        }

        getUser().then((res) => {

            //    console.log(res);

            let {
                userEmail,
                email,
                user,
                avatarUrl,
                set,
                qSets
            } = res;

            console.log(qSets)

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


            projectDispatch({
                type: "SEED_STATE",
                payload: {
                    objects: {
                        ...projectInitialState,
                        ...res.openquiz,
                        content: res.userprojectpostcontent,
                        quizString: res.userprojectspreadsheet,
                        set,
                        qSets
                        //   triggerRerender: "loaded"
                    },
                },
            });


            spreadsheetDispatch({
                type: "SEED_STATE",
                payload: {
                    objects: {
                        spreadsheetContent: res.userprojectspreadsheet,
                        protoData: createProtoArray(res.userprojectspreadsheet, 6, 6),
                        data: createNewDraft(createProtoArray(res.userprojectspreadsheet, 6, 6)),
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
                    <ProjectContext.Provider value={projectState}>
                        <ProjectDispatchContext.Provider value={projectDispatch}>
                            <Container>
                                <QuizSet />
                                <QuizWithRandomNumber />
                                <MultipleChoicesQuiz />
                                <CompactSpreadsheetLayout />
                            </Container>

                        </ProjectDispatchContext.Provider>
                    </ProjectContext.Provider>

                </SpreadsheetDispatchContext.Provider>
            </SpreadsheetContext.Provider>

        </ApplicationDispatchContext.Provider>
    </ApplicationContext.Provider>
}

ReactDOM.createRoot(document.querySelector("#quizcardwithstorage")).render(<App />);

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

function CompactActiveCells() {
    let spreadsheetSelector = useContext(SpreadsheetContext);
    let letter = alphabet[spreadsheetSelector.countLetter];
    let arrayOfRows = Array.from({ length: spreadsheetSelector.protoData.length }, (_, i) => i + 1);
    //  console.log(arrayOfRows);
    return <div>
        {arrayOfRows.map((item, index) => {
            return <CompactActiveCell cellAddress={letter + item} rowIndex={index} />
        })}
    </div>
}


function CompactActiveCell({ rowIndex = 0 }) {
    let projectDispatch = useContext(ProjectDispatchContext);
    let spreadsheetDispatch = useContext(SpreadsheetDispatchContext);
    let spreadsheetSelector = useContext(SpreadsheetContext);
    const protoDataValue = spreadsheetSelector.protoData
    [rowIndex]
    [spreadsheetSelector.countLetter];
    const [value, setValue] = React.useState(protoDataValue)
    const debouncedValue = useDebounce(value, 2000);



    useEffect(() => {

        let valueChecked = isNaN(debouncedValue)
            ? !!debouncedValue
                ? debouncedValue.trim()
                : ""
            : +debouncedValue;

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
                    spreadsheetContent: newSpreadsheetContent,
                    protoData: newProtoData,
                    data: newData
                }
            }
        })

        projectDispatch({
            type: "SEED_STATE",
            payload: {
                objects: {
                    quizString: newSpreadsheetContent,
                    triggerSave: Math.random(),
                    saveOptions: { type: "spreadsheet" }
                }
            }
        })


    }, [debouncedValue])

    const calculatedDataValue = spreadsheetSelector.data
    [rowIndex]
    [spreadsheetSelector.countLetter];



    console.log(calculatedDataValue);
    let cellAddress = (alphabet[spreadsheetSelector.countLetter] + (rowIndex + 1))


    // function setValue(value) {
    //     console.log(value);
    // }

    let dataValue = isNumeric(calculatedDataValue) ?
        calculatedDataValue : " ";

    return <InputGroup className="my-1">
        <InputGroup.Prepend>
            <InputGroup.Text id={cellAddress}>
                <small style={{ minWidth: "3rem" }}>{cellAddress + " " + dataValue}</small>
            </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
            value={value}
            //      placeholder={value}
            aria-label={cellAddress}
            aria-describedby={cellAddress}
            onChange={(e) => setValue(e.target.value)}
        />
    </InputGroup>
}



function CompactSpreadsheetLayout() {
    let spreadsheetDispatch = useContext(SpreadsheetDispatchContext);
    let spreadsheetSelector = useContext(SpreadsheetContext);
    let numberOfRows = spreadsheetSelector.protoData.length;


    function addRowUnder() {

        let newProtoData = createProtoArray(spreadsheetSelector.spreadsheetContent, numberOfRows + 1, 6)
        let newData = createNewDraft(newProtoData);

        spreadsheetDispatch({
            type: "SEED_STATE",
            payload: {
                objects: {
                    //   spreadsheetContent: spreadsheetSelector.spreadsheetContent,
                    protoData: newProtoData,
                    data: newData
                }
            }
        })

        //  console.log(createProtoArray(spreadsheetSelector.spreadsheetContent, numberOfRows + 1, 6 ));
        // spreadsheetDispatch({
        //     type: "SEED_STATE",
        //     payload: {
        //         objects: {
        //             protoData: createProtoArray(spreadsheetSelector.spreadsheetContent, numberOfRows + 1, 6 ),
        //             triggerRerender: Math.random()
        //         },
        //     },
        // });
    }



    return <div>
        <CompactActiveCells />
        <Button
            onClick={addRowUnder}
            variant="outline-secondary">{"+ " + (numberOfRows + 1) + " ячейку"}</Button>

    </div>
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



const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => clearTimeout(timeout)
    }, [value, delay])
    return debouncedValue
}

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

function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}
