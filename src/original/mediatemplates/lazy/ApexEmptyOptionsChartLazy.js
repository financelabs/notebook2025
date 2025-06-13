import React from "react";
import { produce } from "immer";
import { merge } from "lodash";
import Chart from "react-apexcharts";

import Container from "react-bootstrap/Container";

//function Chart() { return <div>Chart</div>}

export default function ApexEmptyOptionsChartLazy(props) {



  if (props?.showAs === "datalinebarapexchart" || props?.showAs === "datetimebarapexchart") {
    //    return <DatalineBarApexChartLazy {...props} />;
    return <DateTimeBarApexChart {...props} />;
  }
  if (props?.showAs === "datetimelineapexchart") {
    //  return <DataLineBrightColorsLazy {...props} />;
    // console.log(props);
    return <DateTimeLineApexChart {...props} />;
  }

  if (props?.showAs === "datalinebrightcolor") {
    //  return <DataLineBrightColorsLazy {...props} />;
    // console.log(props);
    return <DataLineBrightColors {...props} />;
  }



  if (props?.showAs === "lineapexchart" || props?.showAs === "arraycategorieslineapexchart") {
    // return <LineApexChartLazy {...props} />;
    return <ArrayCategoriesLineApexChart {...props} />;
  }
  if (props?.showAs === "apexbarchartsgrouped" || props?.showAs === "arraycategoriesbarapexchart") {
    return <ArrayCategoriesBarApexChart {...props} />;
  }


  if (props?.showAs === "datalinequotesapexchart" || props?.showAs === "datetimeareanocategoriesapexchart") {
    // return <DatalineQuotesApexChartLazy {...props} />;
    return <DateTimeAreaApexChart {...props} />;
  }

  if (props?.showAs === "scatterquotesapexchart" || props?.showAs === "scatterapexchart") {
    return <ScatterApexChart {...props} />;
  }

  return null;
}

function makeCategories(categories) {

  if (!Array.isArray(categories)) return []

  let newCategories = categories.map(item => {
    if (item > 1000000) return item
    if (item.includes("/")) {
      let [month, day, year] = item.split('/'); //"8/1/2020"
      //    console.log(month, day, year);
      return +new Date(+year, +month - 1, +day + 1);
    }
    if (item.includes("+")) {
      let [, days] = item.split('+'); // "TODAY()+8"
      return +new Date() + 1000 * 60 * 60 * 24 * (+days);
    }
    if (item.includes("-")) {
      let [, days] = item.split('-'); // "TODAY()-8"
      return +new Date() + 1000 * 60 * 60 * 24 * (-days);
    }
    return +Date.now()
  }
  )
  //  console.log(newCategories);
  return newCategories
}

