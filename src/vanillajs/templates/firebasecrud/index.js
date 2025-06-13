import { getApps, deleteApp, initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';
import { getDatabase, get, ref, update, push, child, onValue } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js';
import { produce } from "https://unpkg.com/immer@10.1.1/dist/immer.production.mjs";

let state = { openquizes: [] };

// DOM Elements
const textInput = document.getElementById("textInput");
const addItemBtn = document.getElementById("addItemBtn");
const itemsList = document.getElementById("itemsList");
const mainContent = document.getElementById("content");
const form = document.getElementById("mainForm")

function dispatch(action) {

    switch (action.type) {
        case "SEED_STATE": {

            return produce(state, (draft) => {
                Object.keys(action.payload.objects).map((key) => {
                    console.log(key, action.payload.objects[key]);
                    draft[key] = action.payload.objects[key];
                });
            });
        }
        case "SEED_ARRAY":
            return produce(state, (draft) => {
                draft[action.payload.arrayName] = action.payload.arrayItems;
            });

        case "LOAD_DATA":
            return produce(state, (draft) => {
                draft.data = action.payload.data;
                draft.protoData = action.payload.protoData;
                draft.expandView = true;
            });

        case "NEW_EMPTY_SPREADSHEET": {
            return produce(state, (draft) => {
                draft.data = action.payload.data;
                draft.protoData = action.payload.protoData;
                draft.formulaValue = action.payload.protoData[0][0];
                draft.expandView = true;
            });
        }

        case "UPDATE_FORMULA":
            return produce(state, (draft) => {
                draft.formulaValue = action.payload.formulaValue;
                draft.formulaRowIndex = action.payload.formulaRowIndex;
                draft.formulaColumnIndex = action.payload.formulaColumnIndex;
                draft.formulaIsInFocus = false;
            });

        case "SAVE_CELL_AND_SET_NEXT_CELL_ACTIVE":
            return produce(state, (draft) => {
                draft.data = action.payload.data;
                draft.protoData = action.payload.protoData;
                // action.payload.value
                draft.formulaValue = action.payload.formulaValue;
                draft.formulaRowIndex = action.payload.formulaRowIndex;
                draft.formulaColumnIndex = action.payload.formulaColumnIndex;
            });

        case "SET_STORE_OBJECT":
            return produce(state, (draft) => {
                draft[action.payload.key] = action.payload.value;
            });

        case "PUSH_ITEM_TO_ARRAY":
            return produce(state, (draft) => {
                draft[action.payload.arrayName].push(action.payload.item);
            });

        default:
            return state;
    }
}
let firepath = "openquizes";

// Initialize Firebase

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

const listRef = ref(db, firepath);

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

//Render
function renderItems(items) {
    itemsList.innerHTML = ""; // Clear current tasks
    items.forEach(item => {
        //  Create task list item
        const li = document.createElement("li");
        li.innerHTML = `
        <div class="container m-1">
            <div class="row">
                <div class="col">
                    <small>${item.title}</small>
                    ${Array.isArray(item?.choices) && item.choices.map(qanswer => {
            //  console.log(qanswer.trim() !== item.answers[0].trim())
            return `<div class='text-secondary'
                         style="${qanswer.trim() === item.answers[0].trim() ? 'text-decoration: green wavy underline;' : ''}"
                         >${qanswer}</div>`
        }).join("")}
                </div>
                <div class="col-auto">
                    <div class="p-1">
                        <button class="btn btn-sm btn-outline-secondary edit" data-id="${item.id}">Edit</button>
                    </div>    
                    <div class="p-1">
                        <button class="btn btn-sm btn-outline-danger delete" data-id="${item.id}">Delete</button>
                    </div>    
                </div>
            </div>
        </div>
        <hr>`;
        itemsList.appendChild(li);
        li.querySelector(".edit").addEventListener("click", async () => {
            editItem(item.id)
        });
        li.querySelector(".delete").addEventListener("click", async () => {
            deleteItem(item.id);
        });
    });
}

// Delete Item 
async function deleteItem() {
    setTimeout(() => console.log(state), 2000);
}

// Edit Item 
async function editItem(id) {
    let selectedItem = state.openquizes.find(item => item.id === id);
    console.log(selectedItem);

    itemsList.innerHTML = "";
    mainContent.innerHTML = "";

    const options = { indent_size: 2, end_with_newline: true, }

    let formGroupArray = [
        {
            id: "theme",
            defaultValue: selectedItem?.theme ? selectedItem.theme : "",
            type: "text",
            smallText: "Тема",
            label: "Тема"
        },

        // {
        //     id: "selecttheme",
        //     options: ["Из имеющихся", ...new Set(state.openquizes.map(item => item.theme))].map((item, index) => {
        //         return {value: index, text: item}
        //     }),
        //     type: "select",
        //     smallText: "Темы",
        //     label: "Темы"
        // },

        {
            id: "title",
            defaultValue: selectedItem?.title ? beautifier.html(selectedItem.title, options) : "",
            type: "textarea",
            smallText: "HTML markup",
            label: "Title"
        },




        {
            id: "text",
            defaultValue: selectedItem?.text ? beautifier.html(selectedItem.text, options) : "",
            type: "textarea",
            smallText: "HTML markup",
            label: "Text"
        },
        {
            id: "hint",
            defaultValue: selectedItem?.hint ? beautifier.html(selectedItem.hint, options) : "",
            type: "textarea",
            smallText: "HTML markup",
            label: "Hint"
        }
    ]

    selectedItem.choices.forEach((item, index) => {
        formGroupArray.push({
            id: "formgroup" + index,
            defaultValue: item,
            type: "text",
            smallText: "Вариант " + (index + 1),
            label: "Вариант " + (index + 1)
        })
    })

    formGroupArray.forEach(item => {

        let newFormGroup = document.createElement("div");
        newFormGroup.className = "form-group";

        let newLabel = document.createElement("label");
        newLabel.htmlFor = item.id;
        newLabel.innerText = item.label;
        newFormGroup.appendChild(newLabel);

        let newInput;

        if (item?.type === "textarea") {
            newInput = document.createElement("textarea");

            newInput.classList = "form-control form-control-sm";
            newInput.id = item.id;
            newInput.rows = 3;
            newInput.name = item.id;
            newInput.ariaDescription = item.id;
            newInput.innerText = item?.defaultValue;
             newFormGroup.appendChild(newInput);
        }

        if (item?.type === "text" || item?.type === "date" || item?.type === "number") {
            newInput = document.createElement("input");
            newInput.type = item.type;
            newInput.classList = "form-control form-control-sm";
            newInput.id = item.id;
            newInput.name = item.id;
            newInput.ariaDescription = item.id;
            newInput.defaultValue = item?.defaultValue;
             newFormGroup.appendChild(newInput);
        }

        // if (item?.type === "select") {
        //     newInput = document.createElement("select");
        //     newInput.classList = "form-control";
        //     newInput.id = item.id;
        //     newInput.name = item.id;
        //     newInput.ariaDescription = item.id;
        //    Array.isArray(item.options) && item.options.forEach(item => {
        //     let option = document.createElement("option");
        //     option.value = item.value;
        //     option.text = item.text;
        //     newInput.add(option)
        //    })
        // }

        

        let newSmall = document.createElement("small");
        newSmall.id = item.id;
        newSmall.classList = "form-text text-muted";
        newSmall.innerText = item.smallText;
        newFormGroup.appendChild(newSmall);

        form.appendChild(newFormGroup);

    })

    let formButton = document.createElement("button");
    formButton.type = "submit";
    formButton.classList = "btn btn-sm btn-outline-primary";
    formButton.innerText = "Сохранить";

    form.appendChild(formButton);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log(e);
        const formData = new FormData(form);
        let res = {};
        for (const [key, value] of formData) {
            res[key] = value;
        }
        console.log(res);
    });
}


