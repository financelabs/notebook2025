import { getApps, deleteApp, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, get, ref, update, push, child } from 'firebase/database';
import { createStore, applyMiddleware, combineReducers } from 'redux';
//import { Parser as FormulaParser} from "hot-formula-parser";

// function createNewDraft(data, oneMoreLoop = true) {
//     if (oneMoreLoop) {
//         let oneMoreIteration = false;
//         let newdata = data.map(row => {
//             return row.map(ix => {
//                 let cellValue = data[row][ix];
//                 if (
//                     (typeof cellValue === "string" || cellValue instanceof String) &&
//                     cellValue.toString().includes("=")
//                 ) {
//                     let mapObj = {
//                         СТЕПЕНЬ: "POWER",
//                         ЧПС: "NPV",
//                         ВСД: "IRR",
//                         МВСД: "MIRR",
//                         СУММ: "SUM",
//                         СРЗНАЧ: "AVERAGE",
//                         ОКРУГЛ: "ROUND",
//                         СТАНДОТКЛОН: "STDEV"
//                     };
//                     let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
//                     cellValue = cellValue.replace(re, function (matched) {
//                         return mapObj[matched];
//                     });
//                     let result = calculateFormula(draft, cellValue.slice(1));
//                     //       formulas.push({ formula: cellValue, result: result })
//                     if (result.later) {
//                         oneMoreIteration = true;
//                         return cellValue;
//                     } else { return result.res.result }
//                 } return cellValue
//             })
//         });

//         if (oneMoreIteration) { return createNewDraft(newdata, true) }
//         else { return newdata }
//     } else {
//         return data
//     }
// }

// function calculateFormula(data, formula) {
//     let parser = new FormulaParser();
//     let dependencies = [];
//     parser.on("callCellValue", (cellCoord, done) => {
//         const x = cellCoord.column.index + 1;
//         const y = cellCoord.row.index + 1;
//         dependencies.push({ x: x, y: y });
//         // if (data[y - 1][x - 1].toString().slice(0, 1) === "=") {
//         //   return done(parseFloat(calculateFormula(data[y - 1][x - 1].toString().slice(1))));
//         // }
//         if (!data[y - 1] || !data[y - 1][x - 1]) {
//             return done("");
//         }
//         //  console.log(y - 1, x - 1);
//         done(data[y - 1][x - 1]);
//     });
//     parser.on("callRangeValue", (startCellCoord, endCellCoord, done) => {
//         var fragment = [];
//         for (
//             var row = startCellCoord.row.index;
//             row <= endCellCoord.row.index;
//             row++
//         ) {
//             var rowData = data[row];
//             var colFragment = [];
//             for (
//                 var col = startCellCoord.column.index;
//                 col <= endCellCoord.column.index;
//                 col++
//             ) {
//                 var value = rowData[col];
//                 dependencies.push({ x: col, y: row });
//                 colFragment.push(value);
//             }
//             fragment.push(colFragment);
//         }
//         // console.log(fragment);
//         if (fragment) {
//             done(fragment);
//         }
//     });
//     let resultObj = parser.parse(formula);
//     // console.log('formula: ' + formula);
//     let later = false;
//     let dependendentOn = [];
//     dependencies.forEach(item => {
//         let cellValue = null;
//         try {
//             cellValue = data[item.y - 1][item.x - 1];
//             //   console.log(cellValue);
//             dependendentOn.push(cellValue);
//         } catch {
//             //      console.log(formula);
//         }
//         if (
//             (typeof cellValue === "string" || cellValue instanceof String) &&
//             cellValue.toString().includes("=")
//         ) {
//             later = true;
//         }
//     });
//     // console.log('dependendentOn: ' + dependendentOn);
//     // console.log('---------');
//     return {
//         res: resultObj,
//         dependencies: dependencies,
//         later: later,
//         dependendentOn: dependendentOn
//     };
// }





