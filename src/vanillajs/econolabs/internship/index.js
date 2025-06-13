import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';


/**
  * Const and Selectors
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
//let apexchart = null;
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

async function doSignInWithEmailAndPassword(email, password) {
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
    currentDay: null,
    openavatars: null,
    selectedUserEmail: "temp_yandex_ru",
    selectedGroup: "kb"
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
        setSelectedUserEmail: (state, action) => {
            state.selectedUserEmail = action.payload
        },
        setSelectedGroup: (state, action) => {
            state.selectedGroup = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
const { setCurrentDate, setSelectedUserEmail, setSelectedGroup
    //  setOpenAvatars
} = applicationSlice.actions


export default applicationSlice.reducer


const api = createApi({
    reducerPath: 'api',
    tagTypes: ["OpenAvatar", "QuizCase", "UserPost", "OpenGroup", "OpenGroupPost"],
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({

        fetchOpenGroupPosts: builder.query({
            async queryFn(group) {
                //    console.log(userEmail)
                try {
                    let openGroupPosts = await getFirebaseNode({ url: "opengroups/" + group + "/posts", type: "array" });
                    //   console.log(userPosts);
                    return { data: Array.isArray(openGroupPosts) ? openGroupPosts : [] } //Array.isArray(openGroups)
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "OpenGroupPost", id }]
        }),


        fetchOpenGroups: builder.query({
            async queryFn() {
                //    console.log(userEmail)
                try {
                    let openGroups = await getFirebaseNode({ url: "opengroups", type: "object" });
                    //   console.log(userPosts);
                    return { data: !!openGroups ? openGroups : [] } //Array.isArray(openGroups)
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "OpenGroup", id }]
        }),

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
            providesTags: (result, error, id) => [{ type: "UserPost", id }]
        }),

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

        fetchOpenAvatars: builder.query({
            async queryFn(url = "johndoe_gmail_com") {
                try {
                    let list = await getFirebaseNode({ url: "openavatars", type: "array" });
                    //     console.log(list)
                    return { data: list }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "OpenAvatar", id }]
        }),

        fetchUserPost: builder.query({
            async queryFn({ userEmail, id }) {
                try {
                    let post = await getFirebaseNode(
                        { url: "usersCraft/" + userEmail + "/posts/" + id, type: "object" }
                    );
                    return { data: post }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "UserPost", id }]
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

        // updatesForCurrentQuizes: builder.mutation({
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
        //     invalidatesTags: ["CurrentQuiz"]
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


let resQuizesCasesByDate;
let resOpenAvatar;
let resOpenAvatars;
let resUserPost;
let resUserPosts;
let resOpenGroups;
let resOpenGroupPosts;


/**
  * Functions
*/

async function getAvatar(userEmail) {
    resOpenAvatar = await store.dispatch(api.endpoints.fetchOpenAvatar.initiate(userEmail))
    return !!resOpenAvatar.data ? resOpenAvatar.data : null;
}

function doAuthUser(e) {
    e.preventDefault();
    console.log("Do Auth");
    let formData = new FormData($("#authform"));
    let res = {};
    for (const [key, value] of formData) {
        res[key] = value
    }
    console.log(res);
    doSignInWithEmailAndPassword(res.emailInput, passwordInput)
        .then(res => {
            console.log(res);
            setTimeout(() => window.location.reload(), 4000)
        })
}

async function getUserPost(userEmail, id) {
    resUserPost = await store.dispatch(api.endpoints.fetchUserPost.initiate({ userEmail, id }))
    return !!resUserPost.data ? resUserPost.data : null;
}

