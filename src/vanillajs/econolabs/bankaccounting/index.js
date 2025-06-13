import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';
import DOMPurify from 'dompurify';

//import { produce } from 'immer'

import loadState from '../../../utlities/loadState.js';
import saveState from '../../../utlities/saveState.js';
//import timeout from "../../../utlities/timeout.js";

import contoUpdates from './contoUpdates.js';
import balanceformArray from './balanceformArray.js';



/**
  * Const and Selectors
*/
const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);
const config = {
    ALLOWED_TAGS: ['p', '#text', 'table', 'thead',
        'tr', 'th', 'tbody', 'td', 'img', 'a', 'div'],
    ADD_ATTR: ['src', 'href'],
    KEEP_CONTENT: true
};
// let recordsArray = [];
// let contoArray = [];
// let userEmail;




//Firebase

let app

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
            //    console.log(res);
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
    recordsArray: [],
    contoArray: [],
    postId: null,
    currPage: 1,
    pageLength: 10,
    mediaObject: null,
    mediaId: null,
    filteredTheme: "Кейс по учету операций в банке",

    // balanceIndicatorId: null
}



const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {

        addContoToArray: (state, action) => {
            let index = state.contoArray.findIndex(item => item.id ===
                action.payload.id);
            //  console.log(index);    
            if (index > -1) {
                state.contoArray[index] = action.payload
            } else {
                state.contoArray.push(action.payload)
            }

        },
        addRecord: (state, action) => {
            state.recordsArray.push(action.payload)
        },
        addRecords: (state, action) => {
            state.recordsArray = action.payload
        },
        fillContoArray: (state, action) => {
            state.contoArray = action.payload
        },
        setPostId: (state, action) => {
            state.postId = action.payload;
        },
        setMediaId: (state, action) => {
            state.mediaId = action.payload;
        },
        //       setMedia: (state, action) => {
        //           state.mediaObject = action.payload;
        //       },
        //      setPreviousCurrentPage: (state) => {
        //          state.currPage = state.currPage === 1 ? 1 : state.currPage - 1;
        //      },
        //      setNextCurrentPage: (state) => {
        //          state.currPage = state.currPage + 1;
        //      },
        setUser: (state, action) => {
            state.email = action.payload.email,
                state.userEmail = action.payload.userEmail,
                state.user = action.payload.user,
                state.avatarUrl = action.payload?.avatarUrl ? action.payload?.avatarUrl : 'https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop',
                state.isLoading = false
        },
        // setAvatar: (state, action) => {
        //    state.avatarUrl = action.payload           
        // },
    }
})

// Action creators are generated for each case reducer function
const { addRecord, fillContoArray, setUser, setMediaId, setPostId,
    addContoToArray, addRecords
    //   setNextCurrentPage, setPreviousCurrentPage, setMedia, addRecords
} = applicationSlice.actions


export default applicationSlice.reducer


