import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, get, update, push, child } from 'firebase/database';
//import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';
import loadState from "../../../utlities/loadState";
import saveState from "../../../utlities/saveState";




/**
  * Const and Selectors
*/

// let d = new Date();
// let currentDay = new Intl.DateTimeFormat("en", {
//     weekday: "short",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
// })
//     .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
//     .replace(/[^a-zA-Z0-9]/g, "_");

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);



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
//const auth = getAuth(app);




async function getFirebaseNode({
    url = "crafts/temp_gmail_com/posts/-Ml6DEjYhdnjuW6HiHB7",
    type = "array"
}) {
    try {
        let snapshot = await get(ref(db, url));
        if (snapshot.exists()) {
            let res = snapshot.val();
            console.log(res);
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

// async function doSignInWithEmailAndPassword(e) {
//     e.preventDefault();
//     let email = $("#emailInput")?.value;
//     let password = $("#userPass")?.value;
//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         console.log(userCredential);
//         return userCredential.user;
//     }
//     catch (error) {
//         console.error(error)
//         return null
//     }
// }


/**
* Store
*/

const initialState = {
    email: '',
    userEmail: "",
    user: '',
    avatarUrl: '',
    isLoading: true,

    postId: "temp",
    currPage: 1,
    pageLength: 10,
    mediaObject: null,
    mediaId: "temp"
}



const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
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
const { setUser, setNextCurrentPage, setPreviousCurrentPage, setPostId, setMedia,
    setMediaId
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
                            userPosts.filter(item => item.type === "media" || item.type === "accountingwithprofitscash")
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
let resUserMediaData;
//let resQuizesArray



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

function doDeletePost(e) {
    e.preventDefault();
    let userEmail = store.getState().application.userEmail;
    let idPost = store.getState().application.postId;
    let post = resUserPosts.data.find(item => item.id === idPost);
    store.dispatch(api.endpoints.deletePost.initiate({
        userEmail,
        id: idPost
    }))
        .then((res) => {
            store.dispatch(api.endpoints.deleteMedia.initiate({
                userEmail,
                id: post.content
            }))
                .then(() => {

                    console.log(res);
                    $("#postBody").innerHTML = "<div class='text-danger'>Deleted!</div>";

                    store.dispatch(api.util.updateQueryData("fetchUserPosts", userEmail,
                        (posts) => {
                            posts.filter(item => item.id !== idPost)
                        }
                    ))
                    renderPagination();
                    // dispatch(
                    //     api.util.updateQueryData('getPosts', undefined, (draftPosts) => {
                    //       draftPosts.push({ id: 1, name: 'Teddy' })
                    //     }),
                    //   )
                })
        });

}

async function showPost(id) {
    $("#newmediaform").style.display = "none";
    $("#deletePost").style.display = "none";
    $("#savePost").style.display = "none";
    $("#editPost").style.display = "block";

   
    let userEmail = store.getState().application.userEmail;
    let post = resUserPosts.data.find(item => item.id === id);
    console.log(post);
    $("#postHeader").innerHTML = "" + post.title + " (" + post.theme  + ")";
  

    if (post?.type === "media" && typeof post?.content === "string") {
        resUserMediaData = await store.dispatch(api.endpoints.fetchUserMediaData.initiate(
            "usersCraft/" + userEmail + "/data/" + post.content
        ));
        store.dispatch(setMedia(resUserMediaData.data));
        store.dispatch(setMediaId(post.content));
        if (!!resUserMediaData.data?.html) {
            $("#postBody").innerHTML = resUserMediaData.data.html;
        } else {
            $("#postBody").innerHTML = post.comment;
        }

        console.log(resUserMediaData.data);
    } else {

       

        let markup = !!post?.comment ? post?.comment : "";
        !!post?.mediaItems && post?.mediaItems.forEach(item => {
            if (item.type === "html") {
                markup += item.content
            }
        })
        $("#postBody").innerHTML = markup;


    }


    store.dispatch(setPostId(post.id));

    // $("#htmlcontent").value = !!resUserMediaData?.data?.html ?
    // resUserMediaData.data.html : "Content";
    // $("#mediatheme").value = post?.theme;
    // $("#mediatitle").value = post?.title;


    //     $("#quizcard").innerHTML = `
    //     <div class='container'>
    //         <div class='m-1 p-1'>${post.id}</div>
    //         <div class='m-1 p-1'>${post.type}</div>
    //         <div class='m-1 p-1'>${post.theme}</div>
    //         <div class='m-1 p-1'>${post.content}</div>        

    //         <div class='m-1 p-1'>
    //         ${Object.keys(resUserMediaData.data)
    //             .map(objKey => {
    //                 return `<p class='m-1'>${objKey}</p>`
    //             })
    //             .join("")}
    //         .
    //         </div>
    //     </div>    
    //    `


}

function renderPagination() {
    let currPage = store.getState().application.currPage;
    let pageLength = store.getState().application.pageLength;
    let items = resUserPosts.data.slice(
        pageLength * (currPage - 1), pageLength + pageLength * (currPage - 1)
    )
    //  console.log(items);
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
            renderPagination()
        })
    $("#previouspage").addEventListener('click',
        (e) => {
            store.dispatch(setPreviousCurrentPage());
            renderPagination()
        })
    //   console.log(pagesLi);
    for (var i = 0; i < pagesLi.length; i++) {
        pagesLi[i].addEventListener('click',
            (e) => {
                const id = e.target.id;
                //   console.log(id);
                if (!!id && id.length > 8) {
                    showPost(id)
                        .then(() => { $("#postContainer").style.display = "block"; })
                }

            }, false);
    }
}


function doSavePost() {
    let userEmail = store.getState().application.userEmail;
    let idPost = store.getState().application.postId;
    let post = resUserPosts.data.find(item => item.id === idPost);
    console.log(post);

    console.log(post);
    let postObject = {
        ...post,
        title: $("#mediatitle").value,
        theme: $("#mediatheme").value,
        date: new Intl.DateTimeFormat("ru", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        }).format(new Date()), //Date().toJSON()
    };



    let updates = {};
    let media = store.getState().application.mediaObject;
    let mediaId = store.getState().application.mediaId;
    console.log(media);
    updates["usersCraft/" + userEmail + "/posts/" + idPost] = { ...postObject, content: mediaId }
    updates["usersCraft/" + userEmail + "/data/" + mediaId] =
        { "html": $("#htmlcontent").value };


    store.dispatch(api.endpoints.updatesForUserPosts.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
            console.log(res)
        });

}



