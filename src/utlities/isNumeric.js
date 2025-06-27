  function isNumeric(str) {
      return !isNaN(str) && !isNaN(parseFloat(str));
    }

    export default isNumeric