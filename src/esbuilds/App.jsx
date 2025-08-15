import React, { useEffect } from 'react';
import { Counter } from '../original/features/counter/Counter';


function App() {

  useEffect(()=>{
 console.log("ha")
  },[])
 
  return <Counter /> 
}

export default App;