const api = createApi({
    reducerPath: 'api',
    tagTypes: ["Post", "Media", "Conto", "Avatar"],
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({

        fetchUserConto: builder.query({
            async queryFn(userEmail) {
                //    console.log(userEmail)
                try {
                    // let userCraft = await getFirebaseNode({ url: "usersCraft/" + userEmail, type: "object" });
                    // console.log(userCraft);
                    let userConto = await getFirebaseNode({ url: "usersCraft/" + userEmail + "/conto", type: "array" });
                    return {
                        data: Array.isArray(userConto) ? userConto
                            //     userPosts.filter(item => item.id === "-MYG8b6xMzB14G8F4bEg")
                            //    userPosts.filter(item => item.type === "html" || item.type === "media" || item.type === "accountingwithprofitscash")
                            : []
                    }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "Conto", id }]
        }),

        fetchUserPosts: builder.query({
            async queryFn(userEmail) {
                //    console.log(userEmail)
                try {
                    //   let userCraft = await getFirebaseNode({ url: "usersCraft/" + userEmail, type: "object" });
                    //   console.log(userCraft);
                    let userPosts = await getFirebaseNode({ url: "usersCraft/" + userEmail + "/posts", type: "array" });
                    //   console.log(userPosts);
                    return {
                        data: Array.isArray(userPosts) ?
                            //     userPosts.filter(item => item.id === "-MYG8b6xMzB14G8F4bEg")
                            userPosts.filter(item => item.type === "html" || item.type === "media")
                            : []
                    }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "Post", id }]
        }),

        fetchUserMediaData: builder.query({
            async queryFn(url) {
                //    console.log(userEmail)
                try {
                    let userMedia = await getFirebaseNode({ url: url, type: "object" });
                    //         console.log(userMedia);
                    return {
                        data: userMedia
                    }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "Media", id: "media" }]
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

        // deletePost: builder.mutation({
        //     async queryFn({ userEmail, id }) {
        //         let fireUpdates = {};
        //         fireUpdates["usersCraft/" + userEmail + "/posts/" + id] = null;
        //         try { await updateFirebaseNode(fireUpdates) }
        //         catch (err) { console.log(err); return { error: err } }
        //         return { data: fireUpdates }
        //     },
        //     invalidatesTags: ["Post"],
        // onQueryStarted(id, { dispatch }) {
        //     dispatch(
        //         api.util.updateQueryData("fetchUserPosts", userEmail,
        //             (posts) => delete posts[id]
        //         )
        //     )
        // }
        //   }),

        // deleteMedia: builder.mutation({
        //     async queryFn({ userEmail, id }) {
        //         let fireUpdates = {};
        //         fireUpdates["usersCraft/" + userEmail + "/data/" + id] = null;
        //         try { await updateFirebaseNode(fireUpdates) }
        //         catch (err) { console.log(err); return { error: err } }
        //         return { data: fireUpdates }
        //     },
        //     invalidatesTags: ["Media"],
        // onQueryStarted(id, { dispatch }) {
        //     dispatch(
        //         api.util.updateQueryData("fetchUserMediaData", 
        //             "usersCraft/" + userEmail + "/data/" + id,
        //             () => {}
        //         )
        //     )
        // }
        //      }),

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
            invalidatesTags: ["Post", "Media"],
        }),

        updatesForUserConto: builder.mutation({
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
            invalidatesTags: ["Conto"],
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
let resUserAvatar;
let resUserConto;
let resUserPosts;
// let resUserMediaData;
//let resQuizesArray



/**
  * Functions
*/

function getAllContoOptions(contoArray) {
    // console.log(contoArray);
    $("#ds").innerHTML = contoArray
        .map(item => {
            return `<option value=${item.id}>${item.conto}</option>`
        })
        .join("");

    $("#ks").innerHTML = contoArray
        .map(item => {
            return `<option value=${item.id}>${item.conto}</option>`
        })
        .join("");


    $("#periods").innerHTML = ["2023", "2024", "2025", "2026", "2027"]
        .map(item => {
            return `<option value=${item}>${item}</option>`
        })
        .join("");

    $("#balancerecords").innerHTML = balanceformArray.
        map(item => {
            return `<option value=${item.id}>${item.name}</option>`
        })
        .join("");

}





async function getUser() {
    let localstrg = loadState();
    console.log(localstrg);
    let application = !!localstrg && !!localstrg?.application ? {
        ...localstrg.application,
        userEmail: !!localstrg?.application ? localstrg.application?.email.replace(/[^a-zA-Z0-9]/g, "_") : null
    } : null
    let recordsArray = !!localstrg && !!localstrg?.recordsArray ? {
        ...localstrg.recordsArray
    } : []

    return { application, recordsArray }
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

function processRecords(indicator) {
    let DValues = 0;
    let KValues = 0;
    let isAsset = balanceformArray.find(item => item.name === indicator).type === "asset";
    let id = balanceformArray.find(item => item.name === indicator).id
    let filteredContoArray =
        store.getState().application.contoArray
            .filter(item => item.parentbalanceId === id)
            .map(item => item.conto);

    Array.isArray(store.getState().application.recordsArray) && store.getState().application.recordsArray.forEach(el => {
        if (filteredContoArray.includes(el.d)) {
            DValues = DValues + parseFloat(el.sum)
        }
        if (filteredContoArray.includes(el.k)) {
            KValues = KValues + parseFloat(el.sum)
        }
    })
    if (isAsset) { return DValues - KValues } else { return KValues - DValues }
}





function addNewRecord(e) {
    e.preventDefault();

    let email = store.getState().application.email;
    let user = store.getState().application.user;
    let recordsArray = store.getState().application.recordsArray;
    let avatarUrl = store.getState().application.avatarUrl;

    if ($("#ds").value.length > 1 &&
        $("#ks").value.length > 1 &&
        $("#sum").value.length > 1 &&
        $("#periods").value.length > 1 &&
        Array.isArray(store.getState().application.contoArray) &&
        store.getState().application.contoArray.length > 0
    ) {
        let record = {
            d: store.getState().application.contoArray.find(item => $("#ds").value === item.id).conto,
            k: store.getState().application.contoArray.find(item => $("#ks").value === item.id).conto,
            sum: $("#sum").value,
            period: $("#periods").value,
            id: getFirebaseNodeKey("temp"),
            comment: `
            Дт ${store.getState().application.contoArray.find(item => $("#ds").value === item.id).name} <br>
            Кт ${store.getState().application.contoArray.find(item => $("#ks").value === item.id).name} <br>
    
            ` + $("#commentInput").value
        }

        saveState({
            application: { email, user, avatarUrl },
            recordsArray: [...recordsArray, record]
        }
        )

        store.dispatch(addRecord(record));

        $("#addrecordform").reset();
    }

}

function setDebetDiscription(e) {
    e.preventDefault();
    let id = e.target.value;
    let conto = store.getState().application.contoArray.find(item => item.id === id);
    $("#debetDescription").innerHTML = `<span>${conto.name}</span>
    <br>
    <span>${conto.type}</span>
    <br>
    <span>
    ${!conto.debetDescription.includes("...") ? conto.debetDescription : ""}
    </span>`
}

function setCreditDiscription(e) {
    e.preventDefault();
    let id = e.target.value;
    let conto = store.getState().application.contoArray.find(item => item.id === id);
    $("#creditDescription").innerHTML = `<span>${conto.name}</span> 
    <br>
    <span>${conto.type}</span>     
    <br>
    <span>
     ${!conto.creditDescription.includes("...") ? conto.creditDescription : ""}
    </span>`
}

function doSaveUpdatedPost(e) {
    e.preventDefault();
    let userEmail = store.getState().application.userEmail;
    let avatarUrl = store.getState().application.avatarUrl;
    let user = store.getState().application.user;
    let email = store.getState().application.email;
    // let mediaId = !!store.getState().application.mediaId ?
    //     !!store.getState().application.mediaId :
    //     getFirebaseNodeKey("usersCraft/" + userEmail + "/data/");
    let id =
        !!store.getState().application.postId ? store.getState().application.postId :
            getFirebaseNodeKey("usersCraft/" + userEmail + "/posts/");

    let formData = new FormData($("#editpostform"));
    let res = {};
    for (const [key, value] of formData) {
        res[key] = value
    }
    let post = { id: "temp", ...res };
    console.log(post);


    let postObject = {
        id: id,
        title: res?.postTitle ? res.postTitle : "Задание " + resUserPosts.data.length + 1,
        theme: "Практика",
        answer: "",
        comment: "Проводки",
        type: "media", //temporary
        //  content: mediaId,
        quizString: "",
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

    let currentDay = new Intl.DateTimeFormat("en", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    })
        .format(new Date())
        .replace(/[^a-zA-Z0-9]/g, "_");

    let currentDayObject = {
        id: id,
        title: postObject.title,
        theme: postObject.theme,
        email: postObject.email,
        user: postObject.user,
        type: "html",
        avatarUrl: postObject.avatarUrl,
        timestamp: +Date.now(),
    };

    let updates = {};
    updates["usersCraft/" + userEmail + "/posts/" + id] =
    {
        ...postObject,
        id: id,
        type: "html",
        content: !!res?.postContent ?
            DOMPurify.sanitize(res.postContent, config)
            : "..."
    };
    updates["currentDay/" + currentDay + "/posts/" + id] = currentDayObject;
    console.log(updates);

    store.dispatch(api.endpoints.updatesForUserPosts.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
            //      console.log(res);
            store.dispatch(setPostId(id));
          // !!mediaId && store.dispatch(setMediaId(mediaId));
            $("#editpostform").reset();
        });


}


function doSavePost(e) {
    e.preventDefault();
    let content = $("#post").innerHTML;
    let userEmail = store.getState().application.userEmail;
    let avatarUrl = store.getState().application.avatarUrl;
    let user = store.getState().application.user;
    let email = store.getState().application.email;
    let mediaId = !!store.getState().application.mediaId ?
        !!store.getState().application.mediaId :
        getFirebaseNodeKey("usersCraft/" + userEmail + "/data/");
    let id =
        !!store.getState().application.postId ? store.getState().application.postId :
            getFirebaseNodeKey("usersCraft/" + userEmail + "/posts/");

    let postObject = {
        id: id,
        title: "Кейс по учету операций в банке " + (resUserPosts.data.length + 1),
        theme: "Кейс по учету операций в банке",
        answer: "",
        comment: "Проводки",
        type: "media",
        //  content: mediaId,
        quizString: "",
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

    let currentDay = new Intl.DateTimeFormat("en", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    })
        .format(new Date())
        .replace(/[^a-zA-Z0-9]/g, "_");

    let currentDayObject = {
        id: id,
        title: postObject.title,
        theme: postObject.theme,
        email: postObject.email,
        user: postObject.user,
        type: "html",
        avatarUrl: postObject.avatarUrl,
        timestamp: +Date.now(),
    };

    let updates = {};
    updates["usersCraft/" + userEmail + "/posts/" + id] = { ...postObject, id: id, type: "html", content: content };
    updates["currentDay/" + currentDay + "/posts/" + id] = currentDayObject;
    store.dispatch(api.endpoints.updatesForUserPosts.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
            //      console.log(res);
            store.dispatch(setPostId(id));
            store.dispatch(setMediaId(mediaId));
        });
}



function addConto(e) {
    e.preventDefault();
    //  const form = e.target;
    const formData = new FormData($("#addcontoform"));
    //  console.log(formData);

    let type = null;
    let parentbalanceId = null;
    let res = {};
    for (const [key, value] of formData) {
        res[key] = value
    }
    //  console.log(res);

    if (res.conto.length > 2
        && res.name.length > 5
        && res.balancerecords.length > 2) {
        let userEmail = store.getState().application.userEmail;
        //    console.log("Сохраняем");
        parentbalanceId = parseInt(res.balancerecords);
        type = balanceformArray.find(item => item.id === parentbalanceId)?.type;

        let newconto = {
            conto: res.conto,
            name: res.name,
            id: res.conto,
            sortby: res.conto,
            type: type,  // "asset",
            add: true,
            parentbalanceId: parentbalanceId,
            debetDescription: res?.debetDescriptionInput && res.debetDescriptionInput.length > 5 ? res.debetDescriptionInput : "По дебету счета отражаются...",
            creditDescription: res?.creditDescriptionInput && res.creditDescriptionInput.length > 5 ? res.creditDescriptionInput : "По кредиту счета отражаются...",
        }
        // console.log(newconto);   
        store.dispatch(addContoToArray(newconto));

        let updates = {};
        updates["usersCraft/" + userEmail + "/conto/" + newconto.id]
            = newconto;
        store.dispatch(api.endpoints.updatesForUserConto.initiate({
            base: "",
            updates: updates
        }))
            .then((res) => {
                //  console.log("Сохранили");
                //   console.log(res);
                $("#addcontoform").reset();
                //    store.dispatch(setBalanceIndicatorId(null));                 
                getAllContoOptions(store.getState().application.contoArray);
            });
    }
}




function doDelRecordsArray(e) {
    e.preventDefault();
    let email = store.getState().application.email;
    let user = store.getState().application.user;
    let avatarUrl = store.getState().application.avatarUrl;
    saveState({
        application: { email, user, avatarUrl }
    });
    store.dispatch(setPostId(null));
}

function renderRecordsDiv() {
    let markup =
        Array.isArray(store.getState().application.recordsArray) &&
            store.getState().application.recordsArray.length > 0
            ?
            `<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Дебет</th>
      <th scope="col">Кредит</th>
      <th scope="col">Сумма</th>
      <th scope="col">Тип</th>
    </tr>
  </thead>
  <tbody>
    `
            + store.getState().application.recordsArray
                .map((item, index) => {
                    return `
        <tr>
      <th scope="row">${index + 1}</th>
      <td>${item.d}</td>
      <td>${item.k}</td>
      <td>${item.sum}</td>
       <td>${!!item?.type ? item.type + " " + !!item?.period ? item.period : "" : ""}</td>
    </tr>
    <tr>
    <th scope='row'>Ком</th>
    <td colspan='4'>${!!item?.comment ? item.comment : ""}</td>
    </tr>
    `
                })
                .join("")
            + `
    </tbody>
</table> 
    ` : "";

    return markup
}

function renderInternshipDiv() {
    console.log(resUserPosts.data);
    let markup = resUserPosts.data
        //     .filter(item => item.theme === store.getState().application.filteredTheme)
        .map(item => {
            return `
            <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                    <img src="../freelancer.jpg" class="avatar alt="img">
                </div>
                <div class="flex-grow-1 ms-3">
                    <h5 class="card-title">${item.theme}</h5>
                    <p class="card-text">${item.title}</p>
                    <p class="card-text">${!!item?.comment ? item.comment : ""}</p>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <div class="card-text">${item.content}</div>
                    <div class='d-flex'>
                    <button class='btn btn-sm btn-outline-primary editpost' id="${item.id}">Ред</button>
                    <a target="_blank" href="https://disk.yandex.ru/i/N0H9hQpoSCRZoA" class="btn btn-sm btn-outline-secondary m-1">Пособие</a>
                    <a target="_blank"  href="https://normativ.kontur.ru/document?moduleId=1&documentId=466405" class="btn btn-sm btn-outline-secondary m-1">Положение 809-П</a>
                    <a target="_blank" href="https://normativ.kontur.ru/document?moduleId=1&documentId=466405#h343" class="btn btn-sm btn-outline-secondary m-1">Характеристика счетов 809-П</a>
                    <a target="_blank" href="https://cbr.ru/statistics/bank_sector/" class="btn btn-sm btn-outline-secondary m-1">Банковский сектор</a>
                  
                    </div>
                </div>
            </div>`})
        .join(" ");
    return markup;
}

function renderDelContoDiv() {
    //  console.log("del markup" + resUserConto.data);
    let userEmail = store.getState().application.userEmail;
    let markup = "<div class='row'>" +
        resUserConto
            .data
            .map(item => {
                return `
                <div class='col-12 col-md-3'>
                <button class="btn btn-sm btn-outline-danger delconto m-1" id=${item.id}>${item.conto} ${item.name} </button>
                </div>
                `})
            .join("") + "</div>";

    return "<div class='d-flex'>" + markup + "</div>"
}

function renderBalanceDiv() {
    let assetsMarkup = balanceformArray
        .filter(item => item.type === "asset")
        .map(item => {
            let sum = processRecords(item.name);
            if (sum === 0) { return "" }
            return `<div>${item.name} ${sum}</div>`
        })
        .join("");
    $("#assetsMarkup").innerHTML = assetsMarkup;


    let liabilitiesMarkup = balanceformArray
        .filter(item => item.type === "liability")
        .map(item => {
            let sum = processRecords(item.name);
            if (sum === 0) { return "" }
            return `<div>${item.name} ${sum}</div>`
        })
        .join("");
    $("#liabilitiesMarkup").innerHTML = liabilitiesMarkup;

    let equityMarkup = balanceformArray
        .filter(item => item.type === "equity")
        .map(item => {
            let sum = processRecords(item.name);
            if (sum === 0) { return "" }
            return `<div>${item.name} ${sum}</div>`
        })
        .join("");
    $("#equityMarkup").innerHTML = equityMarkup;

    //     let markup = `
    // <div class="row">
    //                 <div class="col">
    //                     <div class="m-1 text-primary">Активы</div>
    //                     <div class="m-1" id="assetsMarkup">
    //                        ${assetsMarkup}
    //                     </div>
    //                 </div>
    //                 <div class="col">
    //                     <div class="m-1">Пассивы</div>
    //                     <div class="m-1 text-danger">Обязательства</div>
    //                     <div class="m-1" id="liabilitiesMarkup">
    //                         ${liabilitiesMarkup}
    //                     </div>
    //                     <div class="m-1 text-success">Собственные средства</div>
    //                     <div class="m-1" id="equityMarkup">
    //                         ${equityMarkup}
    //                     </div>
    //                 </div>
    //             </div>

    // `
    return {
        assetsMarkup,
        liabilitiesMarkup,
        equityMarkup
    }
}

async function doDeleteConto(e) {
    let userEmail = store.getState().application.userEmail;
    let updates = {};
    updates["usersCraft/" + userEmail + "/conto/" + e.target.id] = null;
    store.dispatch(api.endpoints.updatesForUserConto.initiate({
        base: "",
        updates: updates
    }))
        .then(() => {
            setTimeout(() => window.location.reload(), 4000);
        });
}

function renderEditPostDiv(id) {
    let post = resUserPosts.data.find(item => item.id === id);
    console.log(post);
    // let formData = new FormData($("#editpostform"));
    $("#postContent").value =
        html_beautify(post?.content,
            { indent_size: 2, space_in_empty_paren: true }
        );
    ;
    $("#postTitle").value = post?.title;
    $("#postComment").value = post?.comment;

    setTimeout(() => {
        let target = [...$$("#myTab li button")][7];
        let tab = new bootstrap.Tab(target);
        tab.show();
    }, 475)


    // return "Ha Ha"
    // `
    //  <div>${post.theme}</div>
    //  <div>${post.title}</div>
    //  <textarea class="form-control">
    //  ${post.content}
    //  </textarea>
    //  `
}


function renderTabContent(tabTrigger) {
    console.log(tabTrigger._config.target);
    if (tabTrigger._config.target === "#internship") {
        $("#internship").innerHTML = renderInternshipDiv();
        [...$$(".editpost")].forEach(item => {
            item.addEventListener("click", async (e) => {
                store.dispatch(setPostId(e.target.id));
                renderEditPostDiv(e.target.id)
            })
        })
    }

    if (tabTrigger._config.target === "#transactions") {
        $("#records").innerHTML = renderRecordsDiv()
    }
    if (tabTrigger._config.target === "#delconto") {
        $("#delconto").innerHTML = renderDelContoDiv();
        [...$$(".delconto")].forEach(item => {
            item.addEventListener("click", async (e) => {
                doDeleteConto(e)
            })
        })
    }
    if (tabTrigger._config.target === "#balance") {
        let markup = renderBalanceDiv();
        $("#assetsMarkup").innerHTML = markup.assetsMarkup;
        $("#liabilitiesMarkup").innerHTML = markup.liabilitiesMarkup;
        $("#equityMarkup").innerHTML = markup.equityMarkup;


    }

    if (tabTrigger._config.target === "#editpost") {
        console.log("editpost");
        store.dispatch(setPostId(null));
        //   $("#editpost").innerHTML = renderEditPostDiv()
    }
}

function doAddTablePostContent(e) {
    e.preventDefault();
   $("#postContent").value = `
   <table class="table">
  <thead>
    <tr>
      <th scope="col">Показатель</th>
      <th scope="col">Период 1</th>
      <th scope="col">Период 2</th>
      <th scope="col">Период 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Показатель 1</th>
      <td>100</td>
      <td>150</td>
      <td>200</td>
    </tr>
    <tr>
      <th scope="row">Показатель 2</th>
      <td>300</td>
      <td>259</td>
      <td>200</td>
    </tr>
    <tr>
      <th scope="row">Показатель 3</th>
      <td>500</td>
      <td>300</td>
      <td>100</td>
    </tr>
  </tbody>
</table>
   `

}


/**
  * HTML event listeners
*/

$("#loginbutton").addEventListener("click", (e) => doLogin(e), false);
$("#addrecord").addEventListener("click", (e) => addNewRecord(e), false);

$("#ds").addEventListener("input", (e) => { setDebetDiscription(e) }, false);
$("#ks").addEventListener("input", (e) => { setCreditDiscription(e) }, false);
$("#savePost").addEventListener("click", (e) => doSavePost(e), false);
$("#delRecordsArray").addEventListener("click", (e) => doDelRecordsArray(e), false);

$("#editpostformbutton").addEventListener("click", (e) => doSaveUpdatedPost(e), false);

$("#addTablePostContent").addEventListener("click", (e) => doAddTablePostContent(e), false);




$("#addcontoform").addEventListener(`submit`, addConto);

const triggerTabList = [...$$('#myTab button')];
triggerTabList.forEach(triggerEl => {
    const tabTrigger = new bootstrap.Tab(triggerEl)

    triggerEl.addEventListener('click', event => {
        event.preventDefault();
        renderTabContent(tabTrigger);
        //   tabTrigger.show()
    })
})



/**
  * Initial load
*/



async function initialLoad() {
    let res = await getUser();

    if (!res?.application) {
        $("#formcontainer").style.display = "block";
        $("#main").style.display = "none";
    } else {
        console.log(res.application.userEmail);
        resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(res.application.userEmail));
        let avatarUrl
        resUserAvatar = await store.dispatch(api.endpoints.fetchUserAvatar.initiate(res.application.userEmail));
        if (resUserAvatar.data && resUserAvatar.data.avatarUrl) {
            avatarUrl = resUserAvatar.data?.avatarUrl;
            $("#avatarUrl").src = avatarUrl
        }

        resUserConto = await store.dispatch(api.endpoints.fetchUserConto.initiate(res.application.userEmail));
        // console.log(resUserConto.data);
        getAllContoOptions([...contoUpdates, ...resUserConto.data]);
        store.dispatch(fillContoArray([...contoUpdates, ...resUserConto.data]));

        store.dispatch(setUser({ ...res.application, avatarUrl: avatarUrl }));

        console.log(!!res?.recordsArray);
        if (!!res?.recordsArray) {
            store.dispatch(addRecords(
                Object.keys(res.recordsArray).map(objKey => res.recordsArray[objKey])
            ))
        }
        return resUserPosts?.status
    }
}

initialLoad().then(() => {
    console.log("bankaccounting");
    //  renderRecordsDiv();
    //  renderDelContoDiv();
});