function DataLineBrightColors(props) {
  console.log(props);

  let series = !!props?.series
    ? props.series
    : [
      { name: "Компания A", data: [100, 1500, 1150, 3000] },
      { name: "Компания Б", data: [1000, 900, 1460, 1300] },
      { name: "Компания В", data: [1000, 1300, 1250, 1550] },
      { name: "Индекс", data: [1000, 1400, 1200, 1600] },
    ];

  let defaultBrightColorsLineApexCharts = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
    },
    title: {
      text: "",
      align: "left",
      style: {
        // color: "gray",
        // fontSize: '1rem',
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "normal",
        marginTop: "2rem",
        // cssClass: 'apexcharts-title',
      },
    },
    stroke: {
      //        width: 7,
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: !!props?.categories
        ? props.categories
        : [...new Array(5)].map((item, index) => {
          var d = new Date();
          return d.setMonth(d.getMonth() - 14 + index);
        }),
      title: {
        text: "",
        style: {
          color: "gray",
          fontSize: "1rem",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 200,
          cssClass: "apexcharts-xaxis-title",
          margin: "1rem",
          padding: "1rem",
        },
      },
      style: {
        color: "gray",
        fontSize: "1rem",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 200,
        cssClass: "apexcharts-yaxis-title",
        margin: "1rem",
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    markers: {
      size: 2,
      colors: ["#D3D3D3"],
      strokeColors: "#808080",
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    yaxis: {
      // min: 800,
      // max: 1800,
      title: {
        text: "",
        style: {
          color: "gray",
          fontSize: "1rem",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 200,
          cssClass: "apexcharts-yaxis-title",
        },
      },
      tickAmount: 5,
      labels: {
        formatter: function (val) {
          return parseFloat(val).toFixed(1);
        },
      },
    },
  };

    console.log("defaultBrightColorsLineApexCharts");
    console.log(options);

  let options = (() => {
    if (!!props?.options) {
      let updatedOptions = { ...defaultBrightColorsLineApexCharts };
      updatedOptions = { ...updatedOptions, ...props.options };
      updatedOptions.xaxis.categories = props.categories;
      return updatedOptions;
    }
    return defaultBrightColorsLineApexCharts;
  })();

  return (
    <Container className="mt-3">
      <Chart options={defaultBrightColorsLineApexCharts} series={series} categories={props.categories} type="line" />
    </Container>
  );
}

function DateTimeBarApexChart(
  {
    series = [
      { name: "Компания A", data: [100, 1500, 1150, 3000] },
      { name: "Компания Б", data: [1000, 900, 1460, 1300] },
      { name: "Компания В", data: [1000, 1300, 1250, 1550] },
      { name: "Индекс", data: [1000, 1400, 1200, 1600] },
    ],
    categories = [...new Array(4)].map((item, index) => { var d = new Date(); return d.setMonth(d.getMonth() - 4 + index) }),
    chartTitle = "Динамика",
    xaxisTitle = "",
    yaxisTitle = "Значение",
    options
  }) {

  const defaultDateTimeBarApexChartOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    title: { text: chartTitle, align: "left", style: { fontFamily: "Helvetica, Arial, sans-serif", marginTop: "2rem", fontWeight: 'normal' } },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%' } }, // columnWidth: '55%', endingShape: 'rounded'
    dataLabels: { enabled: false },
    stroke: { show: true, width: 1, colors: ['transparent'] },
    xaxis: {
      type: "datetime", categories: makeCategories(categories),
      title: { text: xaxisTitle, style: { fontFamily: "Helvetica, Arial, sans-serif", margin: "1rem", padding: "1rem", fontWeight: 'normal' } }
    },
    yaxis: { title: { text: yaxisTitle }, style: { fontSize: '1rem', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 'normal', cssClass: 'apexcharts-yaxis-title' } },
    fill: { opacity: 1 },
    tooltip: {
      x: { format: "MMM yy" }, //'20' + 'yy'
      y: { formatter: function (val) { return val } }
    },
  }

  console.log("defaultDateTimeBarApexChartOptions");
    console.log(options);

  let chartOptions = merge({}, defaultDateTimeBarApexChartOptions, options )
  
  
  // (() => {
  //   if (!!options) {
  //     let updatedOptions = { ...defaultDateTimeBarApexChartOptions, ...options };
  //     return updatedOptions;
  //   }
  //   return defaultDateTimeBarApexChartOptions;
  // })();

  return (
    <Container className="mt-3">
      <Chart options={defaultDateTimeBarApexChartOptions} series={series} categories={makeCategories(categories)} type="bar" />
    </Container>
  );
}

