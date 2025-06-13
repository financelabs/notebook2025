function loadState() {
    try {
      const serializedState = localStorage.getItem('econolabs');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined
    }
  };

  export default loadState