// Add Task to Firestore
addItemBtn.addEventListener("click", async () => {
    console.log(state);
    const post = textInput.value.trim();
    itemsList.innerHTML = ""
    mainContent.innerHTML = "";

    if (post) {
        let quiz = {};
        quiz.text = post;
        quiz.type = "multiplechoices";
        quiz.theme = "Тема";
        quiz.title = "Title";
        quiz.choices = ['4', '3', '5', '', '', '', '', '', ''];
        quiz.answers = ['4'];
        quiz.header = "Тест";
        quiz.id = getFirebaseNodeKey("openquizes");
        quiz.hint = "Подсказка"

        state = dispatch({
            type: "PUSH_ITEM_TO_ARRAY",
            payload: {
                arrayName: "openquizes",
                item: quiz
            }
        });

        renderItems(state.openquizes)
        textInput.value = "";
    } else {
        alert("Please enter a valid task.");
    }
});

// Real-time Listener for Tasks

onValue(listRef, (snapshot) => {
    const data = snapshot.val();
    let openquizes = []
    itemsList.innerHTML = ""; // Clear current tasks
    Object.keys(data).forEach(objKey => { openquizes.push(data[objKey]) });
    renderItems(openquizes)
    state = dispatch({
        type: "SEED_STATE",
        payload: {
            objects: { openquizes: openquizes }
        }
    });
});