function DateTimeLineApexChart(
  {
    series = [
      { name: "Компания A", data: [100, 1500, 1150, 3000] },
      { name: "Компания Б", data: [1000, 900, 1460, 1300] },
      { name: "Компания В", data: [1000, 1300, 1250, 1550] },
      { name: "Индекс", data: [1000, 1400, 1200, 1600] },
    ],
    categories = [...new Array(4)].map((item, index) => { var d = new Date(); return d.setMonth(d.getMonth() - 4 + index) }),
    chartTitle = "Динамика",
    xaxisTitle = "",
    yaxisTitle = "Значение",
    options
  }
) {

  console.log("categories " + categories);

  let defaultDateTimeLineApexChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    title: { text: chartTitle, align: "left", style: { fontFamily: "Helvetica, Arial, sans-serif", marginTop: "2rem", fontWeight: 'normal' } },
    stroke: { curve: "smooth" },
    xaxis: {
      type: "datetime",
      categories: makeCategories(categories),
      title: { text: xaxisTitle, style: { fontFamily: "Helvetica, Arial, sans-serif", margin: "1rem", padding: "1rem", fontWeight: 'normal' } },
      tooltip: { x: { format: "dd MMM yyyy" } }
    },
    markers: { size: 2, colors: ["#D3D3D3"], strokeColors: "#808080", strokeWidth: 2, hover: { size: 4 } },
    yaxis: {
      title: {
        text: yaxisTitle,
        style: { fontSize: '1rem', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 'normal', cssClass: 'apexcharts-yaxis-title' }
      },
      tickAmount: 5,
      labels: { formatter: function (val) { return parseFloat(val).toFixed(1) } },
      // min: 800, max: 1800,
    },
  };

  console.log("defaultDateTimeLineApexChartOptions");
    console.log(options);

  function prepareChartOptions() {
    if (!!options) {
       return produce(defaultDateTimeLineApexChartOptions, draftState => {
        draftState.xaxis.categories = makeCategories(categories);
      });
    }
    return defaultDateTimeLineApexChartOptions;
  }



  // let chartOptions = (() => {
  //   if (!!options) {
  //     let updatedOptions = { ...defaultDateTimeLineApexChartOptions, ...options };
  //     updatedOptions.xaxis.categories = makeCategories(categories);
  //     return updatedOptions;
  //   }
  //   return defaultDateTimeLineApexChartOptions;
  // })();

  return (
    <Container className="mt-3">
      <Chart options={defaultDateTimeLineApexChartOptions} series={series} categories={makeCategories(categories)} type={"line"}/>
    </Container>
  );
}

function ArrayCategoriesLineApexChart({
  series = [
    { name: "Компания A", data: [100, 1500, 1150, 3000] },
    { name: "Компания Б", data: [1000, 900, 1460, 1300] },
    { name: "Компания В", data: [1000, 1300, 1250, 1550] },
    { name: "Индекс", data: [1000, 1400, 1200, 1600] },
  ],
  categories = ['1кв. 2022г.', '2кв. 2022г.', '3кв. 2022г.', '4кв. 2022г.'],
  chartTitle = "Динамика",
  xaxisTitle = "Кварталы",
  yaxisTitle = "Значение",
  options
}) {

  const defaultArrayCategoriesLineApexChartOptions = {
    chart: { type: 'line', toolbar: { show: false } },
    title: { text: chartTitle, align: "left", style: { fontFamily: "Helvetica, Arial, sans-serif", marginTop: "2rem", fontWeight: 'normal' } },
    // stroke: { width: 7, curve: 'smooth' },
    dataLabels: { enabled: true },
    xaxis: {
      categories: categories,
      title: { text: xaxisTitle, style: { fontFamily: "Helvetica, Arial, sans-serif", margin: "1rem", padding: "1rem", fontWeight: 'normal', cssClass: 'apexcharts-xaxis-title' } }
    },
    markers: { size: 2, colors: ["#D3D3D3"], strokeColors: "#808080", strokeWidth: 2, hover: { size: 4 } },
    yaxis: {
      title: {
        text: yaxisTitle,
        style: { fontSize: '1rem', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 'normal', cssClass: 'apexcharts-yaxis-title' }
      },
      //  tickAmount: 8,
      labels: { formatter: function (val) { return parseFloat(val).toFixed(1) } }
      // min: -20,
      // max: 20,
    }
  }

 // console.log("defaultArrayCategoriesLineApexChartOptions");
    let chartOptions = !!options ? merge({}, defaultArrayCategoriesLineApexChartOptions, options ) : defaultArrayCategoriesLineApexChartOptions;
 // let chartOptions = merge({}, defaultArrayCategoriesLineApexChartOptions, options )

  // let chartOptions = (() => {
  //   if (!!options) {
  //     let updatedOptions = { ...defaultArrayCategoriesLineApexChartOptions, ...options };
  //     return updatedOptions;
  //   }
  //   return defaultArrayCategoriesLineApexChartOptions;
  // })();


  return (
    <Container className="mt-3">
      <Chart options={chartOptions} series={series} type="line"/>
    </Container>
  );
}

