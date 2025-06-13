import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { MediaItems } from "./ShowMedia.js";

import ApexEmptyOptionsChart from "./ApexEmptyOptionsChart.js";


function AccountingWithProfitsCash(props) {

    console.log(props);

    let newProps = {...props, periods: ["2024", "2025", "2026", "2027"]};

    return <div>
        <ShowBalance {...newProps} />
        <hr className="m-3" />
        <ShowBalanceStackedBars {...newProps}  />
        <hr className="m-3" />
        <ShowFinancialResults {...newProps}  />
        <hr className="m-3" />
        <ShowCashFlow {...newProps}  />
        <hr className="m-3" />
        {/* <ShowProjectCashFlow /> */}
        <hr className="m-3" />
        <ShowRecords {...newProps} />
        <hr className="m-3" />
        {!!props?.mediaItems ? <MediaItems mediaItems={props.mediaItems} /> : null}
    </div>
}


export function ShowCashFlow(props) {
    let { periods } = props;
    // const [periods, setPeriods] = React.useState(["2021", "2022", "2023", "2024"]);

    function checkTypePeriod(indicator, periodIndex) {
        let sum = 0;
        //    console.log(indicator, periodIndex);
        let processed = !!props?.records && Array.isArray(props.records) && props.records.length > 0 && props.records.map((item) => {
            //   console.log(item.period, periods[periodIndex]);
            if (
                !!item?.type &&
                item.type.includes(indicator) &&
                item.period === periods[periodIndex - 1]
            ) {

                sum = sum + parseFloat(item.sum);
                //   console.log(sum);
            }
            return null;
        });
        return sum;
    }

    return <Container>
        <Row className="bg-secondary text-white">
            {["Кэш-фло", ...props.periods].map((item, index) => (
                <Col key={index} xs={index > 0 ? 2 : 4}>
                    {item}
                </Col>
            ))}
        </Row>

        {["Поступления по текущей деятельности", "Платежи по текущей деятельности", "Поступления по инвестиционной деятельности", "Платежи по инвестиционной деятельности", "Поступления по финансовой деятельности", "Платежи по финансовой деятельности"]
            .map((row, indexRow) => <Row key={indexRow}>
                {[row, ...props.periods].map((item, index) =>
                    <Col key={index} xs={index > 0 ? 2 : 4}>
                        {index === 0 ? row : checkTypePeriod(row, index)}
                    </Col>
                )}
            </Row>
            )}
    </Container>

}

export function ShowFinancialResults(props) {
    let { periods } = props;
    // const [periods, setPeriods] = React.useState(["2021", "2022", "2023", "2024"]);

    function checkTypePeriod(indicator, periodIndex) {
        let sum = 0;
        //    console.log(indicator, periodIndex);
        let processed = !!props?.records && Array.isArray(props.records) && props.records.length > 0 && props.records.map((item) => {
            //   console.log(item.period, periods[periodIndex]);
            if (
                !!item?.type &&
                item.type.includes(indicator) &&
                item.period === periods[periodIndex - 1]
            ) {

                sum = sum + parseFloat(item.sum);
                //   console.log(sum);
            }
            return null;
        });
        return sum;
    }

    return <Container>
        <Row className="bg-secondary text-white">
            {["Финансовые результаты", ...props.periods].map((item, index) => (
                <Col key={index} xs={index > 0 ? 2 : 4}>
                    {item}
                </Col>
            ))}
        </Row>

        {["Выручка", "Себестоимость продукции, работ, услуг", "Коммерческие расходы", "Управленческие расходы",
            "Проценты к уплате", "Прочие расходы", "Налог на прибыль", "Дивиденды к начислению"]
            .map((row, indexRow) => <Row key={indexRow}>
                {[row, ...props.periods].map((item, index) =>
                    <Col key={index} xs={index > 0 ? 2 : 4}>
                        {index === 0 ? row : checkTypePeriod(row, index)}
                    </Col>
                )}
            </Row>
            )}

    </Container>
}

