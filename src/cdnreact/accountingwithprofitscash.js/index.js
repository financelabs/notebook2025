

//import React, { useState, useCallback } from "react";
let useState = React.useState;
let useReducer = React.useReducer;
let useEffect = React.useEffect;
let createContext = React.createContext;
let useContext = React.useContext;
//let useCallback = React.useCallback;

//import { produce } from "immer";
//let produce = immer.produce;

let { Container, Row, Col, Form, Button, Collapse, Navbar, Modal, InputGroup, FormControl, SplitButton, Dropdown } = ReactBootstrap;

const ApplicationContext = createContext(null);
const ApplicationDispatchContext = createContext(null);
const ProjectContext = createContext(null);
const ProjectDispatchContext = createContext(null);
const SpreadsheetContext = createContext(null);
const SpreadsheetDispatchContext = createContext(null);

function NavReportFunctions() {
    return <Navbar className="bg-light justify-content-between mb-3">
        <Button
            variant="outline-secondary"
            size="sm"
        //  disabled={updatedRecords.length === 0}
        //    onClick={() => onSave()}
        >
            Баланс
        </Button>

        <Button
            variant="outline-secondary"
            size="sm"
        //     disabled={records.length === 0}
        //    onClick={() => handleShowNewProject()}
        >
            Фин Рез
        </Button>

        <Button
            variant="outline-secondary"
            size="sm"
        //     disabled={records.length === 0}
        //    onClick={() => handleShowNewProject()}
        >
            Кэш фло
        </Button>

        <Button
            variant="outline-secondary"
            size="sm"
        //     disabled={records.length === 0}
        //    onClick={() => handleShowNewProject()}
        >
            Фильтр
        </Button>

    </Navbar>
}

function ShowFilteredList() {
    const projectSelector = useContext(ProjectContext);


    const [filter, dispatch] = useReducer(
        caseReducer,
        { d: null, k: null }
    );

    let content = Array.isArray(projectSelector.content) ? projectSelector.content : []

    let uniqueD = [...new Set(content.map((item) => item.d))];
    let uniqueK = [...new Set(content.map((item) => item.k))];


    function handleChange(e) {
        let { name: key, value } = e.target;
        dispatch({
            type: "SET_STORE_OBJECT",
            payload: { key, value },
        });
    }

    let filteredDrecords = !!filter.d
        ? content.filter((item) => item.d === filter.d)
        : content.map((item) => item);
    let filteredKrecords = !!filter.k
        ? content.filter((item) => item.k === filter.k)
        : filteredDrecords.map((item) => item);

    return <Container>

        <Row>
            <Col>
                <Form.Group controlId="formStateAnalyticsArray">
                    <Form.Label>Активы +, Пассивы -</Form.Label>
                    <Form.Control as="select" name="d" onChange={handleChange} size="sm" required>
                        {["...", ...uniqueD]
                            .map(item => {
                                return <option key={item} id={item}>
                                    {item}
                                </option>
                            })}
                    </Form.Control>
                </Form.Group>
            </Col>

            <Col><Form.Group controlId="formStateAnalyticsItem">
                <Form.Label>Активы -, Пассивы +</Form.Label>
                <Form.Control as="select" name="k" onChange={handleChange} size="sm" required>
                    {["...", ...uniqueK]
                        .map(item => { return <option key={item} id={item}>{item}</option> })}
                </Form.Control>
            </Form.Group>
            </Col>
        </Row>

        {filteredKrecords.map((row, index) => (
            <Row key={index}>
                <Col xs={2}>
                    <small>{row.period}</small>
                </Col>
                <Col xs={3}>
                    <small>{row.d}</small>
                </Col>
                <Col xs={3}>
                    <small>{row.k}</small>
                </Col>
                <Col xs={4}>
                    <small>{row.sum}</small>
                    {!!row?.type ? <small>{" " + row.type}</small> : <small> </small>}
                </Col>
            </Row>
        ))}

    </Container>


}

function ShowCashFlow() {
    const projectSelector = useContext(ProjectContext);

    let content = Array.isArray(projectSelector.content) ? projectSelector.content : []
    let periods = [...new Set(content.map(item => item.period))];

    function checkTypePeriod(indicator, periodIndex) {
        let sum = 0;
        //    console.log(indicator, periodIndex);
        content.forEach((item) => {
            //   console.log(item.period, periods[periodIndex]);
            if (
                !!item?.type &&
                item.type.includes(indicator) &&
                item.period === periods[periodIndex - 1]
            ) {

                sum = sum + parseFloat(item.sum);
                //   console.log(sum);
            }
            return null;
        });
        return sum;
    }

    return <Container>
        <Row className="bg-secondary text-white">
            {["Кэш-фло", ...periods].map((item, index) => (
                <Col key={index} xs={index > 0 ? 2 : 4}>
                    {item}
                </Col>
            ))}
        </Row>

        {["Поступления по текущей деятельности", "Платежи по текущей деятельности", "Поступления по инвестиционной деятельности", "Платежи по инвестиционной деятельности", "Поступления по финансовой деятельности", "Платежи по финансовой деятельности"]
            .map((row, indexRow) => <Row key={indexRow}>
                {[row, ...periods].map((item, index) =>
                    <Col key={index} xs={index > 0 ? 2 : 4}>
                        {index === 0 ? row : checkTypePeriod(row, index)}
                    </Col>
                )}
            </Row>
            )}
    </Container>

}