function ArrayCategoriesBarApexChart({
  series = [
    { name: "Компания A", data: [100, 1500, 1150, 3000] },
    { name: "Компания Б", data: [1000, 900, 1460, 1300] },
    { name: "Компания В", data: [1000, 1300, 1250, 1550] },
    { name: "Индекс", data: [1000, 1400, 1200, 1600] },
  ],
  categories = ['1кв. 2022г.', '2кв. 2022г.', '3кв. 2022г.', '4кв. 2022г.'],
  chartTitle = "Динамика",
  xaxisTitle = "Кварталы",
  yaxisTitle = "Значение",
  options
}) {
  //    console.log(props);

  let defaultArrayCategoriesBarApexChartOptions = {
    title: { text: chartTitle, align: "left", style: { fontFamily: "Helvetica, Arial, sans-serif", marginTop: "2rem", fontWeight: 'normal' } },
    xaxis: {
      categories: categories,
      title: { text: xaxisTitle, style: { fontFamily: "Helvetica, Arial, sans-serif", margin: "1rem", padding: "1rem", fontWeight: 'normal', cssClass: 'apexcharts-xaxis-title' } }
    },

    yaxis: {
      title: {
        text: yaxisTitle,
        style: { fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 'normal', cssClass: 'apexcharts-yaxis-title' } //fontSize: '1rem', 
      }
    }
  };

 // console.log(options);

//  console.log("defaultArrayCategoriesBarApexChartOptions");
  let chartOptions = !!options ? merge({}, defaultArrayCategoriesBarApexChartOptions, options ) : defaultArrayCategoriesBarApexChartOptions;
  
  

  // let chartOptions = (() => {
  //   if (!!options) {
  //     let updatedOptions = {
  //       ...defaultArrayCategoriesBarApexChartOptions,
  //       ...options,
  //     };
  //     return updatedOptions;
  //   }
  //   return defaultArrayCategoriesBarApexChartOptions;
  // })();

  return (
    <Container className="mt-3">
      <Chart
        options={chartOptions}
        series={series}
        type="bar"
      />
    </Container>
  );
}

function DateTimeAreaApexChart({
  series = [
    {
      name: "dataline1",
      data: [
        ['Dec 23 2017', 100],
        ['Dec 23 2020', 120],
      ],
    },
    {
      name: "dataline2",
      data: [
        ['Dec 23 2017', 150],
        ['Dec 23 2020', 80],
      ],
    },
  ],
  chartTitle = "",
  xaxisTitle = "",
  yaxisTitle = "",
  options
}
) {

  let defaultDateTimeAreaApexChartOptions = {
    chart: { type: "area", zoom: { autoScaleYaxis: true } },
    title: { text: chartTitle, align: 'left', style: { fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 'normal', marginTop: '2rem', cssClass: 'apexcharts-title' } },  //height: 350,
    dataLabels: { enabled: false },
    markers: { size: 0, style: "hollow" },
    xaxis: {
      type: "datetime", title: { text: xaxisTitle, style: { fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 'normal', cssClass: 'apexcharts-xaxis-title' } },
      //min: new Date('01 Mar 2012').getTime(),
      // tickAmount: 6,
    },
    tooltip: { x: { format: "dd MMM yyyy" } },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, stops: [0, 100] } },
    yaxis: {
      title: {
        text: yaxisTitle, style: { fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 200, cssClass: 'apexcharts-yaxis-title' }
        // min: -20,
        // max: 20,
      },
      labels: {
        formatter: function (val) {
          return parseFloat(val).toFixed(1)
        }
      }
    }
  };

  console.log("defaultDateTimeAreaApexChartOptions");
    console.log(options);

  let chartOptions = merge({}, defaultDateTimeAreaApexChartOptions, options )
  

  // let chartOptions = (() => {
  //   if (!!options) {
  //     return {
  //       ...defaultDateTimeAreaApexChartOptions,
  //       ...options,
  //     };
  //   }
  //   return defaultDateTimeAreaApexChartOptions;
  // })();

  return (
    <Chart
      options={defaultDateTimeAreaApexChartOptions}
      series={series}
      type="area"
    />
  );
}

