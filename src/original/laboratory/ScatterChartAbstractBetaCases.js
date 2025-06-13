import React from "react";
//import Chart from "react-apexcharts";

import ApexEmptyOptionsChart from "../mediatemplates/ApexEmptyOptionsChart";

import Container from "react-bootstrap/Container";

function xy_beta_more_than_one(number) {
  return [...new Array(number)].map(() => {
    let randomReturn = Math.round(Math.random() * 300 - 140) / 10;
    return [randomReturn, randomReturn * (1 + Math.random())];
  });
}

function xy_beta_below_zero(number) {
  return [...new Array(number)].map(() => {
    let randomReturn = Math.round(Math.random() * 300 - 140) / 10;
    return [randomReturn, randomReturn * (Math.random() / 5 - 0.2)];
  });
}

function xy_beta_random(number) {
  return [...new Array(number)].map(() => [
    Math.round(Math.random() * 300 - 140) / 10,
    Math.round(Math.round(Math.random() * 300 - 140)) / 10,
  ]);
}

function xy_less_than_one(number) {
  return [...new Array(number)].map(() => {
    let randomReturn = Math.round(Math.random() * 300 - 140) / 10;
    return [randomReturn, randomReturn * (1 - Math.random())];
  });
}

function xy_beta_bond(number) {
  return [...new Array(number)].map(() => {
    let randomReturn = Math.round(Math.random() * 300 - 140) / 10;
    return [randomReturn, randomReturn * (0.2 - Math.random() / 5)];
  });
}

function dateInArray(index) {
  let d = new Date();
  return d.setMonth(d.getMonth() - 50 + index);
}

export default function ScatterChartAbstractBetaCases(props) {
  let areaoptions = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
  };

  let scatteroptions = {
    chart: {
      // height: 350,
      type: "scatter",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
        type: "xy",
      },
    },
    xaxis: {
      title: {
        text: "Доходность фондового индекса за месяц",
        style: {
          color: "gray",
          fontSize: "1rem",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 200,
          cssClass: "apexcharts-yaxis-title",
        },
      },
      min: -20,
      max: 20,
      tickAmount: 8,
      labels: {
        formatter: function (val) {
          return parseFloat(val).toFixed(1);
        },
      },
    },
    yaxis: {
      title: {
        text: "Доходность актива за месяц",
        style: {
          color: "gray",
          fontSize: "1rem",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 200,
          cssClass: "apexcharts-yaxis-title",
        },
      },
      min: -20,
      max: 20,
      tickAmount: 8,
      labels: {
        formatter: function (val) {
          return parseFloat(val).toFixed(1);
        },
      },
    },
  };

  let xy_data = (() => {
    if (props.type === "betamorethanone") {
      return xy_beta_more_than_one(49);
    }
    if (props.type === "betabelowzero") {
      return xy_beta_below_zero(49);
    }
    if (props.type === "betarandom") {
      return xy_beta_random(49);
    }
    if (props.type === "betalessthanone") {
      return xy_less_than_one(49);
    }
    if (props.type === "betabond") {
      return xy_beta_bond(49);
    }
    return [];
  })();

  //  let xy_data = xy_beta_more_than_one(49);

  let indexData = [[dateInArray(0), 100]];
  let assetData = [[dateInArray(0), 100]];
  xy_data.map((item, index) => {
    indexData[index + 1] = [
      dateInArray(index + 1),
      Math.round(indexData[index][1] * (1 + item[0] / 100)),
    ];
    assetData[index + 1] = [
      dateInArray(index + 1),
      Math.round(assetData[index][1] * (1 + item[1] / 100)),
    ];
    return null;
  });

  //console.log([...new Array(50)].map((item, index) => { var d = new Date(); return d.setMonth(d.getMonth() - 50 + index) }));

  //  console.log(indexData);
  //  console.log(assetData);

  let areaseries = [
    {
      name: "Индекс",
      data: indexData,
    },
    {
      name: "Актив",
      data: assetData,
    },
  ];

  return (
    <Container className="mt-3">
      <ApexEmptyOptionsChart
        showAs={"scatterquotesapexchart"}
        // <ScatterQuotesApexChart
        series={xy_data}
        chartTitle="Оцените Beta коэффициент"
        xaxisTitle="Доходность фондового индекса за период, %"
        yaxisTitle="Доходность актива за период, %"
        options={scatteroptions}
      />

      <ApexEmptyOptionsChart
        showAs={"datalinequotesapexchart"}
        //   <DatalineQuotesApexChart
        series={areaseries}
        options={areaoptions}
        chartTitle="Динамика цен на индекс и актив"
        //xaxisTitle=""
        //yaxisTitle=""
      />
      {/* <Chart options={scatteroptions} series={scatterseries} type="scatter" />
        <Chart options={areaoptions} series={areaseries} type="area" /> */}
    </Container>
  );
}