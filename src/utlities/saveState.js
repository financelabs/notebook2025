const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
     // console.log(serializedState);
      localStorage.setItem('econolabs', serializedState);
    } catch (err) {
      console.log(err)
    }
  }

 export default saveState 