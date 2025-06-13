import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';
import { createSlice, configureStore, nanoid } from '@reduxjs/toolkit';

import { initializeApp } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';

//import timeout from "../../utlities/timeout.js";
import loadState from '../../utlities/loadState.js';
import saveState from '../../utlities/saveState.js';
//import firebaseConfig from '../config.js';

import createMinimalProtoArray from '../../utlities/createMinimalProtoArray.js';
import makeDomNodeForSpreadsheet from '../../utlities/makeDomNodeForSpreadsheet.js';



/**
  * Const and Selectors
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);




/**
  * Firebase
*/

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
            if (type === "array") { return Object.keys(res).map(objKey => { return { id: objKey, ...res[objKey] } }) }
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
        // let res = await timeout(3000);
        //  console.log(updates);
        await update(ref(db), updates);
        return updates;
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

    email: '',
    userEmail: "",
    user: '',
    avatarUrl: '',

    activePostId: null,
    previousPostId: null,

    activePage: null,
    previousPage: null,

    startIndex: 0,
    endIndex: 10,

    pageLength: 10

}



const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {

        setPageLength: (state, action) => {
            state.pageLength = action.payload;
            state.endIndex = action.payload;
        },


        setActivePage: (state, action) => {
            state.previousPage = state.activePage;
            state.activePage = action.payload;
            state.startIndex = (action.payload - 1) * state.pageLength;
            state.endIndex = action.payload * state.pageLength;
            state.previousPostId = null
            state.activePostId = null;
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

        setSelectedPostId: (state, action) => {
            state.previousPostId = state.activePostId;
            state.activePostId = action.payload;
        },

        closePost: (state) => {
            state.previousPostId = null
            state.activePostId = null;
        },

    }
})

// Action creators are generated for each case reducer function
const { setSelectedPostId, closePost, setUser, setAvatar, setActivePage, setPageLength

} = applicationSlice.actions


export default applicationSlice.reducer


const api = createApi({
    reducerPath: 'api',
    tagTypes: ["Post", "Avatar"],
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({

        fetchUserPosts: builder.query({
            async queryFn(userEmail) {
                try {
                    let list = await getFirebaseNode({ url: "usersCraft/" + userEmail + "/posts", type: "array" });
                    return { data: list }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "Post", id }]
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
            invalidatesTags: ["Post"]
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



let resUserPosts;
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


async function postsLayout() {

    let { startIndex, endIndex } = store.getState().application;
  //  console.log(startIndex, endIndex);

    // let { data: posts } = resUserPosts;
    // let ids = store.getState().application.filteredItems.map(item => item.id);
    // let pagePosts = posts.filter(item => ids.includes(item.id))

    let pagePosts = resUserPosts.data.filter((item, index) => index >= startIndex && index <= endIndex)

    let postsHTML = pagePosts
        .map((item) => {
            return `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <span class="task-text">${item.title}</span>
                    <div class="btn-group">
                        <button class="btn btn-outline-primary btn-sm edit-post-btn" id="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16" >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                        </button>
                    </div>`;
        }).join("");
    $('#notes').innerHTML = postsHTML;

    let postsEditButtons = [...$$('.edit-post-btn')];

    postsEditButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            $('#notes').innerHTML = "";
            let id = event.currentTarget.id;
            store.dispatch(setSelectedPostId(id));
            setTimeout(() => store.dispatch(setSelectedPostId(id)), 275);
            // console.log(event.currentTarget);
        }, false);
    })

}



function deletePost(idPost) {
    let { userEmail } = store.getState().application;
    let updates = {};
    updates["usersCraft/" + userEmail + "/posts/" + idPost] = null;
   // console.log(updates);

    store.dispatch(api.endpoints.updatesForUserPosts.initiate({
        base: "",
        updates: updates
    }))
        .then(() => store.dispatch(closePost()));
}



function showPost() {
    let post = resUserPosts.data.find(item => item.id === store.getState().application.activePostId);
  //  console.log(post);
    $('#notes').innerHTML = `
    <div class="card m-1" style="min-width: 800px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="https://images.unsplash.com/photo-1726007403882-e8f76fe5dc07?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
       class="img-fluid rounded-start" alt="card image"
       style="objectFit: contain;"
       >
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${post?.title}</h5>
        <p class="card-text">
        <small class="text-muted">${post?.theme}</small>
        </p>
        <p class="card-text">${!!post?.quizString? post.quizString : ""}</p>

        <p class="card-text">${!!post?.answer ? post.answer : ""}</p>

        <div id="content"></div>
        <div>
            <button type="button" class="btn btn-outline-secondary btn-sm" id="closepost">Back</button>
            <button type="button" class="btn btn-outline-primary btn-sm" id="editpost">Edit</button>
            <button type="button" class="btn btn-outline-danger btn-sm" id="delpost">Del</button>
        </div>
      </div>
    </div>
  </div>
</div>`;

    if (post.type === "spreadsheet" && typeof post?.content === "object") {
        document.getElementById("content")
            .appendChild(makeDomNodeForSpreadsheet(createMinimalProtoArray(post?.content, 0, 0)));
    }

    $('#closepost').addEventListener('click', () => {
        $('#notes').innerHTML = "";
        store.dispatch(closePost())
    }, false);

    $('#delpost').addEventListener('click', () => {
     //   console.log("Deleting");
        console.log(post);
        //  $('#notes').innerHTML = "";
        deletePost(post.id)
        //  store.dispatch(closePost({ pagerType: "ShowId", value: nanoid() }))
    }, false);

    $('#editpost').addEventListener('click', () => {
   //     console.log("Edit post")
        $('#notes').innerHTML = "";
        store.dispatch(closePost())
    }, false);
}


function renderPagination() {
    let currentPage = store.getState().application.activePage;
    let pageLength = store.getState().application.pageLength;

    let numberOfPages = Math.ceil(resUserPosts.data.length / pageLength);
    let mypaginationHTML =
        Array.from({ length: numberOfPages }, (v, i) => i + 1).map(item => { return { id: item, label: item } })
            // [{ id: 1, label: 1 }, { id: 2, label: 2 }, { id: 3, label: 3 }, { id: 4, label: 4 }]
            .map((item, index) => {
                return `
           <li class='${item.id === currentPage ? "page-item page active" : "page-item page"}'>
            <a class="page-link" page=${item.id}>
            ${item.label}
            </a>
           </li>`
            }).join("");
    $("#notespagination").innerHTML = mypaginationHTML;

    let pagesLi = [...$$(".page")];
    pagesLi.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
       //     console.log(event.target)
            const pageNumber = parseInt(event.target.getAttribute("page"));
            store.dispatch(setActivePage(pageNumber));
            renderPagination()
        }, false);
    })

    // for (var i = 0; i < pagesLi.length; i++) {
    //     pagesLi[i].addEventListener('click',

    //         (e) => {
    //             const $this = e.target;
    //             //    console.log(parseInt($this.getAttribute("page")));

    //             if (this.itemsPerPage === 1) {
    //                 this.callBack({ id: items[parseInt($this.getAttribute("page")) - 1].id });
    //             } else {
    //                 const start = (currentPage - 1) * pageSize, end = currentPage * pageSize;
    //                 let filteredItems = [];
    //                 items.slice(start, end).forEach(el => {
    //                     filteredItems.push(el);
    //                 });
    //                 this.callBack({ startIndex, endIndex, filteredItems });
    //             }



    //             //      console.log($this);

    //             if ($this.classList.contains("page-link")) {
    //                 this.currPage = parseInt($this.getAttribute("page"))
    //                 //        console.log(this.currPage);
    //             }

    //             // if ($this.classList.contains("next")) {
    //             //   this.currPage += 1;
    //             //   console.log(this.currPage);          
    //             // }
    //             // if ($this.classList.contains("prev")) {
    //             //   this.currPage -= 1;
    //             //   console.log(this.currPage);
    //             // }

    //             this.addEvents(items)
    //             //   this.updateActiveButtonStates(items.length, e.target.id)
    //             //   console.log(e.target.id)

    //         }, false);
    // }
}