function ShowFinancialResults() {
    const projectSelector = useContext(ProjectContext);

    let content = Array.isArray(projectSelector.content) ? projectSelector.content : []
    let periods = [...new Set(content.map(item => item.period))];

    function checkTypePeriod(indicator, periodIndex) {
        let sum = 0;
        //    console.log(indicator, periodIndex);
        content.forEach((item) => {
            //   console.log(item.period, periods[periodIndex]);
            if (
                !!item?.type &&
                item.type.includes(indicator) &&
                item.period === periods[periodIndex - 1]
            ) {

                sum = sum + parseFloat(item.sum);
                //   console.log(sum);
            }
            return null;
        });
        return sum;
    }

    return <Container>
        <Row className="bg-secondary text-white">
            {["Финансовые результаты", ...periods].map((item, index) => (
                <Col key={index} xs={index > 0 ? 2 : 4}>
                    {item}
                </Col>
            ))}
        </Row>

        {["Выручка", "Себестоимость продукции, работ, услуг", "Коммерческие расходы", "Управленческие расходы",
            "Проценты к уплате", "Прочие расходы", "Налог на прибыль", "Дивиденды к начислению"]
            .map((row, indexRow) => <Row key={indexRow}>
                {[row, ...periods].map((item, index) =>
                    <Col key={index} xs={index > 0 ? 2 : 4}>
                        {index === 0 ? row : checkTypePeriod(row, index)}
                    </Col>
                )}
            </Row>
            )}

    </Container>
}


let balanceContoArray = [
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
]


function ShowBalance() {
    const projectSelector = useContext(ProjectContext);

    let content = Array.isArray(projectSelector.content) ? projectSelector.content : []

    let periods = [...new Set(content.map(item => item.period))];



    function processRecords(indicator, periodIndex) {
        //   console.log(periodIndex);
        let DValues = 0;
        let KValues = 0;
        content.forEach((item) => {
            //    console.log(item.period);
            let currentOperationPeriodIndex = periods.findIndex(
                (per) => per === item.period
            );
            //    console.log(currentOperationPeriodIndex);
            if (item.d === indicator && periodIndex > currentOperationPeriodIndex) {
                DValues = DValues + parseFloat(item.sum);
            }
            if (item.k === indicator && periodIndex > currentOperationPeriodIndex) {
                KValues = KValues + parseFloat(item.sum);
            }
            return null;
        });

        let indctr = balanceContoArray.find(item => item.id === indicator)
        if (
            indctr.disposition === "asset"
            // indicator === "Основные средства" ||
            // indicator === "Материалы" ||
            // indicator === "Незавершенное производство" ||
            // indicator === "Готовая продукция" ||
            // indicator === "Дебиторская задолженность" ||
            // indicator === "Деньги"
        ) {
            return DValues - KValues;
        } else {
            return KValues - DValues;
        }
    }

    return <Container>
        <Row className="bg-secondary text-white">
            {["Активы", ...periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {item}
                </Col>
            ))}
        </Row>
        <Row>
            {["Основные средства", ...periods].map((item, index) => (
                <Col className="font-weight-bold" key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Основные средства"
                        : processRecords("Основные средства", index)}
                </Col>
            ))}
        </Row>
        <Row>
            {["Материалы", ...periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0 ? "Материалы" : processRecords("Материалы", index)}
                </Col>
            ))}
        </Row>
        <Row>
            {["Незавершенное производство", ...periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Незавершенное производство"
                        : processRecords("Незавершенное производство", index)}
                </Col>
            ))}
        </Row>
        <Row>
            {["Готовая продукция", ...periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Готовая продукция"
                        : processRecords("Готовая продукция", index)}
                </Col>
            ))}
        </Row>
        <Row>
            {["Дебиторская задолженность", ...periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Дебиторская задолженность"
                        : processRecords("Дебиторская задолженность", index)}
                </Col>
            ))}
        </Row>
        <Row>
            {["Деньги", ...periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0 ? "Деньги" : processRecords("Деньги", index)}
                </Col>
            ))}
        </Row>
        <Row className="bg-secondary text-white">
            {["Пассивы", ...periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {item}
                </Col>
            ))}
        </Row>
        <Row>
            {["Уставный капитал", ...periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Уставный капитал"
                        : processRecords("Уставный капитал", index)}
                </Col>
            ))}
        </Row>
        <Row>
            {["Нераспределенная прибыль", ...periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Нераспределенная прибыль"
                        : processRecords("Нераспределенная прибыль", index)}
                </Col>
            ))}
        </Row>
        <Row className="bg-light text-dark">
            {["Долгосрочный банковский кредит", ...periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Долгосрочный банковский кредит"
                        : processRecords("Долгосрочный банковский кредит", index)}
                </Col>
            ))}
        </Row>
        <Row className="bg-light text-dark">
            {["Краткосрочный банковский кредит", ...periods].map(
                (item, index) => (
                    <Col key={item} xs={index > 0 ? 2 : 4}>
                        {index === 0
                            ? "Краткосрочный банковский кредит"
                            : processRecords("Краткосрочный банковский кредит", index)}
                    </Col>
                )
            )}
        </Row>
        <Row className="bg-light text-dark">
            {["Кредиторская задолженность", ...periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Кредиторская задолженность"
                        : processRecords("Кредиторская задолженность", index)}
                </Col>
            ))}
        </Row>
    </Container>

}

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
    accountingWithProfitsCashProjects: []
};



