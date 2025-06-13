import alphabet from "./alphabet";

function createProtoObject(protoArray) {
    let protoObject = {};
    for (var i = 0; i < protoArray.length; i++) {
      var row = protoArray[i];
      for (var j = 0; j < row.length; j++) {
        if (protoArray[i][j] !== "") {
          protoObject[alphabet[j] + (i+1)] = protoArray[i][j];
        }
      }
    }
    return protoObject;
  }

export default createProtoObject