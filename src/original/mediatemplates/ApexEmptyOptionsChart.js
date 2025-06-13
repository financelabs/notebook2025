import React from "react";
//import { useInView } from 'react-intersection-observer';
import useMedia from "../hooks/useMedia";


import Alert from "react-bootstrap/Alert";

import ApexEmptyOptionsChartLazy from "./lazy/ApexEmptyOptionsChartLazy.js"

//const ApexEmptyOptionsChartLazy = React.lazy(() => import("./lazy/ApexEmptyOptionsChartLazy.js"))



export default (props) => {
  const screenSize = useMedia(
    // Media queries
    ['(min-width: 500px)', '(min-width: 100px)'],
    // Column counts (relates to above media queries by array index)
    ['large', 'small'],
    // Default column count
    'large'
  );

  //const { ref, inView, entry } = useInView({ threshold: 0, triggerOnce: true });

  if (screenSize === 'small') { return <Alert variant={'success'}>График доступен только для широких экранов. Попробуйте развернуть экран в альбомной ориентации</Alert> }

 // const isSSR = typeof window === "undefined"
  return <div>
    {/* {!isSSR && <React.Suspense fallback={<div />}> */}
        <ApexEmptyOptionsChartLazy {...props} />
      {/* </React.Suspense> 
    }*/}
  </div>
}