

function foundQuiz(text, quizes) {
 //   console.log(text);
 //   console.log(quizes);
    let res = false;
    quizes.forEach(item => {
      
        if (typeof (item) === 'string' && item.includes(text)) { res = true }
    })
    return res
}


export default foundQuiz