import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get, update, onValue, push, child } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';

/**
  * Const and Selectors
*/

let d = new Date();
let currentDay = new Intl.DateTimeFormat("en", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
})
    .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
    .replace(/[^a-zA-Z0-9]/g, "_");

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


let fireconf = {};
let app;
let db;
let auth;



/**
  * Firebase
*/



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
db = getDatabase();
auth = getAuth(app);

//console.log(app);
//console.log(db);
//console.log(auth);



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

function getFirebaseNodeKey(url) {
    return push(child(ref(db), url + "/")).key;
}

async function updateFirebaseNode(updates = { temp: "temp" }) {
    try {
        //   let res = await timeout(3000);
        //  console.log(updates);
        await update(ref(db), updates);
        return true
    }
    catch (error) {
        console.error(error)
        return error
    }
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



/**
* Store
*/

const initialState = {
    isLoading: true,
    conto: ["102", "30102", "40702", "452", "603"],
    quizId: "bankaccounting1",
    type: "accounting",
    header: "Тест",
    title: "Перечислены средств клиента с расчетного счета в другой банк через ЦБ РФ",
    theme: "Типовые операции по учету в кредитных организациях",
    text: "Перечислены средств клиента с расчетного счета в другой банк через ЦБ РФ",
    choices: [
        "да",
        "нет",
        "не знаю",
        "не проходили"
    ],
    //   answers: ["40702301"],
    hint: `
         <p><a class="link-opacity-100" target="_blank" target="_blank"
                    href="https://normativ.kontur.ru/document?moduleId=1&documentId=466405">
                    Удобный формат! <br>
                    Положение Банка России от 24.11.2022 N 809-П (ред. от 10.01.2024) "О Плане счетов бухгалтерского
                    учета для кредитных организаций и порядке его применения"
                </a>
                </p>
                 <p><a class="link-opacity-100" target="_blank" target="_blank"
                    href="https://disk.yandex.ru/i/N0H9hQpoSCRZoA">
                    Пособие
                </a>`

}

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = false
        },
        setCurrentQuiz: (state, action) => {
            state.type = action.payload.type;
            state.header = action.payload.header;
            state.title = action.payload.title;
            state.theme = action.payload.theme;
            state.text = action.payload.text;
            state.choices = action.payload.choices;
            state.hint = action.payload.hint;
        },
    }
})

// Action creators are generated for each case reducer function
const { setLoading, setCurrentQuiz
} = applicationSlice.actions


const api = createApi({
    reducerPath: 'api',
    tagTypes: ["OpenQuiz", "Quiz", "Answer", "Avatar", "Post"],
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({

        // fetchUserPosts: builder.query({
        //     async queryFn(userEmail) {
        //         //    console.log(userEmail)
        //         try {
        //             let userPosts = await getFirebaseNode({ url: "usersCraft/" + userEmail + "/posts", type: "array" });
        //             //   console.log(userPosts);
        //             return { data: Array.isArray(userPosts) ? userPosts : [] }
        //         }
        //         catch (err) { console.log(err); return { error: err } }
        //     },
        //     providesTags: (result, error, id) => [{ type: "Post", id }]
        // }),

        fetchOpenQuizesArray: builder.query({
            async queryFn() {
                try {
                    let openQuizes = await getFirebaseNode({ url: "openquizes/", type: "array" });
                    //    console.log(openQuizes);
                    return { data: openQuizes }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "OpenQuiz", id }]
        }),

        fetchCurrentDayQuizesArray: builder.query({
            async queryFn() {

                // let d = new Date();

                // let currentDay = new Intl.DateTimeFormat("en", {
                //     weekday: "short",
                //     year: "numeric",
                //     month: "short",
                //     day: "numeric",
                // })
                //     .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
                //     .replace(/[^a-zA-Z0-9]/g, "_");
                //       console.log(currentDay);

                try {

                    // //      let quizes;
                    // let pageQuizesSets = window?.quizesSets;
                    // console.log(pageQuizesSets);


                    // if (!!pageQuizesSets) {
                    //     pageQuizesSets = window.quizesSets.map(item => {
                    //         return { id: item.id }
                    //     })
                    // } else { pageQuizesSets = [] }

                    let currentQuizArray = await getFirebaseNode({
                        url: "/currentquiz/" + currentDay + "/",
                        type: "array"
                    });

                    // console.log(pageQuizesSets);
                    //   console.log(currentQuizArray);

                    let resArray = [...window?.quizesSets ? window.quizesSets : [], ...currentQuizArray];

                    // if (pageQuizesSets.length > 0) {

                    //     let reqIds = pageQuizesSets.map(item => item.id);
                    //     Array.isArray(res) &&
                    //         res.forEach(item => {
                    //             if (reqIds.includes(item.id)) {
                    //                 let theme = !!pageQuizesSets.find(q => item.id === q.id)?.theme ? pageQuizesSets.find(q => item.id === q.id).theme : false
                    //                 if (theme) { resArray.push({ ...item, theme: theme }) }
                    //                 else { resArray.push(item) }
                    //             }
                    //         })

                    // } else {
                    //     resArray = currentQuizArray
                    // }

                    // let quizes = await Promise.all(
                    //     array.map((quiz, index) => {
                    //         return getFirebaseNode({ url: "openquizes/" + quiz.id, type: "object" });
                    //     }))
                    //               console.log(quizes);    
                    return { data: resArray }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "Quiz", id }]
        }),

        updatesForOpenQuizes: builder.mutation({
            async queryFn({ base = "", updates = { temp: "temp" }
            }) {
                let fireUpdates = {};
                Object.keys(updates).forEach(objKey => {
                    fireUpdates[base + "/" + objKey] = updates[objKey]
                });
                //     console.log(fireUpdates);
                try { await updateFirebaseNode(fireUpdates) }
                catch (err) { console.log(err); return { error: err } }
                return { data: fireUpdates }
            },
            invalidatesTags: ["Answer"]
        }),


    }),
})