function ScatterApexChart({
  series,
  seriesWithNames,
  chartTitle = "",
  xaxisTitle = "",
  yaxisTitle = "",
  options,
}) {

  let defaultScatterApexChartOptions = {
    chart: { type: "scatter", zoom: { enabled: true, type: "xy" } }, //height: 350,
    title: { text: chartTitle, align: "left", style: { fontFamily: "Helvetica, Arial, sans-serif", fontWeight: "normal", marginTop: '2rem', cssClass: 'apexcharts-title' } },
    xaxis: {
      title: { text: xaxisTitle, style: { fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 200, cssClass: "apexcharts-xaxis-title" } },
      tickAmount: 10,
      labels: { formatter: function (val) { return parseFloat(val).toFixed(1) } },
    },
    yaxis: {
      title: { text: yaxisTitle, style: { fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 200, cssClass: "apexcharts-yaxis-title" } },
      tickAmount: 7
    },
  };

  //  console.log(props.series);
  let scatterSeries = (() => {
    if (!!seriesWithNames) { return seriesWithNames }
    if (!!series) { return [{ name: "y", data: [...series] }] }
    return [{ name: "y", data: [[5, 5], [-5, 5], [-5, -5], [5, -5], [1, 1], [-2, -2]] }];
  })();

  console.log("defaultScatterApexChartOptions")
    console.log(options);

 let chartOptions = merge({}, defaultScatterApexChartOptions, options )

  // let chartOptions = (() => {
  //   if (!!options) {
  //     return {
  //       ...defaultScatterApexChartOptions,
  //       ...options,
  //     };
  //   }
  //   return defaultScatterApexChartOptions;
  // })();

  return (
    <Chart
      options={defaultScatterApexChartOptions} //
      series={scatterSeries}
      type="scatter"
    />
  );
}



// import React from "react";
// import Chart from "react-apexcharts";

// import Container from "react-bootstrap/Container";

// export default function ApexEmptyOptionsChartLazy(props) {



//   if (props?.showAs === "datalinebarapexchart") {
//     return <DatalineBarApexChartLazy {...props} />;
//   }

//   if (props?.showAs === "lineapexchart") {
//     return <LineApexChartLazy {...props} />;
//   }


//     if (props?.showAs === "datalinequotesapexchart") {
//         return <DatalineQuotesApexChartLazy {...props} />;
//       }

//   if (props?.showAs === "datalinebrightcolor") {
//     return <DataLineBrightColorsLazy {...props} />;
//   }

//     if (props?.showAs === "scatterquotesapexchart") {
//     return <ScatterQuotesApexChartOptionsLazy {...props} />;
//   }

//   if (!props?.showAs || props?.showAs === "apexbarchartsgrouped" ) {
//     return <ApexBarChartsGroupedLazy {...props} />;
//   }

//   return null;
// }

// function ApexBarChartsGroupedLazy(props) {
//   //    console.log(props);

//   let defaultApexBarChartsGroupedOptions = { xaxis: { categories: [] } };

//   let options = (() => {
//     if (!!props?.options) {
//       let updatedOptions = {
//         ...defaultApexBarChartsGroupedOptions,
//         ...props.options,
//       };
//       return updatedOptions;
//     }
//     return defaultApexBarChartsGroupedOptions;
//   })();

