import { initializeApp } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';

import { createSlice, configureStore } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';

import { createApi as createApiUnsplash } from 'unsplash-js';

/**
  * Const and Selectors
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const selectedDate = document.getElementById("selecteddate");
const selectStudent = document.getElementById("selectStudent");
const selectQuiz = document.getElementById("selectQuiz");




var appconf = {};
try {
    appconf = document.body.dataset;
} catch (err) {
    throw new Error('Unable to get params' + err)
}

/**
  * Unsplash
*/

const unsplash = createApiUnsplash({
    accessKey: appconf.unsplash
});

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

//Firebase


const firebaseConfig = {
    apiKey: appconf.api,
    databaseURL: "https://" + appconf.base + ".firebaseio.com",
    appId: appconf.app
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
    isLoading: true,
}



const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {

        setLoaded: (state, action) => {
            state.isLoading = false
        }

    }
})

// Action creators are generated for each case reducer function
const { setLoaded
} = applicationSlice.actions


const api = createApi({
    reducerPath: 'api',
    tagTypes: ["UnsplashImageFromCollection", "QuizesCases", "Avatar"],
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({


        fetchUserAvatarArray: builder.query({
            async queryFn(array) {
                try {

                    let quizes = await Promise.all(
                        array.filter(item => !!item && item.length > 6)
                            .map((userEmail) => {
                                return getFirebaseNode({ url: "openavatars/" + userEmail, type: "object" });
                            }));

                    let foundAvatars = [];
                    quizes.map(item => {
                        //              console.log(item);
                        if (item) { foundAvatars.push(item) }

                    })
                    return { data: foundAvatars }



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


        fetchUnsplashImagesFromCollection: builder.query({
            async queryFn({ collectionId = "aH98dheb50M", perPage = 30 }) {
                try {
                    const imagesResp = await getPicturesFromCollection({ collectionId, perPage });
                    let images = imagesResp
                        .map(item => {
                            return {
                                src: item.urls.small, slug: item?.slug, color: item?.color,
                                male: !!item?.slug && !item.slug.includes("woman")
                                //  && !item?.description.includes("woman") && item?.alt_description.includes("woman")
                                //     && !item?.slug.includes("girl") && !item?.description.includes("girl") && item?.alt_description.includes("girl")
                            }
                        });

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

let resImages;
let resQuizesCases;
let resfetchUserAvatarArray;


/**
  * Functions
*/

function renderAvatars() {
    var size = 15;
    document.getElementById("freeavatars").innerHTML =
        resImages.data
            .slice(0, size)
            .map(item => {
                return `
         <div class="col-12 col-sm-4 col-md-3 col-lg-2">
          
                    <div class="m-1 p-1" style="background-color: ${!!item?.color ? item.color : "white"};">
                        <img src=${item.src}
                            data-bs-toggle="tooltip" data-bs-html="true" 
                            alt=${item.src}
                            id=${item.src}
                            class="avatar"
                        >
                    </div>
          
         </div>`
            }).join("");

    var items = document.getElementsByClassName("avatar");
    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click',
            (e) => {
                //   doSaveAvatar(e).then(() => 
                console.log("Saved")
                //  )
            }, false);
    }
}


async function doSelectDate(e) {
    e.preventDefault();
    // selectStudent.innerHTML = "<option selected>Select student</option>"    
    let d = new Date(e.target.value);
    let currentDay = new Intl.DateTimeFormat("en", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    })
        .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
        .replace(/[^a-zA-Z0-9]/g, "_");
    //    console.log(currentDay);
    resQuizesCases = await store.dispatch(api.endpoints.fetchUsersByDate.initiate(currentDay));
    //   let uniqueEmails = [...new Set(resQuizesCases.data.map(item => item?.email))];
    let uniqueTitles = [...new Set(resQuizesCases.data.map(item => item?.title))];
    //    let uniqueUserEmails = uniqueEmails.map(email => email.replace(/[^a-zA-Z0-9]/g, "_"));
    //    console.log(uniqueUserEmails);
    // for (var i = 0; i < uniqueUserEmails.length; i++) {
    //     var opt = uniqueUserEmails[i];
    //     var el = document.createElement("option");
    //     el.textContent = opt;
    //     el.value = uniqueUserEmails[i];
    //     selectStudent.appendChild(el);
    // }

    for (var i = 0; i < uniqueTitles.length; i++) {
        var opt = uniqueTitles[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = uniqueTitles[i];
        selectQuiz.appendChild(el);
    }
}

async function doSelectQuiz(e) {
    e.preventDefault();
    let emails = [
        ...new Set(resQuizesCases.data
            .filter(item => item.title === e.target.value)
            .map(item => item.email))
    ]
    resfetchUserAvatarArray = await store.dispatch(api.endpoints.fetchUserAvatarArray.initiate(emails.map(item => item.replace(/[^a-zA-Z0-9]/g, "_"))));

    $("#quizStudents").innerHTML =
        emails.map((item, ind) => {
            let index = resfetchUserAvatarArray.data.findIndex(ava => ava.id === item.replace(/[^a-zA-Z0-9]/g, "_"));
            console.log(index);
            if (index > -1) {
                return `<div class="m-1 p-1">
                                <img src=${resfetchUserAvatarArray.data[index].avatarUrl}
                                    data-bs-toggle="tooltip" data-bs-html="true" 
                                    alt=${ind}
                                    id=${ind}
                                    class="avatar"
                                >                        
                        </div>`}
                        else { return `<div class="col">${item}</div>` }
        }).join("");




}

// HTML event listeners
selectedDate.addEventListener("change", doSelectDate, false);
selectQuiz.addEventListener("change", doSelectQuiz, false);


/**
  * Initial load
*/


async function initialLoad() {
    resImages = await store.dispatch(api.endpoints.fetchUnsplashImagesFromCollection.initiate({ collectionId: "aH98dheb50M", perPage: 30 }));
    console.log(resImages)
}

initialLoad()
    .then(res => {
        store.dispatch(setLoaded());
        console.log(res)
    })

store.subscribe(() => {
    if (!store.getState().application.isLoading) {
        renderAvatars()
    }
})