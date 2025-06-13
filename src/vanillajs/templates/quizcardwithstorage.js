import { initializeApp } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';

import EconolabsChoiceQuiz from '../../utlities/econolabschoicequiz.js';
import EconolabsCheckQuiz from '../../utlities/econolabscheckquiz.js';
import loadState from '../../utlities/loadState.js';
import saveState from '../../utlities/saveState.js';
import timeout from "../../utlities/timeout.js";

import quizesSets from './quizesSets.js';

console.log(quizesSets);

//Randomize choice answers
//Button colors for navigation

/**
  * Const and Selectors
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//Firebase

var fireconf = {};
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

let app = initializeApp(firebaseConfig);
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

        addCorrectQuiz: (state, action) => {
            state.correctquizes.push(action.payload)
        },
      
        setSelectedOptions: (state, action) => {
            state.selectedoptions = action.payload
        },

        setSelectedOption: (state, action) => {
            state.selectedoption = action.payload
        },


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
        },



    }
})

// Action creators are generated for each case reducer function
const { setUser, setSelectedOption, setAvatar, setActivePage, setSelectedOptions, addCorrectQuiz
} = applicationSlice.actions


export default applicationSlice.reducer


const api = createApi({
    reducerPath: 'api',
    tagTypes: ["OpenQuiz", "Quiz", "Answer", "Avatar"],
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({

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

        fetchOpenQuizesArray: builder.query({
            async queryFn(array) {
                try {
                    let resArray = [];
                    let res = await timeout(275, quizesSets);
                    let reqIds = array.map(item => item.id);
                    console.log(reqIds);
                    res.forEach(item => {
                        if (reqIds.includes(item.id)) {
                            let theme = !!array.find(q => item.id === q.id)?.theme ? array.find(q => item.id === q.id).theme : false
                            if (theme) { resArray.push({ ...item, theme: theme }) }
                            else { resArray.push(item) }
                        }
                    })
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



        fetchUserAvatar: builder.query({
            async queryFn(userEmail) {
                try {
                    let openAvatarsResponse = await getFirebaseNode({
                        url: "/openavatars/" + userEmail,
                        type: "object"
                    });

                    return { data: openAvatarsResponse }
                }
                catch (err) { console.log(err); return { data: null, error: err } }
            },
            providesTags: (result, error, id) => [{ type: "Avatar", id }]
        }),

        updatesForOpenQuizes: builder.mutation({
            async queryFn({ base = "", updates = { temp: "temp" }
            }) {
                let fireUpdates = {};
                Object.keys(updates).forEach(objKey => {
                    fireUpdates[base + "/" + objKey] = updates[objKey]
                });
                console.log(fireUpdates);
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

/**
  * Functions
*/

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
    // let parser = new Parser();
    const searchRegExp = /{var1-10}/g;
    const replaceWith = randomNumber.toString();
    quizString = quizString.replace(searchRegExp, replaceWith);

    answer = answer.replace(searchRegExp, replaceWith);
    answer = Math.round(parser.parse(answer).result * 10000) / 10000;

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
    let { title, theme, answers, text, type, answer, id, hint="" } = resOpenQuizesArray.data[activePage];

    let checkquiz = false;
    let reqanswer;
    let quizString;
    let posttype;
    if (type === "multiplechoices" && answers.length === 1 && selectedoption === answers[0]) {
        checkquiz = true;
        reqanswer = selectedoption;
        quizString = text;
        posttype = "multiplechoices" }

    if (type === "multiplechoices" && answers.length > 1) {
        if (selectedoptions.length !== answers.length ) {
            checkquiz = false;         
        } else {
            checkquiz = true 
            selectedoptions.map(item => {
                if (!answers.includes(item)) { checkquiz = false}
            })
        }
         reqanswer = selectedoptions.map(item => item).join("   ");
         quizString = text;
         posttype = "multiplechoices"
        
        }
    if (type === "quizwithrandomnumber") {
        let res = processquizwithrandomnumber({ quizString: text, answer: answer, randomNumber: store.getState().application.selectedoption });
        reqanswer = res.answer;
        quizString = res.quizString;
        posttype = "multiplechoices"
        console.log(reqanswer);
        let value = $("#feedback").value;
        if (
            parseFloat(value) / parseFloat(reqanswer) < 1.02 &&
            parseFloat(value) / parseFloat(reqanswer) > 0.98
        ) { checkquiz = true }
    }

    if (checkquiz) {
        console.log("Right")
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
        console.log(updates);

        store.dispatch(api.endpoints.updatesForOpenQuizes.initiate({
            base: "",
            updates: updates
        }))
            .then((res) => {
                store.dispatch(addCorrectQuiz(id));
                $("#answerButton").className = "btn btn-sm btn-success";
                console.log(res)
            });
    } else {
        console.log("Wrong");
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


function renderPagination() {
    let correctquizes = store.getState().application.correctquizes;
   // let currentPage = store.getState().application.activePage;
    $("#quizbuttonslist").innerHTML = resOpenQuizesArray.data.map((item, index) => {
        return `<button
        class='${correctquizes.includes(item.id) ? "btn btn-sm btn-success page m-1" : "btn btn-sm btn-outline-secondary page m-1"}'
        page=${index}
       >
        ${index + 1}
        </button>`
    }).join("");

    let pagesLi = [...$$(".page")];
    pagesLi.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            const pageNumber = parseInt(event.target.getAttribute("page"));
            store.dispatch(setSelectedOptions([]));
            store.dispatch(setSelectedOption(Math.random() * 9 + 1));
            store.dispatch(setActivePage(pageNumber));
            setTimeout(() => store.dispatch(store.dispatch(setActivePage(pageNumber))), 275);
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
    // timeout(2000).then(() => console.log(updates));

    let updates = {};
    quizesSets.forEach(item => {
        updates[item.id] = item
    })

    console.log(updates)

    // store.dispatch(api.endpoints.updatesForOpenQuizes.initiate({
    //     base: "openquizes",
    //     updates: updates
    // }))
    //     .then((res) => console.log(res));

    let res = await getUser();

    if (!res) {
        $("#formcontainer").style.display = "block";
    } else {
        resUserAvatar = await store.dispatch(api.endpoints.fetchUserAvatar.initiate(res.userEmail));
        if (!!resUserAvatar.data?.avatarUrl) {
            //        console.log(resUserAvatar.data?.avatarUrl);
            store.dispatch(setAvatar(resUserAvatar.data?.avatarUrl));
        } else {
            store.dispatch(setAvatar(
                'https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop'
            ));
        }

        //console.log(resUserAvatar);
        //resOpenQuizes = await store.dispatch(api.endpoints.fetchOpenQuizes.initiate());
        //console.log(resOpenQuizes.data)

        resOpenQuizesArray = await store.dispatch(api.endpoints.fetchOpenQuizesArray.initiate(quizesSets.map(item => {
            return {id: item.id}
        })));
        store.dispatch(setUser(res));
    }
    renderPagination()
}

initialLoad().then(res => { });

store.subscribe(() => {


    if (
        resOpenQuizesArray?.status === "fulfilled" && resOpenQuizesArray.data.length > 0 &&
        store.getState().application.activePage !== store.getState().application.previousPage) {

        console.log(store.getState().application)


        let quiz = resOpenQuizesArray.data[store.getState().application.activePage];
        // let index = resOpenQuizesArray.data.findIndex(item => item.id === store.getState().application.activePage);

        console.log(quiz);

        if (quiz.type === "multiplechoices") {
            $("#quizTitle").innerHTML = "";
            $("#quizString").innerHTML = quiz.text;
            $("#quizHeader").innerText = quiz.header + " " + (store.getState().application.activePage + 1);

            if (quiz.answers.length > 1) {
                chectQuiz.addEvents(quiz.choices)
            } else { choiceQuiz.addEvents(quiz.choices) }


            $("#quizcontainer").style.display = "block";
            $("#answerButton").className = "btn btn-sm btn-primary";
            $("#answerButton").style.display = "block";
        }

        if (quiz.type === "quizwithrandomnumber") {
            $("#quizTitle").innerHTML = quiz.title;
            $("#quizHeader").innerText = quiz.header + " " + (store.getState().application.activePage + 1);
            $("#quizcontainer").style.display = "block";
            $("#answerButton").className = "btn btn-sm btn-primary";
            $("#answerButton").style.display = "block";
            //  randomNumberQuiz.addEvents(quiz.text, quiz.answer, store.getState().application.selectedoption);
            let res = processquizwithrandomnumber({ quizString: quiz.text, answer: quiz.answer, randomNumber: store.getState().application.selectedoption });
            console.log(res.answer)
            $("#quizString").innerHTML = res.quizString;
            $("#quizChecks").innerHTML = `
            <div class="input-group input-group-sm mb-3">
                <span class="input-group-text" id="inputGroup-sizing-sm">Число</span>
                <input type="text" class="form-control" aria-label="quizinput" aria-describedby="quiz-input-sm" id="feedback">
            </div>`;
        }

        renderPagination()
    }
})