//   let categories = (() => {
//     if (!!props?.categories) {
//       return props.categories;
//     }
//     return [2021, 2022, 2023];
//   })();

//   options.xaxis.categories = categories;

//   let series = (() => {
//     if (!!props?.series) {
//       return props.series;
//     }
//     return [
//       {
//         name: "Кэш фло",
//         data: [44, 55, 41],
//       },
//       {
//         name: "Дисконтированный кэш-фло",
//         data: [44, 50, 33],
//       },
//     ];
//   })();

//   return (
//     <Container className="mt-3">
//       <Chart
//         options={options}
//         series={series}
//         type={props?.type ? props.type : "line"}
//         height={props?.height ? props.height : 290}
//       />
//     </Container>
//   );
// }

// function ScatterQuotesApexChartOptionsLazy(props) {
//   const scatterQuotesApexChartOptions = {
//     chart: {
//       height: 350,
//       type: "scatter",
//       zoom: {
//         enabled: true,
//         type: "xy",
//       },
//     },
//     title: {
//       text: props?.chartTitle ? props.chartTitle : "",
//       align: "left",
//       style: {
//         //            color: "gray",
//         //    fontSize: '1rem',
//         fontFamily: "Helvetica, Arial, sans-serif",
//         fontWeight: "normal",
//         //            marginTop: '2rem'
//         //         cssClass: 'apexcharts-title',
//       },
//     },
//     xaxis: {
//       title: {
//         text: !!props?.xaxisTitle ? props?.xaxisTitle : "",
//         style: {
//           color: "gray",
//           fontSize: "1rem",
//           fontFamily: "Helvetica, Arial, sans-serif",
//           fontWeight: 200,
//           cssClass: "apexcharts-xaxis-title",
//         },
//       },
//       tickAmount: 10,
//       labels: {
//         formatter: function (val) {
//           return parseFloat(val).toFixed(1);
//         },
//       },
//     },
//     yaxis: {
//       title: {
//         text: !!props?.yaxisTitle ? props.yaxisTitle : "",
//         style: {
//           color: "gray",
//           fontSize: "1rem",
//           fontFamily: "Helvetica, Arial, sans-serif",
//           fontWeight: 200,
//           cssClass: "apexcharts-yaxis-title",
//         },
//       },
//       tickAmount: 7,
//       // labels: {
//       //     formatter: function (val) {
//       //         return parseFloat(val).toFixed(1)
//       //     }
//       // }
//     },
//   };

//   //  console.log(props.series);
//   let series = (() => {
//     if (!!props?.seriesWithNames) {
//       return props.seriesWithNames;
//     }
//     if (!!props?.series) {
//       return [{ name: "y", data: [...props.series] }];
//     }
//     return [
//       {
//         name: "y",
//         data: [
//           [5, 5],
//           [-5, 5],
//           [-5, -5],
//           [5, -5],
//           [1, 1],
//           [-2, -2],
//         ],
//       },
//     ];
//   })();

//   return (
//     <Chart
//       options={{ ...scatterQuotesApexChartOptions, ...props?.options }} //
//       series={series}
//       type="scatter"
//       //      height={350}
//     />
//   );
// }



