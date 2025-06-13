import vanillajsQuizByDateCard from "./vanillajsQuizByDateCard";
import createMinimalProtoArray from "./createMinimalProtoArray";
import makeDomNodeForSpreadsheet from "./makeDomNodeForSpreadsheet";


function doOpenQuizInModal(id, userEmail, apexchart = null, quizcontainer = "modalbody", quizcaseModal = 'quizcaseModal', getAvatar, fetchUserPost ) {
    apexchart ? apexchart.destroy() : null
    document.getElementById(quizcontainer).innerHTML = "";

    let user, avatarUrl;

    var myModal = new bootstrap.Modal(document.getElementById(quizcaseModal)); //, options

    getAvatar(userEmail)
        .then(info => {
            user = !!info?.user ? info.user : "Иван Оленев";
            avatarUrl = !!info?.avatarUrl ? info?.avatarUrl :
                "https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop";

            store.dispatch(api.endpoints.fetchWorkbookPost.initiate({ userEmail, id }))
                .then(foundquiz => {

                    if (!!foundquiz?.data) {
                        if (foundquiz.data?.type === "spreadsheet") {
                            vanillajsQuizByDateCard(quizcontainer, { ...foundquiz.data, user, avatarUrl });
                            document.getElementById("studentquiz")
                                .appendChild(makeDomNodeForSpreadsheet(createMinimalProtoArray(foundquiz.data?.content, 0, 0)));
                        }

                        if (foundquiz.data?.type === "html") {
                            vanillajsQuizByDateCard(quizcontainer, { ...foundquiz.data, quizString: foundquiz.data?.content, user, avatarUrl });
                        }

                        if (foundquiz.data?.type === "multiplechoices") {
                            vanillajsQuizByDateCard(quizcontainer, { ...foundquiz.data, quizString: foundquiz.data?.content + "<br> " + foundquiz.data?.answer, user, avatarUrl });
                        }
                    } else {
                        let altid = "-N" + id.split("-N").pop();

                        store.dispatch(api.endpoints.fetchQuizesCasesEntyty.initiate({ userEmail, id: altid }))
                            .then(hint => {
                                if (hint.data?.type === "spreadsheet") {
                                    vanillajsQuizByDateCard(quizcontainer, { ...hint.data, user, avatarUrl });
                                    document.getElementById("studentquiz")
                                        .appendChild(makeDomNodeForSpreadsheet(createMinimalProtoArray(hint.data.content, 0, 0)));
                                }

                                if (hint.data?.type === "html") {
                                    vanillajsQuizByDateCard(quizcontainer, { ...hint.data, quizString: hint.data?.content, user, avatarUrl });
                                }

                                if (hint.data?.type === "multiplechoices") {
                                    vanillajsQuizByDateCard(quizcontainer, { ...hint.data, quizString: hint.data?.content + "<br> " + hint.data?.answer, user, avatarUrl });
                                }
                            })
                    }
                });
        })
        .then(() => myModal.show())
}

export default doOpenQuizInModal