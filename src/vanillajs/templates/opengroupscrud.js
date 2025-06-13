import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { createSlice, configureStore, current } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';

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
    openavatars: null,
    currentGroup: "kb",
    currentGroupUserEmails: [],
    notReadyIds: ["-ODV7nTHKNjP4nxM44eG"]
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
        updateGroupUserEmails: (state, action) => {
            state.currentGroupUserEmails = action.payload
        },

    }
})

// Action creators are generated for each case reducer function
const { updateGroupUserEmails, setOpenAvatars
    // setCurrentDate, setOpenAvatars
} = applicationSlice.actions


const api = createApi({
    reducerPath: 'api',
    tagTypes: ["OpenAvatars", "QuizCase", "OpenGroup", "Post"],
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




        fetchOpenAvatars: builder.query({
            async queryFn() {
                try {
                    let list = await getFirebaseNode({ url: "openavatars", type: "object" });
                    //     console.log(list)
                    return { data: list }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "OpenAvatars", id }]
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


        // updatesForUserPosts: builder.mutation({
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
        //     invalidatesTags: ["QuizCase"],

        // }),

        updatesForOpenGroups: builder.mutation({
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
            invalidatesTags: ["OpenGroup"]
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
let resOpenAvatars;
let resFetchOpenGroups;
let resUserPosts;


/**
  * Functions
*/



async function updateUserInGroup(userEmail) {
    let currentGroupUserEmails = store.getState().application.currentGroupUserEmails;
    console.log(currentGroupUserEmails);
    let updates = {};
    let currentGroup = store.getState().application.currentGroup;

    let openavatars = store.getState().application.openavatars;
    let userProfile = !!openavatars?.[userEmail] ?
        openavatars[userEmail] :
        {
            id: userEmail,
            avatarUrl: "https://images.unsplash.com/photo-1618486562734-94f1c3d55861?q=80&w=200&auto=format&fit=crop"
        };

    if (currentGroupUserEmails.includes(userEmail)) {
        updates["opengroups/" + currentGroup + "/" + userEmail] = null;
    } else {
        updates["opengroups/" + currentGroup + "/" + userEmail] = userProfile;
    }

    store.dispatch(api.endpoints.updatesForOpenGroups.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
            $("#" + userEmail).classList.toggle("btn-outline-secondary");
            $("#" + userEmail).classList.toggle("btn-outline-danger");
            if (currentGroupUserEmails.includes(userEmail)) {
                store.dispatch(updateGroupUserEmails([...currentGroupUserEmails.filter(item => item !== userEmail)]));
            } else {
                store.dispatch(updateGroupUserEmails([...currentGroupUserEmails, userEmail]));
            }
        })
        .catch(err => console.log(err));



}

function addUserMarkUp(openavatars) {
    let currentGroup = store.getState().application.currentGroup;
    let currentGroupUserEmails = store.getState().application.currentGroupUserEmails;

    let quizescases = resQuizesCasesByDate.data;
    let uniqueEmails = [...new Set(resQuizesCasesByDate.data.map(item => item?.email))];
    let markup =
        '<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-2">' +
        uniqueEmails
            .map(email => {
                //   console.log(email);
                let avatarUrl =
                    !!openavatars[email.replace(/[^a-zA-Z0-9]/g, "_")]?.avatarUrl ?
                        openavatars[email.replace(/[^a-zA-Z0-9]/g, "_")].avatarUrl
                        : "https://images.unsplash.com/photo-1618486562734-94f1c3d55861?q=80&w=200&auto=format&fit=crop";
                let usermarkup = `
        <div class="col">
            <div class="card" style="width: 250px">
                <div class='text-center p-1'>
                     <img src="${avatarUrl}" class="card-img-top" alt="img" style="width: 200px">
                </div>
                <div class="card-body">
                <button class="btn btn-sm addusertogroup 
                ${currentGroupUserEmails.includes(email.replace(/[^a-zA-Z0-9]/g, "_")) ?
                        " btn-outline-danger"
                        : " btn-outline-secondary"
                    }"
                id=${email.replace(/[^a-zA-Z0-9]/g, "_")}
                >Add ${email} to ${currentGroup} group</button>`
                    + quizescases.filter(item => item.email === email)
                        .map(quiz => {
                            // console.log(quiz);
                            return `<small>${quiz?.title + " "}</small>`
                        })
                        .join("") + `
                </div>
            </div>
        </div>`;
                return usermarkup
            })
            .join("")
        + '</div>';

    //   console.log(markup);
    $("#usercards").innerHTML = markup;

    let addUserToGroupButtons = [...$$('.addusertogroup')];
    addUserToGroupButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            console.log(event);
            updateUserInGroup(event.target.id);
        }, false);
    });

}



async function doSelectDate(e) {
    e.preventDefault();

    let openavatars = store.getState().application.openavatars;

    let d = new Date(e.target.value);
    let currentDay = new Intl.DateTimeFormat("en", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    })
        .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
        .replace(/[^a-zA-Z0-9]/g, "_");
    //  store.dispatch(setCurrentDate(currentDay))
    // console.log(currentDay);

    resQuizesCasesByDate = await store.dispatch(api.endpoints.fetchQuizesCasesByDate.initiate("/currentDay/" + currentDay + "/"));
    let uniqueEmails = [...new Set(resQuizesCasesByDate.data.map(item => item?.email))];
    let updatedopenavatars = {};

    uniqueEmails.forEach(email => {
        let userEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
        updatedopenavatars[userEmail] =
            !!openavatars?.[userEmail] ?
                openavatars[userEmail] :
                {
                    id: userEmail,
                    avatarUrl: "https://images.unsplash.com/photo-1618486562734-94f1c3d55861?q=80&w=200&auto=format&fit=crop"
                };
    })
    addUserMarkUp(updatedopenavatars)




}

