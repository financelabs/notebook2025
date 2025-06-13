// const searchRegExp = /{var1-10}/g;
//   const replaceWith = randomNumber.toString();
//   quizString = quizString.replace(searchRegExp, replaceWith);
//   answer = answer.replace(searchRegExp, replaceWith);
//   answer = Math.round(parser.parse(answer).result * 10000) / 10000;
//   let stringExtractor = extract(["{=", "}"]);
//   let stuffIneed = stringExtractor(quizString);
//   for (let i = 0; i < stuffIneed.length; i++) {
//       let feedback = Math.round(parser.parse(stuffIneed[i]).result * 10000) / 10000;
//       quizString = quizString.replace("{=" + stuffIneed[i] + "}", feedback);
//   }



function extract([beg, end]) {
    const matcher = new RegExp(`${beg}(.*?)${end}`, "gm");
    const normalise = (str) => str.slice(beg.length, end.length * -1);
    return function (str) {
      return str.match(matcher).map(normalise);
    };
  }

  
  export default extract