import React from "react";

import { useSelector } from "react-redux";
import { useFirebaseNode } from "../hooks/useFirebaseNode";

import { selectUserData, doFindValuesForChartDataSeriesByIndicator } from "../features/data/dataSlice"; // selectUserDataItems,
import { selectApplication } from "../features/application/applicationSlice";

import ApexEmptyOptionsChart from "./ApexEmptyOptionsChart";

import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";


export function PrepareReduxDataFromDictionaryForChartForQuizFilteredByCurrentProject(props) {
    const [open, setOpen] = React.useState(false);
    const currentProjectSourseDataURL = useSelector(selectApplication).currentProjectSourseDataURL;
    const userData = useSelector(selectUserData).data;

    let filteredByURLdata = userData.filter(item => item.projectSourseDataURL === currentProjectSourseDataURL);
    console.log(filteredByURLdata)

    return <div className="m-2">
        <ShowChart userData={filteredByURLdata} {...props} />
    </div>
}


export function PrepareReduxDataFromDictionaryForChart({ chart }) {
    const [open, setOpen] = React.useState(false);

    function openChart() { setOpen(!open) }

    console.log(chart);

    return <div className="m-2">
        <Button onClick={() => openChart()} size="sm" block
            aria-controls={"example-collapse-text" + chart.id} aria-expanded={open} variant={open ? "secondary" : "outline-secondary"}>
            {chart.title}
        </Button>
        <Collapse in={open}>
            <div id={"example-collapse-text" + chart.id} className="m-2">
                <GetDataFromState chart={chart} />
            </div>
        </Collapse>
    </div>
}

function GetDataFromState({ chart }) {
    const userData = useSelector(selectUserData).data;
    console.log(userData);
    return <ShowChart userData={userData} chart={chart} />
}

export default function PrepareDataFromDictionaryForChart(props) {
    const { data: projectdata, loading, error } = useFirebaseNode("openmediadata/" + props.quiz.answer);

    //   console.log(props.quiz);

    if (!!loading || !projectdata) {
        return <div>...</div>;
    }
    if (!!error) {
        return <div>:-(</div>;
    }
    let userData = Object.keys(projectdata).map((item) => {
        return projectdata[item];
    });

    return <ShowChart userData={userData} chart={props.quiz} />
}

export function ShowChart({ userData, chart, theme, title }) {

    let requiredcategories = Object.keys(chart.content.requiredcategories).map(item => { return chart.content.requiredcategories[item] })
    let requiredseries = Object.keys(chart.content.requiredseries).map(item => { return chart.content.requiredseries[item] })

    //    console.log(requiredcategories); console.log(requiredseries);

    let series = requiredseries.map(indicator => {
        return {
            name: indicator, data: doFindValuesForChartDataSeriesByIndicator(userData, indicator, requiredcategories)
        }
    })

    if (chart.type === "balancestackedbarswithpredefinedindicators") {
        console.log(chart.id)
        return <ProcessBalanceStackedBars
            categories={requiredcategories}
            reportIndicators={requiredseries}
            processedSeries={series}
            theme={theme}
            title={title}
        />
    }

    // if (props.quiz.type === "arraycategoriesbarapexchartwithpredefinedindicators" || props.quiz.type === "arraycategorieslineapexchartwithpredefinedindicators") {
    return <ApexEmptyOptionsChart
        series={series}
        categories={requiredcategories}
        showAs={chart.type.replace('withpredefinedindicators', '')}
    />
    // }

    /*       
    return   <ApexEmptyOptionsChart
     showAs={"apexbarchartsgrouped"}
         categories={requiredcategories} // ["2017", "2018", "2019", "2020", "2021"]
         series={series
             // [{
             //     name: 'Кэш фло',
             //     data: [44, 55, 41, 64, 22, 43, 21],
             // }, {
             //     name: "Дисконтированный кэш-фло",
             //     data: [44, 50, 33, 52, 13, 31, 14]
             // }]
         }
         options={{ chart: { stacked: false } }}
     /> */

}


function isAssetOrLiability(indicator) {
    if (["Внеоборотные активы", "Оборотные активы", "Денежные средства (А1 — наиболее ликвидные активы)",
        "Дебиторская задолженность (A2 - быстрореализуемые активы)", "Запасы (А3 — медленно реализуемые активы)",
        "Внеоборотные активы (А4 — труднореализуемые активы)"
    ].includes(indicator)) { return 'Asset' }
    return 'Liability'
}


export function GetReadyProcessBalanceStackedBars({ quiz }) {

    let series = Object.keys(quiz.content.series).map((line) => {
        return {
            name: quiz.content["series"][line]["name"],
            data: Object.keys(quiz.content["series"][line]["data"]).map((line_point) => {
                return quiz.content["series"][line]["data"][line_point]
            }),
        };
    });
    console.log(series);

    let fireCategories = Object.keys(quiz.content.categories).map((line_point) => { return quiz.content.categories[line_point] });
    console.log(fireCategories);

    let reportIndicators = Object.keys(quiz.content.series).map((line) => {
        return quiz.content["series"][line]["name"]
    });
    console.log(reportIndicators);


    return <div className="mt-2" >
        <ProcessBalanceStackedBars
            categories={fireCategories}
            processedSeries={series}
            reportIndicators={reportIndicators}
        />
    </div>
}


export function ProcessBalanceStackedBars(props) {
    console.log(props);

    let options = {
        chart: { type: 'bar', stacked: true, zoom: { enabled: true } },
        plotOptions: { bar: { borderRadius: 8, horizontal: false } },
        legend: { position: 'bottom' },
        fill: { opacity: 1 },
        colors: ['#dc3545', '#d63384', '#6f42c1', '#6610f2', '#0d6efd', '#adb5bd', '#dc3545', '#d63384', '#ffc107', '#198754', '#20c997', '#adb5bd']
    };

    let categories = [];
    props.categories.forEach(item => {
        categories.push('Акт ' + item);
        categories.push('Пас ' + item);
    })
    //  console.log(categories);

    function findValue(indicator, period) {
        //     console.log(indicator, period);
        let valueArray = props.processedSeries.filter(item => item.name === indicator)[0].data;
        //     console.log(valueArray);
        let indexOfPeriod = props.categories.indexOf(period);
        //    console.log(indexOfPeriod);
        return valueArray[indexOfPeriod]
    }

    function processIndicator(indicator) {
        let resultArray = [];
        props.categories.map((period) => {
            if (isAssetOrLiability(indicator) === 'Asset') {
                resultArray.push(findValue(indicator, period));
                resultArray.push(0);
            } else {
                resultArray.push(0);
                resultArray.push(findValue(indicator, period));
            }
        })
        return resultArray
    }


    let processedSeries = [];
    props.reportIndicators.forEach(indicator => {
        processedSeries.push({ name: indicator, data: processIndicator(indicator) })
    });
    //    console.log(processedSeries);

    return <div>
        <ApexEmptyOptionsChart
            showAs={"arraycategoriesbarapexchart"}
            options={options}
            series={processedSeries} //props.series
            categories={categories} //['Акт 2021', 'Пас 2021', 'Акт 2022', 'Пас 2022', 'Акт 2023', 'Пас 2023', 'Акт 2024', 'Пас 2024']
            chartTitle={props?.title}
            xaxisTitle="Периоды"
            yaxisTitle="Значение"
        />
    </div>
}