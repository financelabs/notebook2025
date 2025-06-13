
const $ = document.querySelector.bind(document);

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

class EconolabsCheckQuiz {
  constructor(selector, callBack) {
    this.ul = $(`#${selector}`);
    this.selector = selector;
    this.callBack = callBack  
  }

  addEvents(choices) {

    let mixedAnswers = shuffle([...choices]);
    
    let markup = mixedAnswers.map((item, index) => {
        return `
        <div class="form-check">
          <input class="form-check-input ${this.selector}" type="checkbox" value="" id="${index}">
          <label class="form-check-label" for='${index}'>
          ${item}
          </label>
        </div>`
    }).join("");

    this.ul.innerHTML = markup;

    let quizoptions = document.getElementsByClassName(this.selector);
    for (var i = 0; i < quizoptions.length; i++) {
        quizoptions[i].addEventListener('click',
        (e) => { this.callBack( mixedAnswers[e.target.id])})}
  }

}

export default EconolabsCheckQuiz