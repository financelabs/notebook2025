function timeout(ms, res = "fulfilled") {
  return new Promise(resolve => setTimeout(()=>resolve(res), ms));
}

export default timeout