const store = configureStore({
    reducer: {
        application: applicationSlice.reducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})
setupListeners(store.dispatch);



//let resOpenQuizes;
let resOpenQuizesArray;
let resUserAvatar;
let resUserPosts;
let resCurrentDayQuizesArray;

/**
  * Functions
*/

function addCommonMarkup() {
    let { header, title, theme, text: quizText, hint = "" } = store.getState().application;
    let idQuiz = getFirebaseNodeKey("openquizes");
    return `
    <div class="row">    
        
        <div class="col-12 col-md-2">
            <div class="m-1">
                <label for="quizId" class="form-label">quiz Id</label>
                <input type="text" class="form-control" id="quizId" value="${idQuiz}">
            </div>
        </div>

       <div class="col-12 col-md-4">
            <div class="m-1">
                <label for="header" class="form-label">header</label>
                <input type="text" class="form-control" id="header" value="${header}">
            </div>
        </div>

        <div class="col-12 col-md-6">
            <div class="m-1">
                <label for="theme" class="form-label">theme</label>
                <input type="text" class="form-control" id="theme" value="${theme}">
            </div>
        </div>

        <div class="col-12">
            <div class="m-1">
                <label for="title" class="form-label">title</label>
                <input type="text" class="form-control" id="title" value="${title}">
            </div>
        </div>

      

 
             


        <div class="col-12">
            <div class="m-1">
                <label for="quizText" class="form-label">Quiz Text</label>
                <input type="text" class="form-control" id="quizText" value="${html_beautify(quizText, { "indent_size": 3 })}">
            </div>
        </div>

        <div class="col-12">
          <div class="mb-3">
            <label for="hint" class="form-label">hint</label>
            <textarea class="form-control" id="hint" rows="4">${html_beautify(hint, { "indent_size": 3 })}</textarea>
          </div>
        </div>

    </div>
`
}


function addOneChoiceQuiz(id) {
    let { choices } = store.getState().application;

    $("#quiznewquizlayout").innerHTML = addCommonMarkup()
    "<form>"
        +
        Array.isArray(choices) && choices
            .map((item, index) => {
                return `<div class="mb-3">
                            <label for="${index}" class="form-label" id=${index}>${index}</label>
                            <input type="text" class="form-control" id="${index}" value=${item}>
                        </div>`
            })
            .join("")
        +
        "</form>";

    let delquizcheckButtons = [...$$(".delquizcheck")];
    delquizcheckButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            doDeleteCurrentQuiz(event.target.id);
        })
    })

}

function addBankAccountingQuiz() {
    let { conto } = store.getState().application;

    $("#quiznewquizlayout").innerHTML = addCommonMarkup() + "<hr>" + `
        <div class="container p-1 m-1" id="accountingblock" style="display: none;">

                <div class="row m-1 g-1">
                    
                    <div class="col-12 col-md-6">
                        <select class="form-select form-select-sm" aria-label="debet" id="debet">
                            <option selected>Дебет счета</option>
                            <option value="1">...</option>

                        </select>
                    </div>
                    <div class="col-12 col-md-6">
                            <select class="form-select form-select-sm" aria-label="credit" id="credit">
                                <option selected>Кредит счета</option>
                                <option value="1">...</option>
                            </select>
                    </div>

                </div>

        </div>`;

    $("#debet").innerHTML = '<option value="...">Дебет</option>' + conto
        .map(item => {
            return `<option value="${item}">${item}</option>`
        })
        .join("");

    $("#credit").innerHTML = '<option value="...">Кредит</option>' + conto
        .map(item => {
            return `<option value="${item}">${item}</option>`
        })
        .join("");

    $("#accountingblock").style.display = "block";

}