export function ShowBalance(props) {
   

    //  const [periods, setPeriods] = React.useState(["2021", "2022", "2023", "2024"]);

    function processRecords(indicator, periodIndex) {
        //   console.log(periodIndex);
        let DValues = 0;
        let KValues = 0;
        let processed = !!props?.records && Array.isArray(props.records) && props.records.length > 0 && props.records.map((item) => {
            //    console.log(item.period);
            let currentOperationPeriodIndex = props.periods.findIndex(
                (per) => per === item.period
            );
            //    console.log(currentOperationPeriodIndex);
            if (item.d === indicator && periodIndex > currentOperationPeriodIndex) {
                DValues = DValues + parseFloat(item.sum);
            }
            if (item.k === indicator && periodIndex > currentOperationPeriodIndex) {
                KValues = KValues + parseFloat(item.sum);
            }
            return null;
        });
        if (
            indicator === "Основные средства" ||
            indicator === "Материалы" ||
            indicator === "Незавершенное производство" ||
            indicator === "Готовая продукция" ||
            indicator === "Дебиторская задолженность" ||
            indicator === "Деньги"
        ) {
            return DValues - KValues;
        } else {
            return KValues - DValues;
        }
    }

    return <Container>
        <Row className="bg-secondary text-white">
            {["Активы", ...props.periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {item}
                </Col>
            ))}
        </Row>
        <Row>
            {["Основные средства", ...props.periods].map((item, index) => (
                <Col className="font-weight-bold" key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Основные средства"
                        : processRecords("Основные средства", index)}
                </Col>
            ))}
        </Row>
        <Row>
            {["Материалы", ...props.periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0 ? "Материалы" : processRecords("Материалы", index)}
                </Col>
            ))}
        </Row>
        <Row>
            {["Незавершенное производство", ...props.periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Незавершенное производство"
                        : processRecords("Незавершенное производство", index)}
                </Col>
            ))}
        </Row>
        <Row>
            {["Готовая продукция", ...props.periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Готовая продукция"
                        : processRecords("Готовая продукция", index)}
                </Col>
            ))}
        </Row>
        <Row>
            {["Дебиторская задолженность", ...props.periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Дебиторская задолженность"
                        : processRecords("Дебиторская задолженность", index)}
                </Col>
            ))}
        </Row>
        <Row>
            {["Деньги", ...props.periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0 ? "Деньги" : processRecords("Деньги", index)}
                </Col>
            ))}
        </Row>
        <Row className="bg-secondary text-white">
            {["Пассивы", ...props.periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {item}
                </Col>
            ))}
        </Row>
        <Row>
            {["Уставный капитал", ...props.periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Уставный капитал"
                        : processRecords("Уставный капитал", index)}
                </Col>
            ))}
        </Row>
        <Row>
            {["Нераспределенная прибыль", ...props.periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Нераспределенная прибыль"
                        : processRecords("Нераспределенная прибыль", index)}
                </Col>
            ))}
        </Row>
        <Row className="bg-light text-dark">
            {["Долгосрочный банковский кредит", ...props.periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Долгосрочный банковский кредит"
                        : processRecords("Долгосрочный банковский кредит", index)}
                </Col>
            ))}
        </Row>
        <Row className="bg-light text-dark">
            {["Краткосрочный банковский кредит", ...props.periods].map(
                (item, index) => (
                    <Col key={item} xs={index > 0 ? 2 : 4}>
                        {index === 0
                            ? "Краткосрочный банковский кредит"
                            : processRecords("Краткосрочный банковский кредит", index)}
                    </Col>
                )
            )}
        </Row>
        <Row className="bg-light text-dark">
            {["Кредиторская задолженность", ...props.periods].map((item, index) => (
                <Col key={item} xs={index > 0 ? 2 : 4}>
                    {index === 0
                        ? "Кредиторская задолженность"
                        : processRecords("Кредиторская задолженность", index)}
                </Col>
            ))}
        </Row>
    </Container>

}

export function ShowRecords({ records }) {
    return <Container>
        {Array.isArray(records) && records.length > 0 && records.map((row, index) => (
            <Row key={index}>
                <Col xs={2}>
                    <small>{row.period}</small>
                </Col>
                <Col xs={3}>
                    <small>{row?.bookD}</small>
                    <small className="text-muted">{row.d}</small>
                </Col>
                <Col xs={3}>
                    <small>{row?.bookK}</small>
                    <small className="text-muted">{row.k}</small>
                </Col>
                <Col xs={4}>
                    <small>
                        {row.sum} {"  "}
                    </small>
                    {!!row?.type ? (
                        <small>{row.type}</small>
                    ) : (
                        <small>{""}</small>
                    )}
                </Col>
            </Row>
        ))}
    </Container>
}