function doEditPost() {
    $("#deletePost").style.display = "block";
    $("#savePost").style.display = "block";
    $("#editPost").style.display = "none";
    let idPost = store.getState().application.postId;
    let post = resUserPosts.data.find(item => item.id === idPost);
    console.log(post);
    let media = store.getState().application.mediaObject;
    console.log(media);

    $("#htmlcontent").value = !!media?.html ? media?.html : "Content";
    $("#mediatheme").value = !!post?.theme ? post.theme : "Theme";
    $("#mediatitle").value = !!post?.title ? post.title : "Title";

    $("#newmediaform").style.display = "block";
}

function doCreateNewPost() {
    $("#quizpagination").innerHTML = "";

    $("#editPost").style.display = "none";
    $("#deletePost").style.display = "none";



    let userEmail = store.getState().application.userEmail;
    let avatarUrl = store.getState().application.avatarUrl;
    let user = store.getState().application.user;
    let email = store.getState().application.email;
    let mediaId = getFirebaseNodeKey("usersCraft/" + userEmail + "/data/");
    let idPost = getFirebaseNodeKey("usersCraft/" + userEmail + "/posts/");

    let postObject = {
        id: idPost,
        title: "Title",
        theme: "Theme",
        answer: "",
        comment: "",
        type: "media",
        content: mediaId,
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

    let updates = {};
    let media = store.getState().application.mediaObject;
    console.log(media);
    updates["usersCraft/" + userEmail + "/posts/" + idPost] = postObject
    updates["usersCraft/" + userEmail + "/data/" + mediaId] = { "html": "content" };


    store.dispatch(api.endpoints.updatesForUserPosts.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
            window.location.reload();
            // console.log(res);
            // store.dispatch(setPostId(idPost));
            // store.dispatch(setMediaId(mediaId));
            // store.dispatch(setMedia({ html: "content" }));
        
            // $("#postHeader").innerHTML = "Новый Post";
            // $("#postBody").innerHTML = "";
            // renderPagination();
            // doEditPost()
        }
        );



    // store.dispatch(api.util.updateQueryData(
    //     "fetchUserPosts", userEmail, (posts) => {
    //         posts.push(postObject)
    //     }
    // ))

    // store.dispatch(api.util.upsertQueryData(
    //     "fetchUserMediaData", "usersCraft/" + userEmail + "/data/" + mediaId, { html: "content" }
    // ))

}




