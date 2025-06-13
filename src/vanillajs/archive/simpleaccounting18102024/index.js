import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';

//import { produce } from 'immer'

import loadState from '../../../utlities/loadState.js';
import saveState from '../../../utlities/saveState.js';
import timeout from "../../../utlities/timeout.js";

import contoUpdates from './contoUpdates.js';
import balanceformArray from './balanceformArray.js';



/**
  * Const and Selectors
*/
const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);
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
    mediaId: null
}



const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        addContoToArray: (state, action) => {
            state.contoArray.push(action.payload)
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
        setMedia: (state, action) => {
            state.mediaObject = action.payload;
        },
        setPreviousCurrentPage: (state) => {
            state.currPage = state.currPage === 1 ? 1 : state.currPage - 1;
        },
        setNextCurrentPage: (state) => {
            state.currPage = state.currPage + 1;
        },
        setUser: (state, action) => {
            state.email = action.payload.email,
                state.userEmail = action.payload.userEmail,
                state.user = action.payload.user,
                state.avatarUrl = action.payload?.avatarUrl ? action.payload?.avatarUrl : 'https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop',
                state.isLoading = false
        },
    }
})

// Action creators are generated for each case reducer function
const { addRecord, fillContoArray, addContoToArray,
       setUser, setNextCurrentPage, setPreviousCurrentPage, setPostId, setMedia,
    setMediaId, addRecords
} = applicationSlice.actions


export default applicationSlice.reducer


