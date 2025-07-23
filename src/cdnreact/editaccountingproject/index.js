//import React, { useState, useCallback } from "react";
let useState = React.useState;
let useReducer = React.useReducer;
let useEffect = React.useEffect;
let createContext = React.createContext;
let useContext = React.useContext;
//let useCallback = React.useCallback;

//import { produce } from "immer";
//let produce = immer.produce;

let { Container, Row, Col, Form, Button, Collapse, Navbar, Modal, InputGroup, FormControl } = ReactBootstrap;

const ApplicationContext = createContext(null);
const ApplicationDispatchContext = createContext(null);
const ProjectContext = createContext(null);
const ProjectDispatchContext = createContext(null);
const SpreadsheetContext = createContext(null);
const SpreadsheetDispatchContext = createContext(null);

let projectInitialState = {
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
    users: []
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
            console.log(searchParams.get("openquizid"));

            let openquizid;

            if (!!searchParams.get("openquizid")) {
                openquizid = searchParams.get("openquizid")
            } else {
                openquizid = document.getElementById("editaccountingproject").dataset.openquizid
            }

            console.log(openquizid);





            let quiztask = {
                id: openquizid,
                title: "Налоги и налоговый учет в организации 5",
                theme: "Налоги и налоговый учет в организации",
                periods: ["4 кв. 2024", "1 кв. 2025", "2 кв. 2025", "3 кв. 2025", "4 кв. 2025"],
                tasks: [
                    {
                        id: 0,
                        text: `Компания организована в <b>4 кв. 2024 г</b>. Сформирован и оплачен уставный капитал 400 0000 руб.<br>
                        Получен кредит 200 000 руб.`
                    },

                    {
                        id: 1,
                        text: `<b>1 кв. 2025 </b> Приобретены и оплачены товары 1000 ед. на сумму 360 000 руб., в том числе НДС 20%.<br>
                        Начислен и уплачен процент по кредиту 8 000 руб. Погашена основная сумма долга на 100 000 руб.`
                    },


                    {
                        id: 2,
                        text: `<b>2 кв. 2025</b> Приобретены и оплачены товары 400 ед. на сумму 180 000 руб., в том числе НДС 20%.<br>
                        Продано 800 ед. Выручка от продаж 384 000 руб, в том числе НДС 20%. <br>
                        Себестоимость проданных товаров определяется по средней стоимости. <br>
                        Начислен и уплачен процент по кредиту 4 000 руб. Погашена основная сумма долга на 100 000 руб.`
                    },

                    {
                        id: 3,
                        text: `<b>3 кв. 2025</b> Продано 400 ед. Выручка от продаж 192 000 руб, в том числе НДС 20%<br>`
                    },

                    {
                        id: 4,
                        text: `Преполагаем, что в квартале только один месяц. Закрыты счета 90, 91 и 99<br> `
                    },


                    {
                        id: 5,
                        text: `Произведены расчеты по НДС и Налогу на прибыль<br> `
                    },


                ],

                spreadsheetContent: {
                    A1: `1. Реализация (передача на территории Российской Федерации для собственных
нужд) товаров (работ, услуг), в том числе товаров продавцов государств - членов Евразийского экономического союза,
реализуемых посредством электронной торговой площадки, передача имущественных прав по соответствующим ставкам налога, а
также суммы, связанные с расчетами
по оплате налогооблагаемых товаров
(работ, услуг), всего`,
                    A2: "Налоговая база в рублях",
                    A3: "",
                    A4: "Сумма налога в рублях",
                    A5: "",
                    A6: `Сумма налога, предъявленная налогоплательщику при приобретении товаров (работ, услуг), имущественных прав на территории Российской Федерации, подлежащая вычету в соответствии с пунктами 2, 2.2, 2.3, 2.4, 2.5, 4, 7, 11, 13 статьи 171 Налогового кодекса Российской Федерации, а также сумма налога, подлежащая вычету в соответствии с пунктом 5 статьи 171 Налогового кодекса Российской Федерации`,
                    A7: "Сумма налога в рублях",
                    A8: "",
                    A9: `Сумма налога, подлежащая уплате в бюджет в соответствии с пунктом 1 статьи 173 Налогового кодекса Российской Федерации 
(величина разницы суммы строк 200 раздела 3, 130 раздела 4, 
160 раздела 6 и суммы строк 210 раздела 3, 120 раздела 4, 080 раздела 5, 090 раздела 5, 170 раздела 6>=0)`
                },
                answer: "Операции и отчетность",
                comment: "Операции и отчетность",
                type: "accountingwithprofitscash",
                balanceContoArray: [
                    { id: "Основные средства", children: ["01", "08", "07", "04", "02"], disposition: "asset" },
                    { id: "Материалы", children: ["10", "14", "15", "16", "19"], disposition: "asset" },
                    { id: "Незавершенное производство", children: ["20", "23", "25", "26", "44", "21"], disposition: "asset" },
                    { id: "Готовая продукция", children: ["41", "43"], disposition: "asset" },
                    { id: "Дебиторская задолженность", children: ["62.1", "60.2", "75.1", "76", "68"], disposition: "asset" },
                    { id: "Деньги", children: ["50", "51", "52", "55"], disposition: "asset" },
                    { id: "Уставный капитал", children: ["80", "82", "83", "81"] },
                    { id: "Нераспределенная прибыль", children: ["84", "90.1", "90.2", "90.3", "90.4", "90.5", "90.9", "91.1", "91.2", "91.9", "99"] },
                    { id: "Долгосрочный банковский кредит", children: ["67"] },
                    { id: "Краткосрочный банковский кредит", children: ["66"] },
                    { id: "Кредиторская задолженность", children: ["70", "62.2", "60.1", "68", "75.2", "76", "69"] },
                ],

                // importcontent: "accountingreports3"
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

                let mediaItemsObject = await basicfirebasecrudservices.getFirebaseNode({
                    url: "/usersCraft/" + userEmail + "/posts/" + openquizid + "/mediaItems",
                    type: "object",
                });

                let userprojectpostcontentobject = await basicfirebasecrudservices.getFirebaseNode({
                    url: "/usersCraft/" + userEmail + "/posts/" + openquizid + "/content",
                    type: "object",
                });

                if ((!userprojectpostcontentobject || Object.keys(userprojectpostcontentobject).length === 0) && !!openquiz?.importcontent) {
                    userprojectpostcontentobject = await basicfirebasecrudservices.getFirebaseNode({
                        url: "/usersCraft/" + userEmail + "/posts/" + openquiz.importcontent + "/content",
                        type: "object",
                    });
                }

                let userprojectpostcontent = !!userprojectpostcontentobject ?
                    Object.keys(userprojectpostcontentobject).map(objKey => userprojectpostcontentobject[objKey]) : [];

                let periods = [...new Set(userprojectpostcontent.map(item => item.period))];
                let content = [];
                periods.forEach(period => {
                    userprojectpostcontent.filter(item => item.period === period).forEach((item, index) => {
                        if (!!item?.orderby) { content.push(item) }
                        else { content.push({ ...item, orderBy: index }) }
                    })
                });



                return {
                    email: localStorageData?.application?.email,
                    user: localStorageData?.application?.user,
                    avatarUrl: !!openavatar?.avatarUrl
                        ? openavatar.avatarUrl
                        : !!localStorageData?.application?.avatarUrl
                            ? localStorageData.application.avatarUrl
                            : "../freelancer.jpg",
                    userEmail: userEmail,
                    quiztask: quiztask,
                    content: content,
                    mediaItemsObject: mediaItemsObject
                    //  openquizid: openquizid
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
                    quiztask: quiztask,
                    content: [],
                    mediaItemsObject: {}
                    //     openquizid: openquizid
                }
            }
        }

        getUser().then((res) => {
            let {
                userEmail,
                email,
                user,
                avatarUrl,
                quiztask,
                content,
                mediaItemsObject
                //  openquizid
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


            projectDispatch({
                type: "SEED_STATE",
                payload: {
                    objects: {
                        // ...projectInitialState,
                        // ...res.openquiz,
                        quiztask: quiztask,
                        content: content,
                        mediaItemsObject: mediaItemsObject
                        //   openquizid: openquizid
                        //   quizString: res.userprojectspreadsheet
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

                            <SaveProject />
                            {/* <Ledger /> <SpreadsheetLayout />*/}
                            <ProjectOptionsNavigation />
                        </ProjectDispatchContext.Provider>
                    </ProjectContext.Provider>

                </SpreadsheetDispatchContext.Provider>
            </SpreadsheetContext.Provider>

        </ApplicationDispatchContext.Provider>
    </ApplicationContext.Provider>
}

ReactDOM.createRoot(document.querySelector("#editaccountingproject")).render(<App />);


function ProjectOptionsNavigation() {
    const applicationSelector = useContext(ApplicationContext);
    const projectSelector = useContext(ProjectContext);


    const [editorMode, modeDispatch] = useReducer(
        caseReducer,
        {
            openOpenQuiz: true,
            openUserContent: false,
            openUserGroup: false
        }
    );


    useEffect(() => {
        console.log(applicationSelector);
        console.log(projectSelector)
    }, [])



    function setOpenFunction(modeKey) {
        modeDispatch({
            type: "SEED_STATE",
            payload: {
                objects: {
                    [modeKey]: !editorMode[modeKey],
                },
            },
        });
    }



    return <Container>
        <Row className="my-3">
            <Col>
                <Button
                    onClick={() => setOpenFunction("openOpenQuiz")}
                    // aria-controls="example-collapse-text"
                    // aria-expanded={openLedger}
                    variant={editorMode.openOpenQuiz ? "secondary" : "outline-secondary"}
                    className="mb-3"
                    size="sm"
                >
                    Update Open Quiz
                </Button>
            </Col>

            <Col>
                <Button
                    onClick={() => setOpenFunction("openUserGroup")}
                    // aria-controls="example-collapse-text"
                    // aria-expanded={openLedger}
                    variant={editorMode.openUserGroup ? "secondary" : "outline-secondary"}
                    className="mb-3"
                    size="sm"
                >
                    User Group
                </Button>
            </Col>

            <Col>
                <Button
                    onClick={() => setOpenFunction("openUserContent")}
                    // aria-controls="example-collapse-text"
                    // aria-expanded={openLedger}
                    variant={editorMode.openUserContent ? "secondary" : "outline-secondary"}
                    className="mb-3"
                    size="sm"
                >
                    Current User Content
                </Button>
            </Col>

        </Row>



        <Row>
            {editorMode.openOpenQuiz && <ShowOpenQuiz />}
            {editorMode.openUserGroup && <ShowOpenUserGroup />}
            {editorMode.openUserContent && <ShowOpenUserContent />}
        </Row>


    </Container>
}

function ShowOpenQuiz() {
    const projectSelector = useContext(ProjectContext);
    const projectDispatch = useContext(ProjectDispatchContext);

    let { quiztask } = projectSelector;

    function doSaveOpenQuiz() {
        projectDispatch({
            type: "SEED_STATE",
            payload: {
                objects: {
                    triggerRerender: Math.random(),
                    triggerSave: Math.random(),
                    saveOptions: { type: "project" }
                },
            },
        });
    }

    return <Container>
        <Row>
            <Col className="p-3">
                <Button variant="primary" size="sm" block
                    onClick={() => doSaveOpenQuiz()}
                >
                    Save
                </Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <div><pre>{JSON.stringify(quiztask, null, 2)}</pre></div>
            </Col>
        </Row>

    </Container>
}

function ShowOpenUserGroup() {
    const projectSelector = useContext(ProjectContext);
    const projectDispatch = useContext(ProjectDispatchContext);
    let { users } = projectSelector;


    function doSaveContentToUserGroup() {
        projectDispatch({
            type: "SEED_STATE",
            payload: {
                objects: {
                    triggerRerender: Math.random(),
                    triggerSave: Math.random(),
                    saveOptions: { type: "savenodetousergroup", node: "content" }
                },
            },
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const currentTarget = e.currentTarget;
        const formdata = new FormData(currentTarget);
        let { useremail } = Object.fromEntries(formdata);
        let userEmail = useremail.replace(/[^a-zA-Z0-9]/g, "_")
        let openavatar = await basicfirebasecrudservices.getFirebaseNode({
            url: "openavatars/" + userEmail,
            type: "object",
        });
        projectDispatch({
            type: "PUSH_ITEM_TO_ARRAY",
            payload: {
                arrayName: "users",
                item: {
                    id: userEmail,
                    userEmail: userEmail,
                    avatarUrl: !!openavatar?.avatarUrl
                        ? openavatar.avatarUrl
                        : "../freelancer.jpg",
                }
            },
        });
    }


    return <Container>


        <Form onSubmit={handleSubmit}>
            <Row>
                <Col xs={12} sm={6} lg="9">
                    <Form.Group controlId="formUserEmail">
                        <Form.Control size="sm" type="text" name="useremail" placeholder="User Email (Email)" required />
                    </Form.Group>
                </Col>
                <Col xs={12} sm={6} lg="3">
                    <Button size="sm" variant="outline-secondary" type="submit" >Добавить в группу</Button>
                </Col>
            </Row>
        </Form>


        <Row>
            <Col>
                <div><pre>{JSON.stringify(users, null, 2)}</pre></div>
            </Col>
            <Col className="p-3">
                <Button variant="primary" size="sm" block
                    onClick={() => doSaveContentToUserGroup()}
                >
                    Save
                </Button>
            </Col>
        </Row>


    </Container>
}

function ShowOpenUserContent() {
    const projectSelector = useContext(ProjectContext);
    let { content } = projectSelector;
    return <Container>
        <div><pre>{JSON.stringify(content, null, 2)}</pre></div>
    </Container>
}


function SaveProject() {
    const projectSelector = useContext(ProjectContext);
    const applicationSelector = useContext(ApplicationContext);

    let { quiztask, triggerSave, saveOptions, users } = projectSelector;



    useEffect(() => {

        console.log(saveOptions, quiztask);

        async function saveOpenQuiz() {
            let updates = {};
            if (saveOptions?.type === "project" && !!quiztask) {
                console.log("Save Open Quiz");
                updates["openquiz/" + quiztask.id] = projectSelector.quiztask;
                return await basicfirebasecrudservices.updateFirebaseNode(updates);
            }

            if (saveOptions?.type === "savenodetousergroup" && !!saveOptions?.node) {

                let nodeObject = {}
                if (Array.isArray(projectSelector[saveOptions.node])) {
                    projectSelector[saveOptions.node].map((item, index)=> {
                        if (!!item?.id) { nodeObject[item.id] = item } 
                        else { nodeObject[index] = {...item, id: index} }                        
                    })
                }

                users.forEach(user => {
                    updates["/usersCraft/" + user.userEmail + "/posts/" + quiztask.id + "/" + saveOptions.node] =
                      nodeObject
                })
                console.log(updates);
                return await basicfirebasecrudservices.updateFirebaseNode(updates);
            }
            return updates
        }

        saveOpenQuiz().then((res) => {
            console.log(res);
        })



    }, [triggerSave])

    //  console.log(selectApplication)


    return <Navbar bg="light">
        <Container>
            <Navbar.Brand href="#home">
                <img
                    alt="avatarUrl"
                    src={applicationSelector.avatarUrl}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    style={{
                        borderRadius: "50%",
                        filter: "grayscale(100%)",
                        objectFit: "cover",
                    }}

                />
                <small className="mx-3">{projectSelector?.quiztask?.title}</small>

            </Navbar.Brand>

        </Container>



    </Navbar>
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

        case "PUSH_ITEM_TO_ARRAY":
            return basicfirebasecrudservices.produce(state, (draft) => {
                draft[action.payload.arrayName].push(action.payload.item);
            });

        default:
            return state;
    }
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

function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

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