// HTML event listeners
// $("#loginbutton").addEventListener("click", (e) => doSignInWithEmailAndPassword(e), false);
$("#loginbutton").addEventListener("click", (e) => doLogin(e), false);
$("#deletePost").addEventListener("click", (e) => doDeletePost(e), false);
$("#editPost").addEventListener("click", (e) => doEditPost(e), false);
$("#savePost").addEventListener("click", (e) => doSavePost(e), false);
$("#newMediaPost").addEventListener("click", (e) => doCreateNewPost("media"), false);


// async function initialLoad(userEmail) {
//     resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(userEmail));

//     let types = [...new Set(resUserPosts.data.map(item => item.type))];
//     console.log(types);
//     console.log(resUserPosts.data.filter(item => item.type === "accountingwithprofitscash"));

//     let newPosts = [{
//         id: "creditacc1",
//         type: "accountingwithprofitscash",
//         content: [
//             { d: "Дебиторская задолженность", k: "Уставный капитал", period: "2025", sum: "5000" },
//             { d: "Деньги", k: "Дебиторская задолженность", period: "2025", sum: "4800", type: "Поступления по финансовой деятельности" },
//             { d: "Основные средства", k: "Кредиторская задолженность", period: "2025", sum: "10000" }
//         ],
//         answer: "Операции и прогнозная отчетность",
//         avatarUrl: "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxODU2NzR8MHwxfHNlYXJjaHwyMHx8c21pbGV8ZW58MHx8fHwxNjI0MTIzNTAw&ixlib=rb-1.2.1&q=80&w=200",
//         comment: "<h1 id=\"\">Основные средства</h1>\n<p>СПИ 20 лет<br>\nАмортизация 10000/20=500 в год</p>\n<h1 id=\"-1\">Эффективность проекта с точки зрения учредителя</h1>\n<p>Эффективность проекта с точки зрения учредителя IRR 19.4%<br>\nNPV 1429 д.е. относительно 7%</p>\n<h1 id=\"-2\">Эффективность проекта самого по себе</h1>\n<p>IRR 31.4%<br>\nNPV 6464 д.е. относительно 7%</p>",
//         date: "вс, 03 ноября 2024 г., 22:28",
//         deleted: false,
//         email: "nick.golovenkin@yandex.ru",
//         mediaItems: [
//             {
//                 "comment": "Таблица ЭМО-9",
//                 "content": "<p>\n    <b>Таблица в ЭМО-9</b>\n</p>\n<table class=\"table table-sm\">\n    <thead>\n        <tr>\n            <th>G</th>\n            <th>J</th>\n            <th>K</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr>\n            <td>k</td>\n            <td>1</td>\n            <td>2</td>\n        </tr>\n        <tr>\n            <td>n</td>\n            <td>2</td>\n            <td>3</td>\n        </tr>\n    </tbody>\n</table>\n<p>Список</p>\n<ul>\n    <li>Один</li>\n    <li>Два</li>\n    <li>Три</li>\n</ul>",
//                 "type": "html"
//             }
//         ],
//         theme: "Банк",
//         title: "Учет в кредитных организацияx",
//         user: "Д.А. Головенкин"
//     }]

