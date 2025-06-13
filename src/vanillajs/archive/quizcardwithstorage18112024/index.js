import { getApps, deleteApp, initializeApp } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';

//import timeout from "../../../utlities/timeout.js";
import loadState from '../../../utlities/loadState.js';
import saveState from '../../../utlities/saveState.js';

import EconolabsChoiceQuiz from '../../../utlities/econolabschoicequiz.js';
import EconolabsCheckQuiz from '../../../utlities/econolabscheckquiz.js';




/**
  * Const and Selectors
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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

function getFirebaseNodeKey(url) {
    return push(child(ref(db), url + "/")).key;
}

/**
* Store
*/

const initialState = {
    email: '',
    userEmail: "",
    user: '',
    avatarUrl: '',

    isLoading: true,

    selectedoption: null,
    selectedoptions: [],

    activePage: null,
    previousPage: null,

    correctquizes: []
}



const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        loadCorrectquizes: (state, action) => { state.correctquizes = action.payload },
        addCorrectQuiz: (state, action) => { state.correctquizes.push(action.payload) },
        setSelectedOptions: (state, action) => { state.selectedoptions = action.payload },
        setSelectedOption: (state, action) => { state.selectedoption = action.payload },
        setUser: (state, action) => {
            state.email = action.payload.email,
                state.userEmail = action.payload.userEmail,
                state.user = action.payload.user,
                state.avatarUrl = action.payload?.avatarUrl ? action.payload?.avatarUrl : 'https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop',
                state.isLoading = false
        },
        setAvatar: (state, action) => {
            state.avatarUrl = action.payload
        },
        setActivePage: (state, action) => {
            state.previousPage = state.activePage;
            state.activePage = action.payload;
        }
    }
})

// Action creators are generated for each case reducer function
const { setUser, setSelectedOption, setAvatar, setActivePage, setSelectedOptions, addCorrectQuiz, loadCorrectquizes
} = applicationSlice.actions


export default applicationSlice.reducer


