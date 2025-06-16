let useState = React.useState;
let useReducer = React.useReducer;
let useEffect = React.useEffect;
let createContext = React.createContext;
let useContext = React.useContext;

 let { Container, Row, Col, Form, Button, Collapse, Navbar, Modal } = ReactBootstrap;

 const ApplicationContext = createContext(null);
 const ApplicationDispatchContext = createContext(null);
 const SpreadsheetContext = createContext(null);
 const SpreadsheetDispatchContext = createContext(null);

let spreadsheetInitialState = {
    content: [],
    deleted: false,
    triggerRerender: null,
    openLedger: false
};




function SpreadsheetLayout() {
  return <div>Spreadsheet Layout</div>
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
            //  console.log(spreadsheetContext);
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

    return <Navbar bg="light">
        Save Spreadsheet
    </Navbar>
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


