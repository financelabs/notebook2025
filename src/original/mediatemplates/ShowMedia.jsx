import React from "react";

//import ReactHtmlParser from 'react-html-parser';
import parse from 'html-react-parser';


import { useFirebaseNode } from "../hooks/useFirebaseNode";

// import ScatterQuotesApexChart from "./ScatterQuotesApexChart";
// import DatalineQuotesApexChart from "./DatalineQuotesApexChart";
import ApexEmptyOptionsChart from "./ApexEmptyOptionsChart";

import Image from "react-bootstrap/Image";


export function MediaItems({ mediaItems }) {
  console.log(mediaItems);
  let mediaArray = mediaItems.map(item => { return item });
  return <div>
    {mediaArray.map((item, index) => {
      if (item.mediaType === 'html' || item.mediaType === 'markdown') { return <div key={index}>{parse(item.content)}</div> }
    })}
  </div>
}


export default function ShowMedia(props) {
  const { data: mediaItems, loading, error } = useFirebaseNode(
    props.datafirenode
  );
  //  console.log(props.content, mediaItems);

  if (!!loading || !mediaItems) {
    return <div>...</div>;
  }
  if (!!error) {
    return <div>:-)</div>;
  }

  //  console.log(mediaItems);

  return (
    <div>
      {Object.keys(mediaItems).map((mediaItem, mediaItemsIndex) => {

        if (mediaItem === "html") { return <div key={mediaItemsIndex}>{parse(mediaItems[mediaItem])}</div> }

        if (mediaItem === "datetimebarapexchart" || mediaItem === "datetimelineapexchart" ||
          mediaItem === "arraycategorieslineapexchart" || mediaItem === "arraycategoriesbarapexchart"
        ) {
          return (
            <GetSeriesCategoriesOptionsForApexChart
              key={mediaItemsIndex}
              firenode={mediaItems[mediaItem]}
              mediaItem={mediaItem}
            />
          );
        }

        if (
          mediaItem === "scatterquotesapexchart" ||
          mediaItem === "scatterquotesapexchartoptions" ||
          mediaItem === "scatterapexchart"
        ) {
          return (
            <GetReadyScatterApexChart
              key={mediaItemsIndex}
              firenode={mediaItems[mediaItem]}
            />
          );
        }
        if (
          mediaItem === "datalinequotesapexchart" ||
          mediaItem === "datalinequotesapexchartoptions" ||
          mediaItem === "datetimeareanocategoriesapexchart"
        ) {
          return (
            <GetReadyDatalineQuotesApexChart
              key={mediaItemsIndex}
              firenode={mediaItems[mediaItem]}
            />
          );
        }

        if (mediaItem === "images") {
          return (
            <ShowImages key={mediaItemsIndex} urls={mediaItems.images.urls} />
          );
        }

        return null;
      })}
    </div>
  );
}

export function GetSeriesCategoriesOptionsForApexChart({ firenode, mediaItem }) {

//  console.log(firenode);
//  console.log(mediaItem);

  let series = !!firenode && Object.keys(firenode.series).map((line) => {
    return {
      name: firenode["series"][line]["name"],
      data: Object.keys(firenode["series"][line]["data"]).map((line_point) => {
        return firenode["series"][line]["data"][line_point]
      }),
    };
  });

  let categories = !!firenode && Object.keys(firenode.categories).map((line_point) => { return firenode.categories[line_point] });

     console.log(series);
     console.log(categories);

  return <ApexEmptyOptionsChart
    showAs={mediaItem} series={series}
    options={!!firenode?.options ? firenode.options : {}}
    categories={categories}
  />
}

export function GetReadyScatterApexChart({ firenode }) {

 // console.log(firenode);

  let series = !!firenode && Object.keys(firenode.series).map((scatter) => {
    return [firenode["series"][scatter][0], firenode["series"][scatter][1]];
  });
 //        console.log(series)
  return (
    <ApexEmptyOptionsChart
      showAs={"scatterquotesapexchart"}
      series={series}
      options={!!firenode?.options ? firenode.options : {}}
    />
  );
  // <ScatterQuotesApexChart series={series} options={
  //   !!firenode?.options
  //     ? firenode.options
  //     : {}
  // } />
}

export function GetReadyDatalineQuotesApexChart({ firenode }) {

//  console.log(firenode);
  
  let series = !!firenode && Object.keys(firenode.series).map((line) => {
    return {
      name: firenode["series"][line]["name"],
      data: Object.keys(firenode["series"][line]["data"]).map((line_point) => {
        return [
          firenode["series"][line]["data"][line_point][0],
          firenode["series"][line]["data"][line_point][1],
        ];
      }),
    };
  });
 //     console.log(series);
  return (
    <ApexEmptyOptionsChart
      showAs={"datalinequotesapexchart"}
      // <DatalineQuotesApexChart
      series={series}
      options={!!firenode?.options ? firenode.options : {}}
    />
  );
}

function ShowImages({ urls }) {
  return (
    <>
      {urls?.[0] ? <Image src={urls[0]} /> : null}
      {urls?.[1] ? <Image src={urls[1]} /> : null}
      {urls?.[2] ? <Image src={urls[2]} /> : null}
      {urls?.[3] ? <Image src={urls[3]} /> : null}
      {urls?.[4] ? <Image src={urls[4]} /> : null}
    </>
  );
}