const api = createApi({
    reducerPath: 'api',
    tagTypes: ["OpenQuiz", "Quiz", "Answer", "Avatar", "Post"],
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({

        fetchUserPosts: builder.query({
            async queryFn(userEmail) {
                //    console.log(userEmail)
                try {
                    let userPosts = await getFirebaseNode({ url: "usersCraft/" + userEmail + "/posts", type: "array" });
                    //   console.log(userPosts);
                    return { data: Array.isArray(userPosts) ? userPosts : [] }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "Post", id }]
        }),

        // fetchOpenQuizes: builder.query({
        //     async queryFn() {
        //         try {
        //             let openQuizes = await getFirebaseNode({ url: "openquizes/", type: "array" });
        //             //    console.log(openQuizes);
        //             return { data: openQuizes }
        //         }
        //         catch (err) { console.log(err); return { error: err } }
        //     },
        //     providesTags: (result, error, id) => [{ type: "OpenQuiz", id }]
        // }),

        // fetchOpenQuiz: builder.query({
        //     async queryFn(id) {
        //         try {
        //             let quiz = await getFirebaseNode({ url: "openquizes/" + id, type: "object" });
        //             console.log(quiz);
        //             return { data: quiz }
        //         }
        //         catch (err) { console.log(err); return { error: err } }
        //     },
        //     providesTags: (result, error, id) => [{ type: "OpenQuiz", id }]
        // }),

        fetchQuizesArray: builder.query({
            async queryFn() {
                let d = new Date();
                let currentDay = new Intl.DateTimeFormat("en", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })
                    .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
                    .replace(/[^a-zA-Z0-9]/g, "_");
                //       console.log(currentDay);
                try {
                    let currentQuizArray = await getFirebaseNode({
                        url: "/currentquiz/" + currentDay + "/",
                        type: "array"
                    });
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
        // fetchUserAvatar: builder.query({
        //     async queryFn(userEmail) {
        //         try {
        //             let openAvatarsResponse = await getFirebaseNode({
        //                 url: "/openavatars/" + userEmail,
        //                 type: "object"
        //             });

        //             return { data: openAvatarsResponse }
        //         }
        //         catch (err) { console.log(err); return { data: null, error: err } }
        //     },
        //     providesTags: (result, error, id) => [{ type: "Avatar", id }]
        // }),
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
//let resUserAvatar;
let resUserPosts;
let resQuizesArray

/**
  * Functions
*/

function identifyQuiz(title, text) {
    if (typeof (text) === 'string' && text.includes('<br>')) {
        //       console.log(item.quizString.split('<br>')[0])
        return  title + " " + text.split('<br>')[0]
    } else {
        return title + " " + !!text ? text : ""
    }
}

async function getUser() {
    let localstrg = loadState()
    let application = !!localstrg && !!localstrg?.application ? {
        ...localstrg.application,
        userEmail: !!localstrg?.application ? localstrg.application?.email.replace(/[^a-zA-Z0-9]/g, "_") : null
    } : null

    return application
}

function doLogin(e) {
    e.preventDefault();
    let application = {
        email: $("#emailInput")?.value,
        user: $("#userInput")?.value,
    }
    saveState({ application })
    window.location.reload();
}

function processquizwithrandomnumber({
    quizString = "this {={var1-10}+1} some {=2+{var1-10}} that can be {=3+{var1-10}} with a {=4+{var1-10}} function",
    answer,
    randomNumber
}) {
    console.log(quizString, answer, randomNumber)
    function extract([beg, end]) {
        const matcher = new RegExp(`${beg}(.*?)${end}`, "gm");
        const normalise = (str) => str.slice(beg.length, end.length * -1);
        return function (str) {
            return str.match(matcher).map(normalise);
        };
    }
    let parser = new formulaParser.Parser();
    // It returns `Object {error: null, result: 14}`
    //  console.log(parser.parse('SUM(1, 6, 7)'));
    const searchRegExp = /{var1-10}/g;
    const replaceWith = randomNumber.toString();
    quizString = quizString.replace(searchRegExp, replaceWith);

    answer = answer.replace(searchRegExp, replaceWith);
    console.log(answer);
    answer = Math.round(parser.parse(answer).result * 10000) / 10000;
    console.log(answer);

    let stringExtractor = extract(["{=", "}"]);
    let stuffIneed = stringExtractor(quizString);


    for (let i = 0; i < stuffIneed.length; i++) {
        let feedback = Math.round(parser.parse(stuffIneed[i]).result * 10000) / 10000;
        quizString = quizString.replace("{=" + stuffIneed[i] + "}", feedback);
    }

    return {
        quizString: quizString,
        answer: answer
    }
}

function handleCheckAnswer(e) {
    e.preventDefault();
    let { userEmail, user, avatarUrl, email, selectedoption, selectedoptions, activePage } = store.getState().application;
    let { title, theme, answers, text, type, answer, hint = "" } = resQuizesArray.data[activePage];
    let checkquiz = false;
    let reqanswer;
    let quizString;
    let posttype;
    let comment = "";
   // let idsToDelete = null;
    try {
        let feedback = $("#userComment").value;
   //     console.log(feedback);
        comment = feedback !== "Мой комментарий" ? feedback : ""
    } catch {
        comment = ""
    }
    if (type === "accounting" && ($("#debet").value + $("#credit").value === answers[0])) {
        //   console.log($("#debet").value + $("#credit").value);
        //   console.log(answers[0]);

        checkquiz = true;
        reqanswer = "Дт " + $("#debet").value + " Кт " + $("#credit").value;
        quizString = text + "<br>" + hint + "<br>" + comment;
        posttype = "multiplechoices"
    }
    if (type === "multiplechoices" && answers.length === 1 && selectedoption === answers[0]) {
        checkquiz = true;
        reqanswer = selectedoption;
        quizString = text + "<br>" + hint + "<br>" + comment;;
        posttype = "multiplechoices";

        idsToDelete = resUserPosts.data
            .filter(item => item.content === text)
            .map(item => item.id);
    }
    if (type === "multiplechoices" && answers.length > 1) {
        if (selectedoptions.length === answers.length) {
            checkquiz = true
            selectedoptions.map(item => {
                if (!answers.includes(item)) { checkquiz = false }
            })
        }
        reqanswer = selectedoptions.map(item => item).join("   ");
        quizString = text + "<br>" + hint + "<br>" + comment;;
        posttype = "multiplechoices";

        idsToDelete = checkquiz ? resUserPosts.data
            .filter(item => item.content === text)
            .map(item => item.id) : null;
    }
    if (type === "quizwithrandomnumber") {
        let res = processquizwithrandomnumber({ quizString: text, answer: answer, randomNumber: store.getState().application.selectedoption });
         reqanswer = res.answer;
        quizString = res.quizString + "<br>" + hint + "<br>" + comment;;
        posttype = "multiplechoices"
        //   console.log(reqanswer);
        let value = $("#feedback").value;
        console.log(value);
        console.log(reqanswer);
        if (
            parseFloat(value) / parseFloat(reqanswer) < 1.02 &&
            parseFloat(value) / parseFloat(reqanswer) > 0.98
        ) { checkquiz = true }
    }
    if (checkquiz) {
        //    console.log("Right")
        let idPost = getFirebaseNodeKey("usersCraft/" + userEmail + "/posts")

        let currentDay = new Intl.DateTimeFormat("en", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })
            .format(new Date())
            .replace(/[^a-zA-Z0-9]/g, "_");

        let postObject = {
            id: idPost,
            title: title,
            theme: theme,
            answer: reqanswer,
            comment: title + " (" + theme + ")",
            type: posttype,
            content: quizString,
            quizString: quizString,
            deleted: false,
            email: email,
            user: user,
            avatarUrl: avatarUrl,
            date: new Intl.DateTimeFormat("ru", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            }).format(new Date()), //Date().toJSON()
        };

        let currentDayObject = {
            id: idPost,
            title: title,
            theme: theme,
            email: email,
            user: user,
            avatarUrl: avatarUrl,
            timestamp: +Date.now(),
        };
        let updates = {};
        
        updates["usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
        updates[
            "currentDay/" + currentDay + "/posts/" + idPost
        ] = currentDayObject;
     //     console.log(updates);

        // if (Array.isArray(idsToDelete)) {
        //     console.log(idsToDelete);
        //     idsToDelete.map(item => {
        //         updates["usersCraft/" + userEmail + "/posts/" + item] = null;
        //     })
        // }

        store.dispatch(api.endpoints.updatesForOpenQuizes.initiate({
            base: "",
            updates: updates
        }))
            .then(() => {
                store.dispatch(addCorrectQuiz(
                     identifyQuiz(title, text)
                    // typeof (text) === 'string' && text.includes('<br>') ?
                    //     text.split('<br>')[0] : text
                ));


                $("#answerButton").className = "btn btn-sm btn-success";
                //          console.log(res)
            });
    } else {
        //      console.log("Wrong");
        $("#answerButton").className = "btn btn-sm btn-outline-danger";
        $("#quizHint").innerHTML = hint;
        setTimeout(() => $("#answerButton").style.display = "none", 5000)
    }
}

function doCheck(value) { store.dispatch(setSelectedOption(value)) }

function doToggleCheck(value) {
    let selectedoptions = store.getState().application.selectedoptions.map(item => item);
    const index = selectedoptions.indexOf(value);
    if (index > -1) {
        selectedoptions.splice(index, 1);
        store.dispatch(setSelectedOptions(selectedoptions))
    }
    else {
        store.dispatch(setSelectedOptions([...selectedoptions, value]))
    }
}

function updateQuiz(activePage) {
    // resQuizesArray?.status === "fulfilled" && resQuizesArray.data.length > 0 &&
    //     store.getState().application.activePage !== store.getState().application.previousPage) {
    let quiz = resQuizesArray.data[activePage];

    if (quiz.type === "multiplechoices") {
        $("#userComment").value = "Мой комментарий";

        $("#quizChecks").innerHTML = "";
        $("#accountingblock").style.display = "none";
        $("#quizHint").innerHTML = "";
        $("#quizTitle").innerHTML = "";

        $("#quizString").innerHTML = quiz.text;
        $("#quizHeader").innerText = quiz.header + " " + (activePage + 1);

        if (quiz.answers.length > 1) {
            chectQuiz.addEvents(quiz.choices)
        } else { choiceQuiz.addEvents(quiz.choices) }


        $("#quizcontainer").style.display = "block";
        $("#answerButton").className = "btn btn-sm btn-primary";
        $("#answerButton").style.display = "block";
    }

    if (quiz.type === "accounting") {
        $("#userComment").value = "Мой комментарий";

        $("#quizChecks").innerHTML = "";
        $("#quizHint").innerHTML = "";
        $("#quizTitle").innerHTML = "";

        $("#quizString").innerHTML = quiz.text;
        $("#quizHeader").innerText = quiz.header + " " + (activePage + 1);




        $("#debet").innerHTML = '<option value="...">Дебет</option>' + quiz.choices
            .map(item => {
                return `<option value="${item}">${item}</option>`
            })
            .join("");

        $("#credit").innerHTML = '<option value="...">Кредит</option>' + quiz.choices
            .map(item => {
                return `<option value="${item}">${item}</option>`
            })
            .join("");

        $("#accountingblock").style.display = "block";

        $("#quizcontainer").style.display = "block";
        $("#answerButton").className = "btn btn-sm btn-primary";
        $("#answerButton").style.display = "block";
    }





    if (quiz.type === "quizwithrandomnumber") {
        $("#userComment").value = "Мой комментарий";

        $("#accountingblock").style.display = "none";
        $("#quizHint").innerHTML = "";
        $("#quizTitle").innerHTML = quiz.title;
        $("#quizHeader").innerText = quiz.header + " " + (activePage + 1);
        $("#quizcontainer").style.display = "block";
        $("#answerButton").className = "btn btn-sm btn-primary";
        $("#answerButton").style.display = "block";
        //  randomNumberQuiz.addEvents(quiz.text, quiz.answer, store.getState().application.selectedoption);
        let res = processquizwithrandomnumber({ quizString: quiz.text, answer: quiz.answer, randomNumber: store.getState().application.selectedoption });
        //     console.log(res.answer)
        $("#quizString").innerHTML = res.quizString;
        $("#quizChecks").innerHTML = `
            <div class="input-group input-group-sm mb-3">
                <span class="input-group-text" id="inputGroup-sizing-sm">Число</span>
                <input type="text" class="form-control" aria-label="quizinput" aria-describedby="quiz-input-sm" id="feedback">
            </div>`;
    }

    renderPagination()
}

function foundQuiz(correctquizes, text) {
    let res = false;
    correctquizes.forEach(item => {
        if (typeof(item) === 'string' && item.includes(text)) { res = true}
    })
    return res
}


function renderPagination() {
    let correctquizes = store.getState().application.correctquizes;
    //     console.log(correctquizes);
    //     console.log(resQuizesArray.data);
    // let currentPage = store.getState().application.activePage;
    $("#quizbuttonslist").innerHTML = resQuizesArray.data.map((item, index) => {
    //    console.log(identifyQuiz(item.title, item.text))
    //    console.log(item.text);
    //    console.log(correctquizes.includes(item.text))
        return `<button
        class='${
            foundQuiz(correctquizes, item.text)
          //  correctquizes.includes(
          //  identifyQuiz(item.title, item.text)
            // typeof (item.text) === 'string' && item.text.includes('<br>') ?
            //     item.text.split('<br>')[0] : item.text
        //) 
        ? "btn btn-sm btn-success page m-1" : "btn btn-sm btn-outline-secondary page m-1"}'
        page=${index}
       >
        ${index + 1}
        </button>`
    }).join("") +
        `<a href="/myworkbook" title="Рабочая тетрадь" class="btn btn-sm btn btn-outline-primary m-1" target="_blank">РТ</a>`
        ;

    let pagesLi = [...$$(".page")];
    pagesLi.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            const pageNumber = parseInt(event.target.getAttribute("page"));
            //      console.log(pageNumber);
            store.dispatch(setSelectedOptions([]));
            store.dispatch(setSelectedOption(Math.random() * 9 + 1));
            store.dispatch(setActivePage(pageNumber));
            updateQuiz(pageNumber)
            // setTimeout(() => store.dispatch(store.dispatch(setActivePage(pageNumber))), 275);
        }, false);
    })
}


/**
  * HTML event listeners
*/

$("#loginbutton").addEventListener("click", (e) => doLogin(e), false);
$("#answerButton").addEventListener("click", (e) => handleCheckAnswer(e), false);
const choiceQuiz = new EconolabsChoiceQuiz("quizChecks", doCheck);
const chectQuiz = new EconolabsCheckQuiz("quizChecks", doToggleCheck);



/**
  * Initial load
*/

async function initialLoad() {
    let res = await getUser();
 //   console.log(res);
    if (!res) {
        $("#formcontainer").style.display = "block";
    } else {
        resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(res.userEmail));
        resQuizesArray = await store.dispatch(api.endpoints.fetchQuizesArray.initiate());
        store.dispatch(loadCorrectquizes([...new Set(
            resUserPosts.data
                .map(item => { 
                   return identifyQuiz(item.title, item?.quizString)
                    // if (typeof (item?.quizString) === 'string' && item.quizString.includes('<br>')) {
                    //     //       console.log(item.quizString.split('<br>')[0])
                    //     return item.title + " " + item.quizString.split('<br>')[0]
                    // } else {
                    //     return item.title + " " + !!item?.quizString ? item.quizString : ""
                    // }
                }
                ))]))
         store.dispatch(setUser(res));
    }
}


initialLoad().then(() => { 
    console.log("Done")
    renderPagination()
});

//store.subscribe(() => { })