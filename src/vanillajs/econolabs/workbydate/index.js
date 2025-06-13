import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';

import markupForQuizesCasesByDate from "../../../utlities/markupForQuizesCasesByDate";

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


// function getFirebaseNodeKey(url) {
//     return push(child(ref(db), url + "/")).key;
// }

/**
* Store
*/

const initialState = {
    isLoading: true,
}



const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        setLoaded: (state, action) => {
            state.isLoading = false
        },
    }
})

// Action creators are generated for each case reducer function
const { setLoaded
} = applicationSlice.actions


export default applicationSlice.reducer


const api = createApi({
    reducerPath: 'api',
    tagTypes: ["OpenAvatar", "QuizCase"],
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
                    //    console.log(list)
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
//let resOpenQuizes;
//let resUserAvatar;
//let resUserPosts;
//let resQuizesArray



/**
  * Functions
*/

async function getAvatar(userEmail) {
    resOpenAvatar = await store.dispatch(api.endpoints.fetchOpenAvatar.initiate(userEmail))
    return !!resOpenAvatar.data ? resOpenAvatar.data : null;
}


async function doSelectDate(e) {
    apexchart ? apexchart.destroy() : null;
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

    console.log(currentDay);

    resQuizesCasesByDate = await store.dispatch(api.endpoints.fetchQuizesCasesByDate.initiate("/currentDay/" + currentDay + "/"))
         .then(res => {
             let quizesbyDate = res.data;
             console.log(quizesbyDate);
             let uniqueEmails = [...new Set(res.data.map(item => item?.email))];

             let updatedopenavatars = {};

             Promise.all(uniqueEmails.map(email => { return getAvatar(email.replace(/[^a-zA-Z0-9]/g, "_")) }))
                 .then(values => {
                     values.forEach((result, index) => updatedopenavatars[uniqueEmails[index].replace(/[^a-zA-Z0-9]/g, "_")] = result)

    //                 if ((1 - values.filter(item => !!item).length / values.length) > 0.8) {
    //                     let getImages = store.dispatch(api.endpoints.getPicturesFromCollection.initiate("aH98dheb50M"));
    //                     getImages.then(images => {

    //                         uniqueEmails.forEach((email, index) => {
    //                             if (!values[index]) {
    //                                 let quizuser = quizesbyDate.find(item => item.email === email).user;
    //                                 updatedopenavatars[uniqueEmails[index].replace(/[^a-zA-Z0-9]/g, "_")] = {
    //                                     id: email.replace(/[^a-zA-Z0-9]/g, "_"),
    //                                     avatarUrl: findUnspalshImageByGender(!(quizuser.includes("а ")), images.data),
    //                                     user: quizuser
    //                                 };
    //                             }
    //                         });

    //                         markupForQuizesCasesByDate(
    //                             "cards",
    //                             "cases",
    //                             "budgeting",
    //                             quizesbyDate,
    //                             updatedopenavatars,
    //                             "John Doe",
    //                             "https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop"
    //                         );

    //                         uniqueEmails.forEach((email, index) => {
    //                             store.dispatch(
    //                                 api.util.upsertQueryData('fetchOpenAvatar', email.replace(/[^a-zA-Z0-9]/g, "_"),
    //                                     updatedopenavatars[email.replace(/[^a-zA-Z0-9]/g, "_")]
    //                                 ));
    //                         })
    //                     })
    //                 };

                    markupForQuizesCasesByDate(
                        "cards",
                        "cases",
                        "budgeting",
                        quizesbyDate,
                        updatedopenavatars,
                        "John Doe",
                        "https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop"
                    );

                 });

         });
}
// HTML event listeners
$("#selectedDate").addEventListener("change", doSelectDate, false);