function showUserPosts(userEmail) {
    $("#avatarscards").innerHTML = "";
    let userPosts = [];
    let userPostsArray = resQuizesCasesByDate.data
        .filter(item => !!item?.email &&
            item.email.replace(/[^a-zA-Z0-9]/g, "_") === userEmail);


    Promise.all(userPostsArray
        .map(postSummary => { return getUserPost(userEmail, postSummary.id) }))
        .then(values => {
            values.forEach((result) =>
                userPosts.push(result)
            )
        })


    console.log(userPosts);
    setTimeout(() => {
        let target = [...$$("#list-tab a")]
            .find(item => item.id === "list-userposts-list");
        console.log(target)
        let tab = new bootstrap.Tab(target);
        tab.show();
    }, 275)
    //    console.log(updatedopenavatars);

    // $("#avatarscards").innerHTML =
    //     Object.keys(updatedopenavatars)
    //         .map(objKey => {})
    //         .map(item => {
    //         //    console.log(item);
    //             getUserPost(userEmail, item.id)
    //                 .then(post => {
    //                    console.log(post);
    //                     return `
    //             <form>
    //                 <div class="form-text">
    //                     ${post?.type === "html" ?
    //                             post?.content
    //                             : ""}
    //                 </div>
    //                 <button type="submit" class="btn btn-sm btn-primary">Сохранить</button>
    //             </form>
    //     ` })
    //         });
    //  console.log(userPostsArray);
    //  $("#userposts").innerHTML =  userPostsArray.join("");     

}

async function doSelectDate(e) {
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
    resQuizesCasesByDate = await store.dispatch(api.endpoints.fetchQuizesCasesByDate.initiate("/currentDay/" + currentDay + "/"));
    store.dispatch(setCurrentDate(currentDay))
    console.log(currentDay);

}



function renderCurrentDayPosts() {
    let postsArray = Array.isArray(resQuizesCasesByDate?.data) ? resQuizesCasesByDate.data : [];
    let uniqueEmails = [...new Set(postsArray.map(item => item?.email))];
    let updatedopenavatars = {};
    Promise.all(uniqueEmails.map(email => {
        return getAvatar(email.replace(/[^a-zA-Z0-9]/g, "_"))
    }))
        .then(values => {
            values.forEach((result, index) =>
                updatedopenavatars[uniqueEmails[index].replace(/[^a-zA-Z0-9]/g, "_")] = result
            )
            $("#avatarscards").innerHTML =
                "<div class='row row-cols-1 row-cols-md-2 row-cols-xl-4 g-2'>" +

                Object.keys(updatedopenavatars)
                    .map(objKey => {
                        console.log(objKey);
                        let avatarImg = !!updatedopenavatars[objKey]?.avatarUrl ?
                            updatedopenavatars[objKey].avatarUrl :
                            "../freelancer.jpg";
                        let user = !!updatedopenavatars[objKey]?.user ?
                            updatedopenavatars[objKey].user :
                            objKey;
                        let group = !!updatedopenavatars[objKey]?.group ?
                            updatedopenavatars[objKey].group :
                            "...";

                        let length = postsArray
                            .filter(item => !!item?.email &&
                                item.email.replace(/[^a-zA-Z0-9]/g, "_") === objKey)
                            .length;
                        console.log(length);

                        return `
                        <div class="col">
                <div class="card" style="max-height: fit-content;">
                    <div class="row g-0">
                        <div class="col-md-4">
                        <img src="${avatarImg}"
                         class="img-fluid rounded-start" alt="${objKey}">
                         <p class="card-text p-2"><small class="text-muted">${group}</small></p>
                        </div>
                        <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${user + " " + length}</h5>
                            <button class="btn btn-sm btn-outline-secondary userdetails"
                            id=${objKey}>
                                Подробнее
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
                </div>
 
                `
                    }).join("") + "</div>";

            let userDetailsButtons = [...$$('.userdetails')];
            userDetailsButtons.forEach(function (btn) {
                btn.addEventListener('click', function (event) {
                    console.log(event);
                    showUserPosts(event.target.id)
                }, false);
            })
        });

}

