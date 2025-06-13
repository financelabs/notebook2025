import { getApps, deleteApp, initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getDatabase, get, ref, update, push, child } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js';

import { createStore  } from "https://unpkg.com/redux@4.2.1/es/redux.mjs";
import { produce} from "https://unpkg.com/immer@10.1.1/dist/immer.production.mjs";

//Firebase
//https://www.mbloging.com/post/building-a-to-do-list-application-with-javascript

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let initialState = {
    loading: true,
    posts: [],
    selectedTitle: "Основные корпоративные налоги",
    groupUserEmails: [
        "durdinaalisa_yandex_ru",
        "luna_bella_list_ru",
        "marina_leonidovna_p_mail_ru",
        "accounting_yandex_ru",
        "nick_golovenkin_yandex_ru"
    ]
}


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
        fireconf = $("#quizes").dataset// document.body.dataset;
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

function caseReducer(state = [], action) {
    switch (action.type) {
        case "SEED_STATE": {
            return produce(state, (draft) => { //immer.produce
                Object.keys(action.payload.objects).map((key) => {
                    draft[key] = action.payload.objects[key];
                });
            });
        }
        default:
            return state
    }
}


const store = createStore( //Redux.createStore
    caseReducer,
    initialState);

const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
];


function createMinimalProtoArray(protoDataObject = {}) {
    let maxRow = 0;
    let maxColumn = 0;

    Object.keys(protoDataObject).forEach(objKey => {
        if (maxColumn < alphabet.findIndex(item => item === objKey.substring(0, 1))) {
            maxColumn = alphabet.findIndex(item => item === objKey.substring(0, 1)) + 1
        }
        if (maxRow < parseInt(objKey.substring(1))) {
            maxRow = parseInt(objKey.substring(1))
        }
    });
    let array = new Array(maxRow).fill('').map(() => new Array(maxColumn).fill(''));

    Object.keys(protoDataObject).map((objKey) => {
        let col = objKey.substring(0, 1)
        let row = objKey.substring(1)
        let colArrayIndex = alphabet.findIndex((item) => item === col);
        let rowArrayIndex = parseInt(row) - 1;
        array[rowArrayIndex][colArrayIndex] = protoDataObject[objKey];
    });

    return array;
}

function applyClassToTableTag(htmlstring) {
    // if (htmlstring instanceof String && htmlstring.includes("table")) {
    //     const regex = /table/i;
    //     return htmlstring.replace(regex, 'table class="table table-sm"')
    // }
    return htmlstring
}


function makeDomNodeForSpreadsheet(tableArray) {

    var tbl = document.createElement("table");
    tbl.setAttribute('class', "table table-bordered table-sm");

    var tblHead = document.createElement("thead");
    var row = document.createElement("tr");

    var cell = document.createElement("th");
    cell.innerText = " ";
    row.appendChild(cell);

    !!tableArray && Array.isArray(tableArray) && !!tableArray[0] && tableArray[0].forEach((column, columnIndex) => {
        var cell = document.createElement("th");
        cell.setAttribute('class', "text-center");
        cell.innerText = alphabet[columnIndex];
        row.appendChild(cell);
    })

    tblHead.appendChild(row);
    tbl.appendChild(tblHead);

    var tblBody = document.createElement("tbody");

    !!tableArray && Array.isArray(tableArray) && tableArray.forEach((row, rowIndex) => {
        var row = document.createElement("tr");

        var cell = document.createElement("td");
        cell.setAttribute('scope', "row");
        cell.innerText = rowIndex + 1;
        row.appendChild(cell);

        !!tableArray[rowIndex] && tableArray[rowIndex].forEach((column, columnIndex) => {
            var cell = document.createElement("td");
            //      cell.setAttribute('class', "text-center");
            cell.innerText = tableArray[rowIndex][columnIndex];
            row.appendChild(cell);
        })

        tblBody.appendChild(row);
    })
    tbl.appendChild(tblBody);

    return tbl
}

function renderQuizes(posts) {
    const quizList = document.getElementById('quizes');
    quizList.innerHTML = '';
    posts.forEach(post => {
        const div = document.createElement('div');
        let quizString = post?.quizString ? post.quizString : "";
        if (post?.type === "html") { quizString = post?.content; }
        if (post?.type === "multiplechoices") { quizString = post?.content + "<br> " + post?.answer; }
        div.innerHTML = `
            <div class="card m-1">
            <div class="card-body" id=${"studentquiz" + post.id}>
                <h5 class="card-title">${post?.theme ? post.theme : ""}</h5>
                <p class="card-text">${post?.title ? post.title : ""}</p>
                <hr />
                <div class=row>
                    <div class="col-12 col-lg-3">
                        <img src=${post.avatarUrl}
                                data-bs-toggle="tooltip" data-bs-html="true" 
                                alt=${post.id} id=${post.id} class="avatar"
                                title=${post.user}>
                        <div class="m-1">
                        ${post?.user ? post.user : ""}
                        </div>
                    </div>
                    <div class="col-12 col-lg-9">
                        <div id="studenthint" class="mb-3">${post?.quizString ? applyClassToTableTag(post.quizString) : ""}</div>
                    </div>
                <div>    
                <hr />
            </div>
        </div>
        `;
        quizList.appendChild(div);
    })


    posts
        .forEach(post => {
            if (post.type === "spreadsheet") {
                document.getElementById("studentquiz" + post.id)
                    .appendChild(makeDomNodeForSpreadsheet(createMinimalProtoArray(post?.content, 0, 0)));
            }
        })

}


