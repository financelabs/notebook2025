


function processRecords({
    indicator = "Sales",
    balanceIndicators = [],
    records = [],
    periods = ["default"],
    period = "default" }) {
    let DValues = 0;
    let KValues = 0;

    let assets = balanceIndicators.filter(item => item.type === "asset")
        .map(item => item.title);

    Array.isArray(records) && records.forEach(item => {
        let currentOperationPeriodIndex = periods.findIndex(
            (per) => per === item.period
        );

        let periodIndex = periods.findIndex(el => el === period) + 1;
        if (item.d === indicator && periodIndex > currentOperationPeriodIndex) {
            DValues = DValues + parseFloat(item.sum);
        }
        if (item.k === indicator && periodIndex > currentOperationPeriodIndex) {
            KValues = KValues + parseFloat(item.sum);
        }
    });
    if (assets.includes(indicator)) {
        return DValues - KValues;
    } else {
        return KValues - DValues;
    }

};

export function processBalanceIndicatorForStackedBarsChart(
    indicator,
    caseRecords,
    periods,
    balanceIndicators) {
    let resultArray = [];

    function isAsset(indicator) {
        let itemIndex = balanceIndicators.findIndex(item => indicator === item.title);
         if (balanceIndicators[itemIndex].type === "asset") { return true }
        return false
    }

    periods.map((period) => {
        if (isAsset(indicator)) {
            resultArray.push(processRecords({ indicator, balanceIndicators, records: caseRecords, periods, period }));
            resultArray.push(0);
        } else {
            resultArray.push(0);
            resultArray.push(processRecords({ indicator, balanceIndicators, records: caseRecords, periods, period }));
        }

    })

    return resultArray
}



function vanillajsShowBalanceStackedBars(records, balanceIndicators) {
    let periods = [...new Set(records.map(item => item.period))];
  //  console.log(periods);

    let series = [];
    balanceIndicators.forEach(element => {
        if (element.title.length > 2) {
            series.push({
                name: element.title,
                data: processBalanceIndicatorForStackedBarsChart(element.title, records, periods, balanceIndicators)
            })
        }
    });

    let categories = [];
    periods.forEach(period => {
        categories.push('Asset ' + period);
        categories.push('Cap+L ' + period);
    });


    let options = {
        chart: { type: 'bar', stacked: true, zoom: { enabled: true }, width: '90%', height: '80%'  },
        plotOptions: { bar: { borderRadius: 1, horizontal: false } },
        legend: { position: 'bottom' },
        fill: { opacity: 1 },
     //   colors: colors,
        xaxis: { categories }
    };

    return { ...options, series}
}

export default vanillajsShowBalanceStackedBars