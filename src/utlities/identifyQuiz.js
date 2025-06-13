function identifyQuiz(title, text) {
    if (typeof (text) === 'string' && text.includes('<br>')) {
        //       console.log(item.quizString.split('<br>')[0])
        return title + " " + text.split('<br>')[0]
    } else {
        return title + " " + !!text ? text : ""
    }
}

export default identifyQuiz