function listener() {
    console.log('New state:', store.getState());

    console.log(store.getState()?.titles)

    const avatarList = document.getElementById('avatars');
    avatarList.innerHTML = '';
    Array.isArray(store.getState()?.groupAvatars) && store.getState().groupAvatars.forEach(avatarObj => {
        if (!!avatarObj) {
            const div = document.createElement('div');
            div.innerHTML = `          
                <div class="card profile-card m-1">
                    <div class="card-body text-center">
                        <img src="${avatarObj.avatarUrl}" alt="User Profile" class="avatar">
                        <p class="card-text text-muted mb-3">${avatarObj.user}</p>
                        <button class="btn btn-primary btn-sm w-100 alluserquizes" id=${avatarObj.id}>Решения</button>
                    </div>
                </div>`
            avatarList.appendChild(div);
        }
    });

    let pagesLi = [...$$(".alluserquizes")];
    pagesLi.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            // renderQuizes(store.getState()?.titles[titleBtn.id]);
            console.log(event.target.id);
            renderQuizes(store.getState()?.filteredPosts.filter(post => post?.email.replace(/[^a-zA-Z0-9]/g, "_") === event.target.id))
        }, false);
    })

    const titleList = document.getElementById('titles');
    titleList.innerHTML = '';
    Array.isArray(store.getState()?.titles) && store.getState().titles.forEach((quizTitle, index) => {
        if (!!quizTitle) {
            const titleBtn = document.createElement('button');
            titleBtn.style = "margin: .2rem";
            titleBtn.classList = "btn btn-outline-secondary btn-sm w-100"
            titleBtn.id = index;
            titleBtn.innerHTML = `
            <span style="margin: 1rem;">${quizTitle}</span>           
        `;
            titleList.appendChild(titleBtn);
            titleBtn.addEventListener('click', () => {
                let title = store.getState()?.titles[titleBtn.id]
                renderQuizes(
                    store.getState()?.filteredPosts.filter(post => post?.title === title)
                );
            });
        }
    });



}

// Subscribe to the store
store.subscribe(listener);

async function initialLoad() {

    let groupPosts = [];
    let groupAvatars = [];

    console.log(store.getState()?.groupUserEmails)

    let arrayOfAvatarPromises = store.getState().groupUserEmails.map(userEmail => {
        return getFirebaseNode({
            url: "openavatars/" + userEmail,
            type: "object"
        })
    })

    await Promise.all(arrayOfAvatarPromises).then((values) => {
        values.forEach((obj, index) => {
            if (!!obj) { groupAvatars.push(obj) }
        });
    });

    let arrayOfPromises = store.getState().groupUserEmails.map(userEmail => {
        return getFirebaseNode({
            url: "usersCraft/" + userEmail + "/posts",
            type: "array"
        })
    })



    await Promise.all(arrayOfPromises).then((values) => {
        values.forEach(array => {
            groupPosts = [...groupPosts, ...array]
        });
    });

    let themes = [...new Set(groupPosts.map(item => item.theme))];
    let emails = [...new Set(groupPosts.map(item => item.email))];

    let filteredPosts = [];

    let filteredByTheme = groupPosts.filter(post => post?.theme === store.getState().selectedTitle);
    filteredByTheme.forEach(post => {
        let foundAvatarIndex = groupAvatars.findIndex(ava => ava.id === post?.email.replace(/[^a-zA-Z0-9]/g, "_"));
        if (foundAvatarIndex > -1) {
            filteredPosts.push({...post, avatarUrl: groupAvatars[foundAvatarIndex].avatarUrl})
        } else {
            filteredPosts.push({...post,
                avatarUrl: "https://images.unsplash.com/photo-1525130413817-d45c1d127c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxODU2NzR8MHwxfHNlYXJjaHwxODN8fHNtaWxlfGVufDB8fHx8MTY1NjE2MzkyMA&ixlib=rb-1.2.1&q=80&w=200"})
        }

        
    })
    let titles = [...new Set(filteredPosts.map(item => item.title))];

    // let avatarUrl = store.getState().groupAvatars.filter(user => user.email.replace(/[^a-zA-Z0-9]/g, "_") === post.email.replace(/[^a-zA-Z0-9]/g, "_"));
    // console.log(avatarUrl)


    return { groupAvatars, filteredPosts, titles }


}

initialLoad().then((res) => {
    store.dispatch({
        type: "SEED_STATE",
        payload: {
            objects: {
                loading: false,
                groupAvatars: res.groupAvatars,
                filteredPosts: res.filteredPosts,
                titles: res.titles
                //       filteredPosts: filteredPosts
            }
        }
    })
});