function addNewQuizLayout(type) {
    let choicesMarkup = ["1", "2", "3", "4", "5", "6", "7"].map(item => {
        return `
        <div class="mb-1">
            <label for="${item}" class="form-label">${item}</label>
            <input type="text" class="form-control" id="${item}" placeholder="${item}">
        </div>
        `
    }).join("");
    $("#quiznewquizlayout").innerHTML = choicesMarkup;
    $("#quizaction").innerHTML = "Далее";
    $("#quizaction").style.display = "block";

    $("#savenewquizbutton").style.display = "block";

}

async function doDeleteCurrentQuiz(id) {

    let updates = {};

    updates["currentquiz/" + currentDay + "/" + id] = null;
    updates["openquizes/" + id] = null;
    console.log(updates);

    store.dispatch(api.endpoints.updatesForOpenQuizes.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
            console.log(res)
            setTimeout(() => window.location.reload(), 3000)
        })
        .catch(err => console.log(err));

}

function delCurrentDayQuiz() {
    console.log("delCurrentDayQuiz");
    console.log(resCurrentDayQuizesArray.data);

    $("#quiznewquizlayout").innerHTML =
        "<form>"
        +
        resCurrentDayQuizesArray.data
            .map(item => {
                return `<div class="form-check my-3">
               <input class="form-check-input delquizcheck" type="checkbox" value="" id="${item.id}">
               <label class="form-check-label btn-outline-danger" for="${item.id}">
               ${item.text} 
               </label>
             </div>`
            })
            .join("")
        +
        "</form>";

    let delquizcheckButtons = [...$$(".delquizcheck")];
    delquizcheckButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            doDeleteCurrentQuiz(event.target.id);
        })
    })

}

function selectQuizTypeButtons() {
    let selectquiztypeButtons = [...$$(".selectquiztype")];
    console.log(selectquiztypeButtons)
    selectquiztypeButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            console.log(event.target.id);
            // addNewQuizLayout(event.target.id);
            if (event.target.id === "addbankaccountingquiz") {
                addBankAccountingQuiz(event.target.id);
                $("#savenewquizbutton").style.display = "block";
            }

            if (event.target.id === "addonechoicequiz") {
                addOneChoiceQuiz(event.target.id);
                $("#savenewquizbutton").style.display = "block";
            }





            if (event.target.id === "deletecurrentquiz") {
                delCurrentDayQuiz();
            }





            //         const pageNumber = parseInt(event.target.getAttribute("page"));
            //         store.dispatch(setSelectedOptions([]));
            //         store.dispatch(setSelectedOption(Math.random() * 9 + 1));
            //         store.dispatch(setActivePage(pageNumber));
            //         setTimeout(() => store.dispatch(store.dispatch(setActivePage(pageNumber))), 275);
        }, false);
    })


}


