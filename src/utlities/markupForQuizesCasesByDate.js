// function doSelectQuiz(id, userEmail) {
//     console.log(id, userEmail)
// }


function markupForQuizesCasesByDate(
    domIdforPosts = "cards",
    domIdforCases = "cases",
    domIdForBudgeting = "budgeting",
    currentDayQuizes = [],
    openavatarsObject = {},
    defaultUser = "John Doe",
    defaultAvatar = "https://images.unsplash.com/photo-1536300099515-6c61b290b654?q=80&w=200&auto=format&fit=crop",
    doSelectQuiz = ()=> {return null}
) {

    let quizes = currentDayQuizes.filter(item => item.source === "posts")
    let uniqueTitles = [...new Set(quizes.map(item => item?.title))];
    document.getElementById(domIdforPosts).innerHTML =
        uniqueTitles.map(title => {
            let avatarsmarkup = quizes
                .filter(quiz => quiz.title === title)
                .sort((a, b) => a.email < b.email ? -1 : 1)
                .map(quiz => {
                    let openavatar = openavatarsObject[quiz.email.replace(/[^a-zA-Z0-9]/g, "_")];
                    let finduser = openavatar?.user;
                    let user = !!finduser ? finduser : defaultUser;
                    let findavatar = openavatar?.avatarUrl;
                    let avatar = !!findavatar ? findavatar : defaultAvatar;

                    return `<img src=${avatar}
                        data-bs-toggle="tooltip" data-bs-html="true" 
                        alt=${quiz.id} id=${quiz.id} class="avatar"
                        title=${user}>`
                }).join("")

            return `
                <div class="card m-1" data-id=${title}>
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <div class="class-text">${avatarsmarkup}</div>
                    </div>
                </div>`
        })
            .join("");

    let avatarbuttons = document.getElementsByClassName("avatar");
    for (var i = 0; i < avatarbuttons.length; i++) {
        avatarbuttons[i].addEventListener('click',
            (e) => doSelectQuiz(
                e.target.id,
                quizes.find(item => item.id === e.target.id).email.replace(/[^a-zA-Z0-9]/g, "_")
            ));
    }

    let caseswithmediatypes = currentDayQuizes.filter(item => item.source === "cases" && item.type !== "accountingwithprofitscash")
    let uniqueTimeStamps = [...new Set(caseswithmediatypes.map(item => item?.timestamp))];

    document.getElementById(domIdforCases).innerHTML =
        uniqueTimeStamps.map(timestamp => {
            let filteredquizes = caseswithmediatypes.filter(quiz => quiz.timestamp === timestamp);
            //   console.log(filteredquizes);
            let quiz = filteredquizes[0];
            let openavatar = openavatarsObject[quiz.email.replace(/[^a-zA-Z0-9]/g, "_")];
            let finduser = openavatar?.user;
            let user = !!finduser ? finduser : defaultUser;
            let findavatar = openavatar?.avatarUrl;
            let avatar = !!findavatar ? findavatar : defaultAvatar;


            let casetimestampmarkup = filteredquizes.map(labcase => {
                return `<div class="col">
                <button class="btn btn-sm btn-outline-secondary casemediabutton" id=${labcase.id}>
                    ${labcase?.type}
                   </button>
                   </div>`
            })
                .join("");

            return `<div class="card my-1">
                        <div class="card-body">

                            <div class="row">
                                <div class="col-12 col-lg-3">
                                    <img src=${avatar}
                                    data-bs-toggle="tooltip" data-bs-html="true" class="avatar"
                                        alt=${quiz.id} id=${quiz.id} 
                                    title=${user}>
                                </div>    
                                <div  <div class="col-12 col-lg-9">
                                    <h5 class="card-title">${quiz.title}</h5>
                                    <div class="class-text">${quiz.comment}</div>
                                </div>    
                            </div>


                           <div class=container>
                            <div class="row">
                               ${casetimestampmarkup}
                            </div>
                           </div>        
                        </div>
                    </div>`
        }).join("");

    let casemediabuttons = document.getElementsByClassName("casemediabutton");
    for (var i = 0; i < casemediabuttons.length; i++) {
        casemediabuttons[i].addEventListener('click',
            (e) => doSelectCaseMedia(caseswithmediatypes.find(item => item.id === e.target.id)));
    }


    let caseswithbudgeting = currentDayQuizes.filter(item => item.source === "cases" && item.type === "accountingwithprofitscash")

    document.getElementById(domIdForBudgeting).innerHTML =
        caseswithbudgeting.map(casewithbudgeting => {

            let openavatar = openavatarsObject[casewithbudgeting.email.replace(/[^a-zA-Z0-9]/g, "_")];
            let finduser = openavatar?.user;
            let user = !!finduser ? finduser : defaultUser;
            let findavatar = openavatar?.avatarUrl;
            let avatar = !!findavatar ? findavatar : defaultAvatar;



            return `<div class="card my-1">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-12 col-lg-3">
                                    <img src=${avatar}
                                    data-bs-toggle="tooltip" data-bs-html="true" class="avatar"
                                        alt=${casewithbudgeting.id} id=${casewithbudgeting.id} 
                                    title=${user}>
                                </div>    
                                <div  <div class="col-12 col-lg-9">
                                    <h5 class="card-title">${casewithbudgeting.title}</h5>
                                    <div class="class-text">${casewithbudgeting.comment}</div>
                                    <button class="btn btn-sm btn-outline-secondary m-1 btnaccountingrecords" id=${casewithbudgeting.id}>Операции</button>  
                                    <button class="btn btn-sm btn-outline-secondary m-1 btnaccountingbalance" id=${casewithbudgeting.id}>Баланс</button>
                                    <button class="btn btn-sm btn-outline-secondary m-1 btnaccountingfinancialresults" id=${casewithbudgeting.id}>Фин Рез</button>        
                                    <button class="btn btn-sm btn-outline-secondary m-1 btnaccountingcashflow" id=${casewithbudgeting.id}>Кэш фло</button>
                                    <button class="btn btn-sm btn-outline-secondary m-1 btnbalancecase" id=${casewithbudgeting.id}>Диаг Баланс</button> 
                                </div>    
                            </div>
                        </div>
                    </div>`
        }).join("");


    let accountingrecordsbuttons = document.getElementsByClassName("btnaccountingrecords");
    for (var i = 0; i < accountingrecordsbuttons.length; i++) {
        accountingrecordsbuttons[i].addEventListener('click',
            (e) => showCaseRecords(currentDayQuizes.find(item => item.id === e.target.id)));
    }

    let accountingbalancebuttons = document.getElementsByClassName("btnaccountingbalance");
    for (var i = 0; i < accountingbalancebuttons.length; i++) {
        accountingbalancebuttons[i].addEventListener('click',
            (e) => showBalanceMarkUp(currentDayQuizes.find(item => item.id === e.target.id)));
    }

    let accountingcashflowbuttons = document.getElementsByClassName("btnaccountingcashflow");
    for (var i = 0; i < accountingcashflowbuttons.length; i++) {
        accountingcashflowbuttons[i].addEventListener('click',
            (e) => showShowCashFlowMarkUp(currentDayQuizes.find(item => item.id === e.target.id)));
    }

    let accountingfinancialresultsbuttons = document.getElementsByClassName("btnaccountingfinancialresults");
    for (var i = 0; i < accountingfinancialresultsbuttons.length; i++) {
        accountingfinancialresultsbuttons[i].addEventListener('click',
            (e) => showFinancialResultsMarkUp(currentDayQuizes.find(item => item.id === e.target.id)));
    }

    let balancecasesbuttons = document.getElementsByClassName("btnbalancecase");
    for (var i = 0; i < balancecasesbuttons.length; i++) {
        balancecasesbuttons[i].addEventListener('click',
            (e) => showCaseBalance(currentDayQuizes.find(item => item.id === e.target.id)));
    }

}

export default markupForQuizesCasesByDate