function renderCurrentDayGroups() {
    let postsArray = Array.isArray(resQuizesCasesByDate?.data) ? resQuizesCasesByDate.data : [];
    let uniqueEmails = [...new Set(postsArray.map(item => item?.email))];
    let updatedopenavatars = {};
    Promise.all(uniqueEmails.map(email => {
        return getAvatar(email.replace(/[^a-zA-Z0-9]/g, "_"))
    }))
        .then(values => {
            values.forEach((result, index) =>
                updatedopenavatars[uniqueEmails[index].replace(/[^a-zA-Z0-9]/g, "_")] = result
            )
            $("#list-currentdaygroups").innerHTML =
                "<div class='row row-cols-1 row-cols-md-2 g-4'>" +

                Object.keys(updatedopenavatars)
                    .map(objKey => {
                        console.log(objKey);
                        let avatarImg = !!updatedopenavatars[objKey]?.avatarUrl ?
                            updatedopenavatars[objKey].avatarUrl :
                            "../freelancer.jpg";
                        let user = !!updatedopenavatars[objKey]?.user ?
                            updatedopenavatars[objKey].user :
                            objKey;
                        let group = !!updatedopenavatars[objKey]?.group ?
                            updatedopenavatars[objKey].group :
                            "...";

                        let length = postsArray
                            .filter(item => !!item?.email &&
                                item.email.replace(/[^a-zA-Z0-9]/g, "_") === objKey)
                            .length;
                        console.log(length);

                        return `
                        <div class="col">
                <div class="card" style="max-height: fit-content;">
                    <div class="row g-0">
                        <div class="col-md-4">
                        <img src="${avatarImg}"
                         class="img-fluid rounded-start" alt="${objKey}">
                         <p class="card-text p-2"><small class="text-muted">${group}</small></p>
                        </div>
                        <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${user + " " + length}</h5>
                            <button class="btn btn-sm btn-outline-secondary userdetails"
                            id=${objKey}>
                                Подробнее
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
                </div>
 
                `
                    }).join("") + "</div>";

            let userDetailsButtons = [...$$('.userdetails')];
            userDetailsButtons.forEach(function (btn) {
                btn.addEventListener('click', function (event) {
                    console.log(event);
                    store.dispatch(setSelectedUserEmail(event.target.id));
                    showUserPosts(event.target.id);
                }, false);
            })
        });
}


async function renderUserPosts(userEmail) {
    resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(userEmail));
    console.log(resUserPosts.res);
}

function showGroupUsers(e) {
    e.preventDefault();
    console.log($("#groupselect").value);
    store.dispatch(setSelectedGroup($("#groupselect").value));
    let allGroups = [...new Set(
        resOpenAvatars.data.filter(item => !!item?.group && item.group === $("#groupselect").value)
    )];
    console.log(allGroups);
}




function renderAllGroups() {
    let allGroups = [...new Set(
        resOpenAvatars.data.map(item => item.group).filter(item => !!item && item.length > 0)
    )];
    console.log(allGroups);

    let optionsMarkup = allGroups
        .map(group => {
            return `<option value="${group}">${group}</option>`
        })
        .join("");
    console.log(optionsMarkup);

    $("#groupselect").innerHTML = optionsMarkup;
}

async function renderGroupPosts() {
    console.log("list-groupposts-list");
    let group = store.getState().application.selectedGroup;
    resOpenGroupPosts = await store.dispatch(api.endpoints.fetchOpenGroupPosts.initiate(group));
   $("#list-groupposts").innerHTML = `<div>${resOpenGroupPosts.data.length}</div>`    
}




function renderTabContent(tabTrigger) {
    $("#list-currentdaygroups").innerHTML = "";
    //  $("#list-currentdayposts").innerHTML = "";
    $("#list-userposts").innerHTML = "";
    $("#avatarscards").innerHTML = "";
    $("#userposts").innerHTML = "";
    //  console.log(tabTrigger);
    console.log(tabTrigger._element.id);
    if (tabTrigger._element.id === "list-currentdaygroups-list") {
        renderCurrentDayGroups()
    }
    if (tabTrigger._element.id === "list-currentdayposts-list") {
        renderCurrentDayPosts()
    }
    if (tabTrigger._element.id === "list-userposts-list") {
        renderUserPosts()
    }

    if (tabTrigger._element.id === "list-group-list") {
        renderAllGroups()
    }
    if (tabTrigger._element.id === "list-groupposts-list") {
        renderGroupPosts()
    }
}