const api = createApi({
    reducerPath: 'api',
    tagTypes: ["Post", "Media"],
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({

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
                            userPosts.filter(item => item.type === "html" || item.type === "media" || item.type === "accountingwithprofitscash")
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
                    console.log(userMedia);
                    return {
                        data: userMedia
                    }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "Media", id: "media" }]
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

        deletePost: builder.mutation({
            async queryFn({ userEmail, id }) {
                let fireUpdates = {};
                fireUpdates["usersCraft/" + userEmail + "/posts/" + id] = null;
                try { await updateFirebaseNode(fireUpdates) }
                catch (err) { console.log(err); return { error: err } }
                return { data: fireUpdates }
            },
            invalidatesTags: ["Post"],
            // onQueryStarted(id, { dispatch }) {
            //     dispatch(
            //         api.util.updateQueryData("fetchUserPosts", userEmail,
            //             (posts) => delete posts[id]
            //         )
            //     )
            // }
        }),

        deleteMedia: builder.mutation({
            async queryFn({ userEmail, id }) {
                let fireUpdates = {};
                fireUpdates["usersCraft/" + userEmail + "/data/" + id] = null;
                try { await updateFirebaseNode(fireUpdates) }
                catch (err) { console.log(err); return { error: err } }
                return { data: fireUpdates }
            },
            invalidatesTags: ["Media"],
            // onQueryStarted(id, { dispatch }) {
            //     dispatch(
            //         api.util.updateQueryData("fetchUserMediaData", 
            //             "usersCraft/" + userEmail + "/data/" + id,
            //             () => {}
            //         )
            //     )
            // }
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
            invalidatesTags: ["Post", "Media"],

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
// let resUserMediaData;
//let resQuizesArray



/**
  * Functions
*/

function getAllContoOptions(contoArray) {
    console.log(contoArray);
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
            return `<option value=${item.name}>${item.name}</option>`
        })
        .join("");

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

function processRecords(indicator) {
    console.log(store.getState().application.contoArray) ;

    let DValues = 0;
    let KValues = 0;
    let isAsset = balanceformArray.find(item => item.name === indicator).type === "asset";
    console.log(balanceformArray.find(item => item.name === indicator));
    let id = balanceformArray.find(item => item.name === indicator).id
  //  console.log(id);
    let filteredContoArray = 
     store.getState().application.contoArray
    .filter(item => item.parentbalanceId === id )
    .map(item => item.conto);
    console.log(filteredContoArray);
Array.isArray(store.getState().application.recordsArray) && store.getState().application.recordsArray.forEach(el => {
        console.log(el.d , el.k);
            if (filteredContoArray.includes(el.d)) { 
                console.log(el.sum)
                DValues = DValues + parseFloat(el.sum)
            }
            if (filteredContoArray.includes(el.k)) { 
                console.log(el.sum)
                KValues = KValues + parseFloat(el.sum) }        
        
    }) 

    if (filteredContoArray.length > 0) {
        console.log(indicator)        
        console.log(DValues);
        console.log(KValues)
    }
   
 
    
    if (isAsset) { return DValues - KValues } else { return KValues - DValues }
}



function balanceMarkup() {

    

    let assetsMarkup = balanceformArray
        .filter(item => item.type === "asset")
        .map(item => {
            let sum = processRecords(item.name);
            if (sum === 0) { return ""}
            return `<div>${item.name} ${sum }</div>`
        })
        .join("");
    $("#assetsMarkup").innerHTML = assetsMarkup;


    let liabilitiesMarkup = balanceformArray
        .filter(item => item.type === "liability")
        .map(item => {
            let sum = processRecords(item.name);
            if (sum === 0) { return ""}
            return `<div>${item.name} ${sum }</div>`
        })
        .join("");
    $("#liabilitiesMarkup").innerHTML = liabilitiesMarkup;

    let equityMarkup = balanceformArray
        .filter(item => item.type === "equity")
        .map(item => {
            let sum = processRecords(item.name);
            if (sum === 0) { return ""}
            return `<div>${item.name} ${sum }</div>`
        })
        .join("");
    $("#equityMarkup").innerHTML = equityMarkup;

    let markup = `
    <div class="row">
                    <div class="col">
                        <div class="m-1 text-primary">Активы</div>
                        <div class="m-1" id="assetsMarkup">
                           ${assetsMarkup}
                        </div>
                    </div>
                    <div class="col">
                        <div class="m-1">Пассивы</div>
                        <div class="m-1 text-danger">Обязательства</div>
                        <div class="m-1" id="liabilitiesMarkup">
                            ${liabilitiesMarkup}
                        </div>
                        <div class="m-1 text-success">Собственные средства</div>
                        <div class="m-1" id="equityMarkup">
                            ${equityMarkup}
                        </div>
                    </div>
                </div>
    
    `


    // $("#balance").innerHTML = balanceformArray
    // .map(item => {
    //     return `<div>${item.name}</div>`
    // })
    // .join("");

return markup
}

function transactionsList() {
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
       <td>${!!item?.type ? item.type : ""}</td>
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
    $("#records").innerHTML = markup;
    return markup
}

function addNewRecord(e) {
    e.preventDefault();

    if ($("#ds").value.length > 1 &&
        $("#ks").value.length > 1 &&
        $("#sum").value.length > 1 &&
        $("#periods").value.length > 1 &&
        Array.isArray(store.getState().application.contoArray) &&
        store.getState().application.contoArray.length > 0
    )
     {
        console.log(store.getState().application.contoArray.find(item => $("#ds").value === item.id).conto);
        console.log(store.getState().application.contoArray.find(item => $("#ks").value === item.id).conto);

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
        console.log(record);
        // recordsArray = produce(recordsArray, draft => {
        //     draft.push(record)
        // });
        store.dispatch(addRecord(record));
        // console.log(recordsArray);
       
        $("#ds").value = "";
        $("#ks").value ="";
        $("#sum").value = "";
        $("#periods").value = "";
    }

    
    $("#balance").innerHTML = 
    "" + balanceMarkup() 

 
    balanceMarkup();
    transactionsList();
    $("#post").innerHTML = 
        "" + transactionsList() + ""
        + balanceMarkup() 
            
}

function setDedetDiscription(id) {
    let conto = contoUpdates.find(item => item.id === id);
   $("#debetDescription").innerHTML = `<span>${conto.name}</span> <br> <span>${conto.type}</span>`;
}

function setCreditDiscription(id) {
    let conto = contoUpdates.find(item => item.id === id);
    $("#creditDescription").innerHTML = `<span>${conto.name}</span> <br> <span>${conto.type}</span>`;
    
 }

 function doSavePost() {  
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
   
    // updates["usersCraft/" + userEmail + "/posts/" + idPost] = postObject;
    // updates["usersCraft/" + userEmail + "/data/" + mediaId] = { "html":  content };

    updates["usersCraft/" + userEmail + "/posts/" + id] = {...postObject, id: id, type: "html", content: content } ;
    updates["currentDay/" + currentDay + "/posts/" + id ] = currentDayObject;
   // updates["currentDay/" + currentDay + "/cases/" + postObject.idPost+"htmlversion" ] = currentDayObject;


    store.dispatch(api.endpoints.updatesForUserPosts.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
            console.log(res);
            store.dispatch(setPostId(id));
            store.dispatch(setMediaId(mediaId));
      //      setTimeout(()=>window.location.reload(), 5000)
                     
        }
        );   
 }

//  function balanceLocation(value) {
//     let balanceLoc = balanceformArray.find(item => item.name.includes(value));
//     console.log(balanceLoc.id);
//     return {
//         parentbalanceId:  balanceLoc.id,
//         type: balanceLoc.type,
//     } 
//  }

//  function addConto(e) {
//     e.preventDefault();
//     if (
//       !(store.getState().application.contoArray.map(item => item.conto).includes($("#conto").value))
//       && $("#conto").value.length > 3
//         && $("#name").value.length > 3
//      //   && $("#balancerecords").value.length > 3
//     ) {
//         let newconto = {
//             conto: $("#conto").value,
//             sortby: $("#conto").value,
//             type:balanceLocation($("#balancerecords").value).type,
//             name: $("#name").value,
//             add: true,
//             parentbalanceId: balanceLocation($("#balancerecords").value).parentbalanceId,
//             id: $("#conto").value
//         }
//      //   console.log(newconto);
//         store.dispatch(addContoToArray(newconto));
       
//         let updates = {};
//         updates["usersCraft/" + 
//          store.getState().application.userEmail + 
//             "/conto/" + newconto.id] = newconto;
//              store.dispatch(api.endpoints.updatesForUserPosts.initiate({
//              base: "",
//              updates: updates
//          }))
//              .then((res) => {
//                  console.log(res);
//                  getAllContoOptions(store.getState().application.contoArray); 
//              });
  
//     }
// }
 



/**
  * HTML event listeners
*/

$("#loginbutton").addEventListener("click", (e) => doLogin(e), false);
$("#addrecord").addEventListener("click", (e) => addNewRecord(e), false);

$("#ds").addEventListener("input", (e) => {setDedetDiscription(e.target.value)}, false);
$("#ks").addEventListener("input", (e) => {setCreditDiscription(e.target.value)}, false);
$("#savePost").addEventListener("click", (e) => doSavePost(e), false);
//$("#addconto").addEventListener("click", (e) => addConto(e), false);


/**
  * Initial load
*/



async function initialLoad() {


    let res = await getUser();
    if (!res) {
        $("#formcontainer").style.display = "block";
    } else {
        getAllContoOptions(contoUpdates);
        store.dispatch(fillContoArray(contoUpdates));
        resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(res.userEmail));
        store.dispatch(setUser(res));


        //  let unique = [...new Set(userPostsResp.map(item => item.type))];

 //       console.log(userContoResp);
        // contoUpdates.forEach(item => {
        //     contoArray = produce(contoArray, draft => {
        //         draft.push(item)
        //     });            
        // });
      
        let t = await timeout(2000, "Loaded");


        return t

    }
}

initialLoad().then(() => {
    console.log("simpleaccounting");
   
    transactionsList();
//    balanceMarkup();
  //  delContoMarkup();
});

// function delContoMarkup() {

//     console.log("del markup" + contoArray);
//     let markup = contoArray
//         .map(item => {
//             return `<button class="btn btn-sm btn-outline-danger delconto m-1" id=${item.id}>${item.conto} ${item.name} </button>`
//         })
//         .join("");
//     console.log("markup");
//     $("#delconto").innerHTML = "<div class='d-flex'>" + markup + "</div>";

//     [...$$(".delconto")].forEach(item => {
//         item.addEventListener("click", async e => {
//             if (userEmail.length > 5) {
//                 console.log(e.target.id);
//                 let updates = {};
//                 updates["usersCraft/" + userEmail + "/conto/" + e.target.id] = null;
//                 console.log(updates);
//                 let res = await updateNodes({ base: "", updates: updates })
//                 console.log(res);
//                 window.location.reload()
//             }

//         })
//     })

// }



        // console.log(
        //     userPostsResp.filter(item => item.type === "accountingwithprofitscash")
        // )       
        //   recordsArray = userPostsResp.filter(item => item.type === "accountingwithprofitscash")[0].content;
        //  console.log(recordsArray);
        //  let ds = [...new Set(recordsArray.map(item => item.d))];
        //  let ks = [...new Set(recordsArray.map(item => item.k))];
        //  let periods = ["2023", "2024", "2025", "2026", "2027"]; // [...new Set(recordsArray.map(item => item.period))];
        //  contoArray = [...new Set([...ds, ks])].map(item => { return { id: getFirebaseNodeKey("temp"), name: item } });
        //  console.log(contoArray);
        //        console.log(periods);


        // };

        // let userEmails = [
        //     "kolupaewa1969_gmail_com",
        //     "Scamum_mail_ru",
        //     "nastasya_sidorova_05_mail.ru",
        //     "klepcovaksenia298_gmail_com",
        //     "hhursashapow2321_gmail_com",
        //     "kitty_toxxx@mail_ru",
        //     "arjseok_list_ru",
        //     "johndoe_yandex_ru",
        //     "svetapogudina48_gmail_com",
        //     "6link_gmail_com",
        //     "kirilllarionov2005_gmail_com",
        //     "matvejskorodumov040_gmail.com",
        //     "danilshapran2005_gmail_com"

        // ];

        // let updates = {};

        // userEmails.forEach(userEmail => {
        //     updates["usersCraft/" + userEmail + "/conto/"] = contoUpdates
        // })

        // console.log(updates);
        // updateNodes({base: "", updates: updates})
        // .then(res => console.log(res))