function doSaveNewQuiz(e) {
    e.preventDefault();
    let { type: quizType, conto } = store.getState().application;

    console.log(e.target.value);



    // let answer = $("#debet").value + $("#credit").value;
    // console.log(answer);
    let answers = [$("#debet").value + $("#credit").value];
    // answers.push()

    let type = $("#type")?.value;
    let header = $("#header")?.value;
    let id = $("#quizId")?.value;
    let title = $("#title")?.value;
    let theme = $("#theme")?.value;
    let text = $("#quizText")?.value;
    let hint = $("#hint")?.value;

    let updates = {};

    updates["currentquiz/" + currentDay + "/" + id] = { id, header, type, title, theme, text, hint, answers, choices: conto };
    updates["openquizes/" + id] = { id, header, type, title, theme, text, hint, answers, choices: conto };

    console.log(updates);


    // let quizesSets = [


    //     {
    //         id: "statistics300",
    //         header: "Типовая задача",
    //         type: "quizwithrandomnumber",
    //         title: "Чему равна мода этой совокупности?",
    //         theme: "Задачи и виды статистической сводки",
    //         text: `
    //         <div>{=5000-4*{var1-10}*100}</div>              
    //         <div>{=5000-2*{var1-10}*100}</div>
    //         <div>{=5000-5*{var1-10}*100}</div>
    //         <div>{=5000-4*{var1-10}*100}</div>               
    //         <div>{=5000-3*{var1-10}*100}</div>
    //         <div>{=5000-1*{var1-10}*100}</div>
    //         <div>{=5000-4*{var1-10}*100}</div>
    //         <div>{=5000-1*{var1-10}*100}</div>
    //         `,
    //         answer: "5000-4*{var1-10}*100",
    //         hint: "Мода - значение, которое встречается в выборке чаще всего"
    //     },

    //     {
    //         id: "statistics305",
    //         type: "multiplechoices",
    //         header: "Тест",
    //         title: "Предметом изучения статистики",
    //         theme: "Основы",
    //         text: "Предметом изучения статистики являются",
    //         choices: [
    //             "закономерности  социально-экономических массовых явлений и процессов на предприятиях и в экономике в целом",
    //             "результаты статистического наблюдения, сводки и группировки",
    //             "закономерности маркетинговой деятельности предприятий",
    //             "процессы развития общества"],
    //         answers: ["закономерности  социально-экономических массовых явлений и процессов на предприятиях и в экономике в целом"]
    //     },

    //     {
    //         id: "bankaccounting1",
    //         type: "accounting",
    //         header: "Тест",
    //         title: "Проводки",
    //         theme: "Типовые операции по учету в кредитных организациях",
    //         text: "Перечислены средств клиента с расчетного счета в другой банк через ЦБ РФ",
    //         choices: [
    //             "102",
    //             "301",
    //             "40702",
    //             "452",
    //             "603"
    //         ],
    //         answers: ["40702301"],
    //         hint: `
    //         <div class="row m-1">
    //             <div class="col">
    //                 <div class="alert alert-secondary" role="alert">
    //                     <a target="_blank" href="https://www.consultant.ru/document/cons_doc_LAW_436264/cd9dff97697f94ed33851013a6bd0c346fdf6faa/#dst106225">40702</a>
    //                 </div>
    //             </div>
    //              <div class="col">
    //                 <div class="alert alert-secondary" role="alert">
    //                     <a target="_blank" href="https://www.consultant.ru/document/cons_doc_LAW_436264/0dd6470ab5f728a5c74438a60d9a5a458c4c71be/#dst105650">301</a>
    //                 </div>
    //             </div>              
    //         </div>`
    //     }
    // ]
    // updates[
    //     "currentDay/" + currentDay + "/posts/" + idPost
    // ] = currentDayObject;
    // console.log(updates);

    store.dispatch(api.endpoints.updatesForOpenQuizes.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
            store.dispatch(setCurrentQuiz({ type, header, title, theme, text, choices: ["да", "нет"], hint }));
            $("#quiznewquizlayout").innerHTML = "";
            console.log(res)
        })
        .catch(err => console.log(err));

}


/**
  * HTML event listeners
*/

$("#savenewquizbutton").addEventListener("click", (e) => doSaveNewQuiz(e), false);
$("#loginbutton").addEventListener("click", (e) => doSignInWithEmailAndPassword(e), false);


// $("#loginbutton").addEventListener("click", (e) => doLogin(e), false);
// $("#answerButton").addEventListener("click", (e) => handleCheckAnswer(e), false);
// const choiceQuiz = new EconolabsChoiceQuiz("quizChecks", doCheck);
// const chectQuiz = new EconolabsCheckQuiz("quizChecks", doToggleCheck);

/**
  * Initial load
*/


async function initialLoad() {
    resCurrentDayQuizesArray = await store.dispatch(api.endpoints.fetchCurrentDayQuizesArray.initiate());
    resOpenQuizesArray = await store.dispatch(api.endpoints.fetchOpenQuizesArray.initiate());
    return resCurrentDayQuizesArray.status === "fulfilled" && resOpenQuizesArray.status === "fulfilled" ? true : false
}


onAuthStateChanged(auth, function (user) {
    console.log("editcurrentquiz");
    //   verifyEmailButton.disabled = true;
    if (user) {
        console.log(user);

        initialLoad().then(() => {
            store.dispatch(setLoading());
            $("#loading").style.display = "none";
            selectQuizTypeButtons();
            $("#addquizbuttons").style.display = "block";
        });



        // User is signed in.
        //   const displayName = user.displayName;
        //   const email = user.email;
        //   const emailVerified = user.emailVerified;
        //   const photoURL = user.photoURL;
        //   const isAnonymous = user.isAnonymous;
        //   const uid = user.uid;
        //   const providerData = user.providerData;
        //   signInStatus.textContent = 'Signed in';
        //   signInButton.textContent = 'Sign out';
        //   accountDetails.textContent = JSON.stringify(user, null, '  ');
        //   if (!emailVerified) {
        //     verifyEmailButton.disabled = false;
        //   }
    } else {
        $("#authblock").style.display = "block";
        // User is signed out.
        //   signInStatus.textContent = 'Signed out';
        //   signInButton.textContent = 'Sign in';
        //   accountDetails.textContent = 'null';
    }
    //  signInButton.disabled = false;
});


store.subscribe(() => {
    console.log(store.getState())
})