function doShowPosts() {
    let notReadyIds = store.getState().application.notReadyIds;
    let currentGroup = store.getState().application.currentGroup;
    let groupPosts = resUserPosts.data;
    console.log("Do Show Posts");
    $("#savepoststogroup").innerText = "Save posts to " + currentGroup + " group";
    $("#savepoststogroup").style.display = "block";
    let markup = groupPosts
        .filter(item => !notReadyIds.includes(item.id))
        .map(post => {
            return `
        <div class="card">
             <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.comment + " " + post.id}</p>
                <div>${post.content}</div>
            </div>
        </div>`
        })
    $("#usercards").innerHTML = markup;
}

async function doSavePosts() {
    let userEmails = store.getState().application.currentGroupUserEmails;
    let notReadyIds = store.getState().application.notReadyIds;
    let currentGroup = store.getState().application.currentGroup;
    let groupPosts = resUserPosts.data;
    console.log("Do Save Posts");
    $("#savepoststogroup").innerText = "Saving posts to " + currentGroup + " group";
    console.log(groupPosts.filter(item => !notReadyIds.includes(item.id)));

    let openavatars = store.getState().application.openavatars;


    let updates = {};
    userEmails.forEach(userEmail => {
        let userProfile = !!openavatars?.[userEmail] ?
            openavatars[userEmail] :
            {
                id: userEmail,
                avatarUrl: "https://images.unsplash.com/photo-1618486562734-94f1c3d55861?q=80&w=200&auto=format&fit=crop"
            };
        groupPosts
            .filter(item => !notReadyIds.includes(item.id))
            .forEach(post => {
                updates["usersCraft/" + userEmail + "/posts/" + post.id] = {
                    ...post,
                    avatarUrl: userProfile.avatarUrl
                }
            })
    });

    console.log(updates);
    store.dispatch(api.endpoints.updatesForOpenGroups.initiate({
        base: "",
        updates: updates
    }))
        .then((res) => {
            console.log(res)
        })
        .catch(err => console.log(err));

}


async function initialLoad() {
    console.log("opengroupscrud");

    resOpenAvatars = await store.dispatch(api.endpoints.fetchOpenAvatars.initiate())
    store.dispatch(setOpenAvatars(resOpenAvatars.data));

    let currentGroup = store.getState().application.currentGroup;
    let notReadyIds = store.getState().application.notReadyIds;
    resFetchOpenGroups = await store.dispatch(api.endpoints.fetchOpenGroups.initiate());
    console.log(resFetchOpenGroups.data?.[currentGroup]);
    if (!!resFetchOpenGroups.data?.[currentGroup]) {
        store.dispatch(updateGroupUserEmails([...
            Object.keys(resFetchOpenGroups.data[currentGroup])]));
    }
    resUserPosts = await store.dispatch(api.endpoints.fetchUserPosts.initiate(
        currentGroup + "_yandex_ru"
    ));
    $("#showpoststogroup").innerText = "Show " +
        resUserPosts.data
            .filter(item => !notReadyIds.includes(item.id)).length +
        " posts to " + currentGroup + " group";

    // let updates ={};
    // updates["opengroups/avatarUrl"] = null;
    // updates["opengroups/email"] = null;
    // updates["opengroups/id"] = null;
    // updates["opengroups/psa"] = null;
    // updates["opengroups/user"] = null;
    // store.dispatch(api.endpoints.updatesForOpenGroups.initiate({
    //     base: "",
    //     updates: updates
    // }))
    //     .then((res) => {
    //         console.log(res)
    //     })
    //     .catch(err => console.log(err));
};

// HTML event listeners
$("#selectedDate").addEventListener("change", doSelectDate, false);
$("#showpoststogroup").addEventListener("click", doShowPosts, false);
$("#savepoststogroup").addEventListener("click", doSavePosts, false);



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