let spreadsheetInitialState = {
    expandView: true,

    spreadsheetContent: {},

    protoData: [], // createProtoArray({}, 6, 6),
    data: [], // createNewDraft(createProtoArray({}, 6, 6)),
    formulaValue: "", //createProtoArray(emptyProtoDataObject)[0][0],
    formulaRowIndex: 0,
    formulaColumnIndex: 0,
    spreadsheetTitle: '',
    countLetter: 0,
    title: "Задача",
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

            if (!!localStorageData?.application?.email) {
                let userEmail = localStorageData?.application?.email.replace(
                    /[^a-zA-Z0-9]/g,
                    "_"
                );

                let openavatar = await basicfirebasecrudservices.getFirebaseNode({
                    url: "openavatars/" + userEmail,
                    type: "object",
                });

                let posts = await basicfirebasecrudservices.getFirebaseNode({
                    url: "/usersCraft/" + userEmail + "/posts/",
                    type: "array",
                });

                let accountingWithProfitsCashProjects = posts.filter(item => item.type === "accountingwithprofitscash");

                return {
                    email: localStorageData?.application?.email,
                    user: localStorageData?.application?.user,
                    avatarUrl: !!openavatar?.avatarUrl
                        ? openavatar.avatarUrl
                        : !!localStorageData?.application?.avatarUrl
                            ? localStorageData.application.avatarUrl
                            : "../freelancer.jpg",
                    userEmail: userEmail,
                    accountingWithProfitsCashProjects: accountingWithProfitsCashProjects
                }
            } else {
                return null
            }
        }


        getUser().then((res) => {
            let {
                userEmail,
                email,
                user,
                avatarUrl,
                accountingWithProfitsCashProjects
            } = res;

            projectDispatch({
                type: "SEED_STATE",
                payload: {
                    objects: {
                        accountingWithProfitsCashProjects: accountingWithProfitsCashProjects
                        //   triggerRerender: "loaded"
                    },
                },
            });



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
            })
        })
    }, [])

    if (state.loading) return null

    return <ApplicationContext.Provider value={state}>
        <ApplicationDispatchContext.Provider value={applicationDispatch}>


            <SpreadsheetContext.Provider value={spreadsheetState}>
                <SpreadsheetDispatchContext.Provider value={spreadsheetDispatch}>
                    <ProjectContext.Provider value={projectState}>
                        <ProjectDispatchContext.Provider value={projectDispatch}>

                            <AccountingNavBar />

                            <NavReportFunctions />

                            <ShowFilteredList />

                            <ShowBalance />
                            <ShowFinancialResults />
                            <ShowCashFlow />

                        </ProjectDispatchContext.Provider>
                    </ProjectContext.Provider>

                </SpreadsheetDispatchContext.Provider>
            </SpreadsheetContext.Provider>

        </ApplicationDispatchContext.Provider>
    </ApplicationContext.Provider>


}


ReactDOM.createRoot(document.querySelector("#accountingwithprofitscash")).render(<App />);


function AccountingNavBar() {
    const projectSelector = useContext(ProjectContext);

    console.log(projectSelector)



    return <Navbar className="bg-light justify-content-between mb-3">
        <Navbar.Brand>{projectSelector?.title}</Navbar.Brand>
        {projectSelector.accountingWithProfitsCashProjects.length < 2 ? null : (
            <DrowpdownWithUserProjects />
        )}
    </Navbar>
}

function DrowpdownWithUserProjects() {
    const projectSelector = useContext(ProjectContext);
    const projectDispatch = useContext(ProjectDispatchContext);

    let accountingWithProfitsCashProjects = Array.isArray(projectSelector.accountingWithProfitsCashProjects) ?
        projectSelector.accountingWithProfitsCashProjects : []

    function doSelectProject(id) {
        let selectedProject = accountingWithProfitsCashProjects.find(item => item.id === id);
        console.log(selectedProject);
        projectDispatch({
            type: "SEED_STATE",
            payload: {
                objects: {
                    ...selectedProject, triggerRerender: Math.random()

                },
            },
        });
    }

    return (
        <SplitButton
            size="sm"
            drop="left"
            variant="outline-secondary"
            title="Выбрать"
        >
            {" "}
            {accountingWithProfitsCashProjects.map((item, index) => (
                <Dropdown.Item
                    key={item.id}
                    eventKey={index}
                    onClick={() => { doSelectProject(item.id) }}
                >
                    {item.title}
                </Dropdown.Item>
            ))}
        </SplitButton>
    );
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
