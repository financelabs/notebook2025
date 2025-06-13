import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

import { createApi as createApiUnsplash } from 'unsplash-js';



import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';
import { configureStore } from '@reduxjs/toolkit';

import timeout from "../../../utlities/timeout.js"


/**
  * Const and Selectors
*/

const selectedDate = document.getElementById("selecteddate");
const selectStudent = document.getElementById("selectStudent");
const studentAvatar = document.getElementById("studentavatar");
const studentGroup = document.getElementById("studentgroup");




const loginButton = document.getElementById("loginbutton");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");




/**
  * Unsplash
*/

let unsplash

try {
    unsplash = createApiUnsplash({ accessKey: document.body.dataset.unsplash });
} catch (err) { throw new Error('Unable to get params' + err) }


async function getPicturesFromCollection({ collectionId = "aH98dheb50M", perPage = 30 }) {
    let pics = await unsplash.collections.getPhotos({ collectionId, page: 1, perPage });
    let pages = Math.ceil(pics.response.total / 30);
    let allPics = [];
    await Promise.all(
        new Array(pages).fill(0).map((page, index) => {
            return unsplash.collections.getPhotos({ collectionId, page: index + 1, perPage: 30 })
        }))
        .then((pages) => {
            pages.forEach(page => {
                page.response.results.forEach(pic => {
                    allPics.push(pic)
                })
            });
        });
    return allPics
        .filter(item => !item.description?.includes("krain") && !item.alt_description?.includes("krain"))
        .sort(({ likes: a }, { likes: b }) => b - a)
}



/**
  * Firebase
*/
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
const auth = getAuth(app);


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

function getFirebaseNodeKey(url) {
    return push(child(ref(db), url + "/")).key;
}

/**
* Store
*/

const api = createApi({
    reducerPath: 'api',
    tagTypes: ["QuizesCases", "UnsplashImageFromCollection", "Name", "Avatar", "UserAvatarsAndGroup"],
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({

        fetchUserName: builder.query({
            async queryFn(userEmail) {
                try {
                    let list = await getFirebaseNode({ url: "usersCraft/" + userEmail + "/posts", type: "array" });
                    return { data: list.map(item => item.user)[0] }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "Name", id }]
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
                catch (err) { console.log(err); return { data: [], error: err } }
            },
            providesTags: (result, error, id) => [{ type: "Avatar", id }]
        }),


        fetchUsersByDate: builder.query({
            async queryFn(currentDay) {
                try {
                    let postsResponse = await getFirebaseNode({
                        url: "/currentDay/" + currentDay + "/posts",
                        type: "array"
                    });
                    const casesResponse = await getFirebaseNode({
                        url: "/currentDay/" + currentDay + "/cases",
                        type: "array"
                    })
                    return { data: [...postsResponse, ...casesResponse] }
                }
                catch (err) { console.log(err); return { data: [], error: err } }
            },
            providesTags: (result, error, id) => [{ type: "QuizesCases", id }]
        }),


        addOpenAvatar: builder.mutation({
            async queryFn(post) {
                try { await updateFirebaseNode({ updates: { ["openavatars/" + post.id]: post } }) }
                catch (err) {
                    console.log(err);
                    return { error: err }
                }
                return { data: post }
            },
            invalidatesTags: ["OpenAvatar"]
        }),

        fetchUnsplashImagesFromCollection: builder.query({
            async queryFn({ collectionId = "aH98dheb50M", perPage = 30 }) {
                try {
                    const imagesResp = await getPicturesFromCollection({ collectionId, perPage });
                    let images = imagesResp
                        .map(item => { return { ...item, orientation: "landscape" } });

                    return {
                        data: images
                    }
                }
                catch (err) {
                    console.log(err);
                    return { error: err }
                }
            },
            providesTags: ["UnsplashImageFromCollection"]
        }),

        fetchUsersByDate: builder.query({
            async queryFn(currentDay) {
                try {
                    let postsResponse = await getFirebaseNode({
                        url: "/currentDay/" + currentDay + "/posts",
                        type: "array"
                    });
                    const casesResponse = await getFirebaseNode({
                        url: "/currentDay/" + currentDay + "/cases",
                        type: "array"
                    })
                    return { data: [...postsResponse, ...casesResponse] }
                }
                catch (err) { console.log(err); return { data: [], error: err } }
            },
            providesTags: (result, error, id) => [{ type: "QuizesCases", id }]
        }),



        updateUserAvatarGroup: builder.mutation({
            async queryFn({ base = "openavatars", updates = {
                temp_google_com: {
                    id: "temp_google_com",
                    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxODU2NzR8MHwxfGNvbGxlY3Rpb258MjB8YUg5OGRoZWI1ME18fHx8fDJ8fDE3MDAxMzYxMjN8&ixlib=rb-4.0.3&q=80&w=200",
                    user: "Ha Ha"
                }
            }
            }) {
                let fireUpdates = {};
                Object.keys(updates).forEach(objKey => {
                    fireUpdates[base + "/" + objKey] = updates[objKey]
                });
                //    console.log(fireUpdates);
                try { await updateFirebaseNode(fireUpdates) }
                catch (err) { console.log(err); return { error: err } }
                return { data: fireUpdates }
            },
            invalidatesTags: ["UserAvatarsAndGroup"]
        }),


    }),
})