//     let updates = {};
//     newPosts.forEach(item => {
//         updates[item.id] = item
//     })

//     console.log(updates)

//     store.dispatch(api.endpoints.updatesForOpenQuizes.initiate({
//         base: "usersCraft/" + userEmail + "/posts",
//         updates: updates
//     }))
//         .then((res) => console.log(res));

//     return resUserPosts.status === "fulfilled" // && resOpenQuizesArray.status === "fulfilled"
//         ? true : false
// }

async function initialLoad() {

    let res = await getUser();
    if (!res) {
        $("#formcontainer").style.display = "block";
    } else {
        resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(res.userEmail));
        

        store.dispatch(setUser(res));

        //         let newPosts = [{
        //     id: "temp",
        //     type: "accountingwithprofitscash",
        //     content: "",
        //     answer: "Операции и прогнозная отчетность",
        //     avatarUrl: "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxODU2NzR8MHwxfHNlYXJjaHwyMHx8c21pbGV8ZW58MHx8fHwxNjI0MTIzNTAw&ixlib=rb-1.2.1&q=80&w=200",
        //     comment: "<h1 id=\"\">Основные средства</h1>\n<p>СПИ 20 лет<br>\nАмортизация 10000/20=500 в год</p>\n<h1 id=\"-1\">Эффективность проекта с точки зрения учредителя</h1>\n<p>Эффективность проекта с точки зрения учредителя IRR 19.4%<br>\nNPV 1429 д.е. относительно 7%</p>\n<h1 id=\"-2\">Эффективность проекта самого по себе</h1>\n<p>IRR 31.4%<br>\nNPV 6464 д.е. относительно 7%</p>",
        //     date: "чт, 14 ноября 2024 г., 09:56",
        //     deleted: false,
        //     email: "nick.golovenkin@yandex.ru",
        //     mediaItems: [
        //         {
        //             "comment": "Таблица ЭМО-9",
        //             "content": "<p>\n    <b>Таблица в ЭМО-9</b>\n</p>\n<table class=\"table table-sm\">\n    <thead>\n        <tr>\n            <th>G</th>\n            <th>J</th>\n            <th>K</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr>\n            <td>k</td>\n            <td>1</td>\n            <td>2</td>\n        </tr>\n        <tr>\n            <td>n</td>\n            <td>2</td>\n            <td>3</td>\n        </tr>\n    </tbody>\n</table>\n<p>Список</p>\n<ul>\n    <li>Один</li>\n    <li>Два</li>\n    <li>Три</li>\n</ul>",
        //             "type": "html",
        //             "mediaType": "html",
        //         }
        //     ],
        //     theme: "Temp",
        //     title: "Temp",
        //     user: "Д.А. Головенкин"
        // }]

        //          let newPosts = [
        //             {id: "-OBdcFbzXd_ZNaZqJ2Q7"},        
        //         ]

        // let updates = {};
        // newPosts.forEach(item => {
        //     updates[item.id] = null
        // })

        // console.log(updates)

        // store.dispatch(api.endpoints.updatesForUserPosts.initiate({
        //     base: "usersCraft/" + res.userEmail + "/posts",
        //     updates: updates
        // }))
        //     .then((res) => console.log(res));

        return resUserPosts.status === "fulfilled" // && resOpenQuizesArray.status === "fulfilled"
            ? true : false
    }
}


initialLoad().then(() => {
    $("#loadimage").style.display = "none";
    renderPagination()

});


// onAuthStateChanged(auth, function (user) {
//     console.log("mybook");
//     if (user) {
//         console.log(user);

//         initialLoad(user.email.replace(/[^a-zA-Z0-9]/g, "_")).then(() => {
//             store.dispatch(setLoading());
//             $("#loading").style.display = "none";
//         });

//     } else {
//         $("#authblock").style.display = "block";
//     }

// });

//store.subscribe(() => { console.log(store.getState())})

