import { getApps, deleteApp, initializeApp } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';

//import timeout from "../../../utlities/timeout.js";
import loadState from '../../../utlities/loadState.js';
import saveState from '../../../utlities/saveState.js';
import createMinimalProtoArray from "../../../utlities/createMinimalProtoArray.js"
import makeInnerHTMLforContentArray from "../../../utlities/makeInnerHTMLforContentArray.js"

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
    currPage: 1,
    pageLength: 10,
    selectedQuizId: null,
    previousQuizId: null
}



const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {

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


        setAvatar: (state, action) => {
            state.avatarUrl = action.payload
        },






    }
})

// Action creators are generated for each case reducer function
const { setUser, setPreviousCurrentPage, setNextCurrentPage,
    setSelectedOption, setAvatar, setActivePage, setSelectedOptions, addCorrectQuiz, loadCorrectquizes
} = applicationSlice.actions


export default applicationSlice.reducer


const api = createApi({
    reducerPath: 'api',
    tagTypes: ["Media", "Avatar", "Post"],
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({

        fetchUserPosts: builder.query({
            async queryFn(userEmail) {
                //    console.log(userEmail)
                try {
                    let userPosts = await getFirebaseNode({ url: "usersCraft/" + userEmail + "/posts", type: "array" });
                    console.log([...new Set(userPosts.map(item => item.type))]);
                    return {
                        data: Array.isArray(userPosts) ?
                            //     userPosts.filter(item => item.type !== "multiplechoices" && item.type !== "spreadsheet")
                            userPosts.filter(item => item.type === "media" ||
                                item.type === "accountingwithprofitscash")
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

        // updatesForOpenQuizes: builder.mutation({
        //     async queryFn({ base = "", updates = { temp: "temp" }
        //     }) {
        //         let fireUpdates = {};
        //         Object.keys(updates).forEach(objKey => {
        //             fireUpdates[base + "/" + objKey] = updates[objKey]
        //         });
        //         //     console.log(fireUpdates);
        //         try { await updateFirebaseNode(fireUpdates) }
        //         catch (err) { console.log(err); return { error: err } }
        //         return { data: fireUpdates }
        //     },
        //     invalidatesTags: ["Answer"]
        // }),
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
let resUserPosts;
let resQuizesArray;
let resUserMediaData;

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

async function showMedia(post) {
    $("#quizcard").innerHTML = "<div class='p-5'>...</div>"
    resUserMediaData = await store.dispatch(api.endpoints.fetchUserMediaData.initiate(
        "usersCraft/" + store.getState().application.userEmail + "/data/" + post.content
    ));
    console.log(resUserMediaData.data);
    $("#quizcard").innerHTML = `
    <div class='container'>
        <div class='m-1 p-1'>${post.id}</div>
        <div class='m-1 p-1'>${post.type}</div>
        <div class='m-1 p-1'>${post.theme}</div>
        <div class='m-1 p-1'>${post.content}</div>        

        <div class='m-1 p-1'>
        ${Object.keys(resUserMediaData.data)
            .map(objKey => {
                return `<p class='m-1'>${objKey}</p>`
            })
            .join("")}
        .
        </div>
    </div>    
   `
    return resUserMediaData.data
}



function mediaTemplatesAccountingWithProfitsCash(
    records,
    mediaItems
) {
    console.log(records, mediaItems);

    $("#quizcard").innerHTML = Array.isArray(mediaItems) && mediaItems
        .map(item => {
            return `
        <div class='container'>
            <p>${item?.type || item?.mediaType}</p>
            <div class='m-1 p-1'>
            ${item?.type === "html" ? item.content : ""}  
            ${item?.mediaType === "spreadsheet"  ? 
                makeInnerHTMLforContentArray(createMinimalProtoArray(item?.content, 0, 0))
                : ""}                
            </div>
        </div>
        `
        })
        .join("")
}


function showPost(id) {
    let post = resUserPosts.data.find(item => item.id === id)
    console.log(post);
    if (post?.type === "media") {
        showMedia(post)
    }

    if (post?.type === "accountingwithprofitscash") {
        mediaTemplatesAccountingWithProfitsCash(post?.content, post?.mediaItems)
    }

    // else {
    //     $("#quizcard").innerHTML = `
    //     <div class='container'>
    //         <div class='m-1 p-1'>${post?.id}</div>
    //         <div class='m-1 p-1'>${post?.type}</div>
    //         <div class='m-1 p-1'>${post?.theme}</div>
    //     </div>    
    //     `
    // }
}





function makePaginationMarkup(items) {
    console.log("makePaginationMarkup");
    console.log(items);

    let markup = `
     <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" id='previouspage'>
            <span aria-hidden="true" >&laquo;</span>
        </a>
    </li>` +
        items
            .map((item) => {
                return `<li class="page-item"><a class="page-link" href="#" id='${item.id}' >${resUserPosts.data.findIndex(x => x.id === item.id) + 1
                    }</a></li>`
            })
            .join("") +
        `<li class="page-item">
        <a class="page-link" href="#" aria-label="Next" id='nextpage'>
            <span aria-hidden="true">&raquo;</span>
        </a>
    </li>
    `
    $("#quizpagination").innerHTML = markup;



    let pagesLi = [...$$(("a.page-link"))];

    $("#nextpage").addEventListener('click',
        (e) => {
            store.dispatch(setNextCurrentPage());
        })

    $("#previouspage").addEventListener('click',
        (e) => {
            store.dispatch(setPreviousCurrentPage());
        })

    console.log(pagesLi);
    for (var i = 0; i < pagesLi.length; i++) {
        pagesLi[i].addEventListener('click',
            (e) => {
                const id = e.target.id;
                console.log(id);
                if (!!id && id.length > 8) {
                    showPost(id)
                }

                //         store.dispatch(setSelectedQuizId(id));
                //         setTimeout(()=>setSelectedQuizId(id), 275)
                //                  //   console.log($this)
                //                  //   console.log($this.getAttribute("page"));

                //                     if (this.itemsPerPage === 1) {
                //                         this.callBack({ id: items[parseInt($this.getAttribute("page")) - 1].id });
                //                     } else {
                //                         const start = (currentPage - 1) * pageSize, end = currentPage * pageSize;
                //                         let filteredItems = [];
                //                         items.slice(start, end).forEach(el => {
                //                             filteredItems.push(el);
                //                         });
                //                         this.callBack({ startIndex, endIndex, filteredItems });
                //                     }



                //                     //      console.log($this);

                //                     // if ($this.classList.contains("list-group-item")) {
                //                     //     this.currPage = parseInt($this.getAttribute("page"))
                //                     //     //        console.log(this.currPage);
                //                     // }

                //                     // if ($this.classList.contains("next")) {
                //                     //   this.currPage += 1;
                //                     //   console.log(this.currPage);          
                //                     // }
                //                     // if ($this.classList.contains("prev")) {
                //                     //   this.currPage -= 1;
                //                     //   console.log(this.currPage);
                //                     // }

                //                     this.addEvents(items)
                //                     //   this.updateActiveButtonStates(items.length, e.target.id)
                //                     //   console.log(e.target.id)

            }, false);
        //       }
        //     }

    }


}






/**
  * HTML event listeners
*/

$("#loginbutton").addEventListener("click", (e) => doLogin(e), false);



/**
  * Initial load
*/


async function initialLoad() {

    let res = await getUser();

    if (!res) {
        $("#formcontainer").style.display = "block";
    } else {
        resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(res.userEmail));
        resUserAvatar = await store.dispatch(api.endpoints.fetchUserAvatar.initiate(res.userEmail))
        store.dispatch(setUser(res));
        return resUserAvatar

    }
}


initialLoad().then((res) => {
    console.log(res);
});

store.subscribe(() => {

    if (resUserPosts?.status === 'fulfilled') {
        makePaginationMarkup(resUserPosts.data.slice(
            10 * (store.getState().application.currPage - 1), 10 + 10 * (store.getState().application.currPage - 1)
        ));

        //     if (!!store.getState().application.selectedQuizId &&
        //     store.getState().application.previousQuizId !== store.getState().application.selectedQuizId
        // ) {
        //         showPost(resUserPosts.data.find(item => item.id === store.getState().application.selectedQuizId))
        //     } else {
        //         showPost(resUserPosts.data[0])
        //     }

    }

})