/**
  * HTML event listeners
*/
$("#loginbutton").addEventListener("click", (e) => doLogin(e), false);
//const ecomolabsPaginationTasks = new EcomolabsPagination('notespagination', 10, 9, selectNotesPage);

/**
  * Initial load
*/





async function initialLoad() {

    let res = await getUser();
    if (!res) {
        $("#formcontainer").style.display = "block";
    } else {
        resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(res.userEmail));
        let pageLength = resUserPosts.data.length < 100 ? 10 : Math.ceil(resUserPosts.data.length / 10);
        store.dispatch(setPageLength(pageLength));
      
        resUserAvatar = await store.dispatch(api.endpoints.fetchUserAvatar.initiate(res.userEmail));
        if (!!resUserAvatar.data?.avatarUrl) {
            //        console.log(resUserAvatar.data?.avatarUrl);
            store.dispatch(setAvatar(resUserAvatar.data?.avatarUrl));
        } else {
            store.dispatch(setAvatar(
                'https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop'
            ));
        }
        store.dispatch(setUser(res));

        store.dispatch(setActivePage(1));
        setTimeout(() => store.dispatch(store.dispatch(setActivePage(1))), 275);

        renderPagination()
        postsLayout();

        // let updates = {
        //     ["usersCraft/" + res?.userEmail + "/posts/-O8hEugIb31QCVbGJVSC"]: null,
        //     ["usersCraft/" + res?.userEmail + "/posts/-O8hIdM9p8uaiTM7BeWA"]: null
        // };

        // console.log(updates);

        // store.dispatch(api.endpoints.updatesForUserPosts.initiate({
        //     base: "",
        //     updates: updates
        // }))
        //     .then((res) => console.log(res));
    }


    return res
}

initialLoad().then(res => { console.log("Loaded") });






store.subscribe(() => {
    //    console.log(store.getState());

    if (store.getState().application.activePostId !== store.getState().application.previousPostId) {
        showPost();
    }

    if (!!resUserPosts?.isSuccess
        && (store.getState().application.activePage !== store.getState().application.previousPage
            && !store.getState().application.activePostId
        )) {

        postsLayout()
    }

})
