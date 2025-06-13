//  <script src="https://cdn.jsdelivr.net/npm/hot-formula-parser@4.0.0/dist/formula-parser.min.js"></script>

function calculateRandomNumber(quizString, randomNumber) {
  //  console.log(quizString, randomNumber);
  //let parser = new FormulaParser();
  let parser = new formulaParser.Parser();
  //let quizString = `this {={var1-10}+1} some {=2+{var1-10}} that can be {=3+{var1-10}} with a {=4+{var1-10}} function`;
  const searchRegExp = /{var1-10}/g;
  const replaceWith = randomNumber.toString();
  quizString = quizString.replace(searchRegExp, replaceWith);
  //  console.log(quizString);
  let stringExtractor = extract(["{=", "}"]);
  let stuffIneed = stringExtractor(quizString);
  //  console.log(stuffIneed);
  let feedback = Math.round(parser.parse(stuffIneed[0]).result * 1000) / 1000;
  // for (let i = 0; i < stuffIneed.length; i++) {
  //   let feedback = Math.round(parser.parse(stuffIneed[i]).result * 1000) / 1000;
  //    quizString = quizString.replace("{=" + stuffIneed[i] + "}", feedback);
  // }
  //  console.log(feedback);
  return feedback //'2000+2*2.534908428867788*100'
}

export default calculateRandomNumber