export function ShowBalanceStackedBars({ records, periods }) {

    //   const [periods, setPeriods] = React.useState(["2021", "2022", "2023", "2024"]);

    function processRecords(indicator, periodIndex) {
        //   console.log(periodIndex);
        let DValues = 0;
        let KValues = 0;
        let processed = Array.isArray(records) && records.length > 0 && records.map((item) => {
            //    console.log(item.period);
            let currentOperationPeriodIndex = periods.findIndex(
                (per) => per === item.period
            );
            //    console.log(currentOperationPeriodIndex);
            if (item.d === indicator && periodIndex > currentOperationPeriodIndex) {
                DValues = DValues + parseFloat(item.sum);
            }
            if (item.k === indicator && periodIndex > currentOperationPeriodIndex) {
                KValues = KValues + parseFloat(item.sum);
            }
            return null;
        });
        if (
            indicator === "Основные средства" ||
            indicator === "Материалы" ||
            indicator === "Незавершенное производство" ||
            indicator === "Готовая продукция" ||
            indicator === "Дебиторская задолженность" ||
            indicator === "Деньги"
        ) {
            return DValues - KValues;
        } else {
            return KValues - DValues;
        }
    }

    function processAssetIndicator(indicator) {
        let resultArray = [];
        periods.map((item, periodIndex) => {
            resultArray.push(processRecords(indicator, periodIndex + 1));
            resultArray.push(0);
        })
        return resultArray
    }

    function processLiabilitiesIndicator(indicator) {
        let resultArray = [];
        periods.map((item, periodIndex) => {
            resultArray.push(0);
            resultArray.push(processRecords(indicator, periodIndex + 1));
        })
        return resultArray
    }

    let options = {
        chart: { type: 'bar', stacked: true, zoom: { enabled: true } },
        plotOptions: { bar: { borderRadius: 8, horizontal: false } },
        legend: { position: 'bottom' },
        fill: { opacity: 1 },
        colors: ['#dc3545', '#d63384', '#6f42c1', '#6610f2', '#0d6efd', '#adb5bd', '#dc3545', '#d63384', '#ffc107', '#198754', '#20c997', '#adb5bd']
    };

    function generateArrayOfCategories() {
        let categories = [];
        periods.forEach(period => {
            categories.push("Акт " + period);
            categories.push("Пас " + period)
        });
        return categories
    }

    return <div>
        <ApexEmptyOptionsChart
            showAs={"arraycategoriesbarapexchart"}
            options={options}
            series={[
                { name: "Деньги", data: processAssetIndicator("Деньги") },
                { name: "Дебиторская задолженность", data: processAssetIndicator("Дебиторская задолженность") },
                { name: "Готовая продукция", data: processAssetIndicator("Готовая продукция") },
                { name: "Незавершенное производство", data: processAssetIndicator("Незавершенное производство") },
                { name: "Материалы", data: processAssetIndicator("Материалы") },
                { name: "Основные средства", data: processAssetIndicator("Основные средства") },

                { name: "Кредиторская задолженность", data: processLiabilitiesIndicator("Кредиторская задолженность") },
                { name: "Краткосрочный банковский кредит", data: processLiabilitiesIndicator("Краткосрочный банковский кредит") },
                { name: "Долгосрочный банковский кредит", data: processLiabilitiesIndicator("Долгосрочный банковский кредит") },
                { name: "Нераспределенная прибыль", data: processLiabilitiesIndicator("Нераспределенная прибыль") },
                { name: "Уставный капитал", data: processLiabilitiesIndicator("Уставный капитал") }
            ]}
            categories={generateArrayOfCategories()} //['Акт 2021', 'Пас 2021', 'Акт 2022', 'Пас 2022', 'Акт 2023', 'Пас 2023', 'Акт 2024', 'Пас 2024']
            chartTitle="Структура Баланса"
            xaxisTitle="А П"
            yaxisTitle="Значение"
        />
    </div>
}

function isAssetOrLiability(indicator) {
    if (["Внеоборотные активы", "Оборотные активы"].includes(indicator)) { return 'Asset' }
    return 'Liability'
}

export function ProcessBalanceStackedBars(props) {
    //   console.log(props);

    let options = {
        chart: { type: 'bar', stacked: true, zoom: { enabled: true } },
        plotOptions: { bar: { borderRadius: 8, horizontal: false } },
        legend: { position: 'bottom' },
        fill: { opacity: 1 },
        colors: ['#dc3545', '#d63384', '#6f42c1', '#6610f2', '#0d6efd', '#adb5bd', '#dc3545', '#d63384', '#ffc107', '#198754', '#20c997', '#adb5bd']
    };

    let categories = [];
    let procCategories = props.categories.map(item => {
        categories.push('Акт ' + item);
        categories.push('Пас ' + item);
        return null
    })
    //  console.log(categories);

    function findValue(indicator, period) {
        //     console.log(indicator, period);
        let valueArray = props.unprocessedSeries.filter(item => item.name === indicator)[0].data;
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
    let processedIndicators = props.reportIndicators.map(indicator => {
        processedSeries.push({ name: indicator, data: processIndicator(indicator) })
        return null
    });
    console.log(processedSeries);

    return <div>
        <div>Process Balance Stacked Bars</div>
        <ApexEmptyOptionsChart
            showAs={"arraycategoriesbarapexchart"}
            options={options}
            series={processedSeries} //props.series
            categories={categories} //['Акт 2021', 'Пас 2021', 'Акт 2022', 'Пас 2022', 'Акт 2023', 'Пас 2023', 'Акт 2024', 'Пас 2024']
            chartTitle="Структура прогнозного баланса"
            xaxisTitle="Прогноз"
            yaxisTitle="Значение"
        />
    </div>
}


// function ShowProjectCashFlow(props) {
//     const [periods, setPeriods] = React.useState(["2021", "2022", "2023", "2024"])

//     function processInvestments(indicator) {
//         let result = 0;
//         periods.map((item, periodIndex) => {
//             if (item.type === "Платежи по инвестиционной деятельности") { result = result + parseFloat(item.sum); return null }
//         })
//         return [-result, 0, 0, 0, 0]
//     }


//     return <div>
//         <ApexEmptyOptionsChart
//             showAs={"datetimebarapexchart"}
//             series={[
//                 { name: "Инвестиции", data: processInvestments() }, // [-10000, 0, 0, 0,0]
//                 { name: "Чистый приток по текущей деятельности", data: [0, 2200, 5000, 3800, 20000] }
//             ]}
//             categories={["12/31/2021", "12/31/2022", "12/31/2023", "12/31/2024", "12/31/2025"]}
//         />
//     </div>
// }

export default AccountingWithProfitsCash