const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})
setupListeners(store.dispatch);

let resImages;
let resQuizesCases;
let resFetchUserName;
let resUserAvatar

/**
 * Functions
 */

async function doSaveAvatar(e) {

    let userEmail = document.getElementById("selectStudent").value;
    let avatarUrl = e.target.id;
    let group = document.getElementById("opengroup").value;
    let user = document.getElementById("name").value;


    let updates = {
        ["openavatars/" + userEmail]: {
            user,
            id: userEmail,
            group,
            avatarUrl
        },
        ["opengroups/" + group]:
        {
            id: userEmail,
            email: userEmail,
            user,
            avatarUrl
        }
    }

    console.log(updates);

    store.dispatch(api.endpoints.updateUserAvatarGroup.initiate({
        base: "/",
        updates: updates
    }))
        .then(() => console.log("Saved"));

    console.log(document.getElementById("selectStudent").value);
    console.log(document.getElementById("name").value);
    console.log(document.getElementById("opengroup").value);
    console.log(e.target.id);
    let res = await timeout(2000);
    console.log("Avatar Saved " + res)
}


async function doSelectDate(e) {
    e.preventDefault();

    selectStudent.innerHTML = "<option selected>Select student</option>"

    var d = new Date(e.target.value);

    let currentDay = new Intl.DateTimeFormat("en", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    })
        .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
        .replace(/[^a-zA-Z0-9]/g, "_");

    console.log(currentDay);

    resQuizesCases = await store.dispatch(api.endpoints.fetchUsersByDate.initiate(currentDay));

    let uniqueEmails = [...new Set(resQuizesCases.data.map(item => item?.email))];
    let uniqueUserEmails = uniqueEmails.map(email => email.replace(/[^a-zA-Z0-9]/g, "_"));

    console.log(uniqueUserEmails);



    for (var i = 0; i < uniqueUserEmails.length; i++) {
        var opt = uniqueUserEmails[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = uniqueUserEmails[i];
        selectStudent.appendChild(el);
    }

}

async function doSelectStudent() {

    studentAvatar.innerHTML = "ФИО Группа";

    resFetchUserName = await store.dispatch(api.endpoints.fetchUserName.initiate(
        selectStudent.value
    ));
    resUserAvatar = await store.dispatch(api.endpoints.fetchUserAvatar.initiate(
        selectStudent.value
    ));

    // console.log(resUserAvatar);
    studentAvatar.innerHTML = !!resUserAvatar.data?.avatarUrl ?
        `<img src=${resUserAvatar.data.avatarUrl}
                data-bs-toggle="tooltip" data-bs-html="true" 
                alt=${resUserAvatar.data.user}               
                class="avatar"
            >` : "ФИО Группа"

    document.getElementById("name").value = resFetchUserName.data;
    studentGroup.innerText = !!resUserAvatar.data?.group ? resUserAvatar.data.group : ""

}

function doLogin() {
    console.log("doLogin");
    signInWithEmailAndPassword(
        auth,
        emailInput.value,
        passwordInput.value)
        .then(() => window.location.reload());
}


// HTML event listeners
selectedDate.addEventListener("change", doSelectDate, false);
selectStudent.addEventListener("change", doSelectStudent, false);
loginButton.addEventListener("click", doLogin, false);

/**
  * Initial load
*/


async function initialLoad() {

    resImages = await store.dispatch(api.endpoints.fetchUnsplashImagesFromCollection.initiate({ collectionId: "aH98dheb50M", perPage: 30 }));

    document.getElementById("freeavatars").innerHTML =
        resImages.data.map(item => {
            return `
          <div class="col-12 col-sm-4 col-md-3 col-lg-2">
        <div class="card m-1">
        <div class="card-body">
           <div class="class-text">
            <img src=${item.urls.thumb}
                data-bs-toggle="tooltip" data-bs-html="true" 
                alt=${item.urls.thumb}
                id=${item.urls.thumb}
                class="avatar"
            >
            </div>
        </div>
    </div>
    </div>`
        }).join("");

    var items = document.getElementsByClassName("avatar");
    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click',
            (e) => {
                doSaveAvatar(e).then(() => console.log("Saved"))
            }, false);
    }

    return true
}

/**
  * Check Auth
*/

onAuthStateChanged(auth, user => {
    if (!user) {
        document.getElementById("loginform").style.display = "block";
        document.getElementById("main").style.display = "none";
    }
    else {
        initialLoad().then(() => {
            // signOut(auth);
            document.getElementById("loginform").style.display = "none";
            document.getElementById("main").style.display = "block";
        });
    }
})



store.subscribe(() => {
    // console.log(store.getState());
})