// function DatalineQuotesApexChartLazy(
//     props
//   //   {
//   //   series = [
//   //     {
//   //       name: "dataline1",
//   //       data: [
//   //         [873057600000, 100],
//   //         [873057600000, 120],
//   //       ],
//   //     },
//   //     {
//   //       name: "dataline2",
//   //       data: [
//   //         [873057600000, 150],
//   //         [873057600000, 80],
//   //       ],
//   //     },
//   //   ],
//   //   chartTitle = "",
//   //   xaxisTitle = "",
//   //   yaxisTitle = "",
//   //   options,
//   // }
//   ) {
//     const datalineQuotesApexChartOptions = {
//       chart: {
//       //  id: "area-datetime",
//         type: "area",
//         height: 350,
//         zoom: {
//           autoScaleYaxis: true,
//         },
//       },
//       title: {
//         text: !!props?.chartTitle ? props?.chartTitle : '',
//         align: 'left',
//         style: {
//             //            color: "gray",
//             //    fontSize: '1rem',
//             fontFamily: 'Helvetica, Arial, sans-serif',
//             fontWeight: 'normal',
//             //            marginTop: '2rem'
//             //         cssClass: 'apexcharts-title',
//         }
//     },
//       dataLabels: {
//         enabled: false,
//       },
//       markers: {
//         size: 0,
//         style: "hollow",
//       },
//       xaxis: {
//         type: "datetime",
//         title: {
//           text: !!props?.xaxisTitle ? props?.xaxisTitle : '',
//           style: {
//           //    color: "gray",
//           //    fontSize: '1rem',
//               fontFamily: 'Helvetica, Arial, sans-serif',
//               fontWeight: 'normal',
//               cssClass: 'apexcharts-xaxis-title',
//           }
//       },
//         //     min: new Date('01 Mar 2012').getTime(),
//        // tickAmount: 6,
//       },
//       tooltip: {
//         x: {
//           format: "dd MMM yyyy",
//         },
//       },
//       fill: {
//         type: "gradient",
//         gradient: {
//           shadeIntensity: 1,
//           opacityFrom: 0.7,
//           opacityTo: 0.9,
//           stops: [0, 100],
//         },
//       },
//       yaxis: {
//         // min: -20,
//         // max: 20,
//         title: {
//             text: !!props?.yaxisTitle ? props?.yaxisTitle : '',
//              style: {
//             //     color: "gray",
//             //     fontSize: '1rem',
//                  fontFamily: 'Helvetica, Arial, sans-serif',
//             //     fontWeight: 200,
//             //     cssClass: 'apexcharts-yaxis-title',
//              }
//         },
//         labels: {
//             formatter: function (val) {
//                 return parseFloat(val).toFixed(1)
//             }
//         }
//     }
//     };

//     let options = !!props?.options ? { ...datalineQuotesApexChartOptions, ...props.options }: datalineQuotesApexChartOptions;
//     return (
//       <Chart
//         options={options}
//         series={!!props?.series ? props.series: [
//               {
//                 name: "dataline1",
//                 data: [
//                   [873057600000, 100],
//                   [873057600000, 120],
//                 ],
//               },
//               {
//                 name: "dataline2",
//                 data: [
//                   [873057600000, 150],
//                   [873057600000, 80],
//                 ],
//               },
//             ]
//         }
//       />
//     );
//   }

//   function LineApexChartLazy({
//     series = [{ name: 'Прибыль', data: [-5, -5, -5, -5, 0, 5, 10] }],
//     categories = [60, 65, 70, 75, 80, 85, 90],
//     chartTitle = "Case Позиция покупателя опциона на покупку. Страйк цена 75 руб, премия 5 руб",
//     xaxisTitle = "Курс доллара на дату исполнения опциона",
//     yaxisTitle = "Прибыль",
//     options
//   }) {
//     const lineApexChartOptions = {
//       chart: {
//         type: 'line',
//         toolbar: {
//           show: false,
//         }
//       },
//       title: {
//         text: chartTitle,
//         align: 'left',
//         style: {
//           //            color: "gray",
//           //    fontSize: '1rem',
//           fontFamily: 'Helvetica, Arial, sans-serif',
//           fontWeight: 'normal',
//           //            marginTop: '2rem'
//           //         cssClass: 'apexcharts-title',
//         }
//       },
//       //     stroke: {
//       //        width: 7,
//       //        curve: 'smooth'
//       //     },
//       dataLabels: {
//         enabled: true,
//       },
//       xaxis: {
//         //         type: 'datetime',
//         categories: [...categories],
//         title: {
//           text: xaxisTitle,
//           style: {
//             color: "gray",
//             fontSize: '1rem',
//             fontFamily: 'Helvetica, Arial, sans-serif',
//             fontWeight: 200,
//             cssClass: 'apexcharts-xaxis-title',
//           }
//         },
//         style: {
//           color: "gray",
//           fontSize: '1rem',
//           fontFamily: 'Helvetica, Arial, sans-serif',
//           fontWeight: 200,
//           cssClass: 'apexcharts-yaxis-title',
//         }
//       },
//       // fill: {
//       //     type: 'gradient',
//       //     gradient: {
//       //         shade: 'dark',
//       //         gradientToColors: ['#FDD835'],
//       //         shadeIntensity: 1,
//       //         type: 'horizontal',
//       //         opacityFrom: 1,
//       //         opacityTo: 1,
//       //         stops: [0, 100, 100, 100]
//       //     },
//       // },
//       markers: {
//         size: 2,
//         colors: ["#D3D3D3"],
//         strokeColors: "#808080",
//         strokeWidth: 2,
//         hover: {
//           size: 4,
//         }
//       },
//       yaxis:
//       {
//         // min: -20,
//         // max: 20,
//         title: {
//           text: yaxisTitle,
//           style: {
//             color: "gray",
//             fontSize: '1rem',
//             fontFamily: 'Helvetica, Arial, sans-serif',
//             fontWeight: 200,
//             cssClass: 'apexcharts-yaxis-title',
//           }
//         },
//         tickAmount: 8,
//         labels: {
//           formatter: function (val) {
//             return parseFloat(val).toFixed(1)
//           }
//         }
//       }
//     }