console.log("authirebasecrudservices");
//https://tighten.com/insights/react-101-part-4-firebase/

//Firebase

let app;
let auth;

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
auth = getAuth(app);


function useAuthStateHook() {
    const [user, setUser] = !!React && React.useState(null);
    const [loading, setLoading] = !!React && React.useState(true);
    //const [error, setError] = !!React && React.useState(null);

    !!React && React.useEffect(() => {
        const listener = onAuthStateChanged(auth, function (user) {
            if (user) {
                setUser(user);
                setLoading(false);
                return true
            } else {
                setUser(false);
                setLoading(false);
                return false
            }
        });
        return () => {
            listener();
        };
    }, [auth]);

    return [user, loading]; //, error
};


async function getFirebaseNode({
    url = "crafts/temp_gmail_com/posts/-Ml6DEjYhdnjuW6HiHB7",
    type = "array"
}) {
    try {
        let snapshot = await get(ref(db, url));
        if (snapshot.exists()) {
            let res = snapshot.val();
            if (type === "array") {
                return Object.keys(res).map(objKey => {
                    return {
                        ...res[objKey],
                        id: !!res[objKey]?.id ? res[objKey].id : objKey
                    }
                })
            }
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


async function doSignInWithEmailAndPassword(email, password) {
    e.preventDefault();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(userCredential);
        return userCredential.user;
    }
    catch (error) {
        console.error(error)
        return null
    }
}


function useFirebaseNode(url = "crafts/temp_gmail_com/posts/-Ml6DEjYhdnjuW6HiHB7", options) {
    const [status, setStatus] = !!React && React.useState({
        loading: false,
        data: undefined,
        error: undefined
    });

    function fetchNow(url, options) {
        setStatus({ loading: true });
        getFirebaseNode({ url, type: !!options?.type && options.type === object ? "object" : "array" })
            .then(res => {
                setStatus({ loading: false, data: res });
            })
            .catch((error) => {
                setStatus({ loading: false, error });
            });
    }
    !!React && React.useEffect(() => {
        if (url) {
            fetchNow(url, options);
        }
    }, []);

    return { ...status, fetchNow };
}

// export const fincalculationsApi = createApi({
//     reducerPath: 'api',
//     tagTypes: ["OpenQuiz", "Quiz", "Answer", "Avatar", "Post"],
//     baseQuery: fakeBaseQuery(),
//     endpoints: (builder) => ({

//         fetchOpenQuizesCasesIds: builder.query({
//             async queryFn() {
//                 try {
//                     let list = await getFirebaseNode({ url: "quizescases/quizesCasesIds", type: "array" });
//                     return { data: list };
//                 } catch (err) {
//                     console.log(err);
//                     return { error: err };
//                 }
//             },
//             providesTags: (result = [], error2, arg) => [
//                 "QuizCase",
//                 ...result.map(({ id }) => ({ type: "QuizCase", id }))
//             ]
//         }),

//         fetchOpenQuizCaseById: builder.query({
//             async queryFn(id) {
//                 try {
//                     let list = await getFirebaseNode({ url: "quizescases/quizesCasesIds/" + id, type: "object" });
//                     return { data: list };
//                 } catch (err) {
//                     console.log(err);
//                     return { error: err };
//                 }
//             },
//             providesTags: (result, error, id) => [{ type: "QuizCase", id }]
//         }),

//         fetchUserPosts: builder.query({
//             async queryFn(userEmail) {
//                 //    console.log(userEmail)
//                 try {
//                     let userPosts = await getFirebaseNode({ url: "usersCraft/" + userEmail + "/posts", type: "array" });
//                     //   console.log(userPosts);
//                     return { data: Array.isArray(userPosts) ? userPosts : [] }
//                 }
//                 catch (err) { console.log(err); return { error: err } }
//             },
//             providesTags: (result, error, id) => [{ type: "Post", id }]
//         }),



//         fetchQuizesArray: builder.query({
//             async queryFn() {
//                 let d = new Date();
//                 let currentDay = new Intl.DateTimeFormat("en", {
//                     weekday: "short",
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                 })
//                     .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
//                     .replace(/[^a-zA-Z0-9]/g, "_");
//                 //       console.log(currentDay);
//                 try {
//                     let currentQuizArray = await getFirebaseNode({
//                         url: "/currentquiz/" + currentDay + "/",
//                         type: "array"
//                     });

