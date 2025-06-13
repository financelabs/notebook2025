function applyClassToTableTag(htmlstring) {
    if (htmlstring instanceof String && htmlstring.includes("table")) {
        const regex = /table/i;
        return htmlstring.replace(regex, 'table class="table table-sm"')
    }
    return htmlstring
}


function vanillajsQuizByDateCard(e, t) {

    return document.getElementById(e).innerHTML = `
        <div class="card m-1">
            <div class="card-body" id="studentquiz">
                <h5 class="card-title">${t?.theme ? t.theme : ""}</h5>
                <p class="card-text">${t?.title ? t.title : ""}</p>
                <hr />
                <div class=row>
                    <div class="col-12 col-lg-3">
                        <img src=${t.avatarUrl}
                                data-bs-toggle="tooltip" data-bs-html="true" 
                                alt=${t.id} id=${t.id} class="avatar"
                                title=${t.user}>
                        <div class="m-1">
                        ${t?.user ? t.user : ""}
                        </div>
                    </div>
                    <div class="col-12 col-lg-9">
                        <div id="studenthint" class="mb-3">${t?.quizString ?  applyClassToTableTag(t.quizString) : ""}</div>
                    </div>
                <div>    
                <hr />
            </div>
        </div>`

}

export default vanillajsQuizByDateCard