//     return (
//       <Chart
//         options={{ ...lineApexChartOptions, ...options }}
//         series={series}
//       />
//     );
//   }

//   function DatalineBarApexChartLazy(props) {

//     const datalineBarApexChartOptions = {

//       chart: {
//         type: 'bar',
//         toolbar: { show: false }
//       },
//       plotOptions: {
//         bar: {
//           horizontal: false,
//           columnWidth: '55%',
//   //        endingShape: 'rounded'
//         },
//       },
//       dataLabels: {
//         enabled: false
//       },
//       stroke: {
//         show: true,
//         width: 1,
//         colors: ['transparent']
//       },
//       xaxis: {
//         type: 'datetime',
//   //      categories: !!props?.categories ? props.categories : [...new Array(10)].map((item, index) => { var d = new Date(); return d.setFullYear(d.getFullYear() + 1 + index) }),
//         style: {
//           color: "gray",
//           fontSize: '1rem',
//           fontFamily: 'Helvetica, Arial, sans-serif',
//           fontWeight: 200,
//           cssClass: 'apexcharts-yaxis-title',
//         }
//         //   categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
//       },
//       yaxis: {
//         title: {
//           text: 'млн. руб'
//         }
//       },
//       fill: {
//         opacity: 1
//       },
//       tooltip: {
//         x: {
//           format: "MMM 'yyyy" //'20' + 'yy'
//         },
//         y: {
//           formatter: function (val) {
//             return "RUB " + val + " млн."
//           }
//         }

//       },
//     }



//     let options = (() => {
//       if (!!props?.options) {
//           let updatedOptions = { ...datalineBarApexChartOptions, ...props.options };
//           return updatedOptions;
//       };
//       return datalineBarApexChartOptions
//   })();

//   let categories = (() => {
//       if (!!props?.categories) { return props.categories };
//       return [...new Array(7)].map((item, index) => { var d = new Date(); return d.setFullYear(d.getFullYear() + 0 + index) }) // [2001, 2002, 2003, 2004, 2005, 2006, 2007]
//   })();

//   options.xaxis.categories = categories;

//   let series = (() => {
//       if (!!props?.series) { return props.series };
//       return [{
//           name: 'Кэш фло',
//           data: [44, 55, 41, 64, 22, 43, 21],
//       }, {
//           name: "Дисконтированный кэш-фло",
//           data: [44, 50, 33, 52, 13, 31, 14]
//       }];
//   })();

//     return (
//       <Chart
//         options={options}
//         series={series}
//         type="bar"
//       />
//     );
//   }