function doSaveContentForStudentGroup(e) {
    e.preventDefault();
    let formData = new FormData($("#saveposttogroup"));
    let res = {};
    for (const [key, value] of formData) {
        res[key] = value
    }
   console.log(res);

   let formObject = {
    
        // "postId": "fdgfdg",
        // "postTheme": "fdgdgf",
        // "postTitle": "dfgdgf",
        // "postComment": "dfgdgf",
        // "contentforstudentgroup": "dfgdgf"
    
    
}



    // let userEmail = store.getState().application.userEmail;
    // let avatarUrl = store.getState().application.avatarUrl;
    // let user = store.getState().application.user;
    // let email = store.getState().application.email;
    // let mediaId = !!store.getState().application.mediaId ?
    //     !!store.getState().application.mediaId :
    //     getFirebaseNodeKey("usersCraft/" + userEmail + "/data/");
    // let id =
    //     !!store.getState().application.postId ? store.getState().application.postId :
    //         getFirebaseNodeKey("usersCraft/" + userEmail + "/posts/");

    // let postObject = {
    //     id: id,
    //     title: "Кейс по учету операций в банке " + (resUserPosts.data.length + 1),
    //     theme: "Кейс по учету операций в банке",
    //     answer: "",
    //     comment: "Проводки",
    //     type: "media",
    //     //  content: mediaId,
    //     quizString: "",
    //     deleted: false,
    //     email: email,
    //     user: user,
    //     avatarUrl: avatarUrl,
    //     date: new Intl.DateTimeFormat("ru", {
    //         weekday: "short",
    //         year: "numeric",
    //         month: "short",
    //         day: "numeric",
    //         hour: "numeric",
    //         minute: "numeric",
    //     }).format(new Date()), //Date().toJSON()
    // };

    // let currentDay = new Intl.DateTimeFormat("en", {
    //     weekday: "short",
    //     year: "numeric",
    //     month: "short",
    //     day: "numeric",
    // })
    //     .format(new Date())
    //     .replace(/[^a-zA-Z0-9]/g, "_");

    // let currentDayObject = {
    //     id: id,
    //     title: postObject.title,
    //     theme: postObject.theme,
    //     email: postObject.email,
    //     user: postObject.user,
    //     type: "html",
    //     avatarUrl: postObject.avatarUrl,
    //     timestamp: +Date.now(),
    // };

    // let updates = {};
    // updates["usersCraft/" + userEmail + "/posts/" + id] = { ...postObject, id: id, type: "html", content: content };
    // updates["currentDay/" + currentDay + "/posts/" + id] = currentDayObject;
    // store.dispatch(api.endpoints.updatesForUserPosts.initiate({
    //     base: "",
    //     updates: updates
    // }))
    //     .then((res) => {
    //         //      console.log(res);
    //         store.dispatch(setPostId(id));
    //         store.dispatch(setMediaId(mediaId));
    //     });


}

async function initialLoad() {
    console.log("internship");
    resOpenAvatars = await store.dispatch(api.endpoints.fetchOpenAvatars.initiate())
    resOpenGroups = await store.dispatch(api.endpoints.fetchOpenGroups.initiate())
    console.log(resOpenGroups.data)
};


/**
  * HTML event listeners
*/

$("#selectedDate").addEventListener("change", doSelectDate, false);
$("#groupselect").addEventListener("change", (e) => showGroupUsers(e), false);

$("#authformbutton").addEventListener("click", (e) => doAuthUser(e), false);
$("#savecontentforstudentgroup").addEventListener("click", (e) => doSaveContentForStudentGroup(e), false);


const triggerTabList = [...$$('#list-tab a')];
triggerTabList.forEach(triggerEl => {
    const tabTrigger = new bootstrap.Tab(triggerEl)

    triggerEl.addEventListener('click', event => {
        event.preventDefault();
        //  console.log(tabTrigger);
        renderTabContent(tabTrigger);
        //  tabTrigger.show()
    })
})
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
            .then(() => console.log("Loaded"))
        // signOut(auth); 
    }
})


