import { getApps, deleteApp, initializeApp } from 'firebase/app';
import { getDatabase, get, ref, update, push, child } from 'firebase/database';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { createApi, setupListeners, fakeBaseQuery } from '@reduxjs/toolkit/query';


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

async function updateFirebaseNode(updates = { temp: "temp" }) {
    try {
        //let res = await timeout(3000); console.log(updates);
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






const api = createApi({
    reducerPath: 'api',
    tagTypes: ["OpenQuiz", "Quiz", "Answer", "Avatar", "Post", "QuizCase", "OpenQuizCase",  "OpenAvatar", ],
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

        fetchOpenQuizCaseById: builder.query({
            async queryFn(id) {
                try {
                    let quiz = await getFirebaseNode({ url: "quizescases/quizesCasesIds/" + id, type: "object" });
                    return { data: !!quiz ? quiz : {} };
                } catch (err) {
                    console.log(err);
                    return { error: err };
                }
            },
            providesTags: (result, error, id) => [{ type: "OpenQuizCase", id }]
        }),

        fetchOpenQuizesCasesIds: builder.query({
            async queryFn() {
                try {
                    let list = await getFirebaseNode({ url: "quizescases/quizesCasesIds", type: "array" });
                    return { data: list };
                } catch (err) {
                    console.log(err);
                    return { error: err };
                }
            },
            providesTags: (result = [], error2, arg) => [
                "QuizCase",
                ...result.map(({ id }) => ({ type: "QuizCase", id }))
            ]
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
            providesTags: (result, error, id) => [{ type: "Post", id }]
        }),



        fetchQuizesArray: builder.query({
            async queryFn() {
                let d = new Date();
                let currentDay = new Intl.DateTimeFormat("en", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })
                    .format(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
                    .replace(/[^a-zA-Z0-9]/g, "_");
                //       console.log(currentDay);
                try {
                    let currentQuizArray = await getFirebaseNode({
                        url: "/currentquiz/" + currentDay + "/",
                        type: "array"
                    });

                    //    console.log(currentQuizArray);

                    let newCurrentQuizAddedIndexes = [];
                    let resArray = !!window?.quizesSets ?
                        window.quizesSets.map(item => {
                            let index = currentQuizArray.findIndex(currentquiz => item.id === currentquiz.id);
                            if (index > -1) {
                                currentQuizArray[index];
                                newCurrentQuizAddedIndexes.push(index);
                                return currentQuizArray[index]
                            } else { return item }
                        })
                        : [];
                    //    console.log(newCurrentQuizAddedIndexes);
                    currentQuizArray = currentQuizArray.filter((item, index) => !newCurrentQuizAddedIndexes.includes(index) && !!item.id);
                    resArray = [...resArray, ...currentQuizArray];
                    //    console.log(resArray);
                    let quizeswithtype = resArray.map(quiz => {
                        let updatedquiz = { ...quiz };
                        if (Array.isArray(quiz?.quizes)) {
                            updatedquiz = { ...quiz, type: "onerandommanyanswers" }
                        }
                        if (Array.isArray(quiz?.choices) && Array.isArray(quiz?.answers) && quiz?.type !== "accounting") {
                            updatedquiz = { ...quiz, type: "multiplechoices" }
                        }

                        if (!!quiz?.answer && quiz.answer.includes("{var1-10}")) {
                            //       console.log("Quiz With Random Number");
                            updatedquiz = { ...quiz, type: "quizwithrandomnumber" }
                        }
                        return updatedquiz
                    })
                    return { data: quizeswithtype }
                }
                catch (err) { console.log(err); return { error: err } }
            },
            providesTags: (result, error, id) => [{ type: "Quiz", id }]
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
        updatesForOpenQuizes: builder.mutation({
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
            invalidatesTags: ["Answer"]
        }),

        // fetchOpenQuizes: builder.query({
        //     async queryFn() {
        //         try {
        //             let openQuizes = await getFirebaseNode({ url: "openquizes/", type: "array" });
        //             //    console.log(openQuizes);
        //             return { data: openQuizes }
        //         }
        //         catch (err) { console.log(err); return { error: err } }
        //     },
        //     providesTags: (result, error, id) => [{ type: "OpenQuiz", id }]
        // }),

        // fetchOpenQuiz: builder.query({
        //     async queryFn(id) {
        //         try {
        //             let quiz = await getFirebaseNode({ url: "openquizes/" + id, type: "object" });
        //             console.log(quiz);
        //             return { data: quiz }
        //         }
        //         catch (err) { console.log(err); return { error: err } }
        //     },
        //     providesTags: (result, error, id) => [{ type: "OpenQuiz", id }]
        // }),
    }),
})



const initialState = {
    email: '',
    userEmail: "",
    user: '',
    avatarUrl: '',
    isLoading: true,
    selectedoption: null,
    selectedoptions: [],
    activePage: null,
    correctquizes: [],
    currentDay: null,
    openavatars: {}
}



const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        setOpenAvatars: (state, action) => {
            state.openavatars = action.payload
        },
        setCurrentDate: (state, action) => {
            state.currentDay = action.payload
        },
        loadCorrectquizes: (state, action) => { state.correctquizes = action.payload },
        addCorrectQuiz: (state, action) => { state.correctquizes.push(action.payload) },

        setInitialQuizOptions: (state) => {
            state.selectedoptions = [];
            state.selectedoption = Math.random() * 9 + 1
        },
        setSelectedOptions: (state, action) => { state.selectedoptions = action.payload },
        setSelectedOption: (state, action) => { state.selectedoption = action.payload },


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
        setActivePage: (state, action) => {
            state.activePage = action.payload;
        }
    }
})






function createRtkFirebaseStore() {


    const store = configureStore({
        reducer: {
            application: applicationSlice.reducer,
            [api.reducerPath]: api.reducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(api.middleware),
    })

    setupListeners(store.dispatch);

    return store


}

export default createRtkFirebaseStore

export const {
    setCurrentDate, setOpenAvatars,
    setUser, setSelectedOption, setInitialQuizOptions,
    setAvatar, setActivePage, setSelectedOptions, addCorrectQuiz, loadCorrectquizes
} = applicationSlice.actions

export { api }
