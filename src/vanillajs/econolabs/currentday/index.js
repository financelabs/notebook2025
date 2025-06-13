import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';

import markupForQuizesCasesByDate from "../../../utlities/markupForQuizesCasesByDate";

import quizesSets from './quizesSets';
//import timeout from "../../../utlities/timeout.js";

/**
  * Const and Selectors
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let apexchart = null;
//let myModal = new bootstrap.Modal(document.getElementById('quizcaseModal'));

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
const auth = getAuth(app);



async function getFirebaseNode({
    url = "crafts/temp_gmail_com/posts/-Ml6DEjYhdnjuW6HiHB7",
    type = "array"
}) {
    try {
        //    console.log(url);
        let snapshot = await get(ref(db, url));
        if (snapshot.exists()) {
            let res = snapshot.val();
            //       console.log(res)
            if (type === "array") { return Object.keys(res).map(objKey => { return { ...res[objKey], id: objKey } }) }
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

// function getFirebaseNodeKey(url) {
//     return push(child(ref(db), url + "/")).key;
// }

/**
* Store
*/

const initialState = {
    isLoading: true,
    currentDay: null,
    openavatars: null
}



const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        setCurrentDate: (state, action) => {
            state.currentDay = action.payload
        },
        setOpenAvatars: (state, action) => {
            state.openavatars = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
const { setCurrentDate,
    //  setOpenAvatars
} = applicationSlice.actions


export default applicationSlice.reducer


const api = createApi({
    reducerPath: 'api',
    tagTypes: ["OpenAvatar", "QuizCase", "CurrentQuiz"],
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({

        fetchOpenAvatar: builder.query({
            async queryFn(url = "johndoe_gmail_com") {
                try {
                    let list = await getFirebaseNode({ url: "openavatars/" + url, type: "object" });
                    //     console.log(list)
                    return { data: list }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "OpenAvatar", id }]
        }),


        fetchQuizesCasesByDate: builder.query({
            async queryFn(url = "/currentDay/Wed__Feb_14__2024/") {
                try {
                    let quizes = await getFirebaseNode({ url: url + "posts", type: "array" });
                    let cases = await getFirebaseNode({ url: url + "cases", type: "array" });
                    // console.log([
                    //     ...quizes.map(item => { return { ...item, source: "posts" } }),
                    //     ...cases.map(item => { return { ...item, source: "cases" } })
                    // ]);
                    return {
                        data: [
                            ...quizes.map(item => { return { ...item, source: "posts" } }),
                            ...cases.map(item => { return { ...item, source: "cases" } })
                        ]
                    }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, arg) =>
                result
                    ? [...result.map(({ id }) => ({ type: "QuizCase", id })), "QuizCase"]
                    : ["QuizCase"],
        }),

        updatesForUserPosts: builder.mutation({
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
            invalidatesTags: ["QuizCase"],

        }),

        updatesForCurrentQuizes: builder.mutation({
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
            invalidatesTags: ["CurrentQuiz"]
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


let resQuizesCasesByDate;
let resOpenAvatar;


/**
  * Functions
*/

async function getAvatar(userEmail) {
    resOpenAvatar = await store.dispatch(api.endpoints.fetchOpenAvatar.initiate(userEmail))
    return !!resOpenAvatar.data ? resOpenAvatar.data : null;
}

function doDeletePost(id, userEmail) {
    let currentDay = store.getState().application.currentDay;
    // let userEmail = array
    //     .find(item => item.id === id).email.replace(/[^a-zA-Z0-9]/g, "_")
    //   console.log(currentDay)
    //  console.log(id);
    let updates = {};

    updates["usersCraft/" + userEmail + "/posts/" + id] = null;
    updates["currentDay/" + currentDay + "/posts/" + id] = null;
    updates["currentDay/" + currentDay + "/cases/" + id] = null;
    console.log(updates);

    store.dispatch(api.endpoints.updatesForUserPosts.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => { console.log(res) });
}



async function doSelectDate(e) {
    //   apexchart ? apexchart.destroy() : null;
    e.preventDefault();

    let d = new Date(e.target.value);

    let currentDay = new Intl.DateTimeFormat("en", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    })
        .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
        .replace(/[^a-zA-Z0-9]/g, "_");

    store.dispatch(setCurrentDate(currentDay))

    console.log(currentDay);

    resQuizesCasesByDate = await store.dispatch(api.endpoints.fetchQuizesCasesByDate.initiate("/currentDay/" + currentDay + "/"));
    console.log(resQuizesCasesByDate.data);
    let res = resQuizesCasesByDate.data;

    let quizesbyDate = res;
    console.log(quizesbyDate);
    let uniqueEmails = [...new Set(res.map(item => item?.email))];

    let updatedopenavatars = {};

    Promise.all(uniqueEmails.map(email => { return getAvatar(email.replace(/[^a-zA-Z0-9]/g, "_")) }))
        .then(values => {
            values.forEach((result, index) =>
                updatedopenavatars[uniqueEmails[index].replace(/[^a-zA-Z0-9]/g, "_")] = result
            )
            console.log(updatedopenavatars);
            //       store.dispatch(setOpenAvatars(updatedopenavatars));
            markupForQuizesCasesByDate(
                "cards",
                "cases",
                "budgeting",
                quizesbyDate,
                updatedopenavatars,
                "John Doe",
                "https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop",
                doDeletePost
            );

        });
}

function changeMode(mode) {
    console.log(mode);
    ["deletequiz", "addopenquizes", "removedublicates", "showgroupresults"].forEach(item => {
        $("#" + item).classList.remove("btn-secondary");
        $("#" + item).classList.add("btn-outline-secondary");
    });
    $("#" + mode).classList.remove("btn-outline-secondary");
    $("#" + mode).classList.add("btn-secondary");
    ["deletequiz", "addopenquizes", "removedublicates", "showgroupresults"].forEach(item => {
        $("#" + item + "block").style.display = "none";
    });
    $("#" + mode + "block").style.display = "block";
}

function doSaveNewQuiz(e) {
    e.preventDefault();

    let updates = {};

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


    quizesSets.forEach(item => {
        updates["currentquiz/" + currentDay + "/" + item.id] =
            item
    });

    console.log(updates);
    // updates[
    //     "currentDay/" + currentDay + "/posts/" + idPost
    // ] = currentDayObject;
    // console.log(updates);

    store.dispatch(api.endpoints.updatesForCurrentQuizes.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
            console.log(res)
        })
        .catch(err => console.log(err));

}

async function doSelectDateForDuplicates(e) {
    e.preventDefault();


    let d = new Date(e.target.value);

    let currentDay = new Intl.DateTimeFormat("en", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    })
        .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
        .replace(/[^a-zA-Z0-9]/g, "_");

    store.dispatch(setCurrentDate(currentDay))

    console.log(currentDay);

    resQuizesCasesByDate = await store.dispatch(api.endpoints.fetchQuizesCasesByDate.initiate("/currentDay/" + currentDay + "/"));
    console.log(resQuizesCasesByDate.data);
    let res = resQuizesCasesByDate.data;

    let quizesbyDate = res;
    console.log(quizesbyDate);
    let uniqueEmails = [...new Set(res.map(item => item?.email))];
    console.log(uniqueEmails);

    let updatedopenavatars = {};

    Promise.all(uniqueEmails.map(email => {
        return getAvatar(email.replace(/[^a-zA-Z0-9]/g, "_"))
    }))
        .then(values => {
            values.forEach((result, index) =>
                updatedopenavatars[uniqueEmails[index].replace(/[^a-zA-Z0-9]/g, "_")] = result
            );
            let markup = uniqueEmails
                .map(item => {
                    let image;
                    let userEmail = item.replace(/[^a-zA-Z0-9]/g, "_");
                    console.log(updatedopenavatars[userEmail]);

                    if (!!updatedopenavatars?.[userEmail]) {
                        image = !!updatedopenavatars[userEmail]?.avatarUrl ?
                        updatedopenavatars[userEmail].avatarUrl 
                        : "../freelancer.jpg";
                    }
                    return `<div class="card mb-3" >
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${image}" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${
              !!updatedopenavatars[userEmail]?.user ?
              updatedopenavatars[userEmail]?.user : "Anonymous"
            }</h5>
            <button class='btn btn-sm btn-outline-secondary'>Проверить</button>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <p class="card-text"><small class="text-muted">${item}</small></p>
            <p class="card-text"><small class="text-muted">${
                !!updatedopenavatars[userEmail]?.group ?
              updatedopenavatars[userEmail]?.group : "-"
            }</small></p>
          </div>
        </div>
      </div>
    </div> `
                }).join(" ");
            $("#exploreuser").innerHTML = markup;

        })

    console.log(updatedopenavatars);




}


/**
  * HTML event listeners
*/

$("#addopenquizesbutton").addEventListener("click", (e) => doSaveNewQuiz(e), false);

$("#selectedDate").addEventListener("change", doSelectDate, false);

$("#addopenquizes").addEventListener("click", () => changeMode("addopenquizes"), false);
$("#deletequiz").addEventListener("click", () => changeMode("deletequiz"), false);
$("#removedublicates").addEventListener("click", () => changeMode("removedublicates"), false);
$("#showgroupresults").addEventListener("click", () => changeMode("showgroupresults"), false);
$("#selectedDateforDuplicates").addEventListener("change", (e) => doSelectDateForDuplicates(e), false);


function initialLoad() {
    console.log("Done");
    $("#deletequiz").classList.remove("btn-outline-secondary");
    $("#deletequiz").classList.add("btn-secondary");

    let updates = {};

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

    

     updates["currentquiz/" + currentDay ] = null;
        store.dispatch(api.endpoints.updatesForCurrentQuizes.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
            console.log(res)
        })
        .catch(err => console.log(err));
};

/**
  * Check Auth
*/

onAuthStateChanged(auth, user => {
    if (!user) {
        document.getElementById("loginform").style.display = "block";
        document.getElementById("main").style.display = "none";
    }
    else {
        document.getElementById("loginform").style.display = "none";
        document.getElementById("main").style.display = "block";
        initialLoad()
        // signOut(auth); 
    }
})





