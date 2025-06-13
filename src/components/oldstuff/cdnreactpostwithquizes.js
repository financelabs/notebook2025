import React from 'react';
import useFetch from './services/fetchFirebaseDataWithCdns';
import CDNMultipleChoicesQuiz from './templates/CDNMultipleChoicesQuiz';
import { QuizCardProvider } from './services/QuizCardContext';



function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}



function App({ quizid }) {
    const { data, email, userEmail, user, avatarUrl, loading, error } = useFetch({ url: 'quizescases/quizesCasesIds/' + quizid, type: 'object' });


    if (loading) {
        return <div className="d-flex justify-content-center">
            <div className="spinner-grow spinner-grow-sm" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    }

    if (!!data?.set) {
        return <QuizSet /> //({ set, setTitle })
    } else {
         let { choices, ...other } = data;
        <SingleQuizCardWithStorage email={email} userEmail={userEmail} user={user} avatarUrl={avatarUrl} choices={shuffle(choices)} {...other}/>
    }
    // if (!!data?.choices) {
   
    //     return <CDNMultipleChoicesQuiz email={email} userEmail={userEmail} user={user} avatarUrl={avatarUrl} choices={shuffle(choices)} {...other} />;
    // }

    return <div>{quizid}</div>
}

function QuizSet() {
    return <div>Quiz Set</div>
}

function SingleQuizCardWithStorage(props) {
    console.log(props);
    // if (!!props?.choices) {
    //     return <CDNMultipleChoicesQuiz {...props} />;
    // }

    return <div>{quiz.id}</div>     
}


// Find all DOM containers, and render Like buttons into them.
document.querySelectorAll('.quizwithfeedback')
    .forEach(domContainer => {
        console.log(domContainer.dataset.quizid);
        const root = ReactDOM.createRoot(domContainer);
        root.render(
            <QuizCardProvider>
                <App quizid={domContainer.dataset.quizid} />
            </QuizCardProvider>
        );
    });
