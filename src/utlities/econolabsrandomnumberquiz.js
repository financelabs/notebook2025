
const $ = document.querySelector.bind(document);

function processquizwithrandomnumber({
  quizString = `<table>
    <tbody>
    <tr>
    <th>АКТИВЫ</th>
    <th>ПАССИВЫ</th>
    </tr>
    </tbody>
    <tbody>
    <tr>
    <td>Основные средства {=3000+2*{var1-10}*100}</td>
    <td>Собственный капитал {=2000+0.2*{var1-10}*100}</td>
    </tr>
    <tr>
    <td>Запасы {=3000-2*{var1-10}*100}</td>
    <td>Долгосрочные обязательства 3000</td>
    </tr>
    <tr>
    <td>Дебиторская задолженность 3500</td>
    <td>Краткосрочный кредит {=2000-0.2*{var1-10}*100}</td>
    </tr>
    <tr>
    <td>Деньги 500</td>
    <td>Кредиторская задолженность 1000</td>
    </tr></tbody>
    </table>`,
  answer = "3000+2*{var1-10}*100-2000-0.2*{var1-10}*100",
  randomNumber = 5
}) {
  function extract([beg, end]) {
      const matcher = new RegExp(`${beg}(.*?)${end}`, "gm");
      const normalise = (str) => str.slice(beg.length, end.length * -1);
      return function (str) {
          return str.match(matcher).map(normalise);
      };
  }
  let parser = new formulaParser.Parser();
  // It returns `Object {error: null, result: 14}`
  //  console.log(parser.parse('SUM(1, 6, 7)'));
  // let parser = new Parser();
  const searchRegExp = /{var1-10}/g;
  const replaceWith = randomNumber.toString();
  quizString = quizString.replace(searchRegExp, replaceWith);

  answer = answer.replace(searchRegExp, replaceWith);
  answer = Math.round(parser.parse(answer).result * 10000) / 10000;

  let stringExtractor = extract(["{=", "}"]);
  let stuffIneed = stringExtractor(quizString);


  for (let i = 0; i < stuffIneed.length; i++) {
      let feedback = Math.round(parser.parse(stuffIneed[i]).result * 10000) / 10000;
      quizString = quizString.replace("{=" + stuffIneed[i] + "}", feedback);
  }

  return {
      quizString: quizString,
      answer: answer
  }
}


class EconolabsRandomNumberQuiz {
  constructor(selector, callBack) {
    this.quizStringMarkup = $(`#${selector}`);
    this.selector = selector;
    this.callBack = callBack  
  }

 
  addEvents(text, answer, randomNumber) {

    let res = processquizwithrandomnumber({quizString: text, answer, randomNumber});

    this.quizStringMarkup.innerHTML = res.quizString;
    $("#quizChecks").innerHTML = `
    <div class="input-group input-group-sm mb-3">
      <span class="input-group-text" id="inputGroup-sizing-sm">Число</span>
      <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
  </div>
    `;

  //  this.callBack(res.answer)
    
    
  //   let markup = choices.map((item, index) => {
  //       return `<div class="form-check">
  //       <input class="form-check-input ${this.selector}" type="radio" name="quizRadio" id="${index}">
  //       <label class="form-check-label" for='${index}'>${item}</label>
  //   </div>`
  //   }).join("");

  //   this.ul.innerHTML = markup;

  //   let quizoptions = document.getElementsByClassName(this.selector);
  //   for (var i = 0; i < quizoptions.length; i++) {
  //       quizoptions[i].addEventListener('click',
  //       (e) => { this.callBack(choices[e.target.id])})}
   }

}

export default EconolabsRandomNumberQuiz