//                     console.log(currentQuizArray);

//                     let newCurrentQuizAddedIndexes = [];
//                     let resArray = !!window?.quizesSets ?
//                         window.quizesSets.map(item => {
//                             let index = currentQuizArray.findIndex(currentquiz => item.id === currentquiz.id);
//                             if (index > -1) {
//                                 currentQuizArray[index];
//                                 newCurrentQuizAddedIndexes.push(index);
//                                 return currentQuizArray[index]
//                             } else { return item }
//                         })
//                         : [];
//                     console.log(newCurrentQuizAddedIndexes);
//                     currentQuizArray = currentQuizArray.filter((_, index) => !newCurrentQuizAddedIndexes.includes(index));
//                     resArray = [...resArray, ...currentQuizArray];
//                     console.log(resArray);
//                     let quizeswithtype = resArray.map(quiz => {
//                         let updatedquiz = { ...quiz };
//                         if (Array.isArray(quiz?.quizes)) {
//                             updatedquiz = { ...quiz, type: "onerandommanyanswers" }
//                         }
//                         if (Array.isArray(quiz?.choices) && Array.isArray(quiz?.answers) && quiz?.type !== "accounting") {
//                             updatedquiz = { ...quiz, type: "multiplechoices" }
//                         }

//                         if (!!quiz?.answer && quiz.answer.includes("{var1-10}")) {
//                             console.log("Quiz With Random Number");
//                             updatedquiz = { ...quiz, type: "quizwithrandomnumber" }
//                         }
//                         return updatedquiz
//                     })
//                     return { data: quizeswithtype }
//                 }
//                 catch (err) { console.log(err); return { error: err } }
//             },
//             providesTags: (result, error, id) => [{ type: "Quiz", id }]
//         }),

//         // fetchUserAvatar: builder.query({
//         //     async queryFn(userEmail) {
//         //         try {
//         //             let openAvatarsResponse = await getFirebaseNode({
//         //                 url: "/openavatars/" + userEmail,
//         //                 type: "object"
//         //             });

//         //             return { data: openAvatarsResponse }
//         //         }
//         //         catch (err) { console.log(err); return { data: null, error: err } }
//         //     },
//         //     providesTags: (result, error, id) => [{ type: "Avatar", id }]
//         // }),
//         updatesForOpenQuizes: builder.mutation({
//             async queryFn({ base = "", updates = { temp: "temp" }
//             }) {
//                 let fireUpdates = {};
//                 Object.keys(updates).forEach(objKey => {
//                     fireUpdates[base + "/" + objKey] = updates[objKey]
//                 });
//                 //     console.log(fireUpdates);
//                 try { await updateFirebaseNode(fireUpdates) }
//                 catch (err) { console.log(err); return { error: err } }
//                 return { data: fireUpdates }
//             },
//             invalidatesTags: ["Answer"]
//         }),

//         // fetchOpenQuizes: builder.query({
//         //     async queryFn() {
//         //         try {
//         //             let openQuizes = await getFirebaseNode({ url: "openquizes/", type: "array" });
//         //             //    console.log(openQuizes);
//         //             return { data: openQuizes }
//         //         }
//         //         catch (err) { console.log(err); return { error: err } }
//         //     },
//         //     providesTags: (result, error, id) => [{ type: "OpenQuiz", id }]
//         // }),

//         // fetchOpenQuiz: builder.query({
//         //     async queryFn(id) {
//         //         try {
//         //             let quiz = await getFirebaseNode({ url: "openquizes/" + id, type: "object" });
//         //             console.log(quiz);
//         //             return { data: quiz }
//         //         }
//         //         catch (err) { console.log(err); return { error: err } }
//         //     },
//         //     providesTags: (result, error, id) => [{ type: "OpenQuiz", id }]
//         // }),
//     }),
// })



// Redux:

const initialState = {
    isLoading: true,
    isUpdating: false,
    choices: [
        { id: 0, text: 'Philosopher’s Path', isRight: true },
        { id: 1, text: 'Visit the temple', isRight: false },
        { id: 2, text: 'Drink matcha', isRight: false }
    ],
    openquizes: []
};


function commonReducer(state, action) {
    switch (action.type) {

        case "SET_STORE_OBJECT": {
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }
        }

        case "SEED_ARRAY": {
            return {
                ...state,
                [action.payload.arrayName]: action.payload.arrayItems
            }
        }

        case "PUSH_ITEM_TO_ARRAY": {
            return {
                ...state,
                [action.payload.arrayName]: [...state[action.payload.arrayName], action.payload.item]
            }
        }

        case "DELETE_ITEM_FROM_ARRAY": {
            //    console.log(action.payload);
            //    console.log(state[action.payload.arrayName].filter(item => item.id !== action.payload.id))
            return {
                ...state,
                [action.payload.arrayName]: state[action.payload.arrayName].filter(item => item.id !== action.payload.id)
            }
        }

        case "PUSH_SOME_ITEMS_TO_ARRAY": {
            return {
                ...state,
                [action.payload.arrayName]: [
                    ...draft[action.payload.arrayName],
                    ...action.payload.newArrayItems
                ]
            }
        }

        case "UPDATE_ITEM_IN_ARRAY": {
            // console.log(action.payload);
            const index = state[action.payload.arrayName].findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                const newarray = [...state[action.payload.arrayName]];
                newarray[index] = action.payload.item;
                return {
                    ...state,
                    [action.payload.arrayName]: newarray

                }
            };
        }



        default: {
            return state
            //  throw Error('Unknown action: ' + action.type);
        }
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;

function reduxMiddleware(store) {
    return function (next) {
        return function (action) {
            if (action.type === 'LOAD_FROM_FIREBASE') {
                store.dispatch({ type: "SET_STORE_OBJECT", payload: { key: "isLoading", value: true } })
                getFirebaseNode({
                    url: action.payload.url, type: action.payload.datatype
                })
                    .then(data => {
                        if (action.payload.datatype === "array") {
                            store.dispatch({ type: "SEED_ARRAY", payload: { arrayName: action.payload.destination, arrayItems: data } });
                        } else {
                            store.dispatch({ type: "SET_STORE_OBJECT", payload: { key: action.payload.destination, value: data } });
                        }
                        store.dispatch({ type: "SET_STORE_OBJECT", payload: { key: "isLoading", value: false } })
                    }
                    )
            }

            if (action.type === 'UPDATE_IN_FIREBASE') {
                store.dispatch({ type: "SET_STORE_OBJECT", payload: { key: "isUpdating", value: true } })
                updateFirebaseNode(action.payload.updates)
                    .then(data => {
                        store.dispatch({ type: "SEED_ARRAY", payload: { arrayName: "openquizes", arrayItems: data } });
                        store.dispatch({ type: "SET_STORE_OBJECT", payload: { key: "isUpdating", value: false } })
                    }
                    )
            }


            if (typeof action === "function") {
                return action(store.dispatch, store.getState);
            }
            else {
                return next(action);
            }
        }
    }
}

const store = createStore(
    commonReducer,
    initialState,
    composeEnhancers(applyMiddleware(reduxMiddleware))
);

export {
    getFirebaseNode,
    updateFirebaseNode,
    getFirebaseNodeKey,
    commonReducer,
    store,
    doSignInWithEmailAndPassword,

    useAuthStateHook,
    useFirebaseNode,